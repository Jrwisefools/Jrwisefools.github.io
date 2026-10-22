---
title: "用户组管理与文件权限"
date: 2025-08-01
tags:
  - Linux
archived: true
description: "每个用户都有一个组 新建组:groupadd xtqj 删除组：groupdel xtqj 修改组：groupmod -n xtqj2 xtqj 给小新加入新的组 ：usermod -g 新组名 用户…"
---
# Day 13
### 用户组管理命令
每个用户都有一个组
新建组:groupadd xtqj
删除组：groupdel xtqj
修改组：groupmod -n xtqj2 xtqj
给小新加入新的组 ：usermod -g 新组名 用户名
useradd -g xtqj xiaoxin
cat /etc/group

> **补充整理**：原稿只列了组命令，这里把**用户管理**补齐（两者是一套）。
>
> ```shell
> useradd -m -s /bin/bash xiaoxin   # 建用户，同时建家目录、指定 shell
> passwd xiaoxin                    # 设密码（不设密码该用户无法登录）
> userdel -r xiaoxin                # 删用户，-r 同时删家目录
> id xiaoxin                        # 看 uid/gid/所属组
> groups xiaoxin                    # 看属于哪些组
> usermod -aG sudo xiaoxin          # 加入 sudo 组（获得管理员权限）
> ```
>
> 几个关键点：
>
> - **`-g` 和 `-G` 的区别**：`-g` 改**主组**，`-G` 改**附加组**。
>   加组必须用 `usermod -aG`（`-a` 是 append），**直接写 `-G` 会覆盖掉原有的附加组**，
>   这是把人从 sudo 组踢出去的经典事故
> - 建用户务必加 **`-m`**，否则没有家目录，登录后各种配置都写不了
> - 相关文件：`/etc/passwd`（用户）、`/etc/shadow`（密码，只有 root 能读）、`/etc/group`（组）
>
> ### su 与 sudo
>
> | 命令 | 效果 | 需要谁的密码 |
> | --- | --- | --- |
> | `su root` | 切到 root 用户 | **root 的密码** |
> | `sudo 命令` | 以 root 身份执行**一条**命令 | **自己的密码** |
> | `sudo -i` | 切换到 root 环境 | 自己的密码 |
>
> **生产环境一律用 `sudo`，不要用 `su root`，更不要长期以 root 登录**——
> sudo 会留下操作日志，且只在这一条命令上提权，误操作面小得多。

## 文件权限类（重点）
### 文件属性
linux是一种典型的多用户系统,不同角色权限不一样  
通过ll来查看不同文件的权限
d rwx r-x r-x  root     root
0 123 456 789  文件主人  文件组
0：d 文件类型，有d， - ，l
123：rwx 属主文件 r：读 w：写 x：执行
456：r-x 属组文件
789：r-x other其他用户权限
说明：删除文件的前提是对该文件所在目录有写权限，才能删除该文件

### 改变权限——chmod
ll 指令查看权限
(1) chmod [ugoa]{+-=}{rwx}]文件和目录
u:user   g:group   o:other   a:all
全字母方式
(2) chmod [mod=421][文件或目录]
读:4 写:2 执行:1
rwx = 7

例如：
chmod u+x 文件名
chmod 765 文件名
7->用户 6->组 5->其他用户
chmod -R 777 test
当前目录下所有文件给所有人所有权限

> **补充整理**：数字权限怎么算——**r=4、w=2、x=1，相加即可**：
>
> | 数字 | 权限 | 含义 |
> | --- | --- | --- |
> | 7 | rwx | 读 + 写 + 执行（**最高**） |
> | 6 | rw- | 读 + 写 |
> | 5 | r-x | 读 + 执行 |
> | 4 | r-- | 只读 |
> | 0 | --- | 无权限 |
>
> 所以 `chmod 765` = 属主 rwx(7)、属组 rw-(6)、其他 r-x(5)。
> 最常用的两个：**`644`**（文件：自己能改，别人只读）和 **`755`**（目录/脚本：别人能读能执行）。
>
> **文件与目录的 x 权限含义不同**，这点特别容易混：
>
> | 权限 | 对文件 | 对目录 |
> | --- | --- | --- |
> | r | 能读内容 | 能 `ls` 列出内容 |
> | w | 能改内容 | 能**新建/删除**目录内的文件 |
> | x | 能当程序执行 | 能 `cd` 进入该目录 |
>
> 这解释了原稿那句重要结论：**删文件的权限在"所在目录"上，不在文件本身**——
> 只要对目录有 w 权限，即便文件是别人的、自己只读，也能删掉它。
>
> **关于 `chmod 777`**：它是「所有人可读写执行」，等于完全放开。
> 临时调试可以，但**不要用在生产环境**，尤其是 Web 目录——
> 那意味着任何进程都能篡改你的代码。需要放开时也应精确到具体用户/组，
> 而不是图省事给 777。

### 改变所有者——chown
chown[选项][最终用户][文件或者目录]
-R递归改

### 修改所有组——chgrp
chgrp[选项][最终用户组][文件或者目录]
选项 -R 递归

## 搜索查找类
### find 查找文件或者目录

find [搜索范围] [选项]
-name 按指定文件名查找
find ./ -name "*.txt"
-user 按所有者查找
-size 按大小查找，默认单位是块（512 字节）
find ./ -size "39c"        # c 表示字节，正好 39 字节
find ./ -size "+39c"       # 大于 39 字节的

> **补充整理**：原稿有 3 处笔误——
> `fin` 应为 **`find`**；「安装指定文件名称找」应为「**按**指定文件名查找」；
> 「安装所以者来找」应为「按**所有者**查找」。
>
> `-size` 的单位必须写，容易记混：
>
> | 后缀 | 单位 |
> | --- | --- |
> | `c` | 字节 |
> | `k` | KB |
> | `M` | MB |
> | `G` | GB |
> | 不写 | 块（512 字节），基本没人用 |
>
> 几个高频组合：
>
> ```shell
> find /var/log -name "*.log" -mtime +7      # 7 天前修改过的日志
> find . -type f -size +100M                 # 找大于 100M 的文件（磁盘满时排查神器）
> find /home -user xiaoxin                   # 找某个用户的文件
> find . -name "*.log" -delete               # 找到并删除（先不加 -delete 看一遍！）
> ```
>
> **安全提醒**：`find ... -delete` 和 `find ... -exec rm {} \;` 一定要
> **先不加删除动作跑一遍**确认匹配范围，误删的代价很高。

### grep 与 “|”管道符

|:上一条指令的结果给下一个指令
grep 过滤出指定内容
-n 行号

```shell
find ./ -size "+39c" | grep "hello" -n
ps aux | grep nginx                  # 查进程
cat app.log | grep -i "error"        # -i 忽略大小写
grep -rn "TODO" ./src                # -r 递归目录，-n 显示行号
```

> **补充整理**：原稿写的 `grep *hello* -n` 是**错的**——
> `*` 在 grep 里不是通配符（那是 shell 文件名通配），
> grep 用的是**正则表达式**。匹配包含 hello 的行要写成 `grep "hello"`。
> 而且裸写的 `*hello*` 会被 shell 先展开成当前目录的文件名，结果完全不可控。
>
> grep 最常用的几个参数：
>
> | 参数 | 作用 |
> | --- | --- |
> | `-i` | 忽略大小写 |
> | `-n` | 显示行号 |
> | `-r` | 递归搜索目录 |
> | `-v` | **反向**匹配（排除） |
> | `-E` | 启用扩展正则（可用 `|` 表示或） |
> | `-c` | 只统计匹配行数 |
>
> 排查日志最常用的组合：`grep -iE "error|fail|exception" app.log`

## 压缩和解压
tar.gz 常用格式
### tar 
注意：打包只有.tar文件，压缩才有.gz
tar [选项] XXX.tar.gz
-c 产生 .tar打包文件
-v 显示详细信息
-f 指定压缩或解压的文件名
-z 打包同时压缩
-x 解包.tar文件
打包压缩 ：tar -zcvf 压缩后文件名称 被压缩文件名1 被压缩文件名2
compress 打包
例：tar -zcvf abc.tar.gz a.txt b.txt c.txt
    tar -zcvf test.tar.gz test2
### 解压 extract
tar -zxvf abc.tar.gz

## 磁盘类(了解)
### df 查看磁盘使用情况
df -m 查看
df -h 更好看
### du 查看磁盘使用空间
du -a 当前目录
## 网络类
### ifconfig
apt install net-tools
### ping
ping ip地址
### 修改主机名
hostname 查看当前主机名
编辑 /etc/hostname
之后重启虚拟机

> **补充整理**：原稿两处需要修正——
> `ip -a` 是错的，正确写法是 **`ip a`** 或 `ip addr`；
> 「编辑 etc/hostname」少了开头的斜杠，应为 **`/etc/hostname`**。
>
> 现状建议：**别再装 `net-tools`，直接用 `ip` 命令**——
> `ifconfig` 属于已被弃用的老工具，新系统默认不装。
>
> ```shell
> ip a                    # 查看网卡与 IP（替代 ifconfig）
> ip route                # 查看路由表（替代 route -n）
> ss -lntp                # 查看监听端口（替代 netstat，比它快很多）
> ```
>
> 排错三件套（服务起不来时按顺序查）：
>
> 1. `ss -lntp | grep 8080` —— 端口到底有没有被监听
> 2. `ping 目标IP` —— 网络通不通
> 3. `curl 目标IP:端口` —— 端口能连上（ping 通不代表端口通）

## 进程线程类
### ps
ps aux 查看所有进程
ps -ef  可以看得到父进程
ps -ef | grep vim
过滤更好找

### kill终止进程
kill[选项]选项号
kill id
killall 进程名称

kill -9 强制杀

### free查看服务器总体内存
free 
free -m（单位变成M）
free -h（有单位）

### top 查看系统状态
与ps一样
但是默认每隔3秒会刷新进程状态，实时关注
top -d 指定几秒更新

### netstat 显示网络信息和端口占用情况
-n 拒绝显示别名，直接显示数字
-p 仅列出监听的服务状态
-l 表示哪个进程在被调用
-lnput u：查看utp
        t：查看tcp的
netstat -lnput |grep ssh 根据ssh过滤
## 路径类（了解）
### basename
basename[string/pathname][suffix]
获取整个路径的文件名称
suffix为后缀，如果后缀被制定了也会去掉
basename /test/a.txt .txt
会把.txt去掉

dirname 文件绝对路径
拿的是目录的路径
dirname /test/a.txt

## crontab 系统定时任务
### crontab 服务管理
得保证定时任务的服务开启
sysytemctl restart cron
sysytemctl status cron

### crontab 定时任务设置
crontab[选项]
先-e 进入编辑模式
-e 编辑crontab定时任务,edit
-l 查询crontab任务
-r 

（1）*****执行的任务 *的含义
第一个"*" -->分钟  0-59
第二个"*" -->小时  0-23
第三个"*" -->  天  1-31
第四个"*" -->  月  1-12
第五个"*" -->星期   0-7（0和7都是周日）
注意星期和天数会有冲突

（2）特殊符号
"*"  每分钟执行一次
","  代表不联系的时间
"-"  代表代表连续时间范围
"/n" 代表间隔，*/10每隔十分钟

![img_1.png](/images/linux-mysql/img_1.png)

# Shell 概述
shell是一个命令行解释器
外层应用程序->shell->linux内核->硬件
Ubuntu 默认的解释器是bash
/bin/bash
通过
echo $SHELL 来查看监视器

## shell脚本文件
```
#!/bin/bash --->固定内容

echo "hello shell"
```
vim hello.sh  
#!/bin/bash  
echo "helloword"  
sh ./hell.sh  
bash ./hell.sh  
sh 和 bash都可以执行.sh文件  
不需要脚本文件有可执行文件  
若想直接执行 ./hello.sh ,  
这样权限不够,得先chmod 更改权限  
之后再./hello.sh

### 变量
#### 系统预定义变量
PATH、HOME、PWD、SHELL、USER

```shell
echo $PATH
打印可执行文件的目录
```
```shell
echo $HOME
echo $PWD
echo $SHELL
echo $USER
```
基本语法
1. 定义变量：变量名=变量值
2. 撤销变量：unset 变量名
3. 声明静态：readonly 变量，（不能重新赋值，不能unset）

变量定义规则
（1）变量名称可以由字母、数字和下划线组成，但是不能以数字开头，环境变量名建议大写。
（2）等号两侧不能有空格。
（3）在bash中，变量默认类型都是字符串类型，无法直接进行数值运算。
（4）变量的值如果有空格，需要使用双引号或单引号括起来。
（5）最右侧分号可有可无，一般都不写
#### 自定义变量
```shell
num=5
echo $num
num=6
echo $num
unset $num
echo $num
readonly $num
#只读变量，无法重写赋值
str="i love you"
echo str
```
expoet B ---->把B提升成全局变量
之后再新增sh文件就可以调用B

#### 特殊变量
1. $n 
$0 脚本名称, $9代表脚本参数,
十以上的参数用${10}
2. $#
获取所有输入参数的个数
常用于循环
3. $* 、 $@
拿所有参数
$* 所有参数看作一个整体
$@ 每个参数区分开来
4. $?
判断上一个指令是否正确执行，
正常执行是     0
不正常执行就是 非0
注意：shell 里面空是1，非空为0

### 算数运算
基本语法：
$((运算式)) 或 $[运算式]
shell默认是字符串
```shell
num=$[(1+1)*2]
num3=$((1+1))
echo $num
echo $num3
```
### 条件判断
1. test 条件
2. [ 条件 ]注意：条件前后要有空格
注意条件成立是0,条件不成立是1
```shell
test atguigu
#这里返回的是0，因为非空为真返回0
#[  ]返回1，[ "" ]返回1
```
1）两整数之间比较
-eq 等于（equal）	    -ne 不等于（not equal）
-lt 小于（less than）	-le 小于等于（less equal）
-gt 大于（greater than）  -ge 大于等于（greater equal）	

2）按照文件权限进行判断
-r 有读的权限（read）	
-w 有写的权限（write）
-x 有执行的权限（execute）

3）按照文件类型进行判断
-e 文件存在（existence）
-f 文件存在并且是一个常规的文件（file）
-d 文件存在并且是一个目录（directory）

4）多条件判断
（&& 表示前一条命令执行成功时， 才执行后一条命令，
|| 表示上一条命令执行失败后，才执行下一条命令）

### 流程语句
1. 单分支
```shell
if [ 条件表达式 ]
then
    程序
fi 
```
2. 多分支
```shell
if [ 条件表达式 ]
then
    程序
elif [ 条件表达式 ]
then
    程序
else
    程序
fi 
```
### case 语句
```shell
case $变量值 in
值1）
    如果变量的值等于1，执行程序1
;;
值2）
    如果变量的值等于2，执行程序2
;;
*)
    如果没有匹配到,执行改程序
esac
```

### for循环
```shell
for ((初始值;循环控制条件;变量变化)) 
do 
    程序 
done
```
```shell
for 变量 in 值1 值2 值3… 
do 
    程序 
done
```
### while循环
```shell
while [ 条件判断式 ] 
do 
    程序
done
```
### read命令
作用读取终端输入到指定变量中
read （选项）（参数）
-p：提示语句
-t：指定读取值时的等待时间
参数: 输入的数据给参数

### 函数
区别shell命令和shell函数
shell函数是自己定义的代码块

#### 定义函数

```shell
funname()
{
  Action;
  [return int;]
}
```
函数返回值只能通过$?系统变量获得
如果不加return 会以最后一条命令运行结果来返回
