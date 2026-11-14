---
title: "Filter：过滤器与 FilterChain"
date: 2026-11-11
tags:
  - JavaWeb
  - Filter
archived: true
description: "Filter 的概念、生命周期、配置方式、执行顺序，以及统一编码、权限校验等典型应用。"
---

# Filter：过滤器与 FilterChain
## Filter概述

- 概念   :  在请求之前做一些预处理
  - 一个实现了特殊接口(Filter)的Java类. 实现对请求资源(jsp,servlet,html,)的过滤的功能. 过滤器是一个运行在服务器的程序, 优先于请求资源(Servlet或者jsp,html)之前执行. 过滤器是javaweb技术中**最为实用**的技术之一
  - 过滤器中包含了一个FilterConfig对象，可以获取过滤器的初始化参数

- 作用

    >  对资源预处理

  - Filter的作用是对目标资源(Servlet,jsp)进行过滤，其应用场景有: 登录权限检查,解决网站乱码等等

## Filter入门案例

- 开发步骤

  - 自定义类实现Filter接口
  - 重写init、doFilter、destroy方法
  - 在web.xml中配置过滤器

- 代码实现

  ```java
  public class Demo01Filter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        //Demo01Filter过滤器的初始化
        System.out.println("Demo01Filter初始化");
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        //Demo01Filter过滤器处理请求
        System.out.println("Demo01Filter放行之前");
        filterChain.doFilter(servletRequest,servletResponse);
        System.out.println("Demo01Filter放行之后");
    }

    @Override
    public void destroy() {
        //Demo01Filter过滤器的销毁
        System.out.println("Demo01Filter销毁");
    }
  }
  ```

  ```xml
  <!--声明Demo01Filter过滤器-->
  <filter>
    <filter-name>Demo01Filter</filter-name>
    <filter-class>com.qzw.filter.Demo01Filter</filter-class>
  </filter>

  <!--配置Demo01Filter的过滤路径-->
  <filter-mapping>
    <filter-name>Demo01Filter</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
  ```

- 注意事项

  - Filter只需要放行一次，如果放行多次，会导致Servlet执行多次。

## Filter执行流程

- 执行流程
  - 浏览器发起请求，服务器会创建request对象和response对象
  - request对象和response对象先交给Filter对象持有
  - 当Filter对象放行
  - request对象和response对象才会传递给Servlet的services方法

## Filter生命周期

- 出生：服务器启动
- 存活：执行过滤
- 死亡：服务器关闭

## Filter相关配置

- 初始化参数

  ```xml
    <filter>
        <filter-name>Demo03Filter</filter-name>
        <filter-class>com.qzw.filter.Demo03Filter</filter-class>
        <!--初始化参数-->
        <init-param>
            <param-name>username</param-name>
            <param-value>root</param-value>
        </init-param>
        <init-param>
            <param-name>password</param-name>
            <param-value>root123</param-value>
        </init-param>

    </filter>
  ```

  ```java
  public class Demo03Filter implements Filter {

    public void init(FilterConfig config) throws ServletException {
        Enumeration<String> parameterNames = config.getInitParameterNames();
        while (parameterNames.hasMoreElements()) {
            //获取初始化参数名称
            String parameterName = parameterNames.nextElement();
            //获取初始化参数值
            String parameterValue = config.getInitParameter(parameterName);
            System.out.println("name : " + parameterName + " , value : " + parameterValue);
        }
    }

    ......

  }
  ```

- 过滤路径

  ```xml
  //仅针对Demo01Servlet进行过滤

  <filter-mapping>
      <filter-name>Demo03Filter</filter-name>
      <servlet-name>Demo01Servlet</servlet-name>
  </filter-mapping>
  ```

  ```xml
  //完全匹配：必须以"/"开头
  //过滤器只过滤访问路径完全匹配"/aa"的资源

  <filter-mapping>
    <filter-name>Demo03Filter</filter-name>
    <url-pattern>/aa</url-pattern>
  </filter-mapping>
  ```

  ```xml
  //目录匹配:必须以"/"开头，以"*"结尾
  //过滤器只过滤访问路径目录匹配到“/aa/bb“的资源

  <filter-mapping>
    <filter-name>Demo03Filter</filter-name>
    <url-pattern>/aa/bb/*</url-pattern>
  </filter-mapping>
  ```

  ```xml
  //后缀名匹配:必须以"*"开头，以后缀名结尾
  //过滤器只过滤后缀名为jsp的资源

  <filter-mapping>
    <filter-name>Demo03Filter</filter-name>
    <url-pattern>*.jsp</url-pattern>
  </filter-mapping>
  ```

## 过滤器链

- 概述

  - ![image](/images/javaweb/filter-chain.png)
  - 一个请求可能被多个过滤器所过滤，只有当所有过滤器都放行，请求才能到达目标资源，如果有某一个过滤器没有放行，那么请求则无法到达后续过滤器以及目标资源，多个过滤器组成的链路就是过滤器链

- 执行顺序

  - 先配置，先过滤，后放行。

- 代码实现
  public class Demo01Filter implements Filter {
  @Override
  public void destroy() {

  ```text
      }

      @Override
      public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
          //这句代码表示放行
          chain.doFilter(req, resp);
      }

      @Override
      public void init(FilterConfig config) throws ServletException {

      }

  }

  public class Demo02Filter implements Filter {

      @Override
      public void destroy() {

      }

      @Override
      public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
          //这句代码表示放行
          chain.doFilter(req, resp);
      }

      @Override
      public void init(FilterConfig config) throws ServletException {

      }

  }
  ```

  ```xml
  <filter>
      <filter-name>Demo01Filter</filter-name>
      <filter-class>com.qzw.filter.Demo01Filter</filter-class>
  </filter>
  <filter-mapping>
      <filter-name>Demo01Filter</filter-name>
      <url-pattern>/demo01</url-pattern>
  </filter-mapping>

  <filter>
      <filter-name>Demo02Filter</filter-name>
      <filter-class>com.qzw.filter.Demo02Filter</filter-class>
  </filter>
  <filter-mapping>
      <filter-name>Demo02Filter</filter-name>
      <url-pattern>/demo02</url-pattern>
  </filter-mapping>
  ```

## Filter拦截行为

- 概述

  - Filter过滤器默认拦截的是请求，但是在实际开发中，我们还有请求转发和请求包含，以及由服务器触发调用的全局错误页面。默认情况下过滤器是不参与过滤的，要想使用，就需要我们配置。

- 拦截行为

  | 拦截行为 | 说明                                                      |
  | -------- | --------------------------------------------------------- |
  | REQUEST  | 过滤请求:默认值。                                         |
  | ERROR    | 过滤全局错误页面:当由服务器调用全局错误页面时，过滤器工作 |
  | FORWAD   | 过滤请求转发:当请求转发时，过滤器工作。                   |
  | INCLUDE  | 过滤请求包含:当请求包含时，过滤器工作。                   |
  | ASYNC    | 过滤异步类型，它要求我们在fiter标签中配置开启异步支持     |

- 代码实现

  ```text
  <filter>
      <filter-name>Demo01Filter</filter-name>
      <filter-class>com.qzw.filter.Demo01Filter</filter-class>
      <!--开启异步支持，配合dispatcher=async使用-->
      <async-supported>true</async-supported>
  </filter>

  <filter-mapping>
      <filter-name>Demo01Filter</filter-name>
      <url-pattern>/*</url-pattern>
      <dispatcher>REQUEST</dispatcher>
      <dispatcher>FORWARD</dispatcher>
      <dispatcher>ERROR</dispatcher>
      <dispatcher>INCLUDE</dispatcher>
      <!--必须在filter标签中开启异步支持-->
      <dispatcher>ASYNC</dispatcher>
  </filter-mapping>
  ```

- 注意事项

  - include会将下一个资源中的内容包含到当前资源中，而forward不会。

## Filter注解开发

- 源码
  @Target(ElementType.TYPE)
  @Retention(RetentionPolicy.RUNTIME)
  @Documented
  public @interface WebFilter {

  ```text
      /**
       * @return array of initialization params for this Filter
       */
      WebInitParam[] initParams() default {};

      /**
       * @return name of the Filter, if present
       */
      String filterName() default "";

      /**
       * @return array of Servlet names to which this Filter applies
       */
      String[] servletNames() default {};

      /**
       * A convenience method, to allow extremely simple annotation of a class.
       *
       * @return array of URL patterns
       * @see #urlPatterns()
       */
      String[] value() default {};

      /**
       * @return array of URL patterns to which this Filter applies
       */
      String[] urlPatterns() default {};

  }
  ```

- 代码实现

  ```java
  @WebFilter(filterName = "Demo04Filter" ,
          urlPatterns = "/demo01",
          servletNames = "Demo01Servlet" ,
          initParams = {
                  @WebInitParam(name = "username",value = "root"),
                  @WebInitParam(name = "password",value = "root123")
          })
  public class Demo04Filter implements Filter {

      public void init(FilterConfig config) throws ServletException {
          Enumeration<String> parameterNames = config.getInitParameterNames();
          while (parameterNames.hasMoreElements()) {
              String parameterName = parameterNames.nextElement();
              String parameterValue = config.getInitParameter(parameterName);
              System.out.println(parameterName + " , " + parameterValue);
          }
      }

      ......

  }
  ```

- 注意事项

  - 按照过滤器的类名的字典顺序决定谁先过滤，谁先放行!
  - 比如AFilter、BFilter，那么AFilter就会先过滤，BFilter会先放行!

  ### 08-Filter登录状态校验

  > 代码实现

  ```java
  @WebFilter("/*")
  public class FilterLogin implements Filter {
      @Override
      public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
          //登录状态校验
          HttpServletRequest req = (HttpServletRequest) servletRequest;
          HttpServletResponse resp = (HttpServletResponse) servletResponse;
          Object existUser = req.getSession().getAttribute("existUser");
          //当访问login.html和ServletLogin，直接放行。
          String requestURI = req.getRequestURI();
          System.out.println("requestURI = " + requestURI);
          if (existUser != null || requestURI.contains("login")) {
              //已经登录了，直接放行
              filterChain.doFilter(req,resp);
          } else {
              //没有登录，跳转到login.html
              resp.sendRedirect(req.getContextPath() + "/login.html");
          }
      }
  }
  ```

  > 注意事项
  > FilterLogin放行login.html、ServletLogin两个资源，否则无限访问login.html。
