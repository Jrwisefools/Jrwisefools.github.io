---
title: "Tomcat 与 Web 项目部署"
date: 2026-11-09
tags:
  - JavaWeb
  - Tomcat
archived: true
description: "常见 Web 服务器对比、Tomcat 安装与目录结构、三种部署方式，以及 IDEA 部署项目时 Tomcat 副本与部署路径的原理。"
---

# Tomcat 与 Web 项目部署
## 本章内容

- tomcat下载和安装
- 服务器部署web项目

## 常见web服务器

- 概述
  - 与客户端进行交互，接收客户端的数据、处理具体的业务逻辑、传递给客户端其需要的数据
- 分类
  - **Tomcat（Apache）**：当前应用最广的JavaWeb服务器
  - Jetty:更轻量级、更灵活的servlet容器
  - JBoss（Redhat红帽）：支持JavaEE，应用比较广EJB容器 –> SSH轻量级的框架代替
  - GlassFish（Oracle）：Oracle开发JavaWeb服务器，应用不是很广
  - Resin（Caucho）：支持JavaEE，应用越来越广
  - Weblogic（Oracle）：要钱的！支持JavaEE，适合大型项目
  - Websphere（IBM）：要钱的！支持JavaEE，适合大型项目

## tomcat的下载和安装

- 概述
  - tomcat时apache软件基金会的Jakarta项目组的一个核心项目，由apache、sun和其他一些公司及个人共同开发而成。由于有了sun公司的参与和支持，最新的servlet、jsp规范总是能在tomcat中得到体现。因为tomcat技术先进、性能稳定，而且免费，所以深受java爱好者的喜爱并得到了部分软件开发商的认可，成为目前比较流行的web应用服务器。
- 下载地址
  - https://tomcat.apache.org/download-80.cgi
- 基本使用
  - 启动
  - 关闭
- 相关配置
  - JAVA_HOME配置
  - 端口号配置 ： tomcat/conf/server.xml
  - 启动控制台乱码 : tomcat\conf\logging.properties
    - java.util.logging.ConsoleHandler.encoding = GBK

## tomcat目录结构

- 目录结构

  | 目录/文件 | 说明                                               |
  | --------- | -------------------------------------------------- |
  | bin       | 存放tomcat执行文件,比如：startup.bat、shutdown.bat |
  | conf      | 存放tomcat配置文件                                 |
  | lib       | 存放tomcat核心jar包                                |
  | logs      | 存放tomcat日志文件                                 |
  | temp      | 存放tomcat临时文件                                 |
  | webapps   | 用于部署web项目                                    |
  | work      | 存放jsp转译之后的java文件                          |

## Web项目

- 概述
  - `JavaWeb`应用是一个全新的应用种类。这类应用程序指供浏览器访问的程序，通常也简称为web应用。
  - 一个web应用由多个静态web资源和动态web资源组成，例如：html、css、js文件，jsp文件、java程序、支持jar包、工程配置文件、图片、音视频等等。
  - Web应用开发好后，若想供外界访问，需要把web应用所在目录部署到Web服务器管理（Tomcat就是Web服务器之一），这个过程称之为虚拟目录的映射。
- 项目结构
  - 1.html
  - css/css.css
  - js/demo.js
  - WEB-INF--------如果有web.xml或者.class文件时，该目录必须存在，且严格区分大小写。客户端是无法直接访问的
    - classes目录----------------web应用的class文件
    - lib目录--------------------web应用所需的jar包（tomcat的lib目录下jar为所有应用共享）
    - web.xml--------------------web应用的主配置文件
- 项目设置
  - `<welcome-file-list>`设置

## tomcat部署web项目

- 方式一：直接将web应用程序放置到webapps目录

  - 直接将一个web应用程序放置在tomcat/webapps目录下。这时web应用程序目录名称就是我们访问tomcat下的这个应用程序的名称

- 方式二：虚拟目录初级版

  - 将一个不在tomcat下的web应用程序部署加载。可以在tomcat/conf/server.xml文件中配置，在server.xml文件中的`<Host>`标签中添加一段配置

    `<Context docBase="磁盘路径" path="/hello" />`

  - 经过以上配置后,在浏览器上可以输入http://localhost/hello来访问。

- 方式三:虚拟目录优化版

  - 在tomcat/conf/Catalina/localhost下创建任意名称的一个xml文件，例如创建一个good.xml文件，在good.xml中书写

    `<Context docBase="磁盘路径" />`

  - 这种方案配置，xml文件的名称就是访问路径，在浏览器中访问http://localhost/good就可以。

## IDEA 部署 Web 项目

- 开发步骤
  - ①idea创建JavaWeb项目
  - ②项目配置tomcat插件
  - ③部署项目
  - ④启动服务器并测试

## IDEA 部署 Web 项目的原理

![IDEA 部署项目与 Tomcat 副本的关系](/images/javaweb/idea-deploy-principle.png)

> **补充整理**：图里三个方框对应三件事——**本地 Tomcat** 是装好的原始目录；
> IDEA 会为每个项目复制一份 **Tomcat 副本**（在副本的 `conf/Catalina/localhost/*.xml` 里写入
> `<Context path="/day08" docBase="…">`），让项目之间互相隔离；右下的 **项目路径** 是源码所在位置。
> 编译产物被放进 `docBase` 指向的部署目录，浏览器通过 `path` 指定的上下文路径才能访问。
> 所以「改了代码没生效」通常要检查的，就是这份副本里的 `docBase` 是否还指向旧的编译输出。

- ①为什么使用 Tomcat 副本？
  - 副本起隔离作用：某个项目出问题不会让整个 Tomcat 崩溃、进而影响别的项目；一个项目一份副本。
- ②项目本地路径和项目部署路径的关系？
  - 项目本地路径：开发人员写代码、存放 HTML 等资源的位置。
  - 项目部署路径：项目编译后资源的存放位置；只有落到这个路径，资源才算真正部署成功。

## Web 资源会部署到哪儿

- ①web目录中资源会部署到哪儿？
  - 部署到"\day09_web_war_exploded"
- ②src目录中资源会部署到哪儿？
  - 部署到"\day09_web_war_exploded\WEB-INF\classes"
- ③项目目录中资源会部署到哪儿？
  - 不会部署!!!
- ④WEB-INF目录中资源会部署到哪儿？
  - 部署到"/day09_web_war_exploded/WEB-INF"
  - WEB-INF 目录中的资源不能被外部直接访问，它们是受保护的资源，只能被内部访问(转发)。
