---
title: "用户组管理与文件权限"
date: 2025-08-01
tags:
  - Linux
archived: true
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

### 改变所有者——chown
chown[选项][最终用户][文件或者目录]
-R递归改

### 修改所有组——chgrp
chgrp[选项][最终用户组][文件或者目录]
选项 -R 递归

## 搜索查找类
### find 查找文件或者目录

fin[搜索范围][选项]
-name安装指定文件名称找
find ./ -name "*.txt"
-user 安装所以者来找
-size 默认单位是块
find ./ -size "39c"
find ./ -size "+39c"大于39字节的

### grep 与 “|”管道符

find ./ -size "+39c" | grep *hello* -n
|:上一条指令的结果给下一个指令
grep 过滤出指定内容
-n 行号

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
或者ip -a
### ping
ping ip地址
### 修改主机名
hostname 查看当前主机名
编辑etc/hostname
之后重启虚拟机

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
