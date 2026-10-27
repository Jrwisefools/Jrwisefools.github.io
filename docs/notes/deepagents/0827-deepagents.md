---
title: "深度智能体：从 Agent 到 Agentic AI"
date: 2025-08-27
tags:
  - DeepAgents
  - Agent
  - 多智能体
archived: false
description: "DeepAgents 的核心能力、LangChain 生态四层的选择、Message 分类、多智能体与子智能体配置、人工审核（HITL）、后端存储与文件权限，以及上下文工程。"
---

# 深度智能体

## 三个阶段的演进

最初的人工智能是 LLM。

LLM（HTTP 请求、基础语言模型）→ AI Agent（执行特定任务的智能代理）→ Agentic AI（具备自主决策能力的代理智能）

- LangChain（单智能体）：`@tool` 调用工具
- Agentic AI：分成主智能体和多个子智能体

## LangChain 与 LangGraph 的分工

最先出现的是 LangChain，之后是 LangGraph（最底层）——负责编排流程（运行时流程）。

- LangGraph 用节点编排固定流程（静态流程）
- LangChain 是动态生成流程（不同问题干的事情不一样）

## 实现第三阶段 Agentic AI

### 智能体框架

规划 - 执行 - 反馈 - 迭代

主智能体 - 子智能体 - 主智能体 - 反复迭代

### 高阶提示词

高阶提示：告诉我怎么想、按什么步骤、用什么逻辑。

### DeepAgents

- 内置任务规划功能，用于上下文管理（交给模型输入数据）的文件路径
- 上下文包含两块：提示词、工具文档（说明工具功能）
- 子代理生成长期记忆：多重子智能体，一次会话的多次执行（短期记忆）；多次会话、多次调用都能拿到第一次调用的数据（多次数据共享 → 长期记忆）
- DeepAgents 建立在 LangChain 基础上

## LangChain 生态的四层

1. **langchain-core**（基石）：最底层、最基础
2. **LangGraph**（引擎）：深度集成流程图
3. **LangChain**
4. **DeepAgents**（开箱即用层 / 多智能体套件 agent harness）：依赖 LangChain 和 LangGraph，把规划（ToDoList）、文件系统、子智能体、上下文等高级能力打包

## 如何选择

- **LangGraph**：明确的多步骤长流程（如 RAG 项目）
- **LangChain**：简单、快速，没有复杂的长流程处理
- **DeepAgents**：场景比较复杂，先问四个问题
  1. 问题是否比较开放：调用的流程是不同的
  2. 是否存在领域冲突：涉及不同领域会污染上下文环境，而多智能体各有独立的上下文，不会互相污染
  3. 是否需要不同模型：语言模型、视觉模型……适合多智能体
  4. 任务是否存在并行的需求（提高效率）

## DeepAgents 的核心能力

### 1. 智能规划、任务分解

内置工具：`write_todos`、`read_todo`、`update_todos`、`delete_todos`

### 2. 高效的上下文管理

有临时文件，避免上下文窗口溢出。

### 3. 子 agent 生成机制

主智能体只是一个管家，不能什么事情都负责。好处是**上下文隔离**。

### 4. 长期记忆能力

持久的「记忆存储」系统，有三种形态：

- 文件存储
- store 的 Key-Value 存储：内存 / 本地或远程数据库
- 组合式存储：上面两个的组合

## Message 分类

1. **SystemMessage 系统消息**

   给模型设定角色、规则、能力边界，就是代码里的 `system_prompt`。

   > 示例：你是一位专家级研究员，可以使用 internet_search 工具收集信息。

2. **HumanMessage 用户消息**

   用户输入的提问。

   > 示例：武汉今天天气怎么样

3. **AIMessage AI 消息**

   大模型输出的内容，分两种情况：

   - 直接输出最终文字回答（不需要调用工具）
   - 携带 `tool_calls`，代表模型决定调用工具（日志里那条 `finish_reason: tool_calls` 的 AIMessage 就是这个）

4. **ToolMessage 工具消息**

   工具执行之后返回的结果，传给模型继续处理，里面必须带上对应的 `tool_call_id`，用来和前面 AIMessage 的工具调用一一绑定。

   > 示例：tavily 搜索返回的天气 json 结果

## 同步一次性输出

入口方法：`agent.invoke()`

```python
from deepagents import create_deep_agent
from langchain.chat_models import init_chat_model
from langchain_core.tools import tool

@tool  # 自定义工具需要声明
def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"

llm = init_chat_model(
    model="qwen-plus",
    model_provider="openai",
    api_key="",
    base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
)

# 创建深度智能体
agent = create_deep_agent(
    model=llm,
    tools=[get_weather],
    system_prompt="You are a helpful assistant",
)

# Run the agent
result = agent.invoke(
    {"messages": [{"role": "user", "content": "what is the weather in sf"}]}
)
```

### 返回的 result

```python
messages = [
    # 1. 用户消息
    HumanMessage(content='武汉天气怎么样')

    # 2. LLM 第一轮输出：决定调用工具（finish_reason="tool_calls"）
    AIMessage(
        content='',  # 这一轮没有自然语言回答，只输出工具调用
        tool_calls=[{'name': 'get_weather', 'args': {'city': '武汉'}, 'id': 'call_27b4369d077b49329baee6'}],
        finish_reason='tool_calls'
    )

    # 3. 工具返回结果（ToolMessage）
    ToolMessage(
        content="It's always sunny in 武汉!",
        name='get_weather',
        tool_call_id='call_27b4369d077b49329baee6'  # 和上面的 tool_call_id 一一对应，用来配对
    )

    # 4. LLM 第二轮：拿到工具返回值，整理成自然语言给用户
    AIMessage(
        content='武汉目前天气晴朗！',
        finish_reason='stop'  # 本轮结束，不再继续调用工具
    )
]
```

所以取最终答案需要：

```python
print(result["messages"][-1].content)
```

## 多智能体场景理解

主智能体负责分配，子智能体负责具体工作、执行具体子任务。

- 单智能体的问题：注意力稀释，不同场景会出现互相干扰、污染环境
- 多智能体的缺点：token 指数级消耗；子智能体是一个黑盒（但可以用 LangSmith 来查看）
- 怎么用：就是前面那四问

多智能体的架构设计：

- **层级方式**：有主智能体 + 子智能体（各自专注某个方向）——大部分都是这种方式
- **协作方式**：没有主智能体，去中心化，一起讨论 → Google A2A

> **补充整理**：「注意力稀释」指的是所有工具、所有领域的说明都塞在同一份上下文里，
> 模型每一次决策都要在这堆信息里找相关的那一小段，工具越多、领域越杂，选错的概率越高。
> 拆成子智能体后，每个子智能体只携带自己那几件工具和那一段提示词，判断空间小得多。
> 代价就是多智能体要写更好的分派描述（`description` 写不清，主智能体就会派错人）。

## Subagent 配置方式：字典或 CompiledSubAgent 对象

CompiledSubAgent 对象：专门去兼容 LangChain 和 LangGraph。如果已经有一个完整的 LangGraph，就需要给它包装成该对象。

### 字典配置

- `name`：名称 → 工作任务谁做，要交给主智能体（必须）
- `description`：描述 → 子智能体的职能描述，交给主智能体（必须）
- `system_prompt`：交给模型（得说内部具体需要用什么）
- `tools`：子智能体配置工具
- `model`：默认从主智能体中继承，若不一样就要配置 `model`
- `response_format`：响应方式格式化
- `middleware`：中间件，实现日志记录、速率限制和自定义行为等
- `interrupt_on`：人机协作流程
- `skills`：`list[str]`，技能

## 子智能体配置小结

- 子 agent 配置的 2 种形式？
  - 字典
  - CompiledSubAgent
- 字典形式的子 agent：`name` / `description` / `system_prompt` / `tools` / `model`
- CompiledSubAgent 形式的子 agent：
  - 包装 LangChain 的 agent
  - 包装 LangGraph 的 StateGraph
  - 是更好的兼容方式吗？API 接口 → SDK
- 子智能体格式化输出：给子智能体配置 `response_format`，并指定包含的字段和类型
- 子智能体可以嵌套，但不要超过 2 层

字典形式的子智能体不能有子智能体 → 只有 DeepAgent 才能有子智能体，所以嵌套的时候需要把 DeepAgent 封装成 CompiledSubAgent 对象。

`task` 工具：

1. 执行的速度慢
2. 有步骤

## 人工审核（HITL）

有些工具坑比较敏感，需要人工批准才能执行。

### 什么是人工审批

对于高危、敏感的工具操作（删表、删除文件等），**在工具真正执行前先拦截，交给人审核**：审核同意才执行工具；审核拒绝，则不执行该工具。

### 人工审批编码实现流程（4 步）

1. **创建 Agent**：配置支持审批动作（`approve` 同意、`reject` 拒绝、`edit` 修改参数），同时配置 `checkpointer`（状态持久化 / 断点保存）
2. **第一次调用执行**：指定 `thread_id`（会话 ID）。运行到要调用工具的节点时**主动中断暂停**，将当前 Agent 状态保存下来，**不会执行工具**；返回结果中携带 `__interrupt__`，存放待审批信息（待调用工具、参数、上下文）
3. **审批逻辑处理**：读取返回数据里 `__interrupt__` 中的工具信息，由人 / 业务逻辑判断，产出审批结果
4. **第二次恢复执行**：**使用同一个 `thread_id` + 带上审批结果**。Agent 会读取之前保存的断点状态继续跑：
   - `approve`：正常调用这个工具
   - `reject`：跳过、取消本次工具调用
   - `edit`：使用修改后的参数调用工具

   执行完毕返回最终结果

`checkpointer` + `thread_id` 是这套审批的核心：用来**记住中断时的会话状态**，依靠 `interrupt()` 触发暂停、通过返回的 `__interrupt__` 向外透出审批载荷，实现「暂停 → 外部审批 → 续跑」，也就是 LangGraph 里的 **human-in-the-loop（人在回路）**。

## 后端存储

Backend 是重点，四种形态：

- **state**：状态（默认）。节点的 state，结束就会释放，若没有配置检查点就得不到
- **Filesystem**：内存文件
- **store**：利用其可以达到长期记忆
  - 默认：内存里 → 只要程序不停
  - 持久化：DB
    - 本地：只能实现本地共享
    - 远程：分布式、在线共享、全局共享
- **composite**：组合 → 可能有多种组合方法，通过 router 路由

### 文件存储

```python
main_agent = create_deep_agent(
    model=llm,
    tools=[],
    system_prompt="""对文件读写操作""",
    backend=FilesystemBackend(
        root_dir="./backend_dir",  # 重点：指定路径，告诉它保存在哪个目录下
        virtual_mode=True  # 虚拟路径，转换为对应文件夹，限制智能体只能在这个文件夹中操作，安全性更高
    )
)

result = main_agent.invoke({
    "messages": [
        # 自动调用 write_file
        {"role": "user", "content": "帮我查询下 python 语言的介绍，并且帮我写到 xxx.txt 文件"}
    ]
})
print(f"最终结果: {result['messages'][-1].content}")

result2 = main_agent.invoke({
    "messages": [
        # 自动调用 read_file 工具
        {"role": "user", "content": "读取 xxx.txt 文件内容，不要做额外处理"}
    ]
})
print(f"最终结果2: {result2['messages'][-1].content}")
```

### Store 内存存储

两次会话能读到上次会话的数据。默认用的是内存存储，key、value 的形式。

- 持久化
- 共享性
- 适配器

`namespace`：先确定外层名称，再去内层找 → 定义外部的标识名称

```python
"""
  演示使用 StoreBackend 实现长期记忆
  实现跨会话的数据共享
"""
from deepagents import create_deep_agent
from deepagents.backends import StoreBackend, StateBackend, FilesystemBackend, CompositeBackend
from langgraph.store.memory import InMemoryStore
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
import os

load_dotenv()

llm = init_chat_model(
    model="qwen-plus",
    model_provider="openai",
    api_key=os.getenv("DASHSCOPE_API_KEY"),
    base_url=os.getenv("DASHSCOPE_BASE_URL")
)

store = InMemoryStore()  # 创建用于存储的 store 对象，InMemoryStore 只在程序运行时有效
# 如果要持久化保存，要换成对应数据库的 store

main_agent = create_deep_agent(
    model=llm,
    system_prompt="""
    你要把用户的重要信息保存到 user_profile.txt 文件中！
    获取用户信息可以读取 user_profile.txt 文件！
    """,
    store=store,  # 配置 store
    backend=StoreBackend(  # 配置 store 类型的 backend
        namespace=lambda runtime: ("ns_name",)  # 指定 namespace 标识名称
    )
)

config_a = {"configurable": {"thread_id": "a"}}  # 两个对话
config_b = {"configurable": {"thread_id": "b"}}

# 第一遍执行 => 保存一些重要数据
result_a = main_agent.invoke(
    {"messages": [{"role": "user", "content": "我是大风哥，我今年 19 岁！"}]},
    config=config_a
)
print(f"第 1 次回复结果：{result_a['messages'][-1].content}")

# 手动读取 store 存储的数据
result = store.search(("ns_name",))
print("---", result)
for item in result:
    print("+++", item.namespace, item.key, item.value)

# 第二遍执行 => 读取一些重要信息
result_b = main_agent.invoke(
    {"messages": [{"role": "user", "content": "我叫啥和我的年龄！"}]},
    config=config_b
)
print(f"第 2 次回复结果：{result_b['messages'][-1].content}")
```

### 混合存储

让不同的文件使用不同存储方式存储。

## 文件权限控制

控制哪些文件只读、哪些文件可读可写 → 声明式。

### 全局只读

项目下所有文件只读：

```python
agent = create_deep_agent(
    model=llm,
    backend=FilesystemBackend(
        root_dir="./backend_dir"
    ),
    permissions=[
        FilesystemPermission(
            operations=["write"],  # 针对哪个操作
            paths=["/**"],  # 根目录以及子目录所有文件
            mode="deny"  # 拒绝
        )
    ]
)
```

### 目录隔离

针对某个目录只读或者可读可写：

```python
agent = create_deep_agent(
    model=llm,
    backend=FilesystemBackend(
        root_dir="./agent_workspace"
    ),
    permissions=[
        FilesystemPermission(
            operations=["write", "read"],
            paths=["/allow_dir/**"],  # 匹配根目录下 allow_dir 下的所有文件
            mode="allow"  # 同意 → 这个目录下的文件可读可写
        ),
        FilesystemPermission(
            operations=["write"],
            paths=["/**"],  # 根目录以及子目录所有文件
            mode="deny"  # 拒绝，不允许写
        ),
    ]
)
```

> 从上往下匹配，一旦匹配就不再往下看，所以匹配的时候更具体的要写在前面，范围更小的写在上面。

## Skill

可复用的能力包，实现某一个功能或者某一套功能。

```python
main_agent = create_deep_agent(
    model=llm,
    system_prompt="你是一个智能助手，可以使用 SKILL 技能！",
    backend=FilesystemBackend(root_dir="./"),  # 文件操作的根目录是当前项目目录
    skills=["./skills"]  # 配置所有 skill 所在的目录路径
)
```

### skill.md（必选）

- `name`：必须
- `description`：必须
- 加载策略：先只加载所有 skill 的 `name` 和 `description`，匹配到了再加载整体内容

## 上下文与上下文工程

一份上下文里通常包含四块：

1. 系统提示词（`system_prompt`）→ 一旦确定后不会再变，每次执行都携带
2. 用户提问
3. tool 的 docstring
4. skill：开始只是把所有 skill 的元数据添加到系统提示词，后续匹配上某个技能后，会加载整个 skill 的内容添加为系统提示词

上下文的类型：

- **输入上下文（Input Context）**：系统提示词、记忆、skill、工具说明
- **运行时上下文（Runtime Context）**：用户 id、权限、api key、数据库连接等静态配置

治理上下文的两条路子：

- **子代理隔离**：把子任务隔离到子代理内部
- **长期记忆**：跨线程、跨会话持久信息

> **补充整理**：上下文窗口是这套架构里最贵的资源，DeepAgents 的几个设计其实都指向同一件事——
> 让「当前这一步真正需要的信息」尽量少。
>
> - 规划用 ToDoList 外置：进度写在文件里，而不是每轮都复述一遍
> - 中间结果写临时文件：工具返回的长文本落盘，只把路径带进上下文
> - 子智能体隔离：子任务在自己的窗口里折腾完，只把结论交回主智能体
> - skill 分级加载：先只看 `name` + `description`，命中才读全文
>
> 所以调这套东西时，与其纠结提示词写得多漂亮，不如先看上下文里有没有塞进用不上的东西。
