---
title: "Agent 与工具调用"
date: 2025-08-22
tags:
  - LangChain
  - Agent
archived: false
description: "Agent 与工具调用：JSON Schema 如何描述工具、ReAct 循环的执行过程，以及生产环境的轮数与危险操作控制。"
---
## Agent
### 将所有工具封装成json信息，在调用大模型时候传入所有JSON Schema

---

> **补充整理**：下面是课后补充的原理说明与可运行示例，用于复习时对照。

## Agent 和普通对话的区别

普通调用：问题进 → 答案出，模型只能「说」。

Agent：**模型 + 工具 + 循环**，模型可以「做」。

```text
用户提问
   ↓
LLM 思考：要不要用工具？用哪个？参数是什么？
   ↓                        ↓
 直接回答           执行工具 → 拿到结果 → 塞回上下文 → 再思考
                                                    ↓
                                              直到能给出最终答案
```

所以 Agent 的核心不是「模型更聪明」，而是**给模型配了手和脚，并让它自己决定什么时候用**。

## 工具是怎么告诉模型的

模型不认识 Python 函数，它只认识文本。所以要把工具翻译成结构化的 **JSON Schema** 一起传进去：

```json
{
  "name": "get_weather",
  "description": "查询指定城市当前的天气情况",
  "parameters": {
    "type": "object",
    "properties": {
      "city": { "type": "string", "description": "城市名称，如 北京" }
    },
    "required": ["city"]
  }
}
```

三个字段都很关键：

- `name`：模型后续回传时用来指定调用哪个工具。
- `description`：**最重要**。模型靠这段自然语言判断该不该用这个工具，写得含糊就会乱调或不用。
- `parameters`：约束入参，模型会照着 schema 拼 JSON。

## 在 Python 里定义工具

用 `@tool` 装饰器，文档字符串会自动变成 `description`，类型注解会变成 `parameters`：

```python
from langchain_core.tools import tool

@tool
def get_weather(city: str) -> str:
    """查询指定城市当前的天气情况。用户问天气时调用它。"""
    # 真实场景这里调天气 API
    return f"{city}：晴，26℃"

@tool
def calculate(expr: str) -> str:
    """计算数学表达式，例如 12 * (3 + 4)。"""
    return str(eval(expr))

tools = [get_weather, calculate]
print(get_weather.args_schema.model_json_schema())  # 看看生成的 JSON Schema
```

> 经验：docstring 第一句写「做什么」，第二句写「什么时候用」，召回准确率会明显提升。

## 一个完整的 Agent

```python
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

agent = create_react_agent(llm, tools)

for step in agent.stream(
    {"messages": [{"role": "user", "content": "北京今天天气怎么样？顺便算下 128 * 15"}]},
    stream_mode="values"
):
    step["messages"][-1].pretty_print()
```

执行过程肉眼可见：

1. 模型输出一个「工具调用请求」（不是最终答案）。
2. 框架执行 `get_weather("北京")`，把结果作为 `tool` 消息追加。
3. 模型看完结果继续思考，再调 `calculate`。
4. 信息够了，输出最终回答。

这个「思考 → 调用 → 观察 → 再思考」的循环就是 **ReAct** 模式。

## 生产上要注意的事

- **限制轮数**：不设上限，模型可能陷入死循环把 token 烧光。设 `recursion_limit`。
- **超时与兜底**：外部工具会挂，必须有超时和失败话术。
- **工具别给太多**：一次塞 20 个工具，模型选择质量会断崖下降。按场景动态裁剪到 5 个以内。
- **危险操作要human-in-the-loop**：删数据、发消息、付款这类工具，加人工确认再执行。
