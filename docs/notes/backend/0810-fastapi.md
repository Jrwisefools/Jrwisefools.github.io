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
fastapi底层就是由协程实现的,用于构建API，是建立在Starlette和Pydantic基础上
安装依赖

pip install fastapi
pip install uvicorn

```python
from fastapi import FastAPI
import uvicorn
#创建fastapi对象
fastapi = FastAPI()
#让index函数处理路径为斜杠的网络请求
@app.get("/") #可以处理路径是斜杠的网路请求
def index():
    return {"msg":"helloword"}
@app.get("/item/{item_id}")
def get_one(item_id):
    return {"item_id":item_id}
"""
uvicorn:服务名称
main:模块名
app:fastapi对象名称
"""

"""
if __name__ == "main":
    uvicorn.run(
    app = "main:app"
    host = "0.0.0.0"
    # port = 8000
    port = 80 #http协议默认端口是80
    reload = True
    
    )
"""
```
## SQLAlchemy
ORM 将数据库中的表结构映射为变成语言中的类
将表中的行(记录)映射为类中的对象
无需编写SQL语句
### orm的核心价值
1. 屏蔽数据库差异
2. 简化开发流程
3. 提高代码可读性
4. 自动处理类型转换
#### 核心层
1) Schema/Types
2) SQL Expression Language
3) Engine-->维护连接池
4) Connection Pooling(连接池)--->提高效率
                     会创建一批数据库连接并复用
5) Dialect,会对不同数据库语句差异做翻译,让上层代码以统一方式操作不同数据库

#### 对象关系映射层

### 核心组件
引擎 (Engine)
基类 (base)
