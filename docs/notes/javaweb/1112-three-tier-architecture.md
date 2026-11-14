---
title: "三层架构：分层与解耦"
date: 2026-11-12
tags:
  - JavaWeb
  - 分层架构
archived: true
description: "从 Servlet 包办一切的问题出发，梳理表现层、业务层、数据访问层的职责划分与包结构。"
---

# 三层架构：分层与解耦
## 三层架构

> 存在的问题

Servlet做的事太多了：

1，处理请求	2，业务处理	3，操作数据库	4，渲染页面	5，跳转页面。

程序维护起来特别麻烦。

> 三层架构

![image.png](/images/javaweb/three-tier-architecture.png)
控制层：controller
1，处理请求、
4，渲染页面
5，跳转页面
业务层: service
2，业务处理
持久层：dao
3，操作数据库

> 依然存在的问题

控制层依然需要去编写html代码，进行页面的渲染，将java代码和html代码耦合到一块了。

## MVC架构

> 解决的问题

将java数据显示到html页面中。

> MVC

![image.png](/images/javaweb/mvc-pattern.png)
M:model
承载数据的载体

V:view
渲染数据

C:controller
处理请求
调度页面

- java代码还是在负责页面的跳转

> 前后端分离

![image.png](/images/javaweb/front-back-separation.png)
