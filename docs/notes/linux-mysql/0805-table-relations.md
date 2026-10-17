---
title: "多表关系设计"
date: 2025-08-05
tags:
  - MySQL
  - 数据库
archived: true
description: "概述 表A中的一条记录可以确定表B中的多条记录；表B中的一条记录可以确定表A中的一条记录。 比如 : 部门和员工、用户和订单 开发步骤 ①设计tb_dept和tb_employee的一对多关系 在多的…"
---
### 01-多表设计之一对多
*   概述
    *   表A中的一条记录可以确定表B中的多条记录；表B中的一条记录可以确定表A中的一条记录。
    *   比如 : 部门和员工、用户和订单
*   开发步骤
    *   ①设计tb_dept和tb_employee的一对多关系
        *   在多的一方添加一个字段(dno)等同于一的一方的主键
    *   ②添加外键约束，保证数据的完整性、有效性、正确性
        *   将dno作为外键约束，指向一的一方的主键
*   ①设计tb_dept和tb_employee的一对多关系
    ```
    -- 创建部门表tb_dept
    CREATE TABLE tb_dept(
    	did INT PRIMARY KEY AUTO_INCREMENT,
    	dname VARCHAR(100)
    );
    
    INSERT INTO tb_dept(dname) VALUES('研发部'),('行政部'),('总裁办');
    
    -- 创建员工表tb_employee
    CREATE TABLE tb_employee(
    	eid INT PRIMARY KEY AUTO_INCREMENT,
    	ename VARCHAR(100),
    	dno INT
    );

    INSERT INTO tb_employee(ename,dno) VALUES('小邱',1),('中邱',1),('老邱',3);
    ```
    *   问题1 : 小伙子入职搞笑部，能够入职成功吗?
    *   问题2 : 裁撤研发部，请问研发部的员工怎么办？
*   ②添加外键约束，保证数据的完整性、有效性、正确性
    ```
    ALTER TABLE tb_employee ADD FOREIGN KEY(dno) REFERENCES tb_dept(did);
    ```

### 02-多表设计之多对多
*   概述
    *   表A中的一条记录可以确定表B中的多条记录；表B中的一条记录可以确定表A中的多条记录。
    *   比如：课程和学生、老师和学生
*   开发步骤
    *   ①设计tb_student和tb_course的多对多关系
        *   建立一张中间表tb_student_course (两个字段分别等同于另外两张表的主键)
    *   ②添加外键约束，保证数据的完整性、有效性、正确性
        *   中间表和另外两张表的关系是一对多表关系
*   ①设计tb_student和tb_course的多对多关系
    ```
    -- 创建学生表
    CREATE TABLE tb_student(
    	sid INT PRIMARY KEY AUTO_INCREMENT,
    	sname VARCHAR(30)
    );
    
    INSERT INTO tb_student(sname) VALUES('马林杰'),('雷帅'),('邓腾军'),('苗苗');
    
    
    -- 创建课程表
    
    CREATE TABLE tb_course(
    	cid INT PRIMARY KEY AUTO_INCREMENT,
    	cname VARCHAR(30)
    );`tb_student_course`
    
    INSERT INTO tb_course(cname) VALUES('javase'),('javame'),('javaee');
    
    -- 体现tb_student和tb_course的多对多关系
    CREATE TABLE tb_student_course(
    	sno INT,
    	cno INT
    );
    ```
*   ②添加外键约束，保证数据的完整性、有效性、正确性
    ```
    -- tb_student(一的一方)和tb_student_course(多的一方)的一对多
    ALTER TABLE tb_student_course ADD FOREIGN KEY(sno) REFERENCES tb_student(sid);
    
    -- tb_course(一的一方)和tb_student_course(多的一方)的一对多
    ALTER TABLE tb_student_course ADD FOREIGN KEY(cno) REFERENCES tb_course(cid);
    ```

### 03-多表设计之一对一
*   概述
    *   表A中的一条记录可以确认表B中的一条记录；表B中的一条记录可以确认表A中的一条记录。
    *   比如：公司和注册地址
*   设计原则
    *   ①设计tb_company和tb_address的一对一关系
    *   ②添加外键约束，保证数据的完整性、有效性、正确性
        *   将一张表中的主键作为外键约束指向另一张表的主键。
*   ①设计tb_company和tb_address的一对一关系
    ```
    -- 创建公司表tb_company
    CREATE TABLE tb_company(
    	cid INT PRIMARY KEY AUTO_INCREMENT,
    	cname VARCHAR(100)
    );
    
    INSERT INTO tb_company(cname) VALUES("阿里巴巴"),("腾讯"),("华为"),("老邱工作室");
    
    
    -- 创建地址表tb_address
    CREATE TABLE tb_address(
    	aid INT PRIMARY KEY AUTO_INCREMENT,
    	aname VARCHAR(100)
    );
    
    INSERT INTO tb_address(aname) VALUES("杭州"),("深圳"),("松山湖"),("武汉");
    ```
*   ②添加外键约束，保证数据的完整性、有效性、正确性
    ```
    ALTER TABLE tb_company ADD FOREIGN KEY(cid) REFERENCES tb_address(aid);
    ```

### 04-外键约束相关指令
*   语法
    ```sql
    #建表时添加外键约束, 使用默认外键名称
    create table t_orders (
    	字段1 类型(长度) , 
        字段2 类型(长度) , 
        foregin key(字段1) references 表名(主键名)
    );
    #建表时添加外键约束, 使用指定外键名称
    create table t_orders (
    	字段1 类型(长度) , 
        字段2 类型(长度) , 
        constraint 外键名称 foregin key(字段1) references 表名(主键名)
    );
    
    #删除外键约束
    alter table t_orders drop foreign key 外键名称;
    
    #建表后添加外键约束
    alter table 表名 add foreign key(字段名) references 表名(主键名);
    ```
