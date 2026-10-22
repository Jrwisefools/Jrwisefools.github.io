---
title: "FastAPI 与 SQLAlchemy ORM"
date: 2025-08-10
tags:
  - FastAPI
  - SQLAlchemy
  - ORM
  - Python
archived: false
description: "FastAPI 基础用法与 SQLAlchemy ORM：路由定义与 uvicorn 启动，ORM 的核心价值、核心层与对象关系映射组件。"
---

# FastAPI

fastapi 底层就是由协程实现的，用于构建 API，是建立在 Starlette 和 Pydantic 基础上

安装依赖

```bash
pip install fastapi
pip install uvicorn
```

```python
from fastapi import FastAPI
import uvicorn

# 创建 fastapi 对象
app = FastAPI()

# 让 index 函数处理路径为斜杠的网络请求
@app.get("/")   # 可以处理路径是斜杠的网络请求
def index():
    return {"msg": "helloworld"}

@app.get("/item/{item_id}")
def get_one(item_id):
    return {"item_id": item_id}

# uvicorn: 服务名称
# main: 模块名
# app: fastapi 对象名称
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        # port=8000
        port=80,        # http 协议默认端口是 80
        reload=True,
    )
```

> **补充整理**：原稿里三处会直接跑不起来的地方，已修正——
>
> 1. `fastapi = FastAPI()` 与 `@app.get` 变量名不一致（装饰器会报 `NameError: app`），
>    统一成 `app = FastAPI()`
> 2. `uvicorn.run(app="main:app")` 参数写法错误：应用路径是**第一个位置参数**，
>    不是 `app=` 关键字
> 3. `if __name__ == "main"` 少了下划线，写成 `"__main__"` 才会执行
>
> 另外几个实践要点：
>
> - `def index()` 改成 `async def index()` 才能发挥协程优势；但**不要在 async 函数里
>   写阻塞调用**（如 `time.sleep`、同步的 requests），那会把整个事件循环卡住，
>   这种情况用普通 `def`，FastAPI 会自动丢进线程池
> - `/item/{item_id}` 建议加类型标注，FastAPI 会据此做校验和自动生成文档：
>   ```python
>   @app.get("/item/{item_id}")
>   def get_one(item_id: int):
>       return {"item_id": item_id}
>   ```
> - 装依赖建议加上 `pip install "uvicorn[standard]"`（含性能相关的可选组件）；
>   `reload=True` 只用于开发环境，生产必须关掉
> - 启动后自带交互式文档：`/docs`（Swagger UI）与 `/redoc`

## SQLAlchemy

ORM 将数据库中的表结构映射为**编程**语言中的类
将表中的行（记录）映射为类中的对象
无需编写 SQL 语句

### orm 的核心价值

1. 屏蔽数据库差异
2. 简化开发流程
3. 提高代码可读性
4. 自动处理类型转换

#### 核心层

1. Schema/Types
2. SQL Expression Language
3. Engine —— 维护连接池
4. Connection Pooling（连接池）—— 提高效率，会创建一批数据库连接并复用
5. Dialect，会对不同数据库语句差异做翻译，让上层代码以统一方式操作不同数据库

> **补充整理**：SQLAlchemy 是**两层**结构，这是理解它的关键——
>
> - **Core（核心层）**：靠近 SQL 的一层，`Engine` / `Connection` / `Dialect` /
>   `SQL Expression Language` 都在这。写的是「用 Python 表达的 SQL」，灵活但仍有数据库味道
> - **ORM（对象关系映射层）**：在 Core 之上，把表映射成类、行映射成对象
>
> `Dialect` 是屏蔽差异的关键：同一句 `select(User).where(User.id == 1)`，
> 在 MySQL 下翻译成 MySQL 方言，在 PostgreSQL 下翻译成 PG 方言，上层代码不用改。

#### 对象关系映射层

> **补充整理**：这一层的映射关系是——
>
> | 数据库 | Python |
> | --- | --- |
> | 表（table） | 类（class） |
> | 行（record） | 对象（instance） |
> | 列（column） | 类属性（attribute） |
> | 外键 | 关系属性 `relationship()` |
>
> 最小可用写法（SQLAlchemy 2.0 风格）：
>
> ```python
> from sqlalchemy import create_engine, String, select
> from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session
>
> class Base(DeclarativeBase):
>     pass
>
> class User(Base):
>     __tablename__ = "users"
>     id: Mapped[int] = mapped_column(primary_key=True)
>     name: Mapped[str] = mapped_column(String(50))
>
> engine = create_engine("mysql+pymysql://user:pwd@host/db", pool_pre_ping=True)
> Base.metadata.create_all(engine)        # 建表（通常交给迁移工具做）
>
> with Session(engine) as session:
>     session.add(User(name="路中麋鹿"))
>     session.commit()
>     print(session.scalars(select(User)).all())
> ```
>
> 几个易踩的坑：
>
> - **会话要用完即关**：`Session` 不是线程安全的，Web 应用里应该「一个请求一个 Session」，
>   在 FastAPI 中用依赖注入管理
> - **查询是惰性的**：`select()` 只是构造语句，真正发请求在 `session.execute()` /
>   `session.scalars()` 时
> - **别忘了 commit**：`session.add()` 只进事务，不 `commit()` 数据不会落库
> - **`pool_pre_ping=True`**：数据库断连后自动重连，否则可能拿到失效连接
> - 生产环境建表用 **Alembic** 做迁移，不要依赖 `create_all()`

### 核心组件

引擎（Engine）
基类（base）

> **补充整理**：三个必须分清的东西——
>
> - **Engine**：连接的「工厂」+ 连接池，全局**只创建一个**（在应用启动时建，整个进程复用）
> - **Session**：一次数据库会话（事务边界），**每请求一个**，用完关闭
> - **Base（declarative base）**：所有模型类的父类，`Base.metadata` 持有全部表定义，
>   `create_all()` 和 Alembic 都靠它
>
> 顺带一提：ORM 不是万能的。复杂报表、批量更新、需要精细控制执行计划的场景，
> 直接写 SQL（走 Core 层）往往更清楚也更快。
