---
title: "窗口函数"
date: 2025-08-07
tags:
  - MySQL
  - 数据库
archived: true
description: "有几条数据执行完还是几条 包括sum(),avg(),count(),max(),min() 把这些功能函数放进窗口函数后返回的数据就从单行变成多行"
---
# Day 17
### 窗口函数
有几条数据执行完还是几条
包括sum(),avg(),count(),max(),min()
把这些功能函数放进窗口函数后返回的数据就从单行变成多行

1. `ROW_NUMBER()` 行号（连续，不并列）
2. `RANK()` 并列排序，和 `ROW_NUMBER()` 的区别是值相同时**行号相同且会跳号**：1，1，3
3. `DENSE_RANK()` 并列排序，值相同行号相同但**不跳号**：1，1，2
4. `LAG(字段, n, 默认值)` / `LEAD(字段, n, 默认值)` 访问窗口中当前行**前/后** n 行的值
   n 表示前/后偏移几行，默认值是在没有前一行或后一行时填充的值
5. `FIRST_VALUE()` / `LAST_VALUE()` 访问窗口的第一个 / 最后一个值

> **补充整理**：原稿把 `row number()` 写成了带空格的形式，函数名实际是 `ROW_NUMBER()`。
> 三个排序函数的区别用一张表看最清楚（按分数降序排）：
>
> | 分数 | ROW_NUMBER | RANK | DENSE_RANK |
> | --- | --- | --- | --- |
> | 100 | 1 | 1 | 1 |
> | 100 | 2 | 1 | 1 |
> | 90 | 3 | 3 | 2 |
>
> 常见需求对应：`ROW_NUMBER()` 做**去重取最新一条**（分组后取 rn=1）、
> `RANK()`/`DENSE_RANK()` 做**排名**（要「并列后跳名次」用 RANK，不跳用 DENSE_RANK）。

#### 可运行示例

> **补充整理**：原稿只有函数清单没有例子，这里补一份能直接跑的。
>
> ```sql
> -- 建一张成绩表
> CREATE TABLE score (
>   id     INT PRIMARY KEY AUTO_INCREMENT,
>   name   VARCHAR(20),
>   subject VARCHAR(20),
>   score  INT
> );
>
> INSERT INTO score (name, subject, score) VALUES
>   ('张三', '数学', 90), ('李四', '数学', 90),
>   ('王五', '数学', 85), ('赵六', '数学', 78),
>   ('张三', '语文', 88), ('李四', '语文', 92),
>   ('王五', '语文', 92), ('赵六', '语文', 70);
> ```
>
> **① 三个排序函数对比**（按数学成绩排名）
>
> ```sql
> SELECT name, score,
>        ROW_NUMBER() OVER (ORDER BY score DESC) AS rn,
>        RANK()       OVER (ORDER BY score DESC) AS rk,
>        DENSE_RANK() OVER (ORDER BY score DESC) AS drk
> FROM score
> WHERE subject = '数学';
> ```
>
> **② 分组取每组第一名**（经典去重题：每科最高分是谁）
>
> ```sql
> SELECT * FROM (
>   SELECT name, subject, score,
>          ROW_NUMBER() OVER (PARTITION BY subject ORDER BY score DESC) AS rn
>   FROM score
> ) t
> WHERE rn = 1;
> ```
>
> > 窗口函数**不能直接写在 WHERE 里**（执行顺序上 WHERE 早于 SELECT），
> > 必须像上面这样套一层子查询再过滤——这是初学者最常踩的坑。
>
> **③ 累计求和（ running total ）**
>
> ```sql
> SELECT name, score,
>        SUM(score) OVER (ORDER BY score DESC
>                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_sum
> FROM score
> WHERE subject = '数学';
> ```
>
> 注意 `ORDER BY` 存在时，聚合类窗口函数默认范围就是
> 「分区首行 → 当前行」，所以上面 `ROWS BETWEEN` 那一段其实可以省略。
>
> **④ 环比：和上一名的分差（ LAG ）**
>
> ```sql
> SELECT name, score,
>        LAG(score, 1) OVER (ORDER BY score DESC) AS prev_score,
>        score - LAG(score, 1) OVER (ORDER BY score DESC) AS diff
> FROM score
> WHERE subject = '数学';
> ```
>
> `LAG` 常用于「比昨天、比上月」这类同环比计算，比自连接清晰得多。
>
> **⑤ 命名窗口，避免重复书写**
>
> ```sql
> SELECT name, score,
>        RANK() OVER w AS rk,
>        DENSE_RANK() OVER w AS drk
> FROM score
> WHERE subject = '数学'
> WINDOW w AS (ORDER BY score DESC);
> ```

#### 格式
函数名(参数列表) over(
 [partition by colum]-->不写就不分组
 [order by colum]
 [rows between `start` and `end`] -->不写就是把所有数据求和“范围”，默认是从第一行开始到当前行
)
窗口函数可复用 window w as（）
范围：
unbounded preceding：窗口从分区的第一行开始
n preceding ：当前行之前的n行
current row ：当前行
n following ：当前行之后的n行
unbounded following

### 事务
保证所有事务作为一个工作单元来执行
要么一起成功要么一起失败
> 原子性: 原子性是指事务是一个不可分割的工作单位
> 一致性: 总的金额是不变的
> 隔离性: 不同的业务之间是互不干扰的（相对独立），不同的隔离级别对事务的影响是不一样的
> 持久性: 指一个事务一旦提交，对数据库的影响是永久的

-- mysql默认是自动提交事务，
如果sql语句没有问题就自动提交事务

#### 自动模式下手动开启事务
start transaction
后续的sql语句都在同一个事务中
注意：事务开启后一定得结束事务
commit 成功就提交事务
rollback 失败就回滚事务

### 手动提交模式
set autocommit = false;
或 autocommit = 0
->成功提交
commit
->失败回滚
rollback

#### DDL语句不支持事务管理
create,drop,alter等不支持
### 事务的隔离级别
不同隔离级别对两个事务之间的影响是不一样的
隔离性越高，数据一致性就越好,但并发性越弱

#### 并发问题
1. 脏读 一个事务读取了另一个事务未提交的数据。
2. 不可重复读 : 同一个事务前后两次读取同一条记录不一样
3. 幻读 ： 一个事务读取了另一个事务新增、删除的记录情况
      这个问题是正常的问题，事务b确实添加了
      把其变成串行即可以解决

#### 四种事务隔离级别
1. read-uncommitted 允许a事务读取其他事务未提交和已提交的数据，会出现脏读、不可重复读、幻读问题。
2. read-committed 只允许A事务读取其他事务已提交的数据，可以避免脏读，但仍然会出现不可重复读、幻读问题。
3. repeatable-read 确保事务可以多次从一个字段中读取相同的值,在这个级别也可以避免幻读,正常情况下就是这个隔离级别，也是 mysql 默认的隔离级别
4. serializable 串行,两个事务一个执行完才执行另外一个,所有并发问题都可以避免，但性能十分低下。

设置隔离级别
set transaction_isolation
--设置读未提交:
set transaction_isolation = "read-uncommitted"
--设置读已提交:
set transaction_isolation = "read-committed "
--设置可重复读:
set transaction_isolation = "repeatable-read"
--设置串行读:
set transaction_isolation = "serializable"
-- 查看隔离级别:
select @@transaction_isolation

# Docker
### 为什么出现docker
因为软件开发时候环境不一致
环境差异、依赖冲突、兼容性问题
解决思路：安装时候把原始环境一模一样地复制过来
把代码、依赖、配置、系统环境全部打包在一起、形成一个可以移植的容器
运维不用反复配置机器,直接运行容器即可
### docker简介
是一个开源的容器引擎,基于go语言开发
容器完全使用沙箱机制，相互之间不会有任何接口，
更重要的是容器性能开销非常低 
"一次封装，到处运行"
### 优势
可移植性，可伸缩性，隔离性
### docker 和 虚拟机的区别
不需要额外虚拟的操作系统,
调用系统的环境支持库
需要docker引擎
隔离性：虚拟机隔离的更加彻底，
      而docker共享宿主机的操作系统
运行效率:docker速率更快
### docker架构
是一个客户端-服务器(C/S)架构
