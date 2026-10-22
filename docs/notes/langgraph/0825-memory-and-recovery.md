---
title: "记忆机制与故障恢复"
date: 2025-08-25
tags:
  - LangGraph
  - 记忆
archived: false
description: "短期记忆与长期记忆的分工、故障恢复与断点续传、获取历史状态，以及 LangGraph 节点执行、缓存与重试机制。"
---

# LangGraph

## 短期记忆与长期记忆

短期记忆：保存在内存中
长期记忆：保存在数据库中、磁盘上

> **补充整理**：LangGraph 里这两层是有明确 API 对应的——
>
> | 记忆类型 | 载体 | 作用域 | 常用实现 |
> | --- | --- | --- | --- |
> | 短期记忆 | `checkpointer` | 按 `thread_id` 隔离的单次会话 | `MemorySaver`、`SqliteSaver` |
> | 长期记忆 | `Store` | 跨会话持久化，按 `namespace` + `key` 存取 | `InMemoryStore`、`SqliteStore` |
>
> 短期记忆记住的是「图跑到哪一步、状态是什么」；长期记忆记住的是「这个用户是谁、历史偏好是什么」。
> 前者交给 `checkpointer`，后者要自己在节点里读写 `store`。

## 图执行中报错

像是网络不行，调用过程中发生了问题
中途断了
需要把已经执行的节点保存，之后从报错的节点开始
这种需要长期（持久化），因为程序因错误停止后，内存会被释放掉

> **补充整理**：这正是 `checkpointer` 存在的意义。每个节点执行完，LangGraph 会把当前
> 状态写入 checkpoint；进程崩溃后重启，只要传同一个 `thread_id`，图就能读到上次的
> 断点，从中断处继续，而不是从头再跑一遍（对付费的大模型调用来说，这能省下真金白银）。

## 故障恢复

只有 SqliteSaver 不一样
需要长期记忆的数据存储至文件中

> **补充整理**：几个 checkpointer 的取舍——
>
> - `MemorySaver`：纯内存，重启即丢，只适合本地调试
> - `SqliteSaver`：写本地 `.sqlite` 文件，**进程重启后仍在**，单机生产够用
> - `PostgresSaver`：写数据库，多实例部署时的选择
>
> 用法是编译图时传入：
>
> ```python
> from langgraph.checkpoint.sqlite import SqliteSaver
>
> with SqliteSaver.from_conn_string("checkpoints.sqlite") as checkpointer:
>     graph = builder.compile(checkpointer=checkpointer)
> ```
>
> 之后调用必须带 `thread_id`，否则每次都是一条全新的会话：
>
> ```python
> config = {"configurable": {"thread_id": "user-1"}}
> graph.invoke({"messages": [("user", "你好")]}, config)
> ```

### 断点续传

> **补充整理**：两种做法——
>
> 1. **自动续跑**：再次 `invoke` 时传入 `None` 作为输入，图会从 checkpoint 里没执行完的节点接着跑
>    ```python
>    graph.invoke(None, config)  # 从断点继续
>    ```
> 2. **人为中断后再放行**：编译时用 `interrupt_before=["节点名"]` 或 `interrupt_after`
>    在图跑到某节点前后暂停（典型场景：工具调用前等人工审批），确认后同样用
>    `invoke(None, config)` 放行。

## 获取历史状态

每一个节点都可以更新状态节点的某一个属性
获取每一个节点的历史状态（之前获得的是所有节点的最终状态）

> **补充整理**：对应两个方法——
>
> ```python
> # 当前这一刻的完整状态
> graph.get_state(config)
>
> # 每一次 checkpoint 的快照，从新到旧
> for state in graph.get_state_history(config):
>     print(state.values, state.next)   # next 是接下来要执行的节点
> ```
>
> 这两个能力组合起来还能做**时间旅行**：用 `graph.update_state()` 修改某个历史
> 快照的值，再让它重新往下跑，用于「回到上一轮换个问法试试」。

## LangGraph 底层运行算法

Pregel 管控
在这个类当中，有两大属性

### 通道：边 + 节点名

节点与边联系就是通道
订阅的是指向其的边
边就是通道

LangGraph 中不是一个传统的有向无环图
LangGraph 中节点的指向来自**超步**（SuperStep）

> **补充整理**：LangGraph 的运行时借鉴了 Google 的 **Pregel** 大规模图计算模型，
> 所以它不是简单的一次性 DAG 执行，而是按「超步」迭代推进的。
>
> - **通道（Channel）**：节点之间传递状态的管道，决定了「谁的输出会被谁看到」
> - **超步（SuperStep）**：一轮执行。同一超步内没有依赖关系的节点**并行执行**，
>   全部结束后把结果写入通道，再进入下一超步
>
> 因为允许「写入结果 → 下一轮再判断往哪走」，LangGraph 才能天然支持**循环**（比如
> Agent 的「思考 → 调工具 → 再思考」），这也是它和传统 DAG 编排框架最大的区别。

### 每个超步先确定当前要执行什么

历史状态必须要 checkpointer 来实现
出现同一个超步的节点会以并行的方式执行

1. Plan 阶段
2. Execute 阶段
3. Update 阶段，执行完要更新状态

> **补充整理**：一个超步的执行节奏是——
>
> 1. **Plan**：根据通道里最新的状态，算出这一轮有哪些节点满足执行条件
> 2. **Execute**：并行执行这些节点（互不依赖，所以可以并发）
> 3. **Update**：把各节点的返回值按通道规则合并回状态，写 checkpoint，进入下一超步

## 节点

针对节点函数的
一般在节点函数中定义节点

> **补充整理**：节点就是一个普通函数，签名的参数按需声明，LangGraph 按名字注入——
>
> | 参数 | 含义 |
> | --- | --- |
> | `state` | 当前图状态（必需） |
> | `config` | 运行配置，能拿到 `thread_id` 等 configurable 字段 |
> | `runtime` | 运行时上下文，能拿到 `store`、上下文对象等 |
>
> ```python
> def my_node(state: State, config: RunnableConfig):
>     thread_id = config["configurable"]["thread_id"]
>     return {"messages": [("ai", f"当前会话 {thread_id}")]}
> ```
>
> 至少要有 `state` 一个参数；返回值是要**合并**进状态的字段片段，不需要自己拼完整状态。

### 节点的输出

> **补充整理**：节点的返回值就是它的输出，规则是——
>
> - 返回一个**字典**，键是状态里的字段名，LangGraph 按该字段预先声明的 reducer 合并
> - 返回 `None` 表示不改变状态
> - 想主动决定下一步往哪走，用 `Command(goto="节点名", update={...})`
>
> 状态的合并方式取决于字段声明（`Annotated` + reducer）。最常见的消息列表写法：
>
> ```python
> from typing import Annotated
> from langgraph.graph.message import add_messages
>
> class State(TypedDict):
>     messages: Annotated[list, add_messages]   # 追加而不是覆盖
> ```
>
> 不加 reducer 的话，后一个节点的返回值会**直接覆盖**前一个。

### 节点的缓存

暂时存储数据

> **补充整理**：指节点级缓存（Node Caching）。对「输入相同、输出必然相同」的
> 重活（比如同一段文本的向量化、同一份文档的解析），缓存能省掉重复调用：
>
> ```python
> from langgraph.types import CachePolicy
>
> builder.add_node("embed", embed_fn, cache_policy=CachePolicy(ttl=300))  # 秒
> ```
>
> 缓存键由**节点输入 + 节点名**算出，所以不同节点互不影响；`ttl` 控制有效期。
> 注意：带副作用（写库、发消息）的节点**不要**开缓存。

### 节点的重试

节点的重试次数
使用默认的重试策略
对一些异常之外的进行重试，有些异常没有必要重试

> **补充整理**：节点可以单独配 `RetryPolicy`，只对**瞬时故障**（网络抖动、限流）重试：
>
> ```python
> from langgraph.pregel import RetryPolicy
>
> builder.add_node(
>     "call_model",
>     call_model,
>     retry=RetryPolicy(
>         max_attempts=3,          # 含首次共 3 次
>         initial_interval=0.5,    # 首次间隔 0.5s
>         backoff_factor=2,        # 指数退避
>         jitter=True,             # 加随机抖动，避免同时重试
>         retry_on=lambda e: isinstance(e, (TimeoutError, ConnectionError)),
>     ),
> )
> ```
>
> `retry_on` 是关键：**参数错误、认证失败这类永久性错误重试一百次也没用**，
> 只会拖慢响应；只有超时、连接断开这类才值得重试。
