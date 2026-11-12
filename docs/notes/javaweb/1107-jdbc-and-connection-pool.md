---
title: "JDBC：连接数据库、预编译与连接池"
date: 2026-11-07
tags:
  - JavaWeb
  - JDBC
archived: true
description: "JDBC 规范与驱动、DriverManager / Connection / Statement / ResultSet 核心 API、SQL 注入与 PreparedStatement、Druid 连接池与事务管理。"
---

# JDBC：连接数据库、预编译与连接池
# Day 06

## JDBC概述

- 数据库连接,用于执行SQL语句,是由一组使用Java语言编写的类或者接口组成

- 作用: 使用Java语言连接到数据库

- 什么是驱动

  ​	     厂商提供的接口就是驱动,这些驱动都实现jdbc规范

  ​		 数据库驱动Driver---提供了规范(链接数据库,增加/删除.修改/查询数据库,事务管理方法)

  ​		 (SUN公司)提供了JDBC规范,厂家去实现.
### 开发步骤

​		① 搭建环境，导入驱动jar包

​		② 加载驱动

​		③ 获取数据库连接

​		④ 获取执行sql对象

​		⑤ 编写sql,执行sql

​		⑥ 释放资源

## JDBC API

### DriverManager类

​    注册驱动 : DriverManager.registerDriver(new Driver());===>但是Driver 类中已经注册过一次,这样写相当于注册两次

​		优化---> Class.forName()--->加载类 Class.forName("com.mysql.cj.jdbc.Driver")

>  url: "jdbc:mysql://localhost:3306/crm(库名)"---等价于---"jdbc:mysql:///crm"(本地主机可以省略)

### Connection 接口

它是由DriverManager创建的

(1) 创建执行sql对象

> connection.createStatement();
>
>  	- 创建普通sql执行对象

(2) 事务管理

> PreparedStatement prepareStatement(String sql):
>
> * 创建预编译sql执行对象

### Statement 接口

获取执行sql对象----概述: 由Connection创建的

**ResultSet**`(返回的是ResultSet结果集)` executeQuery(String sql) **主要执行DQL(查询),会返回一个结果集**

**int** executeUpdate(String sql) **主要用于执行DML(增加/删除/修改)**

- 这里excute的int返回值:受影响的行数

  - insert :成功插入几行就是返回几

  - update: 符合where条件,并且真的被修改的行数

    ⚠️ 注意：如果 where 匹配到了行，但是新值和原来的值一样，部分数据库驱动会返回 0

  - delete:被删除了几行,返回几

- 特殊情况

  - DDL语句(建表,删表,alter)也可以用executeUpdate，此时返回值一般是 **0**，这个 0 没有行数含义，只是规范
  - 返回0不一定代表失败

### ResultSet 接口

代表的是select查询后的结果

底层维护了一个游标,指向第一条数据的前一行,问有没有下一个元素`(resultSet.next())`,

如果有就可以把下一个元素获取->`Integer userId = resultSet.getInt(1)` **//这里传入的是位置,拿到当前行数的第几个位置** ===`Integer userId = resultSet.getInt("userId")` **//这里传入的是字段名,拿到当前行的哪个字段名对应的值**

### 资源的释放

- 因为查询需要用到ResultSet,所以查询的时候要多释放一个ResultSet ,`result.close()`

注意 : 为什么要释放连接: mysql连接数量有限,如果不释放连接变多了就会卡死,

> 如果连接释放之前产生了异常,后面就不会释放,所以释放异常的代码需要放在finally中**(一定会执行)**,不能throw抛出异常

  前面的collection,statement,resultset可能为空,所以要判断是否为空,close也会产生异常,所以也要try

  ### JDBC增删改查

### JDBCUtils工具类使用properties配置文件
>概述
>  *   driverClass、jdbcUrl、username、password四个常量应该存储到配置文件中。
>开发步骤
>①定义jdbc.properties配置文件
>②改造JDBCUtils工具类
>加载jdbc.properties文件
>①定义jdbc.properties配置文件
```properties
driverClass=com.mysql.jdbc.Driver
jdbcUrl=jdbc:mysql://localhost:3306/day28
username=root
password=root
```

### SQL 注入漏洞

用户在输入的时候可能会输入一些特殊符号,比如一些注释,sql语句会识别到注释,导致输入错误也能查询到,或者修改到

所以必须解决

原因:sql语句是直接字符串拼接的

此时不能用普通的statement

应该用预编译:`PreparedStatement prepareStatement(String sql):`----->创建预编译sql执行对象

### 连接池概述

原来:创建连接之后销毁连接

现在:创建连接之后不销毁,只归还,创建,销毁次数减小

### 开源连接池之Druid

是阿里巴巴开源平台上一个数据库连接池实现

(1) 创建druid连接池对象

(2) 配置druid(纯java代码方式,`正常应该用配置文件.properties`)

```java
//dataSource.setDriver(new Driver());
dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
dataSource.setUrl("jdbc:mysql://localhost:3306/ai");
dataSource.setUsername("root");
dataSource.setPassword("123456");
如果用properties配置的时候一定要和set方法一致(通过工厂)
```

​	   druid.properties方式,

​		properties 的键名，要和 set 方法`去掉 set、首字母小写之后的名称一模一样`。

```java
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost:3306/ai
username=root
password=123456
```

> driverClassName = com.mysql.cj.jdbc.Driver
>
> 因为没有手动把参数设置给连接池(说明自动设置,会获取到参数名,根据参数名得到对应的set方法)---底层用的是反射

(3)获取连接

(4)释放资源(三个)

> 改地方的.close并不是在销毁连接而是在归还

### 工具类Utils 结合Druid

```java
public class JDBCUtils {

  private static  DataSource dataSource = null;

  static {
      Properties properties = new Properties();
      try {
   		  properties.load(JDBCUtils.class.getClassLoader().getResourceAsStream("druid.properties"));
          dataSource = DruidDataSourceFactory.createDataSource(properties);
      } catch (Exception e) {
          e.printStackTrace();
      }
  }
  public static Connection getConnection() throws SQLException {
      return dataSource.getConnection();
  }
  public static void release(Connection connection, Statement statement , ResultSet resultSet){
      if (null != connection) {
          try {
              connection.close();
          } catch (SQLException throwables) {
              throwables.printStackTrace();
          }
          connection = null;
      }
      if (null != statement) {
          try {
              statement.close();
          } catch (SQLException throwables) {
              throwables.printStackTrace();
          }
          statement = null;
      }
      if (null != resultSet) {
          try {
              resultSet.close();
          } catch (SQLException throwables) {
              throwables.printStackTrace();
          }
          resultSet = null;
      }
  }
  public static void release(Connection connection,Statement statement){
      release(connection,statement,null);
  }
}
```

### JDBC 事务管理

从始至终只有一个连接(出账,入账)

一个业务,一个连接对应一个事务

如果没有事务管理---中途出错了不会返回初始值

所以当开始的时候开启事务

当成功的时候提交事务

失败的时候回滚事务

