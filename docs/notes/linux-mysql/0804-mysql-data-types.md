---
title: "MySQL 数据类型"
date: 2025-08-04
tags:
  - MySQL
  - 数据库
archived: true
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
rand(x,y)x的小数保留y位小数（四舍五入）
truncate(x,y)x的小数保留y位小数(之间截断)
format(x,y)x的小数保留y位小数（四舍五入）,整数部分超过三位以逗号分开
sqpt(x) x的平方根
pow(x,y) x的y次方

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
1. password)(str)(Mysql8不再支持)
2. md5(str)
3. sha(str)

### 常用系统信息函数
database()	当前数据库名  
version()	当前数据库版本  
user()	当前登录用户名  

### 条件判断函数
if(a,x,y)	如果a为真，返回x，否则返回y   
ifnull(x,y)	如果x不为空，8返回x，否则返回y   
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
count()统计数量，如果传入的字段他空值不会被记录
max()统计最大值
min()统计最小值
avg()统计平均值
sum()求和
group by 分组
3. 窗口函数

### 表的关系
一对多
表A中的一条记录对象表中的一条记录；
同时表B中的一条记录对应表A中的一条记录。
多对多
表A中的一条记录可以确定表B中的多条记录，
表B中的一条记录可以确定表A中的多条记录。
一对一
表A与表B一一对应
