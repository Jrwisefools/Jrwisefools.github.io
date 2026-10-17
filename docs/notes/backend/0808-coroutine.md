---
title: "Python 协程"
date: 2025-08-08
tags:
  - Python
  - 并发
archived: false
---
# 协程

## 协程概述

协程（Coroutine）是 Python 中处理高并发的强大工具，是一种用户态的轻量级线程，也叫**微线程**。它不像线程那样由操作系统调度，而是由程序自身控制。

### 进程、线程、协程对比表

| **机制** | **调度者** | **切换开销** | **资源共享** | **适用场景** | **局限性** | **核心优势** |
|----------|------------|--------------|--------------|--------------|------------|--------------|
| **进程** | 操作系统 | 极大（内核级） | 完全隔离 | CPU密集型 | 资源消耗大，数量有限 | 利用多核 |
| **线程** | 操作系统 | 较大（内核级） | 共享内存（需加锁） | I/O密集型（低并发） | 受GIL限制，调度开销大 | 共享地址空间 |
| **协程** | 程序自身（Event Loop） | 极小（函数调用级） | 共享内存（无需加锁） | I/O密集型（极高并发） | 需要配套异步库 | 极高并发，高性能I/O |

###  线程处理 I/O 密集型操作的不足

在处理大量 I/O 密集型任务（如 Web 服务同时处理数千个用户连接）时，线程模型存在以下瓶颈：

1. **切换开销大**：操作系统在数千个线程之间切换消耗大量 CPU 时间
2. **同步复杂**：线程共享内存需要使用锁（Lock）保护数据，增加复杂性，可能导致死锁
3. **阻塞浪费**：线程执行到网络等待时会阻塞并挂起，但线程切换成本高，无法创建足够多的线程应对极高并发

###  协程优势

1. **调度者**：由程序自身调用，主动让出 CPU 给其他协程（通过 `await` 关键字），类似 `yield`
2. **轻量级**：创建成本极低，一个线程可以轻松创建数万个协程
3. **无锁机制**：同一时间只有一个协程运行，无需锁保护共享资源
4. **与线程比**：避免了操作系统级别的上下文切换开销，只有极小的函数调用开销

---

## async 和 await

Python 3.5+ 中通过 `async` 和 `await` 关键字实现协程。

### 定义协程函数：`async def`

- 使用 `async def` 定义的函数是协程函数，返回一个**协程对象**
- 调用协程函数时，函数体**不会立即执行**，只返回协程对象

```python
import asyncio

async def asyncFunc():
    print("hello coroutine")

async def asyncFunc1():
    print("hello coroutine")
    return 1

if __name__ == '__main__':
    result = asyncFunc()
    print(result)  # <coroutine object asyncFunc at 0x...>
    result2 = asyncFunc1()
    print(result2)  # <coroutine object asyncFunc1 at 0x...>
    # 函数体内部的 print 没有执行！
```

### 挂起与恢复：`await` 关键字

`await` 是协程的灵魂，用于暂停当前协程的执行，并等待一个可等待对象完成。

**执行流程：**
1. 遇到 `await` → 当前协程让出 CPU 控制权，进入**挂起**状态
2. 事件循环接管 → 调度执行其他**就绪**状态的协程
3. 等待对象完成后 → 事件循环恢复被挂起的协程，从 `await` 之后继续执行

> ⚠️ `time.sleep()` 阻塞的是**线程**，会阻塞所有协程；
> `asyncio.sleep()` 只阻塞**当前协程**，其他协程可以继续执行

```python
import time
import asyncio

async def asyncFunc(name, sec):
    print(f"协程{name}开始执行")
    await asyncio.sleep(sec)  # 只阻塞当前协程，让出CPU
    print(f"协程{name}执行完成")

async def main_sync():
    """串行执行示例"""
    print("----main_sync------")
    await asyncFunc('A', 1)   # 等待 A 完成
    await asyncFunc('B', 2)   # 再执行 B

if __name__ == "__main__":
    start = time.time()
    asyncio.run(main_sync())
    print(f"串行耗时: {time.time() - start:.2f}秒")  # 约 3 秒
```

**输出：**
```
----main_sync------
协程A开始执行
协程A执行完成
协程B开始执行
协程B执行完成
串行耗时: 3.02秒
```

---

## 事件循环（Event Loop）

事件循环是管理和调度所有协程的核心机制，是协程并发模型的"心脏"。

###  注册协程到事件循环的三种方式

| 方式 | 用途 | 说明 |
|------|------|------|
| `asyncio.run(main_coro)` | **顶级注册，启动程序** | 只执行一次，作为程序入口点 |
| `asyncio.create_task(coro)` | **最常用，实现并发** | 立即将协程包装成 Task 并注册到事件循环 |
| `await coro` | 隐式注册，实现串行 | 等待协程完成后再继续后续代码 |

### 1.3.2 事件循环工作流程

```
1. 注册任务 → 2. 启动协程 → 3. 遇到 await → 4. 切换任务
       ↑                                      ↓
       └──────── 6. 终止与清理 ←──────── 5. I/O完成通知
```

1. **注册任务**：协程被注册到事件循环中等待执行
2. **启动协程**：事件循环选择就绪的协程开始执行
3. **遇到 await**：协程遇到 `await`，主动让出 CPU
4. **切换任务**：事件循环选择下一个就绪协程执行
5. **I/O 完成通知**：操作系统通知事件循环 I/O 已准备好
6. **恢复协程**：事件循环让挂起的协程从 `await` 处恢复执行
7. **终止与清理**：顶级 Task 完成 → 取消所有子 Task → 关闭事件循环 → 程序退出

### 事件循环伪代码

```
任务列表 = [Task1, Task2, ...]

while True:
    # 1. 检查 I/O 事件，更新任务状态
    已完成的IO = monitor_io_events()
    
    # 2. 选取就绪任务执行
    for task in 就绪任务队列:
        task.run_until_await()  # 运行直到遇到下一个 await
    
    # 3. 检查是否所有任务都已完成
    if not 任务列表 and not 正在等待IO:
        break
```

---

## 1.4 实现并发：Task 与 `asyncio.gather()`

协程本身只是"可暂停的函数"，要实现并发，必须将其包装成 **Task（任务）** 并提交给事件循环。

### 1.4.1 Task 的概念

- **创建**：`asyncio.create_task(协程对象)`
- **作用**：将协程封装成 Task，自动注册到事件循环，具备被调度执行的能力
- **特点**：Task 一旦被创建，就立即在后台开始运行（事件循环会调度它）

### 1.4.2 批量并发执行：`asyncio.gather()`

```python
import time
import asyncio

async def async_func(name, sec):
    print(f"任务 {name} 开始...")
    await asyncio.sleep(sec)
    print(f"任务 {name} 完成.")
    return f"结果 of {name}"

async def main_concurrent():
    print("并发执行（总耗时 max(1s, 2s) = 2s）")
    
    # 创建 Task：立即在后台运行
    task1 = asyncio.create_task(async_func("C", 1))
    task2 = asyncio.create_task(async_func("D", 2))
    
    # 等待所有 Task 完成，获取结果
    results = await asyncio.gather(task1, task2)
    print(f"所有结果: {results}")

if __name__ == "__main__":
    start_time = time.time()
    asyncio.run(main_concurrent())
    print(f"并发总耗时: {time.time() - start_time:.2f}秒")  # 约 2 秒
```

**输出：**
```
并发执行（总耗时 max(1s, 2s) = 2s）
任务 C 开始...
任务 D 开始...
任务 C 完成.
任务 D 完成.
所有结果: ['结果 of C', '结果 of D']
并发总耗时: 2.01秒
```

### 1.4.3 并发执行原理

1. Task("C", 1) 打印"开始..."，遇到 `await asyncio.sleep(1)`，让出控制权
2. 事件循环切换到 Task("D", 2)，打印"开始..."，遇到 `await asyncio.sleep(2)`，让出控制权
3. 1 秒后，计时器完成，恢复 Task("C", 1)，打印"完成"
4. 2 秒后，计时器完成，恢复 Task("D", 2)，打印"完成"
5. `await asyncio.gather()` 收到所有结果并返回

### 1.4.4 ⚠️ 重要陷阱：顶级 Task 提前退出

```
async def main_concurrent():
    # 创建了子任务，但没有等待它们
    asyncio.create_task(async_func("C", 1))
    asyncio.create_task(async_func("D", 2))
    # main 函数立即结束，事件循环终止，子任务被强制取消

if __name__ == "__main__":
    asyncio.run(main_concurrent())  # 子任务不会执行完成！
```

**输出：**
```
任务 C 开始...
任务 D 开始...
并发总耗时: 0.00秒   # 子任务被强制取消，没有"完成"输出
```

> ✅ **正确做法**：必须使用 `await asyncio.gather()` 或 `await task` 等待子任务完成

---

## 1.5 高级控制与协程限制

### 1.5.1 协程的限制：阻塞 I/O

协程在**单线程**中运行。如果协程代码中包含阻塞 I/O（如 `time.sleep()`、`requests.get()` 等同步库调用），**整个事件循环和所有其他协程都会被卡住**。

**解决方案：隔离阻塞操作**

使用 `asyncio.to_thread()`（Python 3.9+）将阻塞代码交给线程池执行：

```python
import requests
import asyncio

async def fetch_blocking_url(url):
    # 将同步的 requests.get() 扔到线程池执行，避免阻塞事件循环
    response = await asyncio.to_thread(requests.get, url)
    return response.status_code
```

### 1.5.2 超时处理：`asyncio.wait_for()`

```python
import asyncio
async def slow_task():
    await asyncio.sleep(5)

async def main_timeout():
    try:
        await asyncio.wait_for(slow_task(), timeout=2.0)  # 2 秒超时
    except asyncio.TimeoutError:
        print("任务超时！")
```

### 1.5.3 任务取消：`Task.cancel()`

```
import asyncio
task = asyncio.create_task(slow_task())
task.cancel()  # 请求取消任务
# 被取消的 Task 会抛出 asyncio.CancelledError 异常
```

---

## 1.6 实战案例：异步网络请求（aiohttp）

协程最适合 I/O 密集型任务，网络请求是典型代表。

```python
import asyncio
import aiohttp
import time

# 需要安装：pip install aiohttp

async def fetch_url(session, url):
    """异步请求一个URL并返回结果"""
    start_time = time.time()
    async with session.get(url) as response:
        await response.text()  # 等待响应体时，让出 CPU
        response_time = time.time() - start_time
        return f"{url} 耗时 {response_time:.2f}秒"

async def main():
    urls = [
        "https://www.baidu.com",
        "https://www.bing.com",
        "https://www.github.com"
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        for result in results:
            print(result)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## 1.7 WSGI 与 ASGI

WSGI 和 ASGI 是 Python Web 开发中两个重要的接口规范，定义 **Web 服务器**与 **Python Web 应用**之间的通信规则。

### 1.7.1 核心定位与目标

| 对比项 | WSGI | ASGI |
|--------|------|------|
| **全称** | Web Server Gateway Interface | Asynchronous Server Gateway Interface |
| **提出时间** | 2003 年 | 2018 年 |
| **支持模式** | 仅支持同步操作 | **原生支持异步操作**，同时兼容 WSGI |
| **代表框架** | Flask、Django（旧版） | **FastAPI**、Starlette、Django 3.1+ |
| **代表服务器** | Gunicorn、uWSGI | **Uvicorn**、Daphne |
| **设计目标** | 解决早期 Python Web 框架兼容性问题 | 解决 WSGI 无法高效处理异步任务的问题 |
| **适用场景** | 传统同步 Web 应用 | 高并发 API、WebSocket、长轮询 |

### 1.7.2 工作流程差异

**WSGI 工作流程（同步阻塞）：**
```
客户端发送请求 → WSGI 服务器接收 
→ 同步调用 application(environ, start_response) 
→ 应用处理完成后通过 start_response 返回响应 
→ 服务器转发响应
```
> 整个过程是同步阻塞的，一个请求未处理完时，对应的线程/进程无法处理其他请求

**ASGI 工作流程（异步非阻塞）：**
```
客户端发送请求 → ASGI 服务器接收 
→ 将请求封装为事件（如 http.request） 
→ 通过事件循环异步传递给应用 
→ 应用处理后返回事件（如 http.response） 
→ 服务器转发响应
```
> 等待 I/O 操作（如数据库查询）时，事件循环会切换到其他请求，实现非阻塞处理

### 1.7.3 如何选择

| 场景 | 选择 |
|------|------|
| 使用同步框架（Flask、Django 旧版） | WSGI 服务器（Gunicorn、uWSGI） |
| 使用**异步框架**（**FastAPI**、Starlette、Django 3.1+） | **ASGI 服务器（Uvicorn）** |
| 需要实时通信（WebSocket 聊天、实时数据推送） | **必须使用 ASGI** |

> 📌 **FastAPI 基于 ASGI 规范**，使用 Uvicorn 作为异步服务器，利用协程实现高并发处理。
