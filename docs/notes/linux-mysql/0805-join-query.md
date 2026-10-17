---
title: "多表关联查询"
date: 2025-08-05
tags:
  - MySQL
  - 数据库
archived: true
---
# Day 16
# MySQL 关联查询 & SELECT 完整子句笔记
## 第9章 关联查询（多表连接）
### 9.1 关联查询基础概念
1. **定义**：同时查询2张及以上存在关联关系的表，
依靠**关联字段**建立连接。
2. **关联字段要求**：逻辑含义相同、数据类型一致，字段名可不同；可以不建立外键。
3. **笛卡尔积问题**
   - 不写关联条件时，结果行数=表1行数 × 表2行数，数据冗余无意义。
   - 规则：`n`张表关联，必须写 `n-1` 个关联条件，用 `on` 子句书写（可读性优于where）。
4. **多表连接语法格式**

```sql
表1 连接类型 join 表2 on 关联条件
表1 join 表2 on 条件 join 表3 on 条件
```

### 9.2 七种连接结果图解（MySQL支持）
1. 内连接：`A inner join B` → 交集 $\(A∩B\)$
2. 左连接：`A left join B` → 全集A
3. 左独有数据：`A left join B where B关联字段 is null` → $A-\(A∩B\)$
4. 右连接：`A right join B` → 全集B
5. 右独有数据：`A right join B where A关联字段 is null` → $B-\(A∩B\)$
6. 全并集：左连接 union 右连接 → $\(A∪B\)$
7. 两边独有：左独有 union 右独有 → $\(A∪B\) - \(A∩B\)$

### 9.3 内连接 inner join
只返回两张表**能匹配上**的数据，两边无匹配的记录全部过滤。
#### 示例（员工表t_employee、部门表t_department）
```sql
-- 查询员工姓名、部门编号、部门名称（只显示有部门的员工）
select ename, t_employee.did, dname
from t_employee inner join t_department
on t_employee.did = t_department.did;

-- 三表内连接：员工+部门+职位
select ename, dname, jname, salary
from t_employee
inner join t_department on t_employee.did = t_department.did
inner join t_job on t_employee.job_id = t_job.jid
where t_department.did = 1;
```

### 9.4 左连接 left join
以**左表A**为基准，左表所有数据全部保留；右表无匹配字段填充`null`。
#### 常用场景
1. 查询全部员工（包含无部门的员工）
```sql
select ename, salary, t_department.did, dname
from t_employee left join t_department
on t_employee.did = t_department.did;
```
2. 查询**没有分配部门**的员工（左表独有数据）
```sql
select ename, salary, dname
from t_employee left join t_department
on t_employee.did = t_department.did
where t_department.did is null;
```

### 9.5 右连接 right join
以**右表B**为基准，右表所有数据全部保留；左表无匹配字段填充`null`。
#### 常用场景
1. 查询全部部门（包含无员工的部门）
```sql
select ename, salary, t_department.did, dname
from t_employee right join t_department
on t_employee.did = t_department.did;
```
2. 查询**没有员工**的部门（右表独有数据）
```sql
select ename, salary, dname
from t_employee right join t_department
on t_employee.did = t_department.did
where t_employee.did is null;
```

### 9.6 union 合并查询结果
#### 核心规则
1. 前后两条`select`查询的**列数、字段类型必须完全一致**；
2. `union`：自动去重；`union all`：直接拼接，不去重，性能更高。
#### 示例1：全并集 \(A∪B\)（所有员工+所有部门）
```sql
-- 左连接结果 union 右连接结果
select * from t_employee left join t_department on t_employee.did = t_department.did
union
select * from t_employee right join t_department on t_employee.did = t_department.did;
```
#### 示例2：两边独有数据（无部门员工 + 无员工部门）
```sql
-- 左独有数据 union 右独有数据
select * from t_employee left join t_department on t_employee.did = t_department.did where t_department.did is null
union
select * from t_employee right join t_department on t_employee.did = t_department.did where t_employee.did is null;
```

### 9.7 自连接
1. **定义**：物理只有一张表，通过**取别名**逻辑拆分成两张表做关联。
2. 适用场景：表内存在上下级、父子、层级关系（员工-领导）。
#### 示例：查询员工及直属领导信息
```sql
-- emp：员工表；mgr：领导表
select
    emp.eid 员工编号, emp.ename 员工姓名, emp.salary 员工薪资,
    mgr.eid 领导编号, mgr.ename 领导姓名, mgr.salary 领导薪资
from t_employee emp inner join t_employee mgr
on emp.mid = mgr.eid; -- emp.mid员工领导编号 = mgr.eid领导自身编号
```

---

# 第10章 SELECT完整7个子句
## 10.1 子句执行顺序（固定不可颠倒）
1. `from`：确定查询数据源（单表/多表）
2. `join on`：多表关联，建立表连接关系
3. `where`：过滤原始表的行，**不能使用聚合函数**
4. `group by`：按照指定字段分组，配合聚合函数统计
5. `having`：过滤**分组后的统计结果**，可以使用聚合函数
6. `order by`：对最终查询结果排序
7. `limit`：分页截取结果

## 10.2 各子句详解
### 10.2 from
指定查询的表，多表逗号分隔会产生笛卡尔积，不推荐。
```sql
select * from t_employee;
```

### 10.3 join on
多表关联专用，书写表与表之间的匹配条件，优先于where。
```sql
-- 自连接示例
select temp1.*, temp2.ename, temp2.salary
from t_employee temp1
join t_employee temp2
on temp2.salary > temp1.salary * 2;
```

### 10.4 where
原始数据行过滤，**执行在分组之前**，不能写`sum/count/avg`等聚合函数。
```sql
select * from t_employee where salary > 10000;
```

### 10.5 group by 分组统计
将相同字段值的数据合并一组，配合聚合函数做统计（avg/sum/max/min/count）。
#### 1. 基础单字段分组
```sql
-- 统计每个部门平均薪资
select did, round(avg(salary),2) 平均薪资
from t_employee
group by did;
```
#### 2. 多字段分组
按多个维度分层分组
```sql
-- 按部门、职位、性别分组统计人数
select did, job_id, gender, count(*) 人数
from t_employee 
group by did, job_id, gender;
```
#### 3. with rollup 合计汇总
分组末尾增加一行总计数据
```sql
-- 统计各部门人数，最后增加总人数行
select ifnull(did,'合计') 部门编号, count(*) 人数
from t_employee
group by did with rollup;
```
#### 分组书写规范
`select`后只能写**分组字段 + 聚合函数**，写其他普通字段会出现数据错乱。

### 10.6 having 分组后过滤
- 执行时机：分组统计完成后；
- 区别where：having支持聚合函数，where不支持；
```sql
-- 查询女员工各部门平均薪资，只保留平均薪资大于12000的部门
select t_department.did, dname, ifnull(round(avg(salary),2),0) 平均薪资
from t_department left join t_employee
on t_department.did = t_employee.did
where gender='女' -- 原始表过滤：只保留女员工
group by t_department.did
having ifnull(round(avg(salary),2),0) > 12000; -- 分组结果过滤
```

### 10.7 order by 排序
- `asc`：升序（默认，可省略）；`desc`：降序；
- 支持多字段排序，优先级从左到右。
```sql
-- 薪资降序，薪资相同则员工编号升序
select * from t_employee order by salary desc, eid asc;
```

### 10.8 limit 分页截取
（当前页数currentPage，每页记录数pageSize）
limit m，n
-> m/begin:表示从第几行开始取记录，第一个索引是0
-> n/pagesize:表示该页最多多少行
bgein = (currentpage-1）*pageSize

#### 语法
`limit offset, size`
- offset：起始行下标，从0开始；
- size：每页展示条数；
#### 分页计算公式
`offset = (当前页码 - 1) * 每页条数`
#### 示例
```sql
-- 每页5条，第3页数据：offset=(3-1)*5=10
select * from t_employee limit 10,5;
```

## 10.3 完整7子句综合案例
```sql
-- 查询薪资大于10000的员工，按部门、性别分组，统计每组人数，只保留人数<3的组，按人数升序分页展示前10条
select t_department.did, dname, gender, count(eid) 人数
from t_employee
right join t_department on t_employee.did = t_department.did
where salary > 10000
group by t_department.did, gender
having count(eid) < 3
order by count(eid) asc
limit 0,10;
```

## 核心区分：where vs having
|对比项|where|having|
| ---- | ---- | ---- |
|执行时机|分组前，过滤原始数据表|分组后，过滤聚合统计结果|
|是否支持聚合函数|不支持|支持|
|作用对象|单条原始数据行|分组后的统计行|

## select 中嵌套子查询
子查询的结果当作外部查询的字段来返回
## where或having中嵌套子查询
当子查询的结果是单列单个值，可以之间用比较运算符
当子查询结果是多个值，可以用in或not in
当子查询是单列多个值，可以用比较运算符搭配 all not

### exists 子查询
exists子查询也是存在外层select的where子句中,外层的执行取决于内层exists有没有返回，有结果外部就会执行
如果没有就不会执行。

### from 中嵌套子查询
把查询结果当作一个表用

### updata中嵌套子查询
同一张表不能同时出现查询和修改，避免出现数据同步

### delete中嵌套子查询
dml和dql不能操作同一张表

### 通用表达式
可复用的子查询，
范围是当前语句，不用给分号
