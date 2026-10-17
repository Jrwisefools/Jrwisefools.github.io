---
title: "模块与包"
date: 2025-07-25
tags:
  - Python
  - 基础
archived: true
description: "模块不能和python中自带的标注模块重名 指定导入模块的部分成员，通过成员名的方式访问, from 模块名 import 成员名1[as 别名],成员2[as 别名] 导入模块中所有不易单下划线开头…"
---
# Day9
## 模块

模块不能和python中自带的标注模块重名
```python "my_add" 
num = 100
def add(a,b):
    """求两个数的和"""
    return a+b

```
```python
#导入my_add模块，全部导入
import my_add as myadd #取别名
print(myadd.add(1,2))
print(myadd.num)

```
### 局部导入，指定
指定导入模块的部分成员，通过成员名的方式访问,  
from 模块名 import 成员名1[as 别名],成员2[as 别名]
```python my_mylti
num = 100
def mul(a,b):
    return a*b
```
```python
# from my_add import add,num
# from my_multi import num
# 两个一样的num，后导入的num会覆盖先导入的num
#如果都想用那就得去别名
from my_add import add,num as n1
from my_multi import num as n2
print(add(1,1))
print(num)
```
### 局部导入from import*
导入模块中所有不易单下划线开头的成员，直接通过成员名的方式访问
_str  !非公开API
```python
"""
使用局部导入的语法导入模块
"""
from my_add import *
print(num)
```
### 模块搜索顺序
1. 当前目录
2. PYTHONPATH 环境变量中的目录
3. 包含标注Python模块以及扩展目录，第三方模块:扩展的模块
```python
#导入模块的搜索顺序
import sys #当前目录->ptthon环境 -> 第三方扩展模块->后续append（手动添加）目录
print(sys.path)
sys.path.append("D:\\ythonAi\\chapter9")
```
#### from import*导入的模块中使用__all__设置哪些内容可以被导入
```python
__all__ = ["num","add"]
num = 100
num2 = 200
_str = "hello"
def add (a,b):
    return a + b
```

```python
from my_add import *  # 全部导入，因为__all__里面没有num2所以不能使用
import my_add  # 此时可以导入add

print(my_add.num)#此时需要my_add.方法
```
#### __name__
__name__是一个特殊的内置变量
所有py文件都有__name__
1. 当一个文件被直接运行时，该文件的__name__属性值为:__main__
2. 当作为一个模块导入运行时候，导入的时候是模块名
3. 使用import导入模块时候，模块中的代码是会执行的

需求：使用import模块导入时候，应该是不执行的
当my_add模块需要直接运行的时候才运行，如果只是 被导入 就不会被运行

```python
print(__name__)
# print("helloword")#该语句在被导入时候也会被执行
if __name__ == "__main__":
    print("helloword")
```

### dir()内置函数
用来列出对象的属性和方法，或者列出当前作用域中定义的名称  
并以一个字符串的形式返回

```python
import math
#查看math模块下
print(dir(math))
```
对dir()传入对象
```python
class Person:
    def __init__(self,name):
        self.name = name
    def show(self):
        print(f"Person name:{self.name}")
p = Person("张三")
print(dir(p))
```
当不传递任何参数的时候就是当前作用域
```python
"""dir()无参"""
num = 1
num2 = 2
class Person:
    pass
def show():
    print("show")
    print(dir())
num = 1
num2 = 2
print(dir())
```
### 包
#### 包概述
包是一种管理模块
1. 全局导入  
导入包中模块所有成员
```python
"""import 全部导入"""
import graphic.cicle
#如果最后一项是包，那就是导入包一次导入太多python不支持->import graphic(报错识别不了)
#如果最后一项是包那就得在__init__.py中指定导入模块

print(graphic.cicle)
```

```python
from .import circle #从当前目录中找（推荐）
from chapter12.chapter12_7_1 graohic import circle#从写的目录里找（不推荐）
import circle #导入模块 模块搜索顺序
#上面的 当前目录->python官方库->第三方扩展库
import circle #是根据运行的程序里面去找，所以会出问题，找不到模块
```

2. 局部导入
局部导入包下的模块from  import 
```python
from graphic import circle as c
print(c.radius)
```
局部导入包下模块的成员
```python
from graphic.circle import radius 
print(radius)
```
局部导入from import *
```python
from graphic import *
print(cicle.radius)
```
上面代码需要在__init__.py文件中写__all__

[//]: # (前面all是导入模块中所有成员)

[//]: # (后面是包导入成员)

### 常用标准库
标准库是指在按照python中自带的库

### 引入第三方库
当需要使用Python中没有内置的库时，可以通过安装第三方库

### pip命令方式
pip list 查看
pip install 安装 
pip uninstall 卸载
pip config

### 安装第三方库
可以在pycharm和命令行都可以
### 打包并安装自己的库
默认项目环境和本地开发环境是相互隔离的
可以新建一个项目取消隔离
也可以直接给.vuev删了（不建议）,直接新加一个解释器

## Python 高级语法
### 深拷贝和浅拷贝
直接赋值：对象的引用（别名），不产生拷贝。  
浅拷贝：拷贝父对象，不会拷贝对象的内部的子对象。
拷贝后只有第一层是独立的。  
深拷贝：完全拷贝了父对象及其子对象。
拷贝后所有层都是独立的。  
### 如何进行浅拷贝
1. 切片\
```python
#外部地址发生变化内部地址不变
list1  =[1,2,3,[4,5,6]]
#切片
list2 = list[:]
print(id(list1),id(list2))
print(id(list1[3]),id(list2[3]))
print("******")
#工厂函数
list3 = list(list1)
print(id(list1),id(list3))
print(id(list1[3]),id(list3[3]))
#copy.copy()函数
list4 = list1.copy()
print(id(list1),id(list4))
print(id(list1[3]),id(list4[3]))
```
### 迭代器
大多数容器对象都可以使用for语句，所以是可迭代对象
#### 判断是否是可迭代对象（Iterable）
```python
from collections.abc import Iterable
print(isinstance([1,2,3],Iterable))
print(isinstance((1,2,3),Iterable))
print(isinstance("hello",Iterable))
print(isinstance({1,2,3},Iterable))
print(isinstance({"name":"张三"},Iterable))
#都是可迭代对象
```
#### 使用迭代器
迭代器有两个基本的方法: iter() 和 next()  
__!!记住：__next__ 要么方法for循环一次执行一次，__  
或者使用迭代器对象调用一次next方法
```python
list1 = [1,2,3]
it = iter(list1)#获取列表的迭代前对象
for item in it:# 手动获取一个迭代器对象，循环一次就会执行迭代前对象的__next__方法，获取下一个元素
    print(item)

#手动调用__next__方法
print(next(it))
print(next(it))
print(next(it))
print(next(it))#会报错迭代器停止了
```
#### 创建迭代器
迭代器中要有数据通过init方法给迭代器进行初始化
所以要重写init方法和next方法
```python
"""对一个序列执行正向迭代器"""
class MyInterator:
    """
    自定义迭代器
    """
    def __init__(self,data):
        """初始化数据"""
        self.data = data
        self.index = 0 #角标初始值等于0
        
    def __next__(self):
        """获取下一个元素"""
        if self.index >= len(self.data):
            raise StopIteration
        # assert not self.index >= len(self.data),StopIteration 断言
        item = self.data[self.index]
        self.index += 1
        return self.data[self.index]

list1 = [1,2,3]
myIterator = MyInterator(list1)
print(next(myIterator)) # index = 0
print(next(myIterator)) # index = 1
print(next(myIterator)) # index = 2
print(next(myIterator)) # index = 3超出范围
```

```python
"""对一个序列执行反向迭代器"""
class MyInterator:
    """
    自定义迭代器
    """
    def __init__(self,data):
        """初始化数据"""
        self.data = data
        self.index = len(self.data) #角标初始值等于0
        
    def __next__(self):
        """获取下一个元素"""
        if self.index >= len(self.data):
            raise StopIteration
        # assert not self.index >= len(self.data),StopIteration 断言
        item = self.data[self.index]
        item += 1
        return self.data[self.index]

list1 = [1,2,3]
myIterator = MyInterator(list1)
print(next(myIterator)) # index = 0
print(next(myIterator)) # index = 1
print(next(myIterator)) # index = 2
print(next(myIterator)) # index = 3超出范围

```
