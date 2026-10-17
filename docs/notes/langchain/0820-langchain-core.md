---
title: "LangChain 核心概念与包结构"
date: 2025-08-20
tags:
  - LangChain
archived: false
---
# LangChain
## LangChain是什么
langchain可以用于多种常见
LLM->大语言模型
开发者希望灵活集成,工具调用(Tool Callinng)
检索增强生成(RAG)
等功能
## langchain包含的包
langchain
langchain-core
langchain-openai

## 核心模块划分
1. Model I/O
    标准化大模型输入输出,包含提示模板，模型调用和格式化输出
    Format(格式化)
    Predict(预测)
    Parse
    
2. Chains
    链条,将多个组件组合成一个完整的流程，方便链式调用
3. Retrieval
    对应RAG：检索外部数据，作为参考信息输入LLM辅助生成答案
4. Agents
    自主规划执行步骤并使用工具来完成任务

在代码当作通过os读取变量
## 调用在线模型
调用 load_dotenv 方法加载.env文件
```python
from dotenv import load_dotenv
load_dotenv()
import os
api_key = os.getenv("Open_API_key")
print(api_key)
```
### openai 官方接口调用方式
ChatCompletionsAPI
```python
from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
cilent = OpenAI(
    base_url = os.getenv("OPENAI_BASE_URL")
    api_key = os.getenv("OPENAI_API_KEY")
)

completion = client.chat.completions.create(
    model = "gpt-5",#模型名称
    message = [{"role":"user","content":"你好翻译成意大利语"}]
)
print(completion.choices[0].message.content)

#ResponsesAPI调用实例
import os
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model = "gpt-5"
    input = "中国国内今天发生了哪些大事"
    tools = [{"type":"web_search"}]  #可以自懂调用内置工具
)
print(response.output_text)

```

## LangChain API 调用模型
1.构造LLM实例
2.传递Message对象或普通字符串对象，调用LLM实例
3.解析调用结果

```python
"""首先介绍init_chat_model的初始化参数"""
import os
import dotenv
from langchain.chat_models import init_chat_model
def get_model_from_init():
   llm =  init_chat_model(
        model = "gpt-4o",
        model_provider= "openai",
        base_url = os.getenv("OPEN_BASE_URL"),
        api_key = os.getenv("OPENAI_API_KEY")
   ) 
   resp = llm.invoke(
       "你好啊"
   )
    print(resp.content)
```
```python
"""使用特性的包"""
import os
import dotenv
from langchain_openai import ChatOpenAI
#构造模型
llm = ChatOpenAI(
    model_name = "gpt-5",
    base_url = os.getenv("OPENAI_BASE_URL")
    base_key = os.getenv("OPENAI_API_KEY")
)
res = llm.invole("你好")
print(type(res))
print(res.connect)
```
除了传入字符串之外，还可以传入一个消息列表
```python
import os
from langchain_openai import ChatOpenAI
from langchain_core.message import HumanMessage,SystemMessage,AIMessage
def invoke_llm_with_message_list():
    llm = ChatOpenAI(
        model = "gpt-5",
        base_url = os.getenv("OPENAI_BASE_URL"),
        api_key = os.getenv("OPENAI_API_KEY")
    )
    resp = llm.invoke([
        SystemMessage(content = "你说一个专业的数学助手"),
        HumanMessage(content = "你好,你是谁")
    ])
    print(resp.content)
```
除了使用HumanMessage等类意外，还可以通过元组对象来表示,元组对象第一个元素表示角色
第二个对象表示具体消息内容;也可以通过OpenAI官方使用的dict来表示,dict当中有两个键
第一个为role,表示角色，第二个是content，表示内容
```python
import os
import dotenv
from langchain_openai import ChatOpenAI

def invoke_llm_with_message_list_use_tuple():
    llm = ChatOpenAI(
        model = "gpt-5"
        bast_url = os.getenv("OPENAI_BASE_URL"),
        api_key = os.getenv("OPENAI_API_KEY")
    )
    messages_list = [("system","你是一个专业的数学助手"),("user","你好,你是谁")]
    messages_list = [{"role":"system","content":"你是一个专业的数学助手"},
                     {"role":"user","content":"你好,你是谁"}]
    resp = llm.invoke(messages_list)
    print(type(resp))
    print(resp.content)
```
Langchain的LLM对象还支持异步调用、流式调用、批次调用等多种方法
```python
"""异步调用在实际生产环境下非常实用，可以大大提高性能"""
import asyncio
async def call_llm_async():
    from langchain_openai import ChatOpenAI
    llm = ChatOpenAI(
        model = "gpt-5"
    )
    response = await llm.ainvoke(
        input= [("user","什么是langChain")]
    )
    print(response.content)
```
```python
"""流式调用，可以让大模型输出结果实现打字机效果"""
from langchain_openai import ChatOpenAI
def call_llm_streaming_mode():
llm = ChatOpenAI(
        model_name = "gpt-5"
    )
response = llm.stream(
    input[("user","什么是LangChain")]
)
#遍历迭代器对象，打印美国chunk的内容
for chunk in response:
    print(chunk.content,end="")
call_llm_streaming_mode()
```
```python
from langchain_openai import ChatopenAI
def call_llm_batch_mode():
    llm = ChatopenAI(
        model = "gpt-5"
    )
    responce = llm.batch(
        inputs = [[
            ("user","什么是LangChain"),
            ("user","langchain的核心价值是什么呢")
        ]]
    )
    #打印每个问题的答案
    for question_chunk in responce:
        print(question_chunk)
call_llm_batch_mode()
```
## 通过Prompt约束
要使用prompt明确约束大模型输出,需要使用langchain所提供的JSONOutputParser,
(1) 通过Pydantic定义Json schema(约束)
(2) 使用构造好的JSON Schem 构造JsonOutputParser 实例 json_parsser
(3) 调用 json_parser 的 get_format_instruction()方法，将json结构输出约束，
放到SystemMessage 当中
(4) 将SystemMessage和UserMessage都给到LLM,进行调用，结果使用json_parser.parse()
解析成PythonDict对象
```python
import os
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel,Field
def json_out_parser():
    llm = ChatOpenAI(
        model_name = "gpt_5"
    )
    class Prime(BaseModel):
        prime : int = Field(description="素数")
        count : int - Field(discriminator="小于改素数的个数")
    
    
```
