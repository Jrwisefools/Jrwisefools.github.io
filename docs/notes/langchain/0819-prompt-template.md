---
title: "提示词模板"
date: 2025-08-19
tags:
  - LangChain
  - 提示词
archived: false
description: "ChatPromptTemplate 用法：模板变量与三种书写形式、管道串联模型、few-shot 示例与多轮历史消息注入。"
---
## 提示词模板
提示词模板以字典作为输入

```python
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

def langchain():
    llm = ChatOpenAI(model_name="gpt-4")
    prompt = ChatPromptTemplate.from_messages(
        messages=[
            ("system", "你是一个数学家"),
            ("human", "{question}")
        ]
    )
```

子类：继承父类
父类：约束了子类的限制

```python
class Fu(ABC)
```
父类继承ABC，变成抽象类
抽象列中就允许有抽象方法
抽象方法必须要求子类重写

---

> **补充整理**：下面是课后补充的模板用法说明与完整示例，用于复习时对照。

## 为什么要用模板

手写 f-string 拼接提示词有三个毛病：变量一多就乱、复用困难、特殊字符（比如 `{`）会和格式化语法打架。

`ChatPromptTemplate` 把提示词变成**带占位符的模板对象**，调用时才填值：

```python
from langchain_core.prompts import ChatPromptTemplate

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个数学家，回答要给出推导过程。"),
    ("human", "{question}")
])

# 填值 —— 这就是「以字典作为输入」
result = prompt.invoke({"question": "1 加 1 为什么等于 2？"})

print(result.to_messages())
# [SystemMessage(...), HumanMessage(content='1 加 1 为什么等于 2？')]
```

## 三种书写形式

`from_messages` 里每个元素可以是三种写法，效果一样，按可读性和场景选：

```python
prompt = ChatPromptTemplate.from_messages([
    # 1) 元组形式（最常用）
    ("system", "你是一个数学家"),
    ("human", "{question}"),

    # 2) 消息对象形式（要设置额外字段时用）
    # SystemMessage(content="你是一个数学家"),

    # 3) 纯字符串 —— 会被当作 human 消息
    # "你是一个数学家"
])
```

角色关键字固定只有四个：`system`、`human`（等价 `user`）、`ai`（等价 `assistant`）、`placeholder`。

## 直接接上模型：管道

模板的输出可以直接喂给模型，用 `|` 串起来，这是 LCEL 的经典写法：

```python
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = prompt | llm | StrOutputParser()

print(chain.invoke({"question": "求 1 到 100 的和"}))
```

`StrOutputParser()` 的作用是把模型返回的复杂对象剥成纯字符串，不然你拿到的是一整个 `AIMessage`。

## 多变量与少样本示例

模板不限制变量个数：

```python
prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一位资深的{role}，请用{style}的语气回答。"),
    ("human", "{question}")
])

chain = prompt | llm | StrOutputParser()
print(chain.invoke({
    "role": "后端工程师",
    "style": "严谨但不啰嗦",
    "question": "微服务该怎么拆分？"
}))
```

想给几个示例让模型照着学（few-shot），用 `MessagesPlaceholder` 插一段消息列表：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个只会输出 JSON 的抽取器。"),
    MessagesPlaceholder("examples"),   # 这里会插入一组示例消息
    ("human", "{text}")
])

examples = [
    ("human", "张三今年 25 岁"),
    ("ai", '{"name": "张三", "age": 25}'),
]

prompt.invoke({"examples": examples, "text": "李四今年 30 岁"})
```

## 做多轮对话：塞历史消息

`MessagesPlaceholder` 也是把历史对话插进来的标准做法：

```python
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个简洁的助手"),
    MessagesPlaceholder("history"),
    ("human", "{input}")
])

history = [
    ("human", "我叫蒋璐新"),
    ("ai", "你好，蒋璐新")
]

prompt.invoke({"history": history, "input": "我叫什么？"})
```

## 几个容易踩的点

- **变量要和占位符一一对应**：占位符写了 `{question}`，invoke 时就必须传 `question`，少一个直接报错，多一个被忽略。
- **正文里要写花括号**：连续写两个左花括号、两个右花括号来转义，否则会被当成变量解析。
- **模板可复用**：把常用的 system 提示单独存成模板文件，不同场景组合复用，比到处复制粘贴强得多。
