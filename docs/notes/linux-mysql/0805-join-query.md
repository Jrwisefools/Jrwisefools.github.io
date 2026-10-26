---
title: "多表关联查询"
date: 2025-08-05
tags:
  - MySQL
  - 数据库
archived: true
description: "1. 定义：同时查询2张及以上存在关联关系的表， 依靠关联字段建立连接。 2. 关联字段要求：逻辑含义相同、数据类型一致，字段名可不同；可以不建立外键。 3. 笛卡尔积问题 - 不写关联条件时，结果行…"
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
1. 内连接：`A inner join B` → 交集 A∩B
2. 左连接：`A left join B` → 全集 A
3. 左独有数据：`A left join B where B关联字段 is null` → A − A∩B
4. 右连接：`A right join B` → 全集 B
5. 右独有数据：`A right join B where A关联字段 is null` → B − A∩B
6. 全并集：左连接 union 右连接 → A∪B
7. 两边独有：左独有 union 右独有 → A∪B − A∩B

> **补充整理**：原稿里的 `$\(...\)$` 是公式标记残留，已清理成纯文本。
>
> 七种连接不用死记，**真正高频的只有三种**：
>
> | 连接 | 用途 | 出现频率 |
> | --- | --- | --- |
> | `INNER JOIN` | 只要两边都对得上的 | **最高** |
> | `LEFT JOIN` | 以左表为准，右表没有就填 NULL | 很高 |
> | `LEFT JOIN + IS NULL` | **找"缺失"**：没下单的用户、没员工的部门 | 高 |
>
> 其余几种：`RIGHT JOIN` 都能改写成 `LEFT JOIN`（把表换顺序即可，**实际项目几乎不用**）；
> `FULL OUTER JOIN` **MySQL 原生不支持**，要用 `LEFT JOIN UNION RIGHT JOIN` 模拟，用得很少。
>
> 所以记忆重点是：**内连接取交集，左连接保左表，左连接 + IS NULL 找缺失。**
>
> 一个易错点：左连接时**右表的过滤条件要写在 `ON` 里，不能写在 `WHERE` 里**——
>
> ```sql
> -- 错：WHERE 把左表独有行也过滤了，退化成内连接
> SELECT * FROM emp e LEFT JOIN dept d ON e.did = d.did WHERE d.dname = '研发部';
>
> -- 对：条件只作用于右表，左表行全部保留
> SELECT * FROM emp e LEFT JOIN dept d ON e.did = d.did AND d.dname = '研发部';
> ```

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
### 10.2.1 from
指定查询的表，多表逗号分隔会产生笛卡尔积，不推荐。
```sql
select * from t_employee;
```

### 10.2.2 join on
多表关联专用，书写表与表之间的匹配条件，优先于where。
```sql
-- 自连接示例
select temp1.*, temp2.ename, temp2.salary
from t_employee temp1
join t_employee temp2
on temp2.salary > temp1.salary * 2;
```

### 10.2.3 where
原始数据行过滤，**执行在分组之前**，不能写`sum/count/avg`等聚合函数。
```sql
select * from t_employee where salary > 10000;
```

### 10.2.4 group by 分组统计
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

### 10.2.5 having 分组后过滤
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

### 10.2.6 order by 排序
- `asc`：升序（默认，可省略）；`desc`：降序；
- 支持多字段排序，优先级从左到右。
```sql
-- 薪资降序，薪资相同则员工编号升序
select * from t_employee order by salary desc, eid asc;
```

### 10.2.7 limit 分页截取
（当前页数 currentPage，每页记录数 pageSize）
`limit offset, size`
-> offset/begin：表示从第几行开始取记录，第一个索引是 0
-> size/pageSize：表示该页最多多少行
`begin = (currentPage - 1) * pageSize`

> **补充整理**：原稿 `limit m，n` 用了中文逗号，SQL 里必须用**英文逗号**；
> 「bgein」应为 **begin**。
>
> 深分页的性能坑必须知道：
>
> ```sql
> SELECT * FROM t_employee LIMIT 1000000, 20;   -- 慢！
> ```
>
> 它会**先扫描并丢弃前 100 万行**再返回 20 行，页数越深越慢。
> 优化办法是用**游标分页（keyset pagination）**，记住上一页最后一行的 id：
>
> ```sql
> SELECT * FROM t_employee WHERE eid > 上一页最大id ORDER BY eid LIMIT 20;
> ```
>
> 这样能走主键索引，无论翻到第几页都是同样快。
> 如果必须显示"第几页/共几页"，可以考虑用覆盖索引先取出 id 再回表。

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

## 10.3 完整 7 子句综合案例
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

```sql
-- 每个员工的姓名，以及他所在部门的平均薪资（子查询返回一个标量值）
SELECT
    e.ename,
    e.salary,
    (SELECT ROUND(AVG(salary), 2) FROM t_employee x WHERE x.did = e.did) AS 部门均薪
FROM t_employee e;
```

> **补充整理**：这种叫**标量子查询**（返回一行一列）。
> 注意它**每行都会执行一次**，数据量大时性能很差，
> 更优写法是用窗口函数或 `JOIN` 一个分组结果（见 `FROM` 子查询那节）。

## where 或 having 中嵌套子查询

> **补充整理**：原稿只写了规则没有例子，这里按三种返回形态逐一补齐。
>
> ### ① 子查询返回单个值 —— 用比较运算符
>
> ```sql
> -- 查出薪资高于全公司平均薪资的员工
> SELECT ename, salary
> FROM t_employee
> WHERE salary > (SELECT AVG(salary) FROM t_employee);
> ```
>
> ### ② 子查询返回一列多个值 —— 用 IN / NOT IN
>
> ```sql
> -- 查出"研发部"和"测试部"的所有员工
> SELECT ename, did
> FROM t_employee
> WHERE did IN (SELECT did FROM t_department WHERE dname IN ('研发部', '测试部'));
> ```
>
> ### ③ 返回一列多个值 + 比较 —— 用 ANY / SOME / ALL
>
> 原稿写的「搭配 all not」不准确，MySQL 里是 **`ANY`（或 `SOME`）与 `ALL`**：
>
> | 写法 | 含义 | 等价 |
> | --- | --- | --- |
> | `> ANY (...)` | 大于子查询中的**任意一个**（即大于最小值） | `> (SELECT MIN(...))` |
> | `> ALL (...)` | 大于子查询中的**所有值**（即大于最大值） | `> (SELECT MAX(...))` |
>
> ```sql
> -- 比"研发部任意一个员工"薪资高就行
> SELECT ename, salary FROM t_employee
> WHERE salary > ANY (SELECT salary FROM t_employee WHERE did = 1);
>
> -- 比"研发部所有员工"都高（即全公司最高薪那一档）
> SELECT ename, salary FROM t_employee
> WHERE salary > ALL (SELECT salary FROM t_employee WHERE did = 1);
> ```
>
> **`NOT IN` 的致命坑**：子查询里只要有一个 `NULL`，`NOT IN` 的结果就是**空集**
> （因为 `x NOT IN (1, NULL)` 等价于 `x<>1 AND x<>NULL`，后者恒为 UNKNOWN）。
> 所以要么给字段加 `NOT NULL` 约束，要么改用 `NOT EXISTS`。

### exists 子查询
exists 子查询也是写在**外层 select 的 where 子句**中，外层是否执行取决于内层 exists 有没有返回结果：
有结果外层就返回该行，没有就不返回。

```sql
-- 查出"至少有一个员工"的部门
SELECT dname
FROM t_department d
WHERE EXISTS (SELECT 1 FROM t_employee e WHERE e.did = d.did);

-- 查出"一个员工都没有"的部门（EXISTS 取反）
SELECT dname
FROM t_department d
WHERE NOT EXISTS (SELECT 1 FROM t_employee e WHERE e.did = d.did);
```

> **补充整理**：`EXISTS` 只关心"**有没有**"，不关心"是什么"，
> 所以子查询里写 `SELECT 1` / `SELECT *` 都一样（推荐写 `1`，语义更清楚）。
>
> **`IN` vs `EXISTS` 的选型**：
>
> | | 适用 |
> | --- | --- |
> | `IN` | 子查询**结果集小**（先算出结果再比对） |
> | `EXISTS` | 外表小、内表大，且**内表有索引**（逐行探测，命中就停） |
>
> 另外 `EXISTS` 天然不受 NULL 影响，这是它相对 `NOT IN` 最大的优势。
> 判断"存在/不存在"时优先用 `EXISTS`。

### from 中嵌套子查询
把查询结果当作一个表用（**派生表**）

```sql
-- 各部门平均薪资，再和部门表连接拿到部门名
SELECT d.dname, t.avg_sal
FROM (SELECT did, ROUND(AVG(salary), 2) AS avg_sal
      FROM t_employee
      GROUP BY did) t          -- ← 派生表
JOIN t_department d ON d.did = t.did
WHERE t.avg_sal > 12000;
```

> **补充整理**：MySQL 要求**派生表必须有别名**（上面那个 `t`），
> 没有别名会直接报 `Every derived table must have its own alias`。
>
> 这种写法比"select 里嵌标量子查询"快得多——分组只算一次，而不是每行算一次。

### update 中嵌套子查询

> **补充整理**：原稿「同一张表不能同时出现查询和修改」这条规则是对的，
> 但没有示例也没说怎么绕开。
>
> ```sql
> -- 直接这么写会报错：You can't specify target table 't_employee' for update
> UPDATE t_employee
> SET salary = salary * 1.1
> WHERE did = (SELECT did FROM t_employee WHERE ename = '张三');   -- ← 同表，报错
>
> -- 绕开办法：把子查询再包一层派生表，让 MySQL 认为它是"另一张表"
> UPDATE t_employee
> SET salary = salary * 1.1
> WHERE did = (SELECT did FROM (SELECT did FROM t_employee WHERE ename = '张三') t);
> ```
>
> 这个"再包一层"的技巧是 MySQL 的经典 workaround，原理是让优化器
> 先把子查询物化成临时表，就不再触发同表限制。

### delete 中嵌套子查询
dml 和 dql 不能操作同一张表（同上，用派生表包一层绕开）

```sql
-- 删除和"张三"同部门的所有人（直接写会报同表错误）
DELETE FROM t_employee
WHERE did = (SELECT did FROM (SELECT did FROM t_employee WHERE ename = '张三') t);
```

> **补充整理**：`DELETE` 前务必先 `SELECT` 确认范围——
> 把 `DELETE FROM` 换成 `SELECT * FROM` 跑一遍看命中多少行，再执行删除。

### 通用表达式（CTE）
可复用的子查询，作用范围是当前语句

```sql
-- WITH 定义一次，后面可以引用多次
WITH dept_avg AS (
    SELECT did, ROUND(AVG(salary), 2) AS avg_sal
    FROM t_employee
    GROUP BY did
)
SELECT d.dname, da.avg_sal
FROM dept_avg da
JOIN t_department d ON d.did = da.did
WHERE da.avg_sal > 12000;
```

> **补充整理**：CTE 就是给子查询起个名字，好处是——
>
> - **可读性好**：复杂查询拆成几段，从上往下读，不用在嵌套里绕
> - **可复用**：定义一次，后面引用多次（派生表做不到）
> - **能递归**：`WITH RECURSIVE` 可以查**树形结构**（部门层级、菜单树、评论回复链），
>   这是普通子查询做不到的：
>
>   ```sql
>   WITH RECURSIVE dept_tree AS (
>       SELECT did, dname, parent_id, 1 AS lvl
>       FROM t_department WHERE parent_id IS NULL     -- 锚点：顶层部门
>       UNION ALL
>       SELECT d.did, d.dname, d.parent_id, dt.lvl + 1
>       FROM t_department d
>       JOIN dept_tree dt ON d.parent_id = dt.did     -- 递归：往下找子部门
>   )
>   SELECT * FROM dept_tree ORDER BY lvl;
>   ```
>
> 注意：CTE 在 MySQL 里**只有 5.7 以下版本不支持**，8.0 完全支持。
> 另外 CTE 的生命周期只在这条语句内，不是视图，也不会被缓存。
