---
title: "Session：服务端会话技术"
date: 2026-11-11
tags:
  - JavaWeb
  - 会话技术
archived: true
description: "Session 的原理、与 Cookie 的关系、常用 API、生命周期与钝化活化。"
---

# Session：服务端会话技术
## session介绍

### 概述

服务器会话管理技术
只不过在客户端保存的是一个特殊标识，而共享的数据保存到了服务器端的内存对象中。每次请求时，浏览器都会将特殊标识携带到服务器端，根据这个标识来找到对应的内存空间，从而实现共享。
也是一个域对象

### 域对象

| 域对象         | 作用范围     | 使用场景                                                     |
| -------------- | ------------ | ------------------------------------------------------------ |
| ServletContext | 整个应用范围 | 当前项目中需要数据共享时，可以使用此域对象。                 |
| ServletRequest | 当前请求范围 | 在请求或者当前请求转发时需要数据共享可以使用此域对象。       |
| HttpSession    | 会话范围     | 在当前会话范围中实现数据共享。它可以在多次请求中实现数据共享 |

## session基本使用

- 方法说明
  - getAttribute
  - setAttribute
  - removeAttribute

## session执行流程

![image.png](/images/javaweb/session-execution-flow.png)

## 04_session相关配置

### ①存活时长: Session默认存活30分钟(`conf/web.xml`)

```xml
<session-config>
  <session-timeout>30</session-timeout>
</session-config>
```

### ②空闲时长: 设置最大空闲时长, 超过这个时间就会销毁session

```java
void setMaxInactiveInterval(int interval);
```

> 单位是秒

### ③立即销毁Session

```java
void invalidate();
```

### ④手动清理浏览器缓存数据会怎么样?

在浏览器, 手动清理缓存数据(Cookie), 只是将保存在浏览器中的`JSESSIONID`清空了, 服务器中的Session对象依然存在(遵守30分钟存活时长的原则), 这个时候如果请求服务器, 服务器会创建一个新的Session对象.

## session用户登录

### 需求

![image.png](/images/javaweb/session-login-requirement.png)
