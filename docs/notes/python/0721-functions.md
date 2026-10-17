---
title: "函数与返回值"
date: 2025-07-21
tags:
  - Python
  - 基础
archived: true
description: "def reduce(): pass开发中，有时候希望一个函数执行结束后，告诉调用者一个结果，以便调用者针对具体的结果做后续的处理。返回值就是函数完成工作后，给调用者的一个结果 1. 在函数中使用 r…"
---
def reduce():
    pass开发中，有时候希望一个函数执行结束后，告诉调用者一个结果，以便调用者针对具体的结果做后续的处理。返回值就是函数完成工作后，给调用者的一个结果      
1. 在函数中使用 return 关键字可以返回结果 ，并结束正在执行的函数    
2. 如果return后面跟[表达式]，在结束函数的同时向调用方返回一个表达式。   
3. 如果仅仅是return关键字，后面没有加内容，函数执行返回调用方None。   
4. 调用函数一方，可以使用变量来接收函数的返回结果   
```python
"""
函数的返回值
"""
def sum(num1, num2):
    sum = num1 +num2
    return sum

num1 = 1
num2 = 2
result = sum(num1,num2)
print(result ** 2)

def func():
    print("func执行了")
    #return #返回结果是None
    #函数中没有return，默认返回结果为None
result = func()
print(result)
```
return可以返回多个值  
### 函数的嵌套使用
在一个函数里面调用另一个函数，当内层函数调用结束之后才会调用外层函数
```python
def funcA():
    print("funcaA执行前····")
    print("funcaA执行中···")
    print("funcaA执行后····")
def funcB():
    print("函数 B 开始执行")
    print("函数 B 执行中...")
    funcA()
    print("函数 B 执行中...")
    print("函数 B 结束执行")
funcB()
```
### 变量的作用域
L （Local） 局部作用域（方法中）  
E （Enclosing）嵌套作用域 闭包函数外的函数中(嵌套方法中)  
G （Global） 全局作用域（作用于方法外）  
B （Built-in） 内建作用域（python内置的）  
先找局部再找嵌套，再去闭包找，再去全局找找不到再去内建
```python
globalNum = 1 #全局变量
#闭包函数
def outer()
    #嵌套作用域
    enclosingNum = 2
    def innter():
        #局部作用域
        localNum = 3
        print("局部作用域：",localNum)
        print("嵌套作用域：",enclosingNum)
        print("局部作用域：",globalNum)
    return innter()#outer方法执行之后的结果，inner方法
#调用outer方法
result = outer()
result()        
```
#### 模块
py文件就是一个模块，类，函数==>只有这三个地方可以映入新的作用域
除了其他代码块(如if/elif/else，for,while,try)不会引入新的作用域， 
这四个里面的变量其他位置也可以直接引用
```python
def func():
    num = 250
    print(num)
#print(num)#这里会报错，方法内局部作用不能引用

if True:
    num = 250
    print(num)#方法外所以可以引用
print(num)
```
### 全局变量和局部变量
函数外的用于全局作用域，局部变量只能在其被声明的局部作用域使用  
全局作用域在局部里面也能访问，全局里不能访问局部

### global关键字:指定使用全局变量
1. 使用global修改全局变量
```python
def changeInt():
    # num = 250
    #指定修改全局变量num
    global num
    num = 250

#定义全局变量
num = 1
print(num)
changeInt()
print(num)#使用global就会变成250
```
### nonlocal关键字
2. nonlocal 用内部作用域修改外部作用域
不适用局部变量
```python
def outer():
    num = 1 #嵌套变量
    def inner():
        nonlocal num#使用嵌套变量
        num = 250 #局部变量 -> 嵌套变量，后续在嵌套作用域里面num就会变成250
    #执行inner方法
    inner()
    print(num)#嵌套变量
outer()
```
```python
num2 = 0
num2 += 1#这里没有定义num2所以或报错，得先定义num2的初始值
#同理定义在函数里也是一样的，单在函数中执行之前必须在函数中定义局部变量num并给初值
#函数里相当于一个新的作用域，在这个新的里面没有用这个关键字所以报错

```
## 递归
递归就是调用函数体中又调用函数本身  
递归是一种逻辑思维，将大的工作分成小工作
```python
#使用递归
def fn(n):
    if n <= 1:
        return 1
    sum = n * fn(n-1)
    return sum
sum = fn(5)
print(sum)
```
## 匿名函数
python 使用lambda来定义匿名函数
lambda 参数列表:表达式
如果你的函数很简单，只有一行代码，就可以用lambda

```python
# def sum(num1,num2):
#     return num1+num2
# def sub(num1,num2):
#     return num1-num2
# def mult(num1,num2):
#     return num1*num2
# def div(num1,num2):
#     return num1/num2
# print("....")

def func(x,y,operate):
    """
    :param x:参与运算的第一个数
    :param y:参与运算的第二个数
    :param operate:四个方法中的一个
    :return:元之后的结果
    """
    return operate(x,y)
#对传统进行简化
print(func(1,2,lambda num1,num2:num1 + num2))
print(func(1,2,lambda num1,num2:num1 - num2))
print(func(1,2,lambda num1,num2:num1 * num2))
print(func(1,2,lambda num1,num2:num1 / num2))
```
![img_1.png](/images/python/img_1.png)
 

### 匿名函数作为内置函数

#### sorted函数：排序
```python
list1 = [1,3,2,5,4]

sorted(list1,key=lambda x :x)#x为正序，-x是倒序，0是原样输出
```

#### map函数
对列表的元素进行统一处理
```python
list1 = [1, 2, 3, 4, 5]
result = map(lambda x: x * 2, list1)
print(list(result))
```
### filter(过滤)
拿到列表中符合条件的
```python
list1 = [1, 2, 3, 4, 5]
result = filter(lambda x : x % 2 == 0,list1)
print(list(result))
```
### refuce(累积)
可以是加减乘除
```python
list1 = [1, 2, 3, 4, 5]
from functools import reduce

reduce(lambda x, y : x + y,list1)
```
### 函数的注释(了解)
```python
def dog1(name,age,species):
    return (name,age,species)

#注释函数

```
## 第七章 文件操作
文件系统通过文件名和文件路径优化  
文件路径可以是绝对路径(从文件系统的盘符来定位管理文件)，或相对路径(相当于当前)
1. 相对路径：层级目路比较简答使用操作./、(/可以省略)
2. ,上级目录，**/上上目录
2. 绝对路径

### 文件的打开与关闭
1.open()打开或者创建文件、   
r	读写方式：只读，文件若不存在会报错。默认此模式   
w	读写方式：写入，写入前清空原有数据。文件不存在会创建文件   
a	读写方式：追加写入，在原有数据后追加，文件不存在会创建文件   
x	读写方式：创建新文件并写入，文件若已存在会报错   
b	编码方式：以二进制打开。一般用于非文本文件如图片等   
t	编码方式：以文本模式打开，默认此模式  
+能读能写
### 关闭文件
f.close
```python
#以读的模式打开
file = open('./a.txt',"r")#可以用绝对路径，不给参数默认读的模式
file.close()
#现在这个模式只能写字符串（文本模式），后面加b就是以二进制模式打开
```

### 文件的读写
#### 写数据
write
用于向文件中写入指定的字符串
字符串先写入缓冲区，再由缓冲区到a.txt
```python
#向a.txt中写入helloword
#w:是write，t是text默认可以不写t
file = open("a.txt","wt")
#将helloword写入缓冲区，当缓冲区刷新，才会将”helloword“写入到程序
file.write("hello word!")
# while True:pass#验证程序一种没结束就不会写入
file.close()#关闭文件，刷新缓冲区
```
#### 读数据
read
read([size])可以从文件中读取数据，size表示要从文件读取数据的长度
```python
#打开文件
#t是文本文件，也可以用b，文本文档读出来还是二进制即为字节"rb"
file  = open("a.txt","rt")#只读文本模式
#read不传递参数，一次性读取所有数据
# content = file.read()
content = file.read(1)#读取1个字符，按照指定数字读字符
#读的过程中得判断也没有到末尾
while content:#判断是否到达文件末尾
# Fales:None、0、0.0、空字符串、空容器
    print(content,end="")
    content = file.read(1)#不为空就再度一个

file.close()

```
readline 读一行
```python
file = open("a.txt",'rt')
content  = file.readline()
while content:
    print(content,end="")
    content = file.readline()#若这里加数字就跟read一样只读一个字符
    print(content)
```
readlines 读取所有行
```python
file = open("a.txt","rt")
content = file.readlines()
```
### 递归遍历当前路径下所有的目录和文件

```python
import os

for root,dirs,files in os.walk("./a")#a是文件夹，当前目录下的a目录
    #root:所有的路径
    #dirs:所有的目录
    #files:所有的文件
    print(root,dirs,files)
#可以把指定目录下的所有文件的路径，目录文件全读出来
```
### 案例文件拷贝
```python
#拷贝文件a.mp4
#注意事项：bytes = srcFile.read()一次性将所有的字节数据存入到内存bytes中

#打开文件：rb
#打开文件（源文件）
srcFile = open("a.mp4","rb")

#读取数据
bytes = srcFile.read()#拿到所有字节文件
#打开文件（目标文件）
destFile = open("copy.mp4","wb")
#写入数据
destFile.write(bytes)
srcFile.close()
```
解决方案：一次只读规定长度(1024/8192)的数据
```python
#打开文件（源文件）
srcFile = open("a.mp4","rb")
bytes = srcFile.read(1024)
#打开文件（目标文件）
destFile = open("copy.mp4","wb")
while bytes:
#读取数据
    bytes = srcFile.read(1024)#拿到所有字节文件
#写入数据
    destFile.write(bytes)
srcFile.close()
```
---
## 面向对象
### 面向过程和面向对象
python是混合型，有面向对象，面向过程还有面向函数  
面向过程：主要关注解决问题的步骤，所有步骤字节做  
面向对象：以对象为中心  
```python
"""
面向过程：所有的步骤都是亲历亲为
需求：吃菠菜
1.买菠菜 2、洗菠菜 3、切菠菜 4、炒菠菜 5、装盘 6、开吃
"""
def buyBoCai():
    print("买菠菜")
def washBoCai():
    print("洗菠菜")
def cutBoCai():
    print("切菠菜")
def zhuangBoCai():
    print("装盘")
def chiBocai():
    print("吃")
```
```python
"""
面向对象：指挥对象做事情
需求：吃菠菜
1.买菠菜 2、洗菠菜 3、切菠菜 4、炒菠菜 5、装盘 6、开吃
"""
class Chef:
    """
    厨子类
    """
    def buyBoCai(self):
        print("买菠菜")
    def washBoCai(self):
        print("洗菠菜")
    def cutBoCai(self):
        print("切菠菜")
    def zhuangBoCai(self):
        print("装盘")
    def songBoCai(self):
        print("送菜")
    def zuocai(self):
        self.buyBoCai()
        self.washBoCai()
        self.cutBoCai()
        self.zhuangBoCai()
class Waiter:
    def songBoCai(self):
        print("送菜")
#1.指挥厨子
chuzi = Chef()
chuzi.zuocai()
waiter = Waiter()
waiter.songBoCai()
#2.吃
def eat():
    print("吃")
```
### 类和对象
类指的是一类对象共同属性或抽象表现形式  
对象是一类的具体实现   

#### 类
类描述了所创建的对象的共同属性（是什么）和方法（能做什么），属性和方法统称为类的成员   
1. 类是大量对象共性的抽象   
2. 类是创建对象的模板   
3. 类是客观事物在人脑中的主观反应   

#### 对象
1. 在自然界中，只要是客观存在的事物都是对象
2. 类是抽象的，对象是类的实例（instance）,是具体的（is instance：判断数据是否是指定类型）
3. 一个对象有自己的状态（属性/名词）、行为（方法/动词）和唯一标识（本质上指内存中所创建的对象）

### 定义类
class 类名： ->大驼峰规范
    “”“类说明文档”“”
    类体（属性和方法）

```python
class Person:#有类就一定有对象，
    pass
    #类属性
    home = "地球"#属性（名词）
    def eat(self):#Method must have a first parameter, usually called 'self'
        #self就是当前类的当前对象->self有很多对象谁调用就是谁
        print("eat....")
        #方法（动词）
    #不管是类还是方法统称为成员
```
