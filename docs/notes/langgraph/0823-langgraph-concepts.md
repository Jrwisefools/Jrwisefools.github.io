---
title: "LangGraph 核心概念：节点、边与状态"
date: 2025-08-23
tags:
  - LangGraph
archived: false
description: "LangGraph 三个核心概念——节点、边、状态。含最小可运行图、条件边与循环，以及与 LCEL 的选型对比。"
---
# 第一章LangGraph
## 什么是LangGraph
节点：代表计算单元，可以是LLM调用、工具执行或任何自定义逻辑   
边:定义节点之间的转换逻辑,决定执行流程   
状态:节点的属性(节点可以携带的信息)-->节点可以想象成节点对象   
代码中节点就是函数
LangGraph 提供了构建生产级智能体应用的核心能力

---

> **补充整理**：下面是课后补充的代码示例与对比说明，用于复习时对照。

## 三个概念一张图

```text
        ┌─────────┐         ┌─────────┐
        │  node_a │────────▶│  node_b │
        └─────────┘   edge  └─────────┘
              │                  │
              └────────┬─────────┘
                       ▼
                  State（共享数据）
```

- **State**：一张所有节点都能读写的「公共白板」。
- **Node**：一个函数，签名固定为 `(state) -> 新状态片段`。
- **Edge**：从一个节点到下一个节点的跳转规则。

理解 State 是关键——节点之间**不直接传参**，都通过 State 中转，这让每个节点可以独立测试、独立替换。

## 最小可运行图

```python
from typing import TypedDict
from langgraph.graph import StateGraph, END

# 1. 定义 State：一张白板的结构
class State(TypedDict):
    messages: list[str]
    count: int

# 2. 定义节点：函数进出都是 State
def node_a(state: State) -> dict:
    print("进入节点 A")
    return {"count": state["count"] + 1, "messages": state["messages"] + ["A 处理过"]}

def node_b(state: State) -> dict:
    print("进入节点 B")
    return {"messages": state["messages"] + ["B 处理过"]}

# 3. 组装图
graph = StateGraph(State)
graph.add_node("a", node_a)
graph.add_node("b", node_b)

graph.set_entry_point("a")          # 从哪个节点开始
graph.add_edge("a", "b")            # a 执行完去 b
graph.add_edge("b", END)            # b 执行完结束

# 4. 编译并执行
app = graph.compile()

result = app.invoke({"messages": [], "count": 0})
print(result)
# {'messages': ['A 处理过', 'B 处理过'], 'count': 1}
```

> 注意节点返回值是**状态片段**而不是完整 State，LangGraph 负责合并回去。这也是为什么函数里写 `{"count": ...}` 就够了。

## 条件边：让流程会拐弯

普通边是「必定走」，条件边是「看情况走」——这才是智能体的灵魂：

```python
from langgraph.graph import StateGraph, END

class State(TypedDict):
    score: int
    retry: int

def check(state: State) -> str:
    """返回下一个要去的节点名"""
    if state["score"] >= 60:
        return "pass"
    return "retry_node"

graph = StateGraph(State)
graph.add_node("check", lambda s: s)
graph.add_node("pass", lambda s: {"score": s["score"]})
graph.add_node("retry_node", lambda s: {"retry": s["retry"] + 1})

graph.set_entry_point("check")
graph.add_conditional_edges(
    "check",
    check,
    {"pass": "pass", "retry_node": "retry_node"}
)
graph.add_edge("pass", END)
graph.add_edge("retry_node", "check")   # 回到检查点，形成循环

app = graph.compile()
```

**能形成循环**是 LangGraph 相对普通链式编排最大的优势——重试、反思、多轮规划都靠它。

## 和 LangChain Agent 怎么选

| | LangChain Agent / LCEL | LangGraph |
|---|---|---|
| 结构 | 链式，一步接一步 | 图，可分支可循环 |
| 适合 | 流程固定的 RAG、简单工具调用 | 需要循环、回退、人工介入、多智能体协作 |
| 状态管理 | 隐式，靠内存里的列表 | 显式 State，可持久化 |
| 复杂度 | 低，上手快 | 略高，但可控性强 |

经验法则：**流程是直线就用 LCEL，流程要拐弯或回头就上 LangGraph。**

## 什么时候该用它

别为了用而用。下面这些场景才真正需要图：

- 需要**重试/自我修正**：生成结果不达标就回退重来。
- 需要**循环**：多轮检索，直到信息足够。
- 需要**持久化与断点续跑**：长时间任务中途挂了能从断点恢复。
- 需要**人在回路**：执行到敏感步骤时暂停等人确认。
- 需要**多智能体协作**：多个角色各自负责一段子图。
