---
title: "Servlet 与 ServletConfig"
date: 2026-11-10
tags:
  - JavaWeb
  - Servlet
archived: true
description: "Servlet 的概念与生命周期、继承体系、web.xml 与注解配置，以及 ServletConfig / ServletContext 的使用。"
---

# Servlet 与 ServletConfig
## 本章内容

- Servlet
- ServletConfig
- ServletContext

## Servlet介绍及入门

- 概述
  - Servlet是一个运行在web服务端的java程序
  - 可以用于接收和响应客户端的请求
  - 要想实现Servlet功能，可以实现Servlet接口，继承GenericServlet或者HttpServlet
- 快速入门
  - 自定义类继承HttpServlet
    - 重写了doGet方法、doPost方法
  - 在web.xml文件中配置servlet
    - 配置servlet访问路径

## Servlet执行流程

- 执行流程
  ![image](/images/javaweb/servlet-execution-flow.png)

## 03_Servlet关系视图

- 关系结构
  ![image](/images/javaweb/servlet-relation-view.png)

## Servlet的其他两种实现方式

- 继承GenericServlet类
- 实现Servlet接口

## 05_Servlet生命周期

- 创建

- 初始化
  - **请求第一次到达Servlet时**，对象就创建出来，并且初始化成功。**只出生一次(单例模式)**，就放到内存中。

    例是实例->对象

    > 单例的问题:多个请求访问同一个sevelet,一个请求发送一个线程,多个线程去操纵一个对象,会有线程安全问题

    多例:普通模式

- 活着
  - 服务器提供服务的整个过程中，该对象一直存在，每次只是执行service方法。

- 销毁
  - 当服务停止时，或者服务器宕机时，对象消亡。

## 06_Servelt初始化时机

- 概述
  - 默认情况，第一次请求Servlet时才会初始化;
  - 可以通过`load-on-startup`让Servlet随着服务器启动而初始化;
  - 对于load-on-startup的值范围：1 ~ 10，数值越大，优先级越低。

## 07_Servlet映射方式

- 概述
  - 在web.xml中声明Servlet
  - 在web.xml中给Servlet映射访问路径

- ①一个Servlet可以有多个访问路径

- ②完全匹配：以"/"开头
  - 网址必须和url-pattern完全一致

- ③目录匹配：以"/"开头，以"*"结束
  - 网址必须和url-pattern目录匹配上即可

    >   /* 可以匹配项目中的所有资源,包括动态资源(jsp,servlet)
    >
    >  / 可以匹配项目中的所有资源,不包括动态资源

  静态资源:html,css,js,图片,音频...(页面代码写好后部署完后,不会发生变化)

  动态资源:servlet(可以写代码,操作数据库,里面的代码数据是变化的-->动态),jsp

  > jsp : java server page,可以在html里写java代码--没有前后端分离-一般不用

- ④扩展名匹配：以"*"开头，以"后缀名"结尾

  - 网址必须和url-pattern后缀名匹配上即可

## 08_缺省servlet

- 概念
  - 创建一个servlet时，如果它的url-pattern的配置值为”/”这时这个servlet就是一个缺省的servlet，tomcat服务器中默认就有缺省Servlet
- 作用
  - 凡是在web.xml文件总找不到匹配的`<servlet-mapping>`元素的URL，它们的请求都将交给缺省Servlet处理。也就是说，缺省的servlet用于处理其他Servlet处理不了的请求。
  - 当访问tomcat服务中的静态资源(html、图片等等)时，实际上是在访问这个缺省的servlet。

## 09_服务器资源的路径问题

- 需求1 : 在demo01.html访问girl.jpg
  - ![image.png](/images/javaweb/resource-path-case1.png)
- 需求2 : 在demo01.html访问girl.jpg
  - ![image.png](/images/javaweb/resource-path-case2.png)
- 需求3 : 在demo01.html访问girl.jpg
  - ![image.png](/images/javaweb/resource-path-case3.png)

## 10_ServletConfig对象

- 概述
  - ServletConfig是javax.servlet.包下的一个接口。ServletConfig它是Servlet的一个配置对象。
- 作用
  - 获取Servlet`名称` getServletName
  - 获取Servlet`初始化参数` getInitParameter getInitParameterNames
  - 获取ServletContext对象。应用域对象,作用范围整个项目

## 11_ServletContext对象

- 概述
  - ServletContext它是jakarta包下的一个接口。
  - 当服务器启动时，会为服务器中的每一个web应用程序创建一个ServletContext对象，一个ServletContext对象对应的就是一个web应用程序。(一个项目一个应用域)
  - 对于ServletContext,我们叫它上下文对象，`ServletConfig对象中维护了ServletContext对象`，也就是说，我们可以通过ServletConfig对象来获取ServletContext对象。
  - 在web应用中的servlet要想`实现资源的共享`，可以通过ServletContext来完成，ServletContext也叫做**域对象**。(应用域对象--整个应用)
- 作用
  - ①存储数据并实现全局共享(应用域)
  - ②获取文件的mimetype类型(请求:下载名称---传给服务器--拿到对应文件--写回给浏览器)
  - ③调度请求
  - ④获取全局初始化参数
  - ⑤获取真实磁盘路径(拿到部署路径)

## 12_Servlet3.0

- 概述
  - Servlet 3.0 作为 Java EE 6 规范体系中一员，随着 Java EE 6 规范一起发布。该版本在前一版本（Servlet 2.5）的基础上提供了若干新特性用于简化 Web 应用的开发和部署。
- 步骤
  - 自定义继承HttpServlet
  - 配置@WebServlet注解
- @WebServlet注解详解
  - String name() default "";
    设置Servlet的名称
  - String[] value() default {};
    设置Servlet的访问路径,等价于urlPatterns,不能同时使用
  - String[] urlPatterns() default {};
    设置Servlet的访问路径
