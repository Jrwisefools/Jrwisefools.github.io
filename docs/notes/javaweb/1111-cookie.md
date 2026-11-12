---
title: "Cookie：客户端会话技术"
date: 2026-11-11
tags:
  - JavaWeb
  - 会话技术
archived: true
description: "会话技术引入、Cookie 的创建与发送、存活时间、路径与域，以及中文与特殊字符处理。"
---

# Cookie：客户端会话技术
## 会话技术介绍

- 为什么？
- 概述
  - 指的是web开发中的一次通话过程，当打开浏览器，访问网站地址后，会话开始，当关闭浏览器（或者到了过期时间），会话结束。
- 分类
  - cookie是浏览器端的会话技术
  - session是服务器端的会话技术
- 作用
  - 如果我们需要在多次请求间实现数据共享，就可以考虑使用会话管理技术

## cookie概述

- 概述

  - 它是客户端浏览器的缓存文件，里面记录了客户浏览器访问网站的一些内容。同时，也是HTTP协议请求和响应消息头的一部分

- 作用

  - 它可以保存客户浏览器访问网站的相关内容（需要客户端不禁用Cookie）。从而在每次访问需要同一个内容时，先从本地缓存获取，使资源共享，提高效率。

- 常用属性

  | 属性名称 | 属性作用           | 是否重要 |
  | -------- | ------------------ | -------- |
  | name     | cookie的名称       | 必要属性 |
  | value    | cookie的值         | 必要属性 |
  | path     | cookie的路径       | 重要     |
  | maxAge   | cookie的生存时间。 | 重要     |

## cookie基本使用

- 常用操作
  - 创建cookie对象
  - 向浏览器添加cookie
  - 服务器端获取Cookie

## cookie执行流程

- 执行流程
  - 浏览器端第一次发起请求，服务器端创建cookie对象
  - 响应对象通过操作响应头“Set-Cookie”将cookie信息携带到浏览器端
  - 浏览器端拿到该cookie信息保存到本地
  - 浏览器端第二次发起请求，cookie信息会随着请求头“cookie”携带到服务器端
  - 服务器端通过request.getCookies()方法来获取该cookie信息

## cookie相关设置

- 值限制
  - Cookie 的值不能包含逗号、分号、空格。
- 存活时间限制(setMaxAge)
  - -1 : (默认值)当前会话有效，浏览器关闭则清除
  - 0 : 立即清除----销毁cookie
  - 正数 : 以秒为单位,设置存活时间
- 访问路径限制(setPath)
  - 访问哪些资源时携带Cookie，默认值是"/项目名称"---当访问项目下所有资源都会携带cookie
  - "/项目名/目录名/资源名",访问路径完全匹配上"/项目名/目录名/资源名"才会携带cookie
    - 比如 : "/web15/xyz/index.html" , 只有"/web15/xyz/index.html"才会携带cookie
  - "/项目名/目录名",访问路径前面匹配上"/项目名/目录名"就会携带cookie
    - 比如："/web15/xyz"，"/web15/xyz/index.html"、"/web15/xyz/demo01.html"都会携带cookie

> 注意:确定唯一的cookie需要相同的name和路径

## cookie销毁

- 开发步骤

  - 创建Cookie对象
  - 设置相同名称
  - 设置相同path
  - 设置maxAge=0

- 代码实现

  ```java
  @WebServlet("/demo01")
  public class Demo01Servlet extends HttpServlet {

      @Override
      protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          Cookie cookie = new Cookie("test", "helloworld");
          cookie.setPath("/");
          cookie.setMaxAge(7 * 24 * 60 * 60);
          resp.addCookie(cookie);
      }

      @Override
      protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          doGet(req, resp);
      }
  }
  ```

  ```java
  @WebServlet("/demo02")
  public class Demo02Servlet extends HttpServlet {

      @Override
      protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          //1,创建相同名称的Cookie对象
          Cookie cookie = new Cookie("test","");
          //2,设置相同path
          cookie.setPath("/");
          //3,设置maxAge=0
          cookie.setMaxAge(0);
          resp.addCookie(cookie);
      }

      @Override
      protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          doGet(req, resp);
      }
  }
  ```

## CookieUtils类引入

- 代码实现

  ```java
  public class CookieUtils {

      public static Cookie getCookie(Cookie[] cookies , String cookieName){
          if (cookies == null || cookies.length == 0) {
              return null;
          }
          for (Cookie cookie : cookies) {
              if (cookieName.equals(cookie)) {
                  return cookie;
              }
          }
          return null;
      }

  }
  ```
