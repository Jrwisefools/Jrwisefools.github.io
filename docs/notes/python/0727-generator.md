---
title: "生成器与迭代器"
date: 2025-07-27
tags:
  - Python
  - 进阶
archived: true
---
# Day 10
## 生成器
1. 当生成器使用yield语句时,把函数暂停
2. 将yield后的表达式作为当前迭代器的值返回
__yield 暂停并返回值__
__return 结束程序并返回值__
3. 每次调用生成器的next()方法或使用for循环进行迭代时，
总结: __yield__ 暂停并返回值，使用next函数或for循环都会进入下一次调用

```python
"""自定义迭代器获取斐波那契数列
    当前数值 = 前两数之和
    prev ：前一个值
    curr ：当前值
    有初值：前一个是0，当前是1
    prev = curr(之前)
    curr = curr + prev（上一个）
"""
class fib:
    def __init__(self,max):
        self.max = max
        self.prev = 0
        self.curr = 1
    def __iter__(self):#获取迭代器对象，意思就是把fib当作一个迭代器对象
        return self
    def __next__(self):#循环一次执行一次

        if self.max <= 0:
            raise StopIteration#对象没有角标，迭代器停止
        else:

            value = self.curr
            self.curr = self.prev +self.curr
            self.prev = value
            self.max -= 1
            return value #返回替换前的value

fib = fib(5)
# for f in fib:
#     print(f,end="  ")
print(next(fib))
print(next(fib))
print(next(fib))
print(next(fib))
```
### 生成器
#### 用函数的方法创建生成器
```python
"""
生成器
"""
def MyGenerator(max):
    prev = 0
    curr = 1
    while True:
        if max <= 0:
                raise StopIteration#对象没有角标，迭代器停止
        else:
            max = max -1
            value = curr
            prev,curr = value,prev+value
            yield value
gen = MyGenerator(3)
# print(next(gen))
# print(next(gen))
# print(next(gen))
for n in gen:
    print(n)
    #返回替换前的value
```
生成器省略了很多，拿到生成器，循环一次

#### 使用元组推导式创建生成器，并操作迭代器进行迭代
```python
generator = (x for x in range(1,6))
print(next(generator))
print(next(generator))
print(next(generator))
print(next(generator))
```
### send()
把yeild恢复执行
1. 给生成器发生一个值，作为当前yield表达式的结果

```python
"""使用send(发送使其交替执行)"""

def MyGenerator():
    # 任务id
    taskId = 0
    # 整数值
    intValue = 1
    # 字符值
    charValue = "A"
    while True:
        match taskId:
            case 0:
                pass
                # 依此打印1，2，3
                taskId = yield intValue
                intValue = intValue + 1
            case 1:
                pass
                # 依此打印A，B，C
                taskId = yield charValue
                charValue = chr(ord(charValue) + 1)

# 创建生成器
gen = MyGenerator()
# next()
# print(next(gen))通过next启动了生成器
# 也可以使用send()启动生成器
print(gen.send(None))
# 使用send发送恢复执行
print(gen.send(1))
print(gen.send(0))
print(gen.send(1))
print(gen.send(0))
```
![img_7.png](/images/python/img_7.png)

#### 命名空间
命名空间是从名称到对象的映射
大多数命名空间都是使用python字典来实现，{键:值}
各个命名空间是独立的，
不同的命名空间是可以重名而没有任何影响

### 三种命名空间
1. 内置名称
python解释器启动时创建的,不会被删除
2. 一个模块的全局名称
模块定义时候创建,会持续到解释器退出
3. 函数内部
在函数被调用时候被创建，
并在函数返回或者未在函数内被处理的异常时候删除

### 作用域
一个命名空间的作用域是python代码中的一段文本区域，
从这个区域可以直接访问该命名空间

#### 四种作用域
1. 最内层作用域
2. 闭包作用域
3. 全局作用域
4. 内建作用域
关键字
global 指定全局
nonlocal 指定闭包

#### 闭包
当调用函数执行完毕后，函数内的变量就会被销毁。
作用：保存函数内的数据并重复使用
构建闭包条件：
    外部函数定义了一个内部函数
    内部函数用到外部函数中的变量
    外部函数将内部函数作为返回值

```python
def outer(a, b):  # a,b是属于外部函数outer的
    def inner(c):  # c是属于内部函数inner的
        return a * c + b

    return inner

innerFunc = outer(1, 1)
print(innerFunc)  # 拿到了内部函数的方法
print(innerFunc(5))#这里有用到outer里面的变量
#直到走完最后一步函数值才被销毁
```
### 装饰器
装饰器允许在不修改原有函数代码的基础上，
动态地增加或修改函数的功能。
装饰器本质上是一个接收函数作为输入并返回一个新的包装过后的函数的对象。
decorator是一个装饰器函数，接受一个函数func作为函数,
并返回一个内部函数
#### 闭包实现方法增强
```python
"""
使用闭包实现装饰器
原函数功能kaipingf
增强函数之后的功能是求绝对值之后再开平方    
"""
from math import sqrt

def mySqrt(num):
    return sqrt(num)

print(mySqrt(-4))

# 使用装饰器对mySqrt进行增强
def mySqrtPro(func):
    def inner(num):
        """
        :args: 被增强的函数的实参
        """
        absNum = abs(num)
        return func(absNum)

    return inner

# print(mySqrt(-4))
# 使用装饰器
mySqrtproFunc = mySqrtPro(mySqrt)
print(mySqrtproFunc(-4))
```

#### @decorator 使用装饰器
```python
#使用@decorator来增强
# 将闭包函数/增强函数作为注解标注至原函数上
from math import sqrt

# 使用装饰器对mySqrt进行增强
def mySqrtPro(func):
    def inner(num):
        """
        :args: 被增强的函数的实参
        """
        absNum = abs(num)
        return func(absNum)
    return inner

@mySqrtPro
def mySqrt(num):
    return sqrt(num)

print(mySqrt(-4))
# print(mySqrt(-4))
# 使用装饰器
# mySqrtproFunc = mySqrtPro(mySqrt)
# print(mySqrtproFunc(-4))
```

### 多层装饰器
```python
"""
需求：将数字字符串转换成数字，
之后再求绝对值
多层装饰器：先装饰的后执行
"""
from math import sqrt
def mySqrt(num):
    return sqrt(num)

#将数字字符串转换为数字
def getInt(func):#括号里面传入要增强的函数
    def inner(num):
        intValue = int(num)
        return func(intValue)
    return inner

#获取绝对值
def getAbs(func):
    def inner(num):
        absNum = abs(num)
        return func(absNum)
    return inner

@getInt#先执行这个
@getAbs#再执行这个
def mySqrt(num):
    return sqrt()
```
### 带参数的装饰器

```python
# 带参数的装饰器
from math import sqrt

def times(n):
    def getAbs(func):#外部函数传递原函数
        def inner(num):#内部函数传递原函数的实参
            absNum = abs(num)
            for i in range(n):  # for里面不会新建作用域
                absNum = func(absNum)
                print(absNum)
            return absNum

        return inner

    return getAbs

@times(2)
def mySqrt(num):
    return sqrt(num)

print(mySqrt("16"))
```

### 类装饰器
    类装饰器是包含__call__()方法
```python
from math import sqrt
class DecorationClass:
    #初始化方法
    def __init__(self,func):
        self.func = func
    #call方法
    def __call__(self, args):
        absNum = abs(args)
        return self.func(absNum)
@DecorationClass
def mySqrt(num):
    return sqrt(num)
print(mySqrt(16))

```
## 进程和线程
一个进程就是一个cpu，一个进程驱使一个cpu去执行一个事情->并行
并发<-线程是一个cpu的一部分，一个cpu可以开多个，线程速度非常快
让人感觉得到是多进程在执行
### 并发（逻辑）
单个CPU处理多个任务，各个任务交替执行一段时间
来回切换看上去
### 并行（物理）
多个CPU同时执行多个任务，功耗高
### 串行
在同一个时间节点至执行一个任务,当前面的任务执行完毕,  
才执行后续任务（前面执行完了才执行后面）

## 多进程
进程是操作系统进行分配的基本单位
操作系统中一个正在运行的程序或软件就是一个进程
多进程就是指在操作系统中同时运行多个程序(并行)
## 创建进程
os.fork()
windows没有fork()调用，不过python提供了一个模块 multiprocessing
1. process的创建
![img_8.png](/images/python/img_8.png)
group:始终为None
raget：驱使进程执行目标任务
name：进程名称
args：针对目标函数调用的元组（如果参数只要一个后面需要加上逗号）
2. Pross的属性和方法

### 
```python
import multiprocessing
#创建进程并开启
def func(n):#目标函数
    for i in range(n):
        print(i)
if __name__ == "__main__":
    #创建进程
    p = multiprocessing.Process(target = func,args = (10,))#这里要加逗号，如果不加就会认为要对其迭代
    #启动进程
    p.start()
```
