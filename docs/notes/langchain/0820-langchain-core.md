---
title: "LangChain 核心概念与包结构"
date: 2025-08-20
tags:
  - LangChain
archived: false
description: "LangChain 的定位、包结构与核心模块划分，OpenAI 原生接口与 LangChain 两种调用方式对比，以及异步/流式/批量调用与结构化输出约束。"
---

# LangChain

## LangChain 是什么

LangChain 可以用于多种常见场景：
LLM -> 大语言模型
开发者希望灵活集成、工具调用（Tool Calling）、检索增强生成（RAG）等功能

> **补充整理**：LangChain 的本质是**一层“胶水”**——它不训练模型，而是把
> 「提示词 → 模型 → 工具 → 记忆 → 检索」这些环节抽象成统一接口，
> 让你可以**换模型不改代码**。它的价值在标准化，不在性能。

## langchain 包含的包

- `langchain`：上层封装，包含链、Agent 等“开箱即用”的组装件
- `langchain-core`：核心抽象（消息、Runnable、输出解析器），**最轻最稳定**
- `langchain-openai`：厂商适配包（还有 `-anthropic`、`-ollama` 等）

> **补充整理**：装包时别再无脑 `pip install langchain` 一把梭。按需装：
>
> ```bash
> pip install langchain-core langchain-openai   # 用 OpenAI 系模型时
> pip install langchain-community               # 用第三方向量库/工具时
> ```
>
> 拆包是为了让依赖变轻——你不会想在只调 OpenAI 的项目里被迫装上一堆用不到的 SDK。

## 核心模块划分

1. **Model I/O**：标准化大模型输入输出，包含提示模板、模型调用和格式化输出
   Format（格式化）→ Predict（预测）→ Parse（解析）
2. **Chains**：链条，将多个组件组合成一个完整流程，方便链式调用
3. **Retrieval**：对应 RAG，检索外部数据作为参考信息输入 LLM 辅助生成答案
4. **Agents**：自主规划执行步骤并使用工具来完成任务

在代码中通过 `os` 读取环境变量

## 调用在线模型

调用 `load_dotenv` 方法加载 `.env` 文件

```python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
print(api_key)
```

> **补充整理**：`.env` 文件**必须加进 `.gitignore`**。密钥一旦提交到公开仓库，
> 几小时内就会被扫描机器人抓取并刷爆账单——这是新手最常犯、代价最高的错误。
> 建议用 `python-dotenv` 只在本地开发时加载，生产环境直接用系统环境变量。

### OpenAI 官方接口调用方式

ChatCompletions API

```python
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("OPENAI_BASE_URL"),
    api_key=os.getenv("OPENAI_API_KEY"),
)

completion = client.chat.completions.create(
    model="gpt-4o",                      # 模型名称
    messages=[{"role": "user", "content": "你好，翻译成意大利语"}],
)
print(completion.choices[0].message.content)
```

> **补充整理**：原稿这里有 3 处会直接报错——
> `cilent` 拼错（后面却用 `client`）、两个参数之间**少了逗号**
> （Python 会把相邻字符串隐式拼接，报难以理解的错）、
> `message=` 应为 **`messages=`**（复数）。

Responses API 调用示例（较新的接口）

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-4o",
    input="中国国内今天发生了哪些大事",
    tools=[{"type": "web_search"}],      # 可以自动调用内置工具
)
print(response.output_text)
```

> **补充整理**：两个接口的关系——
>
> | 接口 | 特点 | 适用 |
> | --- | --- | --- |
> | **Chat Completions** | 事实标准，生态最全，所有兼容 OpenAI 的服务都支持 | **默认选它** |
> | **Responses** | 官方新推，内置了会话状态、内置工具、推理项 | 只调 OpenAI 且想用新特性时 |
>
> 用 LangChain 或接国内模型（DeepSeek、通义、vLLM）时，走 Chat Completions 兼容性最好。
> **注意**：`base_url` 换成国内/自建服务时，模型名也要跟着换，不能沿用 gpt-4o。

## LangChain API 调用模型

1. 构造 LLM 实例
2. 传递 Message 对象或普通字符串，调用 LLM 实例
3. 解析调用结果

### 方式一：`init_chat_model`（按厂商名动态创建）

```python
import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model

load_dotenv()

def get_model_from_init():
    llm = init_chat_model(
        model="gpt-4o",
        model_provider="openai",
        base_url=os.getenv("OPENAI_BASE_URL"),
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    resp = llm.invoke("你好啊")
    print(resp.content)
```

> **补充整理**：`init_chat_model` 的好处是**换厂商只改 `model_provider` 字符串**
> （`"openai"` / `"anthropic"` / `"ollama"`），适合要支持多模型的场景。

### 方式二：直接用厂商包

```python
import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

llm = ChatOpenAI(
    model="gpt-4o",
    base_url=os.getenv("OPENAI_BASE_URL"),
    api_key=os.getenv("OPENAI_API_KEY"),
)
res = llm.invoke("你好")
print(type(res))        # <class 'langchain_core.messages.ai.AIMessage'>
print(res.content)
```

> **补充整理**：原稿此处有 4 处笔误——
> `llm.invole` → `invoke`；`res.connect` → `res.content`；
> `base_key` → `api_key`；两参数之间缺逗号。

除了传入字符串，还可以传入**消息列表**

```python
import os
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

def invoke_llm_with_message_list():
    llm = ChatOpenAI(
        model="gpt-4o",
        base_url=os.getenv("OPENAI_BASE_URL"),
        api_key=os.getenv("OPENAI_API_KEY"),
    )
    resp = llm.invoke([
        SystemMessage(content="你是一个专业的数学助手"),
        HumanMessage(content="你好，你是谁"),
    ])
    print(resp.content)
```

> **补充整理**：`message` 应为 **`messages`**（复数）——这是 LangChain 最常见的导入错误。
>
> 三种等价的消息写法，按场景选：
>
> | 写法 | 示例 | 适用 |
> | --- | --- | --- |
> | 消息类 | `SystemMessage(content="...")` | **推荐**，类型明确、可读性好 |
> | 元组 | `("system", "...")` | 最简洁，写提示模板时常用 |
> | 字典 | `{"role": "system", "content": "..."}` | 和 OpenAI 原生格式一致 |
>
> ```python
> # 元组形式
> messages = [("system", "你是一个专业的数学助手"), ("user", "你好，你是谁")]
>
> # 字典形式
> messages = [
>     {"role": "system", "content": "你是一个专业的数学助手"},
>     {"role": "user",   "content": "你好，你是谁"},
> ]
> ```
>
> 三种角色：`system` 定行为基调、`user` 是用户输入、`assistant` 是模型历史回复
> （多轮对话时要把历史 assistant 消息一起传，模型才“记得”说过什么）。

### 异步调用

```python
import asyncio
from langchain_openai import ChatOpenAI

async def call_llm_async():
    llm = ChatOpenAI(model="gpt-4o")
    response = await llm.ainvoke([("user", "什么是 LangChain")])
    print(response.content)

asyncio.run(call_llm_async())
```

> **补充整理**：异步调用在生产环境非常实用。IO 等待期间事件循环可以去处理别的请求，
> 同样一台机器能扛的并发量是同步的数倍。
>
> 但要注意：**异步只有在真正并发时才有意义**。如果只是 `await` 一个接一个地调，
> 和同步没有区别。批量并发要用 `asyncio.gather`：
>
> ```python
> results = await asyncio.gather(*[llm.ainvoke(q) for q in questions])
> ```
>
> 更省事的写法是直接用 `abatch`。

### 流式调用

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

for chunk in llm.stream([("user", "什么是 LangChain")]):
    print(chunk.content, end="")
```

> **补充整理**：原稿 `input[("user", ...)]` 应为 `input=[...]`（少了等号），
> 且函数体没有缩进。
>
> 流式不只是“打字机效果”这么简单。生产上它的意义是：
>
> - **首字延迟（TTFT）从几秒降到几百毫秒**，体验提升巨大
> - 长回答不用让用户干等
> - 服务端能边生成边处理（如提前做安全过滤）
>
> 调 OpenAI 时要 `stream=True`（LangChain 已封装好）；自建 vLLM 服务同样支持。
> 异步流式用 `astream`。

### 批量调用

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o")

responses = llm.batch([
    [("user", "什么是 LangChain")],
    [("user", "LangChain 的核心价值是什么")],
])

for r in responses:
    print(r.content)
```

> **补充整理**：原稿有 3 处笔误——`ChatopenAI` → `ChatOpenAI`、
> `responce` → `response`、**`inputs` 多套了一层方括号**（这会让两个问题被当成
> “一次对话的两条消息”，而不是“两个独立请求”，结果完全不对）。
>
> `batch` 的正确输入是**请求列表**：每个元素是一次完整的对话。
> 想控制并发上限（避免触发限流）用：
>
> ```python
> llm.batch(requests, config={"max_concurrency": 5})
> ```
>
> 对海量任务，用 `abatch` + `max_concurrency` 效果最好。

## 通过 Prompt 约束输出格式

要让模型稳定输出 JSON，用 LangChain 提供的 `JsonOutputParser`：

1. 通过 Pydantic 定义 JSON Schema（约束）
2. 用构造好的 Schema 构造 `JsonOutputParser` 实例 `json_parser`
3. 调用 `json_parser.get_format_instructions()`，把格式要求放进 SystemMessage
4. 将 SystemMessage 和 HumanMessage 一起给 LLM，结果用 `json_parser.parse()` 解析成 Python dict

```python
import os
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field


class Prime(BaseModel):
    prime: int = Field(description="一个素数")
    count: int = Field(description="小于该素数的素数个数")


parser = JsonOutputParser(pydantic_object=Prime)

prompt = ChatPromptTemplate.from_messages([
    ("system", "严格按以下格式输出 JSON，不要有多余文字。\n{format_instructions}"),
    ("human", "{question}"),
])

llm = ChatOpenAI(model="gpt-4o")

chain = prompt | llm | parser

result = chain.invoke({
    "question": "请给我一个大于 20 的素数",
    "format_instructions": parser.get_format_instructions(),
})

print(result)          # {'prime': 23, 'count': 9}
print(type(result))    # dict
```

> **补充整理**：原稿这段代码有 3 处错误且**没有写完**——
> `count : int - Field(...)` 的 `-` 应为 `=`（这是语法错误）；
> `Field(discriminator=...)` 没有这个参数，应为 `description`；
> `model_name="gpt_5"` 的横杠应为点号（且新版推荐用 `model=`）。
> 上面是补全后可直接运行的版本。
>
> 几个实战经验：
>
> - **光靠提示词约束还不够稳**。生产环境优先用模型厂商的
>   **结构化输出 / JSON Schema 模式**（OpenAI 的 `response_format`、
>   各家都有的 JSON mode），LangChain 里是 `llm.with_structured_output(Prime)`
> - `get_format_instructions()` 生成的说明会占不少 token，
>   字段多时考虑手写更精简的示例（few-shot）替代
> - 解析失败要兜底：模型偶尔会输出带 ```json 标记的文本，
>   用 `try/except` 重试一次而不是直接崩掉
> - `prompt | llm | parser` 这个管道写法就是 **LCEL**，
>   它自动支持 `invoke` / `stream` / `batch` / `ainvoke`，不用自己写多套
