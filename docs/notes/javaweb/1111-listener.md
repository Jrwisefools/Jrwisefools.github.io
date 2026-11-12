---
title: "Listener：监听器"
date: 2026-11-11
tags:
  - JavaWeb
  - Listener
archived: true
description: "Servlet 中的监听器分类、域对象生命周期监听与属性变更监听，以及常见使用场景。"
---

# Listener：监听器
## 一类监听器概述

- 概述
  - 监听域对象的创建和销毁
- 分类
  - ServletRequestListener
    - 监听ServletRequest域对象的创建、销毁
  - HttpSessionListener
    - 监听HttpSession域对象的创建、销毁
  - ServletContextListener
    - 监听ServletContext域对象的创建、销毁

## 一类监听器之ServletContextListener

- 概述

  - 监听ServletContext域对象的创建、销毁

- 开发步骤

  - 自定义类实现ServletContextListener接口
  - 重写监听器中的方法
  - 配置web.xml

- 代码实现 `<listener>` `<listener-class>`com.qzw.listener.MyServletContextListener`</listener-class>` `</listener>`

  ```java
  public class MyServletContextListener implements ServletContextListener {

      @Override
      public void contextInitialized(ServletContextEvent sce) {
          System.out.println("ServletContext初始化...服务器启动");

      }

      @Override
      public void contextDestroyed(ServletContextEvent sce) {
          System.out.println("ServletContext销毁...服务器关闭");
      }
  }
  ```

## 二类监听器

- 概述
  - 监听域对象中属性变更(添加、移除、替换)
- 二类监听器
  - ServletRequestAttributeListener
    - 监听ServletRequest域对象中属性变更
  - HttpSessionAttributeListener
    - 监听HttpSession域对象中属性变更
  - ServletContextAttributeListener
    - 监听ServletContext域对象中属性变更

## 二类监听器之ServletRequestAttributeListener

- 概述

  - 监听ServletRequest域对象中属性变更

- 开发步骤

  - 自定义类实现ServletRequestAttributeListener接口
  - 重写监听器中的方法
  - 配置web.xml

- 代码实现 `<listener>` `<listener-class>`com.qzw.listener2.MyServletRequestAttributeListener`</listener-class>` `</listener>`

  ```java
  public class MyServletRequestAttributeListener implements ServletRequestAttributeListener {

      @Override
      public void attributeAdded(ServletRequestAttributeEvent srae) {
          System.out.println("ServletRequest添加属性");

      }

      @Override
      public void attributeRemoved(ServletRequestAttributeEvent srae) {
          System.out.println("ServletRequest移除属性");
      }

      @Override
      public void attributeReplaced(ServletRequestAttributeEvent srae) {
          System.out.println("ServletRequest替换属性");
      }
  }

  ```

  ```java
  @WebServlet("/demo09")
  public class Demo09Servlet extends HttpServlet {

      @Override
      protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          //ServletRequest添加属性
          req.setAttribute("msg","hello1");
          //ServletRequest替换属性
          req.setAttribute("msg","hello2");
          //ServletRequest移除属性
          req.removeAttribute("msg");
      }

      @Override
      protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          doGet(req, resp);
      }
  }
  ```

## 三类监听器

- 概述
  - 监听session域中javaBean对象的状态变化的监听器
    - 绑定、解绑
    - 钝化、活化
- 分类
  - HttpSessionBindingListener
    - 监听session域中javaBean对象的绑定、解绑
  - HttpSessionActivationListener
    - 监听session域中javaBean对象的钝化、活化

## 三类监听器之HttpSessionBindingListener

- 概述

  - 监听session域中javaBean对象的绑定、解绑
    - 绑定 : 存储javaBean对象到session域
    - 解绑 : 从session域移除javaBean对象

- 代码实现

  ```java
  public class User implements HttpSessionBindingListener {

      private Integer id;
      private String username;

      @Override
      public void valueBound(HttpSessionBindingEvent event) {
          System.out.println("User对象绑定");
      }

      @Override
      public void valueUnbound(HttpSessionBindingEvent event) {
          System.out.println("User对象解绑");
      }

  }
  ```

```java
@WebServlet("/demo12")
      public class Demo12Servlet extends HttpServlet {

          @Override
          protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
              //User对象绑定
              req.getSession().setAttribute("user",new User(1,"oldqiu"));
              //User对象解绑
              req.getSession().removeAttribute("user");
          }

          @Override
          protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
              doGet(req, resp);
          }
      }
```

- 注意事项
  - HttpSessionBindingListener监听器不需要在web.xml配置

## 监听器注解开发

- 概述

  - @WebListener : 相当于在web.xml绑定了监听器

- 代码实现

  ```java
  @WebListener
  public class MyServletContextLIstener implements ServletContextListener {

        @Override
        public void contextInitialized(ServletContextEvent sce) {
            System.out.println("ServletContext创建");
        }

        @Override
        public void contextDestroyed(ServletContextEvent sce) {
            System.out.println("ServletContext销毁");
        }
      }
  ```

