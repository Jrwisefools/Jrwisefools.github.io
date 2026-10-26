---
title: "类与对象"
date: 2025-07-22
tags:
  - Python
  - 面向对象
archived: true
description: "类支持两种操作，成员引用和实例化 1. 成员应用：类名.成员名 2. 实例化：对象名 = 类名()->这里在创建对象也叫实例化 ->操作属性：对象名.属性名称 ->调用方法：对象名.函数名称（实参列表…"
---
# Day 7
# 类的操作
类支持两种操作，成员引用和实例化
1. 成员应用：类名.成员名
```python
class Person:
    home = "地球"
    def eat(self):  #当前类的当前对象，自动传入
        print("eatting")
home = Person.home
eat = Person.eat #只是拿到了函数并没有调用函数
print(home)
print(eat)#函数信息拿到的是
```
2. 实例化：对象名 = 类名()->这里在创建对象也叫实例化
->操作属性：对象名.属性名称
->调用方法：对象名.函数名称（实参列表）——这里执行了方法
```python
#实例化
class Person:
    home = "地球"
    def eat(self):#当前类的打过去对象
        print("eatting")
#创建Person类对象(实例化）
person = Person()
home = person.home
print(person)
person.eat()
```
### __init__方法（魔法函数）
也称为构造函数，创建类对象的时候，对对象的属性进行初始化  
当使用类名创建新的对象时，python 会自动调用该方法  
注意：
1. self：约定俗成，代表类和对象本身，可以通过此访问和修改对象与属性
2. __init__() 方法可以不写，系统默认的 __init__ 什么都不做，它的意义是初始化
3. _init_()方法只能返回None，不能返回其他值
```python
class Person:
    home = "地球"
    def eat(self):#当前类的当前对象
        print("eating")
    def __init__(self,name):#self,当对象创建并初始化的时候,打印init
        print("__init__")
        #init不能返回属性，
        print(id(self))
        self.name = name
    #写这个的作用是给对象的属性初始化，赋值
person1 = Person("张三")#这里在创建对象并初始化，自动调用init函数
#必须要传参，现在self是person1，谁在调用self谁就是self
print(id(person1))
Person.eat()
name = person1.name
print(name)#张三
person2 = Person("李四")#此时self就变成了person2

```
### self
self当前类的当前对象，谁调用谁就是self
1. 调用实例方法
代码既可以通过类调用，也可以先创建对象再调用方法
```python
class Person:
    def __init__(self,name):
        self.name = name
    def eat(self):
        print("eating...")

        
p = Person("张三")
Person.eat(p)#通过类调用里面需要传入对象
p.eat()#通过实例化传入
```

```python

class Person:
    def __init__(self, name):
        self.name = name

    def eat(self):
        print("eating...")

    def drink(self):
        print("drink")

    def eatAndDrank(self):
        # 访问Person对象属性
        print(self.name)
        self.drink()  # 在方法里面用了类，调用成员，使用成员
        # drink()这是一个类里面的方法，要么用对象引用要么用类名引用
        Person.eat(self)  # 通过类调用方法时，需要手动把对象作为第一个参数传入（一般不推荐这么做）

p = Person("张三")
p.eatAndDrank()
```
### 属性
1. 类属性
    类变量，在类中方法外定义的属性，属于类，一类对象的共性的时候就定义为类属性  
   (1) 通过 类名.属性名 或者 对象名.属性名 来
   (2) 注意事项：将属性作为获取的共性
```python
class Person:
    home = "火星"
    def __init__(self,name,age):
        self.name = name
        self.age = age
print(Person.home)#类
p1 = Person("张三",18)
print(p1.home)#对象
```
2. 实例属性
    单个对象的特有属性，
   (1)在__init__方法中定义

```python
class Person:
    home = "火星"

    def __init__(self, name, age):
        self.name = name
        self.age = age
Person.home = "地球"#通过类来改类属性

p1 = Person("张三", 18)
print(p1.home)#类属性
print(p1.name)#对象属性
#对象属性：设置
p1.name = "张三八"
p1.home = "火星"#p1.home = "火星" 并没有修改类属性，只是给 p1 对象新增了一个实例属性！所以 p2.home 依旧是 地球
print(p1.name)
p2 = Person("李四",20)
print()
print(p2.name)
print(p1.age)
```
### 实例方法
1. 实例方法在类中定义,第一给参数是self,代表实例本身（当前类的当前对象）
```python
class Person:
    #类属性
    home = "地球"
    def __init__(self, name, age):
        self.name = name
        self.age = age
    #实例方法
    def eat(self):
        print("eating")
    #实例方法
    def instanceFunc(self):
        #访问类属性:类名.属性名,对象名.属性名
        print(f"{self.home}")
        #访问实例属性：对象名.属性名
        print(f"{self.age}")
        #访问实例方法：对象名.方法名
        self.eat()
p = Person("张三",18)
print(p.eat())
```
### 类方法
1. 适合共性的方法
2. 通过@classmethod定义，用它来标记函数
3. 类方法的第一个参数为cls，代表类的本身
4. 类方法可以通过类和实例对象调用
5. 可以访问类属性
6. 在不创建对象情况下调用，通过类名直接调用很方便
```python
class Person:
    #类属性
    home = "火星"
    
    #类方法
    @classmethod
    def classMethod(cls):#cls：当前类
        print(cla.home)
    #初始化属方法
    def __init__(self, name, age):
        self.name = name#对象属性
        self.age = age
    def eat(self):
        print("eating...")

#使用类方法：类名.方法名
Person.classMethod()
#使用类方法：对象名.方法名
p1 = Person()#创建一个实例对象
p1.classMethod()#通过实例对象来调用类方法
```
### 静态方法
1. 静态方法
2. 不放实例属性或类属性，只能以来于传入参数
3. 可以通过类名或实例调用，但不会访问
```python
"""
静态方法：使用@staticmethod标记
"""
class Person:
    #类属性
    home = "地球"
    
    def __init__(self, name, age):
        self.name = name
        self.age = age
    #对象方法
    def eat(self):
        print("eating...")
    #类方法
    @classmethod
    def classMethod(cla):
        print(cla.home)
    #静态方法
    @staticmethod
    def staticMethod():
        print("静态方法")
    #访问类属性
        print(Person.home)#尽量不要访问
#使用静态方法
Person.staticMethod()

```
### 在类中定义方法
```python
def myF(self):
    print("myF...")
class Person:
    myFunc = myF
#
# Person.myFunc()
Person().myFunc()
```
### 特殊方法(魔法方法)

1. __init__() 对象初始化
2. __del__() 对象什么时候回收，定义了当对象被垃圾回收的行为
    看你这个对象
3. __str__() 获取对象字符串信息
```python
class Person:
    def __init__(self,name,age):#对象初始化
        self.name = name
        self.age = age
    def __del__(self):
        print("Person__del__")
    def __str__(self):
        return f"Person(name={self.name},age={self.age})"
        #若有这个方法就会自动获取字符串信息
p1 = Person("张三",18)
print(p1)
p2 = p1
del p1 #标记销毁Person对象
#垃圾回收器会去观测对象的引用计数是否为0，如果为0才会引用回收
print(p1)

```
## 动态添加属性和方法
程序执行完了之后
### 动态给对象添加属性
```python
class Person:
    def __init__(self,name):
        self.name = name #对象属性
# 动态添加对象属性
p = Person("张三")
print(p.name)
# print(p.age)#没有这个对象属性
#动态给对象添加数据
p.age = 18
print(p.age)
    
```
### 动态添加类属性
```python
class Person:
    def __init__(self,name):
        self.name = name #对象属性
p = Person("张三")
# print(Person.home)#这里还没有
#动态添加类属性
Person.home = "地球"
print(Person.home)
```
### 对象添加方法

#### 添加普通方法
```python
class Person:
    def __init__(self,name):
        self.name = name

#普通方法
def func():
    print("普通方法")  
    #使用对象成员

p = Person("张三")
p.eat = func
p.eat()
#p.func()这个不存在
```

#### 添加对象方法

```python
import types

class Person:
    def __init__(self, name):
        self.name = name

# 对象方法
def func(self):
    print("对象方法")
    # 使用对象成员self

p = Person("张三")
# p.eat = func#这里少了一个方法调用，没有对self 进行处理
# # p.eat()#这里方法调用是没错的
p.eat = types.MethodType(func,p)
```
    
#### 给类添加方法
```python

class Person:
    def __init__(self, name):
        self.name = name

# 类方法
@classmethod
def classMethod(cls):
    print("类方法")
    # 类方法只能访问类成员，不能访问实例成员（self）
# 静态方法
@staticmethod
def staticMethod():
    pass  # 占位，不应真的打开文件

#动态添加类方法
Person.classFunction = classMethod
Person.classFunction()

Person.staticFunc = staticMethod
Person.staticFunc()
```
### 动态删除属性和方法
```python
class Person:
    def __init__(self, name,age):
        self.name = name
        self.age = age
    def eat(self):
        print("eating....")
    def __str__(self):
        return f"Person(name={self.name},age={self.age})"
        
p = Person("张三",18)
print(p)

print(p.__dict__)
#删除属性
del p.name
# print(p.name)报错没有
del p.__dict__["age"]
print(p.__dict__)
#删除方法
# del p.eat #报错 方法不在对象信息字典中
del Person.eat
```
---
### __slots__限制实例属性与实例方法(槽)
用来限制类里面有哪些对象属性和对象方法，无法限制类属性类方法、静态方法

```python
class Person:
    __slots__ = ['name', 'age', 'eat']

    def __init__(self, name):
        self.name = name

def eatFunc(self):
    print("eating...")

def drinkFunc(self):
    print("drinkng...")

# 动态添加对象属性age
p = Person("张三")
print(p.name)
p.age = 18
print(p.age)

import types
# 动态添加对象方法eat
p.eat = types.MethodType(eatFunc,p)
# 动态添加对象方法drink(不在slots范围）
# p.eat = types.MethodType(drinkFunc, p) # 这里会报错（drinkFunc 不在 slots 内）
#动态添加类属性
Person.home = "火星"
print(Person.home)
#动态添加类方法
@classmethod 
def classMethod():
    print("类方法")
Person.classFunction = classMethod  # 赋值「函数对象」本身
Person.classFunction()              # 再调用类方法
#动态添加静态方法
# 静态方法
@staticmethod
def staticMethod():
    pass  # 占位，不应真的打开文件
Person.staticFunc = staticMethod
Person.staticFunc()
```
---
## 面向对象的三大特性
### 封装
不直接使用代码，而是将代码装入指定容器(函数、类)中,  
由改容器提供对外访问的方式  
函数、对象、类、模块都是封装  
=>变量和函数写入类，通过封装将一些细节隐藏起来(私有)，  
只暴露出必要的接口
```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    def eat(self):
        print("eating...")
    def __str__(self):
        return f"Person(name={self.name},age={self.age})"
    def setName(self,name):
        if name == "王八蛋":
            print("姓名非法")
    def setage(self,age):
        if age <0:
            print("年龄非法")  

p1 =Person("张三",36)
print(p1)
p2 = Person("王八蛋",-120)
print(p2)
# 解决思路：不让外界直接访问对象属性，提供方式（设置/获取）给外界使用
```

### 私有化
为了限制属性和方法只能在类内访问,外部无法访问:
或父类中某些属性和方法不希望被子类继承
1. 单下划线：非公开API
_var,约定这个为非公开api，但是实际还是可以调用的，  
约定俗称其不能供外界（模块）

2. 双下划线，改写
例如__x会被改写为_类名_x,只有在类内部可以通过__x访问，
其他地方无法访问,或只能通过。

```python
class Person1:
    def __init__(self,name):
        self.name = name
p1 = Person1("张三")
print(p1.name)
class Person2:
    def __init__(self,name,age):
        self.__name = name
        self._age = age
    #定义公开方法在公开方法里面调用私有对象
    def getName(self):
        return self.__name
p2 = Person2("张三")
#访问单下划线
print(p2._age)#可以访问
# print(p2.__name)#这样会报错，直接说没有__name
#方式一
print(p2._Person2__name)
#方式二
print(p2.getName())

```
```python
class Person:
    def __privateMethod(self):
        print("private method")
    def doSomething(self):
        self.__privateMethod()
        
p = Person()
# p.__privateMethod #报错
p.doSomething()
#方法二：
p._Person__privateMethod()
```
### property
@property:将方法变为读属性
```python
class Person:
    def __init__(self,name):
        self.__name = name#私有对象属性
    # def getName(self):
    #     return self.__name
    @property
    def name(self):
        return self.__name
    
    @name.setter
    def name(self,name):
        self.__name = name
    
p = Person("张三")
#访问私有对象属性
print(p._Person__name)
# print(p.getName())
print(p.name)#用了property就不用括号调用了，相当于一个属性但是是调用方法

#设置私有对象属性
p.name = "李四"
print(p.name)

```
