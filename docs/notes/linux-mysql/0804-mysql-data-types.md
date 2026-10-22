---
title: "MySQL 数据类型"
date: 2025-08-04
tags:
  - MySQL
  - 数据库
archived: true
description: "1.整数类型 TinyInt、SmallInt、MediumInt、Int、BigInt 修饰：unsigned无符号、zerofill零填充；MySQL8废弃int(M)显示宽度 2.浮点类型 单精…"
---
# DAY 15

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

### 字符串类型
1. char(M) 定长字符串：固定占用M字符，适合手机号、身份证
没有达到M长度用空格填充,没有指定长度默认是1。
2. varchar(M) 变长字符串：按实际长度存储，节省空间
M是最多存储的数,varchar是没有默认长度的
varchar里面最多是16383
3. 字符串过长用别的类型来替代

> **补充整理**：`char` 和 `varchar` 怎么选，以及那个 16383 是怎么来的——
>
> | | CHAR(M) | VARCHAR(M) |
> | --- | --- | --- |
> | 存储 | 固定占 M 个字符，不足补空格 | 按实际长度存 + 1~2 字节记录长度 |
> | 读取 | 会**去掉尾部空格** | 保留尾部空格 |
> | 空间 | 可能浪费 | 省 |
> | 适合 | **长度固定**：手机号(11)、身份证(18)、MD5(32)、状态码 | **长度不定**：姓名、标题、地址 |
>
> `VARCHAR` 的上限是**一行 65535 字节**（不是字符），所以字符数取决于字符集：
> utf8mb4 下每个字符最多 4 字节 → 约 16383 字符，这就是原稿那个数字的来源。
> 它**不是固定的 16383**，用 utf8（3 字节/字符）时能到 21845。
>
> 实践建议：
>
> - 不要无脑 `VARCHAR(255)`——虽然存得下，但会误导后续维护者，也让内存临时表变大
> - 长度接近固定的一律用 `CHAR`（如 `CHAR(11)` 存手机号），读写都更快
> - 超过几千字符就改用 `TEXT`，并**拆到独立表**（避免拖慢主表查询）
### 枚举和集合
列出所有可能的值
枚举：单选
字段名 enum(值1,值2,值3)
集合：多选
字段名 set(值1,值2,值3)
### 大文本类型（了解）
varchar ： 内容长度适中
text ： 用大段长度
varchar ： 排序查询效率高

### 日期时间类型
DATE：年月日
DATETIME：年月日时分秒，不受时区影响
TIMESTAMP：时间戳，受时区限制，范围更小
TIME：时分秒
YEAR：仅年份

> **补充整理**：`DATETIME` 和 `TIMESTAMP` 的选型要看场景——
>
> | | DATETIME | TIMESTAMP |
> | --- | --- | --- |
> | 范围 | 1000-01-01 ~ 9999-12-31 | **1970-01-01 ~ 2038-01-19** |
> | 时区 | 存什么读什么，**与时区无关** | 存 UTC，读时按会话时区转换 |
> | 占用 | 8 字节 | 4 字节 |
> | 自动更新 | 需手动 | 可 `ON UPDATE CURRENT_TIMESTAMP` |
>
> 两点实践提醒：
>
> - **TIMESTAMP 有「2038 年问题」**（32 位整数溢出），存生日、长期有效期这类数据
>   **必须用 DATETIME**，否则 2038 年会溢出
> - 做国际化业务用 `TIMESTAMP`（自动换时区方便），纯国内业务用 `DATETIME`（直观不出错）
> - 建表时顺手加上自动时间戳，省得应用层维护：
>   ```sql
>   create_time DATETIME     DEFAULT CURRENT_TIMESTAMP,
>   update_time DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
>   ```

### 二进制类型（了解）
存图片视频之类的，存储二进制数据
一般不这样用，太消耗内存，
如果要存大东西。就传输图片对应的地址
默认是东八区，在标准时区基础上加8
binary
varbinary 
blob

### 其他类型
1. json类型
对象选项 ->json信息
json字符串 ->对象信息
对象信息：容器类型，对象信息等
将json字符串和对象信息的相互转换交给python来处理
2. 空间类型

### 系统预定义函数
1. 单行函数

#### 数字函数
abs(x)绝对值
ceil(x)向上取整
floor(x)向下取整
mod(x,y)x模y
round(x,y)x的小数保留y位小数（四舍五入）
truncate(x,y)x的小数保留y位小数（直接截断，不四舍五入）
format(x,y)x的小数保留y位小数（四舍五入），整数部分超过三位以逗号分开
sqrt(x) x的平方根
pow(x,y) x的y次方

> **补充整理**：原稿有两处需要修正——
>
> - `rand(x,y)` 应为 **`round(x,y)`**。`RAND()` 是取随机数（**不接受这两个参数**），
>   四舍五入才是 `ROUND()`。这两个是完全不同的函数，用错会得到随机结果。
> - `sqpt(x)` 是笔误，应为 **`sqrt(x)`**。
>
> `ROUND` 和 `TRUNCATE` 的区别（当 x=3.146, y=2）：
>
> ```sql
> SELECT ROUND(3.146, 2);     -- 3.15（四舍五入）
> SELECT TRUNCATE(3.146, 2);  -- 3.14（直接截断）
> ```
>
> 金额计算**不要用 ROUND 中间结果**，先算完再四舍五入，否则会累积误差。

#### 字符串函数   
concat(s1,s2,…)	拼接字符串   
concat_ws(a,s1,s2,…) 在字符串间加上a拼接字符串   
char_length(s) s的字符数  
length(s) s的字节数，与字符集有关    
locate(s,str) 或 instr(str,s) 返回s在str中的开始位置  
upper(s) 或 ucase(s) 所有字母转大写  
lower(s) 或 lcase(s) 所有字母转小写  
left(s,n)	返回最左边的n个字符  
right(s,n)	返回最右边的n个字符  
lpad(str,len,pad)	用pad从左边填充str直到长度达到len  
rpad(str,len,pad)	用pad从右边填充str直到长度达到len  
ltrim(s)	去掉s左侧空格   
rtrim(s)	去掉s右侧空格   
trim(s)	去掉s两侧空格  
trim([both] s from str)	去掉str两侧的s  
trim([leading] s from str)	去掉str左侧的s  
trim([trailing] s from str)	去掉str右侧的s  
insert(str,index,len,instr)	str从index位置开始的len个字符替换为instr  
replace(str,a,b)	str中的a全部替换为b  
repeat(s,n)	返回s重复n次的结果  
reverse(s)	反转字符串  
strcmp(s1,s2)	比较s1,s2，字典顺序（a-z） 
-1 表示小于， 0是等于，1是大于  
substring(str,index,len)	str从index位置截取len个字符  
substring_index(str,分隔符,count)	
如果count是正数，那么从左往右数，截取第n个分隔符的左边的全部内容。
例如，substring_index("www.atguigu.com",".",1)是"www"。
如果count是负数，那么从右边开始数，截取第n个分隔符右边的所有内容。  
例如，substring_index("www.atguigu.com",".",-1)是"com"。  

#### 时间函数   
curdate() 或 current_date()	当前系统日期    
curtime() 或 current_time()	当前系统时间    
now() 或 sysdate() 或 current_timestamp() 或 localtime() 或 localtimestamp()	当前系统日期时间    
utc_date() 或 utc_time()	当前UTC日期值/时间值   
unix_timestamp(date)	UNIX时间戳    
year(date)/month(date)/ day(date)/ hour(time)/ minute(time)/ second(time)	取年/月/日/小时/分钟/秒  
extract(type from date)	从日期中提取一部分值   
dayofmonth(date)	一月中第几天  
dayofyear(date)	一年中第几天  
week(date) 或 weekofyear(date)	一年中的第几周  
dayofweek(date)	返回周几，周日是1，周一是2，…周六是7   
weekday(date)	返回周几，周一是0，周二是1，…周日是6  
dayname(date)	返回星期，Monday,Tuesday,…Sunday  
monthname(date)	返回月份，January,…  
datediff(date1,date2)	date1-date2的日期间隔(天数)  
timediff(time1,time2)	time1-time2的时间间隔(时分秒)  
date_add(date,interval expr type)或adddate/date_sub/subdate	返回与给定日期相差interval时间段的日期   
addtime(time,expr)/subtime(time,expr)	返回给定时间加上/减去expr的时间值   
date_format(datetime,fmt)	按照字符串fmt格式化日期datetime值   
time_format(time,fmt)	按照字符串fmt格式化时间time值  
str_to_date(str,fmt)	按照字符串fmt将str解析为一个日期  
get_format(val_type,format_type)	返回日期时间字符串的显示格式  

### 常用加密函数
1. password(str)（MySQL 8 已移除）
2. md5(str)
3. sha(str) / sha2(str, hash_length)

> **补充整理**：原稿 `password)(str)` 多了一个右括号。
>
> **重要**：`MD5()` 和 `SHA1()` 都已被破解，**不能用于存储密码**。
> 密码必须用专门的慢哈希算法（bcrypt、Argon2、PBKDF2），
> 并且**加盐**。这件事应该在**应用层**做，不要指望数据库的加密函数。
> MySQL 提供的这些函数只适合做数据校验、生成摘要（如文件指纹），**不是密码方案**。

### 常用系统信息函数
database()	当前数据库名  
version()	当前数据库版本  
user()	当前登录用户名  

### 条件判断函数
if(a,x,y)	如果a为真，返回x，否则返回y   
ifnull(x,y)	如果x不为空，返回x，否则返回y   
case  
when 条件1 then result1  
when 条件2 then result2   
else resultn   
end	依次判断条件，哪个条件满足了，就返回对应的result,   
所有条件都不满足就返回else的result。如果没有单独的else子句，  
当所有when后面的条件都不满足时则返回NULL  
case 表达式  
when 常量值1 then 值1  
when 常量值2 then 值2  
else 值n  
end	判断表达式与哪个常量值匹配，找到匹配的就返回对应值，都不匹配就返回else的值。  
如果没有单独的else子句，当所有when后面的常量值都不匹配时则返回NULL  
2. 分组函数
分组函数有合并计算过程。 
调用完分组函数后，结果的行数变少，
可能得到一行，可能得到少数几行。
count()统计数量，如果传入的字段有空值不会被记录
max()统计最大值
min()统计最小值
avg()统计平均值
sum()求和
group by 分组

> **补充整理**：`COUNT` 的三种写法区别是面试和实战都常问的——
>
> ```sql
> SELECT COUNT(*)   FROM t;  -- 统计所有行，包括全 NULL 的行（InnoDB 已优化，最快）
> SELECT COUNT(1)   FROM t;  -- 同上
> SELECT COUNT(col) FROM t;  -- 只统计 col 不为 NULL 的行 ← 原稿说的就是这个
> ```
>
> 所以「用 `COUNT(字段)` 统计总人数」是**错的**，字段有 NULL 就会漏统计。
> 统计行数用 `COUNT(*)`，不要用 `COUNT(字段)`。
>
> 其他几个坑：
>
> - **`AVG`、`SUM` 同样忽略 NULL**，分母是「非 NULL 的行数」而不是总行数
> - `SELECT` 里出现的**非聚合字段必须都在 `GROUP BY` 里**，
>   否则 MySQL 会返回一个不确定的值（`ONLY_FULL_GROUP_BY` 模式下直接报错）
> - 对分组结果再过滤要用 **`HAVING`**，不是 `WHERE`
>   （`WHERE` 在分组前过滤行，`HAVING` 在分组后过滤组）：
>   ```sql
>   SELECT dept_id, COUNT(*) AS cnt
>   FROM employee
>   WHERE status = 1              -- 先筛在职员工
>   GROUP BY dept_id
>   HAVING cnt > 10;              -- 再筛人数超 10 的部门
>   ```
3. 窗口函数

### 表的关系

> **补充整理**：原稿「一对多」的定义写错了——它描述的其实是**一对一**。
> 三种关系的正确定义如下，判断方法就是**从两个方向各问一次「能对应几条」**：
>
> | 关系 | 从 A 看 B | 从 B 看 A | 例子 | 怎么建表 |
> | --- | --- | --- | --- | --- |
> | **一对多** | 1 条 A 对应 **多条** B | 1 条 B 对应 **1 条** A | 部门 → 员工 | 在**多的一方**加外键 |
> | **多对多** | 1 条 A 对应 **多条** B | 1 条 B 对应 **多条** A | 学生 ↔ 课程 | 建**中间表**，两个外键 |
> | **一对一** | 1 条 A 对应 **1 条** B | 1 条 B 对应 **1 条** A | 公司 ↔ 注册地址 | 外键 + `UNIQUE` 约束 |
>
> 记忆技巧：看**「多」出现在哪边**——只有一边是「多」就是一对多（外键放多的一方）；
> 两边都是「多」就是多对多（必须中间表）；两边都是「一」就是一对一（加唯一约束）。
> 详见 0805《多表关系设计》。
