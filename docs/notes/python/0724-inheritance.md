---
title: "继承与多态"
date: 2025-07-24
tags:
  - Python
  - 面向对象
archived: true
description: "子类（派生类）继承父类（基类）中的属性和方法，实现代码重用 减少定义类设计时的重复代码 子类可以新增自己特有的方法， 也可以重写父类方法(增强方法) 子类不能继承父类的私有属性和私有方法 只有一个父类…"
---
# Day 8
## 继承
子类（派生类）继承父类（基类）中的属性和方法，实现代码重用  
减少定义类设计时的重复代码   
子类可以新增自己特有的方法， 
也可以重写父类方法(增强方法)  
子类不能继承父类的私有属性和私有方法  
### 单继承
只有一个父类
```python
class Person():
    home = "地球"
    def __init__(self, name):
        self.name = name
    def eat(self):
        print("Person eating...")

class YellowRace(Person):
    color ="黄皮肤"

class WhiteRace(Person):
    color ="白皮肤"

class BlackRace(Person):
    color ="黑皮肤"
    
p1 = YellowRace("刘翔")
print(p1.name)
p1.eat()
```
### 多继承
```python
class Person():
    home = "地球"
    def __init__(self, name):
        self.name = name
    def eat(self):
        print("Person eating...")
class YellowRace(Person):
    color ="黄皮肤"
    def run(self):
        print("YellowRace run")
class Student(Person):
    print("Student _init_")
    def __init__(self, name,grade):
        self.name = name
        self.grade = grade
    def study(self):
        print("student study")
class ChineseStudent(YellowRace,Student):
    country = '中国'

student = ChineseStudent("张三","五年级")
student.eat()
student.run()
student.study()
```
### 复用父类方法（子类使用父类中方法）
1. super().方法名()
2. 父类名.方法名()
```python
class Person():
    home = "地球"
    def __init__(self, name):
        self.name = name
    def eat(self):
        print("Person eating...")
class YellowRace(Person):
    color ="黄皮肤"
    def run(self):
        print("YellowRace run")
class Student(Person):
    print("Student _init_")
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade
    def study(self):
        print("先吃再学")
        # super.eat()
        Person.eat(self)#这里另外一个方法
        print("student study")
student = Student("张三","五年级")
student.study()

```
### 方法解析顺序（重要）
super要遵守方法解析顺序（mro），通过类名.__mro__    
调用“当前类在mro链中下一个类  
1. 无参数：super().__init__()自动绑定当前类和实例，找下一个
2. 有参数：super(mro上一个类)
```python
class Person():
    home = "地球"
    def __init__(self, name):
        self.name = name
    def eat(self):
        print("Person eating...")
class YellowRace(Person):
    color ="黄皮肤"
    def run(self):
        print("YellowRace run")
class Student(Person):
    print("Student _init_")
    def __init__(self, name,grade):
        self.name = name
        self.grade = grade
    def study(self):
        print("student study")
class ChineseStudent(YellowRace,Student):
    country = '中国'

student = ChineseStudent("张三")
print(ChineseStudent.mro())
#mro链条就是书写的从左往右
```

```python
class Parent1:
    def __init__(self, value1):
        print("Initializing Parent1")
        self.value1 = value1#value1是属于Parent1对象属性

class Parent2:
    def __init__(self, value2):
        print("Initializing Parent2")
        self.value2 = value2

class Child(Parent1, Parent2):
    def __init__(self, value1, value2):
        print("Initializing Child")
        # Parent1.value = value1
        # 缺点：一旦父类名称发生改变，子类调用的位置就需要挨个手动修改(不够灵活）
        # # 直接调用 Parent1 的 __init__ 方法
        # Parent1.__init__(self, value1)
        #  # 直接调用 Parent2 的 __init__ 方法
        # Parent2.__init__(self, value2)
        print(Child.__mro__)
        super().__init__(value1)
        #这里super会复用Parent1的init方法，初始化value1,没有执行Parent2的init方法，从而没有value2
     
        # super().__init__(value2)
        super(Parent2).__init__(value2)
        #这个继承顺序不够灵活，如果把后面两个父类换了就错了，因为mro是按照写的顺序
child = Child("value from Parent1", "value from Parent2")
print(child.value1)
print(child.value2)
```

```python
class Parent1:
    def __init__(self, value1, **kwargs):
        print("Initializing Parent1")
        self.value1 = value1#value1是属于Parent1对象属性
        super().__init__(**kwargs)
        
class Parent2:
    def __init__(self, value2,**kwargs):
        print("Initializing Parent2")
        self.value2 = value2
        super().__init__(**kwargs)
        
class Child(Parent1, Parent2):
    def __init__(self, value1, value2):
        print("Initializing Child")
        super().__init__(value1 = value1,value2= value2)
        
child = Child("value from Parent1", "value from Parent2")
print(child.value1)
print(child.value2)
```
案例
```python
class A:
    def __init__(self,a,b,c,**kwargs):
        self.a = a
        self.b = b
        self.c = c
        super().__init__(**kwargs)
class B:
    def __init__(self,d,e,f):
        self.d = d
        self.e = e
        self.f = f
        super().__init__(**kwargs)
class C(A,B):
    def __init__(self,a,b,c,d,e,f):
        super().__init__(a,b,c,d,e,f)
        super().__init__(a=a,b=b,c=c,d=d,e=e,f=f)
c = C(1,2,3,4,5,6)
```
### 钻石继承
如果用类名进行初始化那么初始化就会执行两次

## 多态
同一个事物在不同场景下的多个状态
父类引用子类对象，子类调用父类的相同方法
```python
class Animal:
    def go(self):
        print("go...")
class Dog(Animal):
    def go(self):
        print("")
class Fish(Animal):
    def go(self):
        print("")
class Bird(Animal):
    def go(self):
        print("")
def go(animal):
    animal.go()
#测试Dog
dog = Dog()
go(dog)
```
---
## 异常
```python
#try-except语句

#NameError

# prlnt("hello,word")
print("hello word")
a = "111"
# print(aa)#变量名拼写错误
print(a)
#print(b) #使用一个不存在的变量

# SyntaxError IndentationError

# if "he" == "hi":
#     print()   #跟语法相关的

#TypeError

# print(3+"2")
tp = (1,2,3)
# tp[2] = 5
# tp.append(2) # AttributeError

#KeyError:
# d ={1:2,2:4}
# print(d[4])

#IndexError
# print(tp[7])
```
### try except
可以使用 try except语句来获取执行
```python
try:
    print("hello")
    1/0#发生异常
    print("word")
except:#处理异常
    print("except 处理异常")#有异常的时候执行
print("end")#没有异常的时候正常执行
```
```python
#处理多个不同类型的异常
# print(num)#NameError
#1/0 #ZeroDivisionError
try:
    print("start")
    num = input("请输入数字")
    match num:
        case "1":
            1/0
        case "2":
            print(var)
    print("没有发生异常")
except (NameError,ZeroDivisionError) as e:
    print(e)
except:
    print("缺省异常处理")
print("end")
```
### else
```python
try: 
    num1 = 1
    num2 = 2
    result = num1 / num2
    print(f"没有异常{result}")
except:
    print("处理异常")
else:
    print("没有异常")
```
### finally
通常用于执行一些必须要进行的清理操作,例如关闭文件  
有异常没异常都要执行
```python
try: 
    num1 = 1
    num2 = 2
    result = num1 / num2
    print(f"没有异常{result}")
except NameError:
    print("处理异常")
else:
    print("没有异常")
finally:
    print("有无异常都会执行")#即使异常被处理也会执行
#有无异常都执行，前提是异常被处理
print("end")#如果有异常没被处理就不会执行
```
### raise
```python
def add(a,b):
    #(isinstance(a,int) and isinstance(b,int)):为False时产生并抛出异常
    if not (isinstance(a,int) and isinstance(b,int)):
        raise Exception("数字类型错误")#产生并抛出异常
    return a + b
print(add(1,2))
```
### 断言
assert用于判断一个表达式，在条件为False的时候触发异常，用于调试程序

```python
def add(a,b):
    assert isinstance(a,int) and isinstance(b,int),"数字类型错误！"
    return a + b
print(add(1,1))
```
### 自定义异常
通过直接或者简介继承Exception类来创建自己的异常
```python
class MyError(Exception):
    def __init__(self,msg):
        self.msg = msg
    def __str__(self):
        return self.msg
#产生自定义异常并抛出
try:
    raise MyError("自定义异常")
except Exception as e:
    print("yichang")
print()
```

### 异常的传递
当存在try嵌套或函数嵌套时,若内层出现了异常前在内层无法处理，
会将异常一层一层向外传递，直到异常被处理或者程序报错
```python
try:
    try:
        try:
            print(1 / 0)
        except NameError as e:
            print("第三层", e)
    except TypeError as e:
        print("第二层", e)
except Exception as e:
    print("第一层", type(e), e)
```
### with 关键字（重点）
python用with语句处理异常，  
等价于try finally,with等价于捕获异常并做一个代码的执行   
无法处理异常  
用于有一些资源必须正确获取和释放  
with expression as variable:  
    #代码块  
expression：有两个方法一个是进入__enter__一个是退出__exit__(自动执行)  

variable：上下文对象
```python
try:
    try:
        file = open("test.txt","wt")
        file.write("hello,word")
        print(1/0)#产生异常代码没有正常关闭
    finally:
        file.close()#有没有异常都关闭
finally:
    print(f"{file.closed}")

```
with语句：返回上下文对象，
一个是进入__enter__
一个是退出__exit__:with语句执行结束自动执行close方法

```python
try:
    with open("test.txt","wt") as file:
        file.write("hello,word")
        print(1/0)#产生异常代码没有正常关闭
finally:
    print(f"{file.closed}")
```
### python 常见异常
Exception 所有内置异常的父类
