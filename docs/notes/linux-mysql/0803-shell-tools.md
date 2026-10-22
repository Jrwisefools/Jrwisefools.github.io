---
title: "Shell 文本处理工具"
date: 2025-08-03
tags:
  - Linux
  - Shell
archived: true
description: "1. cut 工作为“剪”类似split方法 从每一行切割字段切割输出 cut [选项参数] filename 选项 -f 列号 提取第几列 -d 分隔符 指定用什么分割,默认用制表符\t，只能是一共…"
---
# Day14
## Shell 工具
1. cut
工作为“剪”类似split方法
从每一行切割字段切割输出
cut [选项参数] filename
选项 
-f 列号 提取第几列
-d 分隔符 指定用什么分割，默认用制表符 \t，**只能是一个字符**
=>补充示例
```shell
# 按冒号分割，提取第7列
cut -d: -f7 /etc/passwd
# 提取1、3列，制表符分隔无需-d参数
cut -f1,3 test.txt
```

> **补充整理**：原稿「只能是一共字符」应为「只能是**一个**字符」。
>
> `cut` 的两个典型局限，遇到就该换 `awk`：
>
> 1. **分隔符只能是单个字符**——`cut -d", "` 这种多字符分隔会报错
> 2. **不能重排字段顺序**——`cut -f3,1` 输出的顺序仍是 1、3（按原文件列序），不是 3、1
>
> 所以 `cut` 适合简单按列截取，稍复杂就直接上 `awk`。

2.awk
默认分割符将每行切片
awk [选项参数] '/pattern1{action1}'匹配符合pattern1的内容输出，这里只能用单引号
-F 指定输入文件的分隔符
-v 赋值一个用户定义变量
```shell
awk -F: '/^root/{print $7}' passwd
```
awk的内置变量
FILENAME 文件名
NR 行号
NF 切割后列的个数
# 补充awk内置变量与示例
$0：当前完整一行文本
$1/$2/$3...：分割后第1、2、3列字段
FS：输入分隔符，等效-F参数
OFS：输出分隔符
```shell
# 打印每行行号、全部字段数量、整行内容
awk '{print NR,NF,$0}' passwd
# 自定义变量统计总和
awk -v total=0 -F: '{total+=$5} END{print total}' user.txt
```

> **补充整理**：原稿只列了变量，这里补几个真正实用的例子。
>
> ```shell
> # 取第 1 列和第 3 列（awk 可以重排，cut 不行）
> awk -F: '{print $1, $3}' /etc/passwd
>
> # 带条件过滤：只看 UID 大于 1000 的普通用户
> awk -F: '$3 > 1000 {print $1, $3}' /etc/passwd
>
> # 自定义输出分隔符（默认空格）
> awk -F: 'BEGIN{OFS="|"} {print $1, $7}' /etc/passwd
>
> # 统计：按 shell 类型计数（Shell 里的 "group by"）
> awk -F: '{cnt[$7]++} END{for (k in cnt) print k, cnt[k]}' /etc/passwd
> ```
>
> `awk` 的核心结构就是 **`BEGIN {前置} /模式/ {动作} END {收尾}`**，
> 记住这三段就够应付大部分文本处理：
>
> - `BEGIN`：读文件前跑一次（常用于设 `FS`/`OFS`、初始化变量、打印表头）
> - 中间：每行跑一次，可加判断条件
> - `END`：读完跑一次（常用于输出统计结果）

# Mysql
数据库：DB
能够永久保存数据,方便读取
MySQL、Oracle
SQL是一套结构化查询语言，专门操作/访问数据库的通用语言
MySQL是最常用的数据库
### 关系型&非关系型数据库
关系型数据库：MySQL、Oracle、SqlServer，采用二维表格存储，表之间可建立关联
非关系型数据库：MongoDB、Redis、Elasticsearch，键值对存储，表与表之间没有关联关系
MySQL5.5之后默认存储引擎为InnoDB

### 层级结构
MySQL服务实例 -> Database数据库 -> table数据表 -> records记录（行）/字段（列）

### SQL 语句简介
1. DDL:数据库定义语句:创建,修改,删除（操作database、table）
2. DML:数据操作语句:对记录进行增、删、改
3. DCL:数据控制语句:权限、事务相关操作
4. DQL:数据查询语句:对记录进行查询（使用频率最高）

### 语句规范
不区分大小写，标识符仅支持数字0-9、大小写字母、下划线
同一层级下名称不能重复（同库表名唯一，同表字段唯一）
每条语句必须以分号;结尾
关键字作为库/表/字段名时，使用反引号`` ` ``包裹

### 注释
```sql
# 注释
-- 数据库单行注释（--后方必须加空格）
/*
sql多行注释
*/
```

### DDL 库相关操作
1. 创建数据库
create database [if not exists] 数据库名;
-- if not exists 避免库已存在时报错
2. 查看所有库
show databases;
3. 查看库创建细节（字符集、校对规则）
show create database 数据库名
4. 修改数据库编码
alter database 数据库名 character set utf8mb4 collate utf8mb4_general_ci;
-- 仅后续新建表生效，已有表编码不会变更

> **补充整理**：原稿用的是 `utf8`，**建议一律改用 `utf8mb4`**。
>
> MySQL 里的 `utf8` 是个"阉割版"——每个字符最多 **3 字节**，
> **存不了 emoji 和部分生僻字**（会报 `Incorrect string value`）。
> 真正的 UTF-8 在 MySQL 里叫 **`utf8mb4`**（最多 4 字节）。
>
> 这也是 MySQL 的历史遗留坑：新项目建库请直接写
>
> ```sql
> CREATE DATABASE mydb
>   DEFAULT CHARACTER SET utf8mb4
>   COLLATE utf8mb4_unicode_ci;
> ```
>
> 排序规则（collate）的选型：
> `_general_ci` 快但排序精度低；`_unicode_ci` 稍慢但对多语言排序更准确；
> 需要区分大小写用 `_bin`。国内业务常用 `utf8mb4_general_ci` 或 `utf8mb4_0900_ai_ci`（MySQL 8 默认）。
5. 使用指定库
use 数据库名
6. 删除库
drop database [if exists] 数据库名;

### DDL 表相关操作
#### 创建表
```
create table [if not exists] 表名(
    字段名 数据类型,
    字段名 数据类型
);
```
MySQL 的下标（列序号）从 **1** 开始，不是 0
#### 表查询操作
show tables; -- 查看当前库所有表
show tables from 库名; -- 查看指定库的表
desc 表名; -- 简洁查看表字段结构
show create table 表名; -- 查看完整建表语句

#### 修改表
-- 修改表字符集
alter table 表名 character set utf8 collate utf_general_ci;
-- 末尾新增字段
alter table 表名 add 字段 类型;
-- 表头新增字段
alter table 表名 add 字段 类型 first;
-- 指定字段后新增
alter table 表名 add 字段 类型 after 目标字段;
-- 删除字段
alter table 表名 drop 字段名;
-- 修改字段数据类型
alter table 表名 modify 字段 新类型;
-- 修改字段名+类型
alter table 表名 change 旧名 新名 新类型;
-- 修改表名
alter table 旧表 rename 新表;
rename table 旧表 to 新表;
-- 删除表
drop table [if exists] 表名;

## DML
### 添加 insert
1. 全字段插入（值顺序、数量与表字段完全对应）
insert into 表名 values(值1,值2),(值3,值4);
2. 指定字段列表插入（未填写字段自动为null）
insert into 表名(字段1,字段2) values(值1,值2);

### 删除表中数据
delete from 表名;
truncate 表名;
truncate 和 delete 表的区别:
delete 是一条一条删除记录的，属于dml 支持事务管理，支持事务回滚
truncate 是销毁原表重建空表，属于ddl 不支持事务管理，不支持事务回滚
补充差异：delete不会重置自增主键；truncate重置自增主键；delete会触发表触发器，truncate不会

> **补充整理**：原稿「不支持事物回滚」应为「不支持**事务**回滚」。
>
> 三种"删"的区别要一次记牢：
>
> | | DELETE | TRUNCATE | DROP |
> | --- | --- | --- | --- |
> | 删什么 | 表里的**行**（可带 WHERE） | 所有行，**保留表结构** | **整张表**（结构+数据全没） |
> | 类型 | DML | DDL | DDL |
> | 能回滚 | **能** | 不能 | 不能 |
> | 自增 ID | 不重置 | **重置为 1** | — |
> | 触发器 | 触发 | 不触发 | 不触发 |
> | 速度 | 慢（逐行记日志） | 快 | 最快 |
>
> 生产上的铁律：**`DELETE` / `UPDATE` 一定要写 `WHERE`，且先 `SELECT` 确认范围**。
> 清空表用 `TRUNCATE`（快且重置 ID），删表用 `DROP`。
> 想要"可恢复的删除"，用 `DELETE` 因为它能回滚——这也是原稿强调事务的原因。

### 修改记录 update
update 表名 set 字段名 = 值,字段名 = 值 [where 条件] --修改满足指定条件
-- 无where条件会修改整张表所有数据，生产禁止使用

## DQL
### select 语句（DQL:data query language),数据查询语句
select 常量;-->select 1;
select 表达式;-->select 9/3;
select 函数;-->select now();
select 字段列表 from 表名 where 条件;
* ：代表表中所有字段

### 使用别名
在当前select中可以给字段、表达式、表取别名
=>列的别名有空格时候需要加双引号
=>表的别名不能加双引号,表的别名中间不能包含空格
=>as可以省略
示例：
select name as "学生 姓名",age age_num from student s;

### 去重
distinct
-- 多字段写distinct时，所有字段值全部重复才会合并去重
select distinct age,gender from student;

### 运算符
#### 算数运算符
+、-、*、/、div(整除、只保留整数部分)、%（取模）
空数据与其他运算结果都为空
sql里面没有字符串拼接功能，+仅做数字运算
示例：
select 7 div 2,7%2,null+10,'123'+1;

> **补充整理**：原稿说「没有字符串拼接功能」——准确说是
> **`+` 在 MySQL 里只做算术，拼接要用 `CONCAT()`**。
>
> ```sql
> SELECT CONCAT(name, '-', dept) FROM employee;      -- 拼接
> SELECT CONCAT_WS('-', name, dept) FROM employee;   -- 带分隔符，自动跳过 NULL
> ```
>
> `CONCAT` 有个坑：**任一参数为 NULL，结果就是 NULL**。
> 所以拼接可空字段时用 `CONCAT_WS` 或 `IFNULL` 兜底：
> `CONCAT(IFNULL(name,''), '-', dept)`。
>
> 另外 `'123' + 1` 在 MySQL 里等于 **124**（字符串会被隐式转成数字），
> 这和 Python 完全不同（Python 会报 TypeError）。隐式转换很方便，
> 但也藏着坑——`'abc' + 1` 会得到 **1**（'abc' 转成 0），**不报错**，
> 数据就这样悄悄错了。所以别依赖隐式转换，该转就显式转。

#### 比较运算符
```
>、<、>=、<=、=、 <>或!=不等于
注意：=、!= 无法判断null值
```
#### 区间或集合范围运算符
between x and y 闭区间包含两端
not between x and y 不在区间内
in(值1,值2,值3) 匹配集合内任意值
not in(值1,值2,值3) 不匹配集合内任意值

#### 模糊运算符 like 
% 表示任意个字符 ->%三%
_ 代表1个字符,如果两个下划线就代表两个字符
查询当前Mysql数据库的字符集情况
show variables like '%character%';

#### 逻辑运算符
&& 或 and 逻辑与
|| 或 or  逻辑或
! 或 not  逻辑非
xor     逻辑异或（两个条件只能成立一个）
示例：
select * from student where age>18 xor gender='男';

#### 关于空值的问题
is null      是null
is not null  不是空
ifnull(x,y)  x是空的时候，用y代替
示例：
select name,ifnull(score,0) from student where score is null;

## MySql数据类型
1.整数类型
TinyInt、SmallInt、MediumInt、Int、BigInt    
修饰：unsigned无符号、zerofill零填充；MySQL8废弃int(M)显示宽度  
2.浮点类型  
单精度float    
双精度double  
定点数decimal，如果不设置m和d默认(10,0)  
decimal---对精度要求更高（财务金额专用，无精度丢失）  
浮点数要表示的范围更大，但存在精度误差  
M：总数字位数，D：小数位数，decimal(5,2)范围-999.99~999.99
