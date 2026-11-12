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

![image.png](https://note.youdao.com/yws/public/resource/7ced6d6a489dcbea5811f91e71134a68/WEB8c4ddefcf24218e7a6944b8af9e920f3/WEBRESOURCEb1fe6f59982c657c08706a180be33ed3?ynotemdtimestamp=1794401450276)
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

![image.png](https://note.youdao.com/yws/public/resource/7ced6d6a489dcbea5811f91e71134a68/WEB8c4ddefcf24218e7a6944b8af9e920f3/WEBRESOURCEb907f9cce1d64a1e961c01a2811660ed?ynotemdtimestamp=1794401450276)
M:model
承载数据的载体

V:view
渲染数据

C:controller
处理请求
调度页面

- java代码还是在负责页面的跳转

> 前后端分离

![image.png](https://note.youdao.com/yws/public/resource/7ced6d6a489dcbea5811f91e71134a68/WEB8c4ddefcf24218e7a6944b8af9e920f3/WEBRESOURCE58e18292f9be8ada16aceb982b6768d4?ynotemdtimestamp=1794401450276)
