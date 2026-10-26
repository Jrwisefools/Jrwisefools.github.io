---
title: "元组与列表"
date: 2025-07-20
tags:
  - Python
  - 基础
archived: true
description: "元组是一个不可变的、有序的元素集合。 不能对元组中的元素进行修改操作。 元组使用 () 定义，数据之间使用,分隔。 元组中每个元素都有对应的位置值，称为索引或下标，索引从起始从0开始向后逐个递…"
---
# Day 5
## 元组
元组是一个不可变的、有序的元素集合。  
不能对元组中的元素进行修改操作。  
元组使用 () 定义，数据之间使用,分隔。  
元组中每个元素都有对应的位置值，称为索引或下标，索引从起始从0开始向后逐个递增，并且从末尾从-1开始逐个向前递减。  
元组中元素可以是不同的类型。  
元组的使用方式与列表类似。
### 1.创建元组
```python
#创建元组
tuple1 = (1,2,3)

#只要一个元素
tuple2 = (4,)
# 注意：() 里放推导式得到的是「生成器表达式」，不是元组
# Python 没有元组推导式，想要元组要用 tuple() 转换
tuple3 = tuple(x for x in range(5, 8))
print(tuple3)   # (5, 6, 7)
```
### 2.访问元组
```python
tuple1 = (1,2,3)
## 使用正向脚标
print(tuple1[1])
## 使用反向脚标
print(tuple1[-1])
#使用切片
print(tuple1[0:1])
```
### 3.遍历元组
```python
tuple4 = (1,2,3)
#for遍历
for item in tuple4:
    print(item)
```
### 4.元组的不可变
不可变类型：int、float、bool、str
可变类型：list、set、dict、类对象

> **补充整理**：上面的"不可变类型"漏了 **元组 tuple**——tuple 和 int/str 一样是不可变的（只是它内部装的**可变元素**还能改，见下方示例）。
> 一句话记：**不可变 = int / float / bool / str / tuple；可变 = list / set / dict / 自定义对象**。
```python
tuple1 = (1,2,3)
print(id(tuple1))
print(tuple1)
#验证不可变
tuple1[0]=11
#上面代码会报错：'tuple' object does not support item assignment
tuple1 = tuple1 + (4,5,6)
print(id(tuple1))
print(tuple1)
#这里是创建了一个新的元组，之后里面加上了4，5，6而不是原来的元组，id不相同
# 元组存储可变类型的元素
tuple2 = (1,2,3,[4,5,6])#元组本身不可变但是里面装的list列表元素可以变
tuple2[3][0] = 44#此时4变为44
```
## 集合
集合是无序的，且不包含重复元素  。
集合使用 {} 定义，数据之间使用 , 分隔，也可以使用set()定义。  
集合没有索引，所以不能通过切片方式访问集合元素。  
集合中元素可以是不同的类型。  
集合可以进行数学上的集合操作，如并集、交集和差集。  
集合适用于需要快速成员检查、消除重复项和集合运算的场景。  
### 创建集合
```python
#创建集合
mySet = {1,2,3}
print(mySet)
mySet2 = set((1,2,3))
print(mySet2)
#创建空集合
# mySet3 = {}====>这是在创建空字典
mySet = set() #这里才是创建集合
print(mySet)
```
### 探讨有序和无序
```python
#探讨有序和无需
#有序：将元素存入到容器中的顺序，存入元素的顺序和取出元素顺序是一致的
#无序：存入元素的顺序和取出元素的顺序不一样
#无序：没有索引
#排序:按照字典顺序(ascii码值）,从小到大或者从大到小

#列表：有序
list1 = [1,3,2]

#集合：无序且去重
set1 = {1,3,2,5,6}
print(set1)#此时输出的是{1,2,3,5,6}
```
### set的常用元素
```python
mySet = {1,2,3}
print(mySet)
mySet.add(4) #添加元素
mySet.update({4,5,6}) #添加元素，x为列表、元组、字符串、字典、集合等
print(mySet)
newSet = mySet.union({4}) #添加元素后返回一个新的集合,x可以为列表、元组、集合
mySet.remove(4) #从集合中移除x，x不存在报错
mySet.discard(7) #从集合中移除x，x不存在也不报错
pop=mySet.pop() #随机取出集合中一个元素，如果集合为空则报错

#set.clear() 清空集合
#set.difference(x1,....)求set1和x1的差集，返回一个新的集合

#求集合的交集并集差集
mySet1 = {1,2,4}
mySet2 = {3,4}
print(mySet1 & mySet2)#交集
print(mySet1 | mySet2)#并集
print(mySet1 - mySet2)#差集
#判断两个集合是否有交集
mySet1.issubset(mySet2)
#判断set1 是否为set2的子集
mySet1.issuperset(mySet2)
mySet1.symmetric_difference(mySet2)#求两个集合中不重复的元素，返回一个新的集合
mySet1.symmetric_difference_update(mySet2)#求两个集合中不重复的元素
#拷贝集合
mySet.copy()
len(mySet)
max(mySet)
min(mySet)
sum(mySet)

```
## 字典
字典是无序的,键值对 的 集合，键是唯一的（不重复，跟元组的元素一样，去重性）  
字典用{}定义（集合用set）,键(key)和值(value)使用：  
字典没有索引  
如果想拿到对应的值可以通过键来获得  
值可以取任何数据类型，但键必须是不可变的，如字符串、数字、元组

> **补充整理**：原稿写"字典是无序的"，这是 **Python 3.6 及以前** 的说法。
> 从 **Python 3.7 起，字典已保证按插入顺序保存**，遍历顺序就是插入顺序，可以放心依赖。
> 另外：键必须是不可变类型，**列表不能当键**（会报 `unhashable type` 错误）。

### 创建字典
```python
#创建空字典
myDict ={}
print(myDict)

myDict= {"name":"张三","age":18,"sex":"男"}
print(myDict)
myDict = dict(name="张三",age=18,sex="男")
myDict = dict([("name","Tom"),("age",22),("sex","男")])
print(myDict)
myDict = {"nums":[1,2,3], "a":4, "b":5, "c":6}  # 键必须是不可变类型，这里用字符串键
```
### 访问字典
用[]访问字典，key不存在会报错
```python
myDict = {"name":"张三","age":18,"sex":"男"}
print(myDict["name"])
print(myDict["address"])#此时会报错
print("有家" if myDict.get("address") else "无家可归")
print(myDict.get("address","无家可归"))
```
### 添加元素
```python
#向字典中添加元素
myDict = {"name":"张三","age":18,"sex":"男"}
#添加键值对
myDict["address"]="地球"
print(myDict)
#修改键值对
myDict["address"]="火星"
print(myDict)
#检查成员是否为字典中的key
print("name" in myDict)
#获取长度
```
### 字典的遍历
```python

myInfo = {"name":"张三","age":18,"sex":"男"}
#遍历key
keys = myInfo.keys()
for key in keys:
    print(key)
#遍历value
values = myInfo.values()
for value in values:
    print(value)
#通过key遍历value
keys = myInfo.keys()
for key in keys:
    print(f"{key}={myInfo[key]}")
#k-v遍历

```
### 删除字典中的元素
```python
myInfo = {"name":"张三","age":18,"sex":"男"}
#删除元素
del myInfo["sex"]

print(myInfo)
#清空字典
myInfo.clear()
#删除字典
del myInfo#直接把字典给删除
```
### 常用函数
```python
myInfo = {"name":"张三","age":18,"sex":"男"}
#pop,获取并删除并获取
lastKV = myInfo.popitem()#获取最后的键值对并删除
#更新
myInfo2 = {"city": "北京"}  # update 接收的是字典
myInfo.update(myInfo2)
#get
myInfo.get("name")
#以seq中元素座位字典中key创建一个新字典，可以设置value的值
#seq只能存储不可变类型的数据：数值(int、float、bool)、字符串、元组
```
### 列表、元组、字典、集合、字符串区别
![img_2.png](/images/python/img_2.png)

## 函数
函数是带名字的代码块，可以重复使用，使程序的编写更容易  
python中函数必须先定义后使用
自定义函数  
### 定义函数
使用def关键字
```python
def 函数名re(形式参数列表):
    """文档注释"""#这里可以选择性的用文档注释
    "函数体"#功能代码
    return #返回，可以不写返回None
```
函数名满足规范小驼峰  
参数，需要一些数据
函数体。功能代码
```python
#定义函数
def myPrint():#小驼峰规范
    for i in range(2):
        print("*"*3)
#告诉解释器有这样一个函数可以用，得先定义再使用
        
#使用函数
myPrint()
myPrint()
```
使用函数使程序变得更简短清晰，提高程序的开发性，提高代码复用，便于分工协作，便于代码击中管理，有利于程序维护
### 函数参数的抽取
```python
#定义函数：打印两行三列
def myPrint(row,col):
    for row in range(row):
        print("*"*col)
```
### 形参和实参
在定义函数的时候，指定的函数称为形式参数（形参）   
在调用函数的时候，指定的函数称为实际参数（实参）  
形参没有分配存储空间，也没有值，详单与一个占位符  
在调用的时候分配存储空间，传递的是实际参数   
当函数执行结束的时候，函数所占的栈空间被释放，形参和局部变量也会被释放   

### 函数的参数传递
在python中，类型属于对象，变量是没有类型的  
变量和类型是分开存储的，变量通过地址来引用数据
注意：变量已被定义，当给一个变量赋值的时候，本质上是修改了数据的引用  

### 可变的不可变
不可变类型 a = 500 后再赋值 a = 1000 ，这里其实是新生成了一个int值对象，不是改变了a，而是新生成了a  
可变类型la = [1,2,3] 后再赋值 la[2] = 5,这里本身la没有动，只是修改了la[2]  

### 参数传递
#### 传递可变参数类型
![img_4.png](/images/python/img_4.png)
![img_6.png](/images/python/img_6.png)
#### 传递不可变参数类型：int、float、bool、str、tuple
![img_5.png](/images/python/img_5.png)

### 函数可用参数形式
#### 必须参数
位置是必须的，根据位置来传递参数
```python
def func(a,b,c):
    print(a,b,c)
func(1,2,3)
```

#### 关键字参数
```python
def func(a,b,c):
    print(a,b,c)
func(a=1,c=2,b=3)
```
#### 默认值参数
```python
def func(a,b,c = 33):
    print(a,b,c)
func(a=1,b=2,c=3)#可以没有c，即输出c为33，但是不能没有ab，没有默认值会报错
```
注意：默认值参数必须在非默认参数的后面，不然会报错

#### 不定长的参数
一个星号 * 会以元组的形式传
参数的个数是不确定的
```python
def func(a,b,*args):
    print(f"a={a},b={b},args={args}")
func(1,2)#可以不传
func(1,2,3,4)#元组(3,4)
```
注意事项：如果args后面有参数必须通过关键字传递
```python
def func(a,b,*args,c,d):
    print(f"a={a},b={b},args={args},c={c},d={d}")
func(1,2,3,4,c=5,d=5)
```
此时若不想给args传递全部用关键字传参

#### 可变长参数
加了两个星号**参数会以字典的形式导入，也就是关键字的形式  
其后面不能再有参数
```python
def func(a,b,**args):
    print(f"{a},{b},{args}")
func(1, 2, c=3,d=4)
```

### 解包传参
若函数形参是定长参数，可以通过*对列表、元组，**对字典解包传参
```python
# *对列表元组进行解包
def func(a,b,c):
    print(a,b,c)
list1 =[1,2,3]
func(*list1)
dict1 = {"a":1,"b":2,"c":3}#注意：字典中key的名称必须和形参的名称一致
func(**dict1)
```
### 强制使用位置参数或者关键字参数
/前的参数必须用位置参数，*后的参数必须用关键字参数
```python
def func1(a,b,c,d):
    print(a,b,c,d)
func1(1,2,c=3,d=4)#没有规定哪里用什么参数

def func2(a,b,/,*,c,d):
    print(a,b,c,d)
func2(1,2,c=3,d=4)#强制了a，b位置，c，d关键字
```
### 防止函数修改列表
列表为可变，地址的同一个地址，内容可以不同
有时候想让函数对列表处理，但是不想修改原来的列表
思路：可以使用深拷贝产生新的列表

```python
import copy

def changeList(myList):
    myList[0] = 11
    print(myList)

list1 = [1, 2, 3]
print(list1)
newList = copy.deepcopy(list1)
changeList(newList)
print(list1)#此时源列表就没有发生变化
```
### 函数说明文档
对函数的功能进行说明
```python
def changeUserInfo(name,age,sex):
    """
    :param name: 用户姓名，字符串类型
    :param age: 用户年龄，整数类型
    :param sex: 用户性别，字符串类型，如"男"/"女"
    :return: 无返回值
    """
    print(f"name={name},age={age},sex={sex}")
changeUserInfo(name="张三",age=18,sex="男")
```
