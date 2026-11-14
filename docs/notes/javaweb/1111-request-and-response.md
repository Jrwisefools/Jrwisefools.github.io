---
title: "Request 与 Response"
date: 2026-11-11
tags:
  - JavaWeb
  - Servlet
archived: true
description: "HttpServletRequest 获取请求参数与请求头、请求转发与域对象；HttpServletResponse 响应数据、重定向与乱码处理。"
---

# Request 与 Response
## 本章内容

- request
- response

## 请求对象概述

- 概述
  - 请求，顾名思义，就是使用者希望从服务器端索取一些资源，向服务器发出询问。在B/S架构中，就是客户浏览器向服务器发出询问。在我们的JavaEE工程中，客户浏览器发出询问，要遵循HTTP协议所规定的。
  - 请求对象，就是在JavaEE工程中，用于发送请求的对象。我们常用的对象就是ServletRequest和HttpServletRequest，它们的区别就是是否和HTTP协议有关。
- 继承体系
  - ![image](/images/javaweb/request-inheritance.png)

## 请求对象获取请求行

- 概述

  - 获取请求方式、请求路径等等

- 方法说明

  | 方法           | 说明                 |
  | -------------- | -------------------- |
  | getMethod      | 获取请求方式         |
  | getContextPath | 获取项目访问路径     |
  | getServletPath | 获取Servlet访问路径  |
  | getRemoteAddr  | 获取客户端ip地址     |
  | getLocalAddr   | 获取服务器ip地址     |
  | getRequestURI  | 获取请求路径         |
  | getRequestURL  | 获取带协议的请求路径 |
  | getQueryString | 获取查询字符串       |

- url

  - `uniform Resource Locater`的简写，中文翻译为`统一资源定位符`，它是某个互联网资源的唯一访问地址，客户端可以通过url访问到具体的互联网资源

    http://ip:端口号/web应用/资源名称

- uri

  - `Uniform Resource identifier`的缩写，中文翻译为`统一资源标识符`, 它是服务器中某个资源的唯一标识，通过uri可以实现同一项目中的某个资源中访问另一个资源

    /web应用/资源名称

## 请求对象获取请求头

- 方法说明

  | 方法           | 说明                                |
  | -------------- | ----------------------------------- |
  | getHeader      | 根据名称获取头的值 一个消息头一个值 |
  | getHeaders     | 根据名称获取头的值 一个头多个值     |
  | getHeaderNames | 获取请求消息头的名称的枚举          |

## 请求对象获取请求参数

- 方法说明

  | 方法               | 说明                               |
  | ------------------ | ---------------------------------- |
  | getParameter       | 根据参数名称获取值 一个参数一个值  |
  | getParameterValues | 根据参数名称获取值 一个参数多个值  |
  | getParameterNames  | 获取参数名称的枚举                 |
  | getParameterMap    | 获取参数名称和一组参数值 封装到map |

## 请求参数中文乱码问题

- GET请求乱码分析
  - GET方式提交参数的方式是将参数放到URL后面,如果使用的不是UTF-8,那么会对参数进行URL编码处理
  - HTML中的 `<meta charset='字符集'/>` 影响了GET方式提交参数的URL编码
  - tomcat10.1.7的URI编码默认为 UTF-8
  - 当GET方式提交的参数URL编码和tomcat10.1.7默认的URI编码不一致时,就会出现乱码
- 方式1 : 设置GET方式提交的编码和Tomcat10.1.7的URI默认解析编码一致

  > **补充整理**：原文此处配一张 IDE 设置截图（有道云笔记资源已失效，图存不下来了）。
  > 做法是把页面/提交端使用的字符集（如 HTML 的 `<meta charset>` 或表单页编码）
  > 设置成与 Tomcat 默认 URI 解析编码 UTF-8 一致，GET 参数就不用转来转去。

- 方式2 : 设置Tomcat10.1.7的URI解析字符集和GET请求发送时所使用URL转码时的字符集一致即可

  > **补充整理**：原文此处配两张配置截图（有道云笔记资源已失效）。思路是反过来改
  > Tomcat 侧：在 `server.xml` 的 Connector 上加 `URIEncoding="页面所用字符集"`
  > （老版本 Tomcat 常见写法），让 URI 解析编码迁就提交端。两边字符集对上，乱码即消失。

- POST请求乱码分析
  - POST请求将参数放在请求体中进行发送
  - 请求体使用的字符集受`<meta charset="字符集"/>` 的影响
  - Tomcat10.1.7 默认使用UTF-8字符集对请求体进行解析
  - 如果请求体的URL转码和Tomcat的请求体解析编码不一致,就容易出现乱码
- 方式1 : 请求时,使用UTF-8字符集提交请求体 (推荐)

  > **补充整理**：原文此处配图已失效。即保证页面以 UTF-8 提交（`<meta charset="UTF-8">`），
  > 与 Tomcat 默认的请求体解析编码一致，后端无需任何额外处理。

- 方式2 : 后端在获取参数前,设置解析请求体使用的字符集和请求发送时使用的字符集一致 (不推荐)

  > **补充整理**：原文此处配图已失效。做法是在读取参数前先调用
  > `request.setCharacterEncoding("页面字符集")`，只对请求体（POST）有效；
  > 不推荐是因为它把编码约定散落在每个 Servlet 里，漏写一处就乱码。

## 请求转发

- 概述
  - 跳转资源，服务器内部资源跳转

## request作为域对象

- 概述
  - ServletRequest也是域对象，**可以用来存储数据并共享**。
- 出生：浏览器发起请求
- 存活：请求执行中
- 死亡：请求结束

## 响应对象概述

- 概述
  - 响应，它表示了服务器端收到请求，同时也已经处理完成，把处理的结果告知用户。简单来说，指的就是服务器把请求的处理结果告知客户端。在B/S架构中，响应就是把结果带回浏览器。
  - 响应对象，顾名思义就是用于在JavaWeb工程中实现上述功能的对象。
- 继承体系
  - ![image](/images/javaweb/response-inheritance.png)

## 响应对象之输出内容

- 方法说明

  | 方法                                                 | 说明                                                         |
  | ---------------------------------------------------- | ------------------------------------------------------------ |
  | setCharacterEncoding("utf-8")                        | 告诉服务器，应该以utf-8编码响应正文                          |
  | setHeader("Content-Type","text/html;charset=utf-8"): | 告诉浏览器，应该以utf-8解码响应正文                          |
  | setContentType("text/html;charset=utf-8")            | 告诉服务器，应该以utf-8编码响应正文；告诉浏览器，应该以utf-8解码响应正文 |

- 代码实现

## 重定向

- 概述

  - 资源跳转，服务器外部资源跳转

- 开发步骤

  - ①设置响应状态码302
  - ②设置响应头Location

- 代码实现

  ```java
  public class ResponseDemo6 extends HttpServlet {

      public void doGet(HttpServletRequest request, HttpServletResponse response)
              throws ServletException, IOException {
          //1.设置响应状态码
  //		response.setStatus(302);
          //2.设置响应头Location
  //		response.setHeader("Location", "ResponseDemo7");

          //使用重定向方法
          response.sendRedirect("ResponseDemo7");//此行做了什么事，请看上面
      }

      public void doPost(HttpServletRequest request, HttpServletResponse response)
              throws ServletException, IOException {
          doGet(request, response);
      }

  }
  ```

## 资源跳转的路径问题

- 资源跳转
  - 请求转发、重定向
- 路径问题
  - 请求转发
    - 相对路径(ok)
    - 绝对路径
      - 直接在项目中找资源，比如：/资源名称
  - 重定向
    - 相对路径(ok)
    - 绝对路径(ok)
      - 先找项目再找资源，比如：/项目名称/资源名称

## 转发和重定向的区别

- 转发 vs 重定向

  | 转发                                   | 重定向                                   |
  | -------------------------------------- | ---------------------------------------- |
  | 一次请求                               | 两次请求                                 |
  | 网址不会发生变化                       | 网址会发生变化                           |
  | 可以使用ServletRequest域对象做资源共享 | 不可以使用ServletRequest域对象做资源共享 |
  | 项目内部资源跳转                       | 项目外部资源跳转                         |
  | 绝对路径=`/资源访问路径`               | 绝对路径=`/项目访问路径/资源访问路径`    |
  | 可以访问`WEB-INF`目录中的资源          | 不可以访问`WEB-INF`目录中的资源          |

## Servlet的线程安全

- 存在问题

  ```java
  @WebServlet("/demo20")
  public class TestServlet extends HttpServlet {

      private String  username = null;

      protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          username = request.getParameter("name");
          try {
              Thread.sleep(3000);
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
          System.out.println("name : " + username);
      }

      protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          doPost(request, response);
      }
  }
  ```

- 代码实现

  ```java
  @WebServlet("/demo20")
  public class Demo20Servlet extends HttpServlet {

  //    private String username;

      protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          String username = request.getParameter("username");

          try {
              Thread.sleep(3000);
          } catch (InterruptedException e) {
              e.printStackTrace();
          }
          response.setContentType("text/html;charset=utf-8");
          response.getWriter().write("姓名 : " + username);

      }

      protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          doPost(request, response);
      }
  }
  ```

  ```java
  @WebServlet("/demo19")
  public class Demo19Servlet extends HttpServlet {

      private String username ;

      protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          synchronized (this) {
              username = request.getParameter("username");

              try {
                  Thread.sleep(3000);
              } catch (InterruptedException e) {
                  e.printStackTrace();
              }
              response.setContentType("text/html;charset=utf-8");
              response.getWriter().write("姓名 : " + username);
          }

      }

      protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
          doPost(request, response);
      }
  }
  ```

- 注意事项

  - 首先，必须是成员变量；其次，该成员白能量要被多个线程修改。才会存在线程安全问题。
