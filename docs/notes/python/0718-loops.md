---
title: "流程控制：while 与 for 循环"
date: 2025-07-18
tags:
  - Python
  - 基础
archived: true
description: "当表达式成立的时候进行循环，条件不成立才跳出循环 else当循环正常结束的时候才执行"
---
# DAY 4
## 4.3.1 循环
### 1.while
```
while 表达式:
      语句
```
当表达式成立的时候进行循环，条件不成立才跳出循环
### 2. while else（了解）  
else当循环正常结束的时候才执行
```python
#需求：键盘录入一个数，判断1~该数范围内，也没有偶数
num1 = int(input("请输入一个数字："))
i = 1
flag = False #标记是否有偶数!
while i < num1:
    print(f"i={i}")
    if i % 2 ==0:
        #有偶数
        #print("偶数")#100行
        flag = True
        break#强制退出
    i += 1
else:
    # print("奇数")#100行
    flag = False
    #这里可以直接不写else,因为默认就是奇数
    
#获取/处理结果（这样可以降低耦合度,让判断是判断，结果是结果）
print("偶数" if flag else "奇数") #三目运算符
print("end")
```

### 3.for循环
遍历可迭代的对象
for是关键字，可迭代对象是要遍历的序列，首先判断是否有一个元素可以获取  

```python
"""
for 临时变量 in 可迭代对象
    语句

"""
#定义列表：[1,10] (遍历列表)
list1 = [1,2,3,4,5,6,7,8,9,10]
for item in list1:
    print(item)
```
```python
"""遍历列表"""
myStr = "HelloWorld"
for chr in myStr:
    print(chr)
```
```python
"""遍历range数列"""
#rang自动获取1~10之间的数
for i in range(1,10,2):#左闭右开[1,10)，开始值可以不写，但是结束值（不包含）必须写
    print(i)
#step 步数,后续再加一个逗号就可以设定步数为2
```
### 4.for循环的嵌套循环
```python
"""
需求：打印九九乘法表
"""
#外部循环：产生9行
for i in range(1,10):
    # print(f"第{i}行",end="\t")
    for j in range(1,i+1):
        # print(f"第{j}列",end='\t')
        print(f"{i}*{j}={i*j}",end='\t')
    print("")

```
### 5.循环中的关键字
#### （1）continue
跳过当前循环块中的剩余语句，继续进行下一轮循环。（一般在if判断里）
```python
"""
案例：打印0-9，跳过偶数
总结：跳过本次循环，继续下一此循环
"""
for i in range(10):
    if(i % 2 == 0):
        continue
    print(i)

```

#### （2）break
跳出（终止）当前循环体
```python
"""
案例：求0-9每个数自己的幂自己的加和，如果大于10000000则终止循环
总结：跳过本次循环，继续下一此循环
"""
sum = 0
for n in range(10):
    sum = sum + n**n
    if sum > 10_000_000:
        break
print('sum')
```

#### （3）pass

```python
"""
pass关键字（跳过）
"""
for i in range(10):
    pass
```
## 5.2 创建列表
### 访问列表
#### 1.打印列表
```python
list1 = [1,2,3]
print(list1)
#访问列表
#通过脚标/索引
#从左往右:[0，n)
print(list1[0])
print(list1[1])
print(list1[2])
#print(list1[2])#报错

#从右往左
print([-1])#获取最后一个元素
print([-2])
print([-3])
#print([-4])#报错
```

#### 2.列表切片
```python
list1 = [1,2,3,4,5]
list2 = list1[:]#复制整个列表！！！用的多
print(list1 is list2)#False

#使用切片拷贝一部分
list3 = list1[2:4]
list4 = list1[2:]
list5 = list1[:4]
list6 = list1[2:-1]#取索引2开始到-1（不包含-1）
list7 = list1[::-1]#倒叙切片整个列表
```
#### 3.列表中添加元素
list是一个可变的有序序列
```python
list1 = [1,2,3,4,5]
#使用append：向列表的末尾追加元素
list1.append(6)
#insert:向列表指定位置中插入元素
list1.insert(2,22)#在索引为2的位置插入22，后面的项往后移
```
#### 4.列表的相加
```python
list1 = [1,2,3]
list2 = [4,5,6]
list3 = list1 +list2
list1.extend(list2)#也是在list1后面加list2

#可以先遍历list2之后添加到list1
for item in list2:
    list1.append(item)
```
#### 4.列表的乘法
```python
list1 = [1,2,3]
print(list1*2) #这里输出的是[1,2,3,1,2,3]是复制两份而不是每个元素乘2
```
#### 5.列表中修改元素
```python
list1 = [1,2,3]
#使用脚标修改
list1[-1] = 33 #将最后一个元素修改成33
#使用切片修改
list1[0:]=[11,22,33]#从脚标为0的修改到最后一个
```
#### 6.检查成员是否为列表中元素
in=>成员运算符
```python
list1 =[1,2,3,4,5]
print(11 in list1)#False
```
#### 7.获取列表长度
```python
list1 =[1,2,3,4,5]
print(len(list1))#5
```
#### 8.获取最大值，最小值求和
max(),min(),sum()

### 遍历列表
```python
list1 = [1,2,3,4,5]
#使用for循环直接遍历
for item in list1:
    print(item)
#通过下表遍历
for index in range(len(list1)):
    print(index)
#使用没剧情enumerate
for index,item in enumerate(list1):
    print(f"脚标={index},元素={item}")#一个方法即拿到了脚标又拿到了元素
```
### 删除列表指定位置元素
```python
list1 = [1,2,3,4,5]
del list1[0]#删除列表中脚标为0的元素
#=>[2,3,4,5]
#切片删除
del list1[1:4]#删除脚标1-3的元素
#=>[1,5]

list1.remove(1)#删除第一次出现的1
```
### 嵌套列表
```python
outerList = [[1,2,3],[4,5,6],[7,8,9]]
#使用for循环
for innerList in outerList:
    for item in innerList:
        print(item)
        
#使用脚标
#获取外层脚标
for outerItem in range(len(outerList)):
    #定义内层列表
    innerList = outerList[outerItem]
    #获取内存脚标
    for innerItem in range(len(innerList)):
        #打印列表
        item = outerList[outerItem][innerItem]
        print(item)

# 使用枚举遍历外层，再枚举遍历内层
for outer_idx, innerList in enumerate(outerList):
    for inner_idx, item in enumerate(innerList):
        print(item)
```

## 列表推导式
#### 可以批量开启进程和批量开启线程
是一种简洁创建列表的方式，可以将一个可迭代的对象的元素通过某种运算或条件筛选后生成新列表  
```python
#基础列表推导式
list1 = [x * 2 for x in range(1,6)]

#带条件的列表推导式
list2 = [x * 2 for x in range(1,6) if x % 2 == 0 ]

#使用现有列表
list3 = [1,2,3,4,5]
list4 = [x*2 for x in list3]

#包含多个循环的列表推导式，列表由元组组成
#示例：两层循环，x取1、2，y取3、4，组合成(x,y)元组
list5 = [(x,y) for x in [1,2] for y in [3,4]]
print(list5) # 输出 [(1, 3), (1, 4), (2, 3), (2, 4)]
```

```python
#获取1-10之间的偶数（列表推导式）
[print(f"偶数={i}" if i % 2 ==0 else f"奇数={i}")for i in range(1,11)]

```

### zip（）函数
zip（）函数可将多个可迭代的对象中打印一个个元组
zip（list1,list2）,让其变成一个元组了

### list函数
list.pop()#冒泡，删除并获取指定位置的数据，默认为末尾  
list.clear()#清空列表  
sorted(list，reverse = True)#返回一个新列表排序，reverse为真表示反转  
list.sort#不返回一个新的列表还是旧的列表  
reverse()反转列表元素  
list.count(x)返回x的数量  
list.copy 拷贝列表类似与切片（这是一个浅拷贝）  
list(x) 将序列转换成列表，序列包括列表，元组，字符串  

## 5.3字符串String
字符串是不可变的、有序的。  
字符串中元素不可修改。  
字符串使用单引号、双引号或三重引号定义。  
字符串中每个值都有对应的位置值，称为索引或下标，索引从起始从0开始向后逐个递增，并且从末尾从-1开始逐个向前递减
```python
#创建字符串
myStr = "helloworld"
#访问字符串
print(myStr)
#使用切片
print(myStr[0:2])
#字符串相加
myStr2 = "fuckword"
print(myStr+myStr2)#拼接
print(myStr+str(1))#把1强制转换成字符串之后拼接
#字符串乘法
print("*"*2)#打印两个✳号
#检查成员
subStr = "hello"
print(subStr in myStr)#in 成员运算符
#原始字符串(直接写成什么样就是什么样)->前面加r
myStr2 = "helloworld\t"
print(myStr2)
myStr3 = r"helloworld\t"#加r之后使转义字符无效了
print(myStr3)
```
### 字符串的常用函数

```python
# 替换
myStr = "helloword helloword helloword helloword helloword"
print(myStr.replace("hello", "fuck", 1))  # 只把第一个hello替换成fuck

myStr.split(" ", 1)  # 把字符串按照空格分割,默认全部分，后面加1表示只分第一个空格,分割之后是列表[]

"-".join("a", "b", "c")  # 以—分割，其中必须是字符串，->a-b-c
myStr = "  helloword"
print(myStr.split(" "))  # 去除指定前缀
myStr.removeprefix(" ")  # 去除前缀但是就去掉一个
##########
print(myStr.find("hello"))  # 从左边开始找第一个索引值，返回脚标，找不到返回-1
print(myStr.count("hello"))  # 数有几个hello
print(myStr.startswith("hello"))  # 看是否以hello开头
print(myStr.endswith("hello"))  # 结尾
print(" ".isspace())  # 判断字符串是否非空且空白
myStr = "hello"
print(myStr.center(30, "-"))
print("{:-^30}".format(myStr))#字符格式化，跟上方作用一样，输出章节有讲
print("abc1".isalpha())#判断其中是否只用字母
print("123".isdigit())#判断字符串中是否只包含数字
```

## 深拷贝和浅拷贝（扩展）
浅拷贝:内容相同，外层容器的地址发生变化，但是内部的地址不变化
深拷贝：外部地址发生变化，内部地址也发生变化
```python
#浅拷贝
list1 = [1,2,3]
list2 = list1[:]#切片，浅拷贝
print(f"list1的地址:{id(list1)}")
print(f"list2的地址:{id(list2)}")

list1[0] = 11
print(list1)
print(list2)
#list2不变，只变list1

```

```python
#深拷贝:外面里面都不一样
import copy
list1 = [1,2,3]
list2 = list.deepcopy(list1)
print(id(list1[0]))
print(id(list2[0]))
#虽然现在是深拷贝，但是里面装的是数值，属于小整数池，所以此时地址是不变的
#可以在列表里面嵌套列表，此时再看里面的嵌套列表地址会发生改变
list1 = [1,2,3,[4,5,6]]
#浅拷贝,若改变4，
list2 = list1[:]
print(id(list1),id(list2))

```
