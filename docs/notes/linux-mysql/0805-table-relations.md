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
    *   问题1 : 小伙子入职搞笑部，能够入职成功吗? → **能。** 没加外键时 `dno` 只是个普通数字，
        写 99 也照样插进去（因为"搞笑部"根本不存在）
    *   问题2 : 裁撤研发部，请问研发部的员工怎么办？ → **会变成"孤儿数据"。**
        部门被删了，但员工表里的 `dno=1` 还指着它，查出来是无效部门

> **补充整理**：这两个问题正是要加外键的原因——
> **没有外键约束时，数据库不保证关联数据的有效性**，脏数据全靠应用层自觉。
> 加上外键后：
>
> - 插入 `dno=99` 会直接报错 `Cannot add or update a child row`，问题 1 被挡住
> - 删除还有员工的部门会报 `Cannot delete or update a parent row`，问题 2 被挡住
>   （除非显式指定了级联行为，见下文）
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
    );
    
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
        foreign key(字段1) references 表名(主键名)
    );

    #建表时添加外键约束, 使用指定外键名称
    create table t_orders (
        字段1 类型(长度) , 
        字段2 类型(长度) , 
        constraint 外键名称 foreign key(字段1) references 表名(主键名)
    );
    
    #删除外键约束
    alter table t_orders drop foreign key 外键名称;
    
    #建表后添加外键约束
    alter table 表名 add foreign key(字段名) references 表名(主键名);
    ```

> **补充整理**：原稿两处 `foregin key` 拼写错误，应为 **`foreign key`**（这个错会直接报语法错误）。
>
> 外键被**删除外键约束时要用约束名**，不是字段名。名字忘了可以这样查：
>
> ```sql
> SHOW CREATE TABLE tb_employee;   -- 输出里能看到系统自动生成的约束名
> ```
>
> ### 级联行为：父表变动时子表怎么办
>
> 加外键时可以用 `ON DELETE` / `ON UPDATE` 指定父表记录被删/改时子表的行为：
>
> | 行为 | 效果 |
> | --- | --- |
> | `RESTRICT` / `NO ACTION` | **默认**。有子记录就不许删/改父记录 |
> | `CASCADE` | 父记录删/改，子记录跟着删/改 |
> | `SET NULL` | 父记录删掉，子记录的外键置 NULL（字段需允许 NULL） |
>
> ```sql
> ALTER TABLE tb_employee
>   ADD CONSTRAINT fk_emp_dept
>   FOREIGN KEY (dno) REFERENCES tb_dept(did)
>   ON DELETE SET NULL      -- 部门没了，员工先挂空，等人工处理
>   ON UPDATE CASCADE;      -- 部门 id 变了，员工跟着改
> ```
>
> 选择建议：员工/部门这类**核心业务关系用 `RESTRICT`**（宁可报错也不能悄悄删掉数据）；
> 评论、日志这类**附属数据用 `CASCADE`**（文章删了，评论跟着删合理）。
>
> ### 一个重要的实践提醒
>
> 课本教的是加物理外键，但**国内互联网公司普遍不用物理外键**，原因是：
>
> - 外键会带来额外的锁和一致性检查，**高并发写入时是性能瓶颈**
> - 数据库**分库分表后外键直接失效**
> - 数据迁移、批量导入时外键约束会让操作顺序变得非常麻烦
>
> 替代做法是：**在应用层保证一致性**，用逻辑外键（字段名约定如 `dept_id`、代码里校验），
> 数据库只加普通索引保证查询性能。
>
> 结论：**学习阶段和中小型系统用物理外键（省心、不易出错）；
> 高并发、要分库分表的系统改用逻辑外键。**
