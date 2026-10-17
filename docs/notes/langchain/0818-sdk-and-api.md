---
title: "SDK 与 API：接入大模型的第一步"
date: 2025-08-18
tags:
  - LangChain
  - API
archived: false
---
SDK:工具包
API:接口统一规范

```python
"""
使用ChatCompletion API访问openai

"""
```

---

> **补充整理**：下面是课后补充的概念辨析与可运行示例，用于复习时对照。

## SDK 和 API 到底什么关系

| | API | SDK |
|---|---|---|
| 是什么 | 一套**通信约定**（地址、参数、返回格式） | 封装好 API 的**语言工具包** |
| 形态 | HTTP 接口文档 | `pip install openai` 这样的库 |
| 你要做的事 | 自己拼 URL、Header、JSON、处理重试 | 调一个函数，传参数 |
| 类比 | 说明书 | 说明书 + 已经组装好的遥控器 |

**结论**：API 是规范，SDK 是规范的实现。日常开发直接用 SDK，省心；理解 API 结构，才能在 SDK 报错时看懂问题出在哪。

## 原生 HTTP 调用长什么样

知道 SDK 帮你省了什么，排错时会更清醒：

```python
import requests

resp = requests.post(
    "https://api.openai.com/v1/chat/completions",
    headers={
        "Authorization": f"Bearer {'你的API_KEY'}",
        "Content-Type": "application/json"
    },
    json={
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": "你好"}]
    },
    timeout=30
)
print(resp.json()["choices"][0]["message"]["content"])
```

SDK 版本做的是完全一样的事：

```python
from openai import OpenAI

client = OpenAI(api_key="你的API_KEY")

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "你好"}]
)
print(resp.choices[0].message.content)
```

## ChatCompletion 的 messages 结构

`messages` 是一个**按时间顺序排列的对话列表**，每条带 `role`：

| role | 作用 | 是否必填 |
|------|------|---------|
| `system` | 设定角色、语气、约束，贯穿全程 | 可选 |
| `user` | 用户说的话 | 必填 |
| `assistant` | 模型的回复；做多轮对话时要把历史回传 | 可选 |
| `tool` | 工具执行结果（函数调用场景） | 可选 |

**多轮对话的本质**：模型本身没有记忆，每一轮都要把完整历史再发一遍。所谓「记忆」是你在客户端维护历史列表。

```python
history = [{"role": "system", "content": "你是一个简洁的助手"}]

def chat(user_input: str) -> str:
    history.append({"role": "user", "content": user_input})
    reply = client.chat.completions.create(model="gpt-4o-mini", messages=history)
    answer = reply.choices[0].message.content
    history.append({"role": "assistant", "content": answer})  # 回写历史
    return answer

chat("我叫蒋璐新")
chat("我叫什么？")   # 能答对，因为上一轮历史被回传了
```

## 只改 base_url 就能换模型

OpenAI 的 API 格式已成为事实标准，多数国产模型和本地推理框架都兼容它，切换成本极低：

```python
from openai import OpenAI

# DeepSeek
client = OpenAI(api_key="sk-xxx", base_url="https://api.deepseek.com")

# 本地 vLLM 部署的开源模型
client = OpenAI(api_key="EMPTY", base_url="http://localhost:8000/v1")

# 阿里通义（兼容模式）
client = OpenAI(api_key="sk-xxx",
                base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
```

这也是为什么企业里常把 OpenAI SDK 当「通用客户端」用——换供应商不改业务代码。

## 常用参数速记

| 参数 | 作用 | 经验值 |
|------|------|--------|
| `model` | 指定模型 | 按场景选，别一律上最强的 |
| `temperature` | 随机性，越低越确定 | 抽取/分类用 0~0.2，创意写作 0.7+ |
| `max_tokens` | 单次回复上限 | 防止失控，必设 |
| `stream` | 流式返回 | 对话类产品必开，体验差别很大 |
| `timeout` | 超时 | 必设，否则一个卡死请求挂住整个服务 |

## 工程实践

- **密钥不要硬编码**：用环境变量 `os.getenv("OPENAI_API_KEY")` 或 `.env` 文件，且 `.env` 必须进 `.gitignore`。
- **一定要做重试**：网络抖动、限流是常态，用指数退避重试 3 次。
- **成本要记账**：统计每次调用的 `usage.prompt_tokens` / `completion_tokens`，长对话尤其容易失控。
