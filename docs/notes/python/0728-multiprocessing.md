---
title: "多进程编程"
date: 2025-07-28
tags:
  - Python
  - 并发
archived: true
description: "减少进程创建和销毁的次数 1.进程池创建"
---
# Day11
### 自定义Process子类创建进程
```python
import multiprocessing
class MyProcess(multiprocessing.Process):
    def run(self):
        for i in range(10):
            print(i)

```
### 同时读写文件
```python
import time
import multiprocessing
def writeFile():
    with open("test.txt","at",encoding="utf-8") as f:
        while True:
            f.write("hello")
            time.sleep(0.5)
            #手动刷新
            f.flush()
def readFile():
    with open("test.txt","rt",encoding="utf-8") as f:
        while True:
            content = f.read()
            print(content)
            time.sleep(0.5)

if __name__ == "__main__":
    writeProcess = multiprocessing.Process(target=writeFile())
    writeProcess.start()
    readProcess = multiprocessing.Process(target=readFile())
    readProcess.start()
```
### 进程池
减少进程创建和销毁的次数
1.进程池创建

```python
#当要启动大量子进程时候，可以使用进程值
import os
import time
import multiprocessing
def func():
    for i in range(10):
        print(f"{os.getpid()} --- {i}")
        time.sleep(0.5)

if __name__  == "__main__":
    #创建进程池
    pool = multiprocessing.Pool(processes=2)
    for i in range(2):
        # #进程异步:并行
        # pool.apply_async(func)
        # #进程是同步/阻塞,串行
        pool.apply(func)
        
    pool.close() #关闭池子
    # 阻塞主进程，等待子进程执行完毕    
    pool.jion()    #同jion的时候保证池子为关闭
    print("end")
```
### 进程间的通信
进程之间不共享全局变量

```python
import time
import os
import multiprocessing

def func(list1):
    for i in range(1, 11):
        print(f"{os.getpid()} -- {i}")
        list1.append(i)
        time.sleep(0.5)

if __name__ == "__main__":
    # 创建进程间共享列表
    manager = multiprocessing.Manager()
    list1 = manager.list()  # 共享列表，父子进程均可读写    
```
#### 使用queue共享队列实现进程通信

```python
import multiprocessing
import time
import random
import os

def func1(queue):
    """
    向共享队里了中写入数据
    
    """
    while True:
        radNum = random.randint(1, 10)
        queue.put(radNum)
        time.sleep(0.2)

def func2(queue):
    while True:
        radNum = queue.get()
        print(f"{os.getpid}---读{radNum}")
        time.sleep(0.2)

if __name__ == "__main__":
    queue = multiprocessing.Queue()
    p1 = multiprocessing.Process(target=func1,args=(queue,))
    p2 = multiprocessing.Process(target=func2,args=(queue,))
    p1.start()
    p2.start()
    p1.join()
    p2.join()
```
## 线程（并发）
线程：之间变量共享实现通信
线程异常如果没有捕获，可能会导致整个进程崩溃，看进程也没有处理这种
多线程指的是同一个进程执行多任务
### 创建线程
1. 使用方法
2. 写一个线程子类
threading.Thread

```python
"""创建并启动线程"""
import threading

# 目标函数
def func():
    for i in range(10):
        print(f"{threading.current_thread().name} -- {i}")
        print(i)

if __name__ == "__main__":
    # 创建线程
    t = threading.Thread(target=func,args=(10,),name="线程1")
    #启动线程
    t.start()

```

使用方法创建线程
```python
"""
两线程交替打印
"""
import time
def func():
    flag =0 
    while True:
        print(f"{threading.current_thread().name}--{flag}")
        #^ 异或，位操作符，不同为True，不同为False
        flag = flag ^1
        time.sleep(0.2)

import threading

if __name__ == "__main__":
    # 创建线程
    t1 = threading.Thread(target= func)
    t2 = threading.Thread(target= func)
    #启动线程
    t1.start()
    t2.start()
```
#### 自定义Thread 子类创建线程
```python
import threading
import time
class MyThread(threading.Thread):
    def __init__(self,name):
        super().__init__(name= name)
    def run(self):
        flag =0 
        while True:
            print(f"{threading.current_thread().name}--{flag}")
            #^ 异或，位操作符，不同为True，相同为False
            flag = flag ^1
            time.sleep(0.2)
if __name__ == "__main__":
    # 创建线程
    t1 = MyThread("线程1")
    t2 = MyThread("线程2")
    #启动线程
    t1.start()
    t2.start()
```
### 线程池

```python
"""
使用线程池提交并执行任务
"""
import concurrent.futures

def func1(n):
    for i in range(1,11):
        print(i)

if __name__ == "__main__":
    # 创建线程池
    pool = concurrent.futures.ThreadPoolExecutor(
        max_workers=10 #最大线程数
    )
    pool.submit(func1,10)
```

```python
"""需求：创建三条线程，并向每条线程传递列表，
往列表里面依此添加1-10的数
"""
import threading
import concurrent.futures
def func(): #list1):
    for i in range(1,11):
        print(f"{threading.current_thread().name}--{i}")
        list1.append(i)
if __name__ == "__main__":
    # 创建线程池
    pool = concurrent.futures.ThreadPoolExecutor(max_workers=10 )#最大线程数
    #全局变量，因为是全局变量所有上面的func里面可以不定义list1之间删掉
    list1 = [] #线程可以共享数据
    #提交任务
    [pool.submit(func)for i in range(3)]#,list1) for i in range(3)]#批量提交任务
    #等待所有子线程结束，再关闭线程池
    pool.shutdown(wait=True)
    #打印结果
    print(list1)
```
#### 互斥锁
1. 线程安全问题
线程之间共享数据会存在线程安全问题

```python

```
2. 互斥锁
某个线程要更改共享数据时，先将其锁定，此时其他线程无法抢占
import time
import threading

def fun():
    
    for i in range(10):
        global globalNum 
        # globalNum = globalNum +1 #原子操作
        temp = globalNum + 1
        time.sleep(0.2)
        globalNum = temp#当线程在工作时候，可能会被打断，交替执行
        
        
        print(f"{threading.current_thread().name}--{globalNum}")

if __name__ == "__main__":
    globalNum = 0
    t1 = threading.Thread(target=fun, name="线程1")
    t2 = threading.Thread(target=fun, name="线程2")
    t3 = threading.Thread(target=fun, name="线程3")
    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()

    print(f"{threading.current_thread().name}--{globalNum}")
使用：threading.Lock()创建
使用lock.acquire加锁
使用lock.release()解锁
```python
import time
import threading

def fun():
    
    for i in range(10):
        #加锁
        lock.acquire()
        global globalNum 
        # globalNum = globalNum +1 #原子操作
        temp = globalNum + 1
        time.sleep(0.2)
        globalNum = temp#当线程在工作时候，可能会被打断，交替执行
        print(f"{threading.current_thread().name}--{globalNum}")
        #解锁
        lock.release()

if __name__ == "__main__":
    #创建互斥锁
    lock = threading.Lock()
    globalNum = 0
    t1 = threading.Thread(target=fun, name="线程1")
    t2 = threading.Thread(target=fun, name="线程2")
    t3 = threading.Thread(target=fun, name="线程3")
    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()

    print(f"{threading.current_thread().name}--{globalNum}")
```
多线程，这些线程都在操作同一个数据，才会出现线程安全问题

### GIL
python全局解释器锁，同一时间只允许一个线程保持python解释器的控制权
意味着在任何一个线程处于执行状态。
默认提供的一套串行的单线程机制，就做一件事。

### 进程和线程对比
资源分配：进程有独立内存空间和系统资源
        线程是共享所属进程的内存空间和资源，
所有同以进程内的线程可以直接访问共享内存
开销：进程独立的内存，开销大
    线程的开销小
并发性：进程：异步执行
       线程：时间片轮转伪异步
独立性：一个进程崩溃不会导致其他的进程
        线程崩溃就可能会导致其他的崩溃
通信：进程麻烦
    线程简单
#### 使用多线程的情况
    I/O密集任务:网络读写、文件读写、操作数据库等耗时操作
    对资源共享要求高
#### 多进程的情况
    cpu密集操作：有大量的科学计算数据处理
    要隔离的任务
## 正则表达式
regular expression
对指定的字符串进行提取、匹配、校验、查找数据等等
### re模块
impoet re
    
1. search
    re.search(pattern,string)
    扫描整个string,返回匹配到的第一个位置,没有匹配到返回None

```python
import re
"""
search 在整个字符串中搜索匹配
"""
# 创建正则表达式
pattern = r"word"  # 加r是原译字符，忽略转义符
# 需要匹配的字符串
string = "helloworld"
# 开始匹配
result = re.search(pattern, string)
# print(result.group())
print(result.group() if result else "匹配失败")
```
2. match 
    re.match(pattern,string)
    只匹配开头
```python
import re
pattern = r"^Hello"#^在正则表达式里面为开头
string = "Hello word!"
result = re.match(pattern,string)
print(result.group() if result else "匹配失败")

```
3.findall
    re.findall(pattern,string)
    以字符串列表或字符串元组列表的形式
```python
import re
pattern = r"\d+"#\d+最少匹配一个数字
string = "The number are 123 and 456"
result = re.findall(pattern,string)
print(result)
```
4. sub
re.sub(pattern,rep1,string,count=0)
使用rep1 替换string中满足pattern的字符串,  
count替换的最大次数,count为0是所有匹配都会被替换，不写默认为0替换所有
```python
import re
pattern = r"apple"
replacement = "orange"#替换的字符串
text = "I have an apple"
newstring = re.sub(pattern,replacement,text,count=0)
print(newstring)
```
5. split
re.split(pattern,string,maxsplit = 0)
用pattern 分开string。用正则表达式做切割，maxsplit默认为0全部切割
```python
import re
pattern = r"\W+"
string = "Word,srparated by punctuation."
list1 = re.split(pattern,string)
print(list1)

```
#### 正则表达式的语法规则
. 代表可以匹配除了\r,\n之外的任何单个字符  
\d 匹配一个数字，等价于[0-9]  
\D 匹配一个非数字字符，等价于 [^0-9]  
\w 匹配包括下划线的任何单词字符 [A-Za-z0-9_]  
\W 匹配任何非单词字符 [^A-Za-z0-9_]  
\s 匹配任何空白字符  
\S 匹配任何非空表字符  
[xyz] 匹配任意列出的字符  
[^xyz] 匹配未被列出的字符  
[a-z] 匹配范围  

```python
# . 代表可以匹配除了\r,\n之外的任何单个字符  
import re

print(re.match(r".{1}", "he"))# 单个字符默认数量为1，
# \d 匹配一个数字，等价于[0-9]
print(re.match(r"^\d$", "9he"))  # ^是开头，$是结尾
# \w 匹配包括下划线的任何单词字符 [A-Za-z0-9_]
print(re.match(r"\w", "9he"))
#\s 匹配任何空白字符
print(re.match(r"\s", " "))
#[xyz] 匹配任意列出的字符
print(re.match(r"[abc]", "a"))
```
#### 表示数量
* 表示零次或者多次，等价于{0,}
+ 表示一次或多次，等价于{1,}
? 表示零次或一次，等价于{0,1}
{n} 匹配确定的n次
{n,} 至少匹配n次
{n,m} 其中 n < m 最少匹配n次且最多匹配m次
```python
import  re
print(re.match(r"[abc]{0,}","ab"))
print(re.match(r"[abc]{1,}","abcd"))
print(re.search(r"[abc]?","abcd"))
print(re.search(r"[abc]{3}","abcd"))#长度
```
#### 表示边界
^ 表示字符串开始位置
$ 表示字符串结束位置
\b 表示前后为单词
\B 表示前后非单词
```python
import re
# ^表示字符串开始位置
print(re.search(r"^[abc]","dabcd"))#开头要么是a，要么是b，要么是c
# $ 表示字符串结束位置
print(re.search(r"^[abc]$","dabcd"))#前后都加，开头结尾都是abc中选一个，
# 数量默认是1，所以只能是单个a单个b单个c
```
#### 匹配分组
x|y 匹配x或y
(pattern) 匹配pattern并获取这一匹配的字符串
```python
"""需求：匹配个位数[0-9]{1}和十位数[1-9]{1}"""
import re
print(re.match(r"^([0-9]|[1-9][0-9])$","89"))
```
#### 原始字符串
r:忽略转义

#### 案例

```python
"""匹配电话号码"""
import re

test = [
    "13812345678",  # 合法
    "11456817239",  # 非法
    "19912345678",  # 合法
    "17138412356",  # 合法
    "1234567890",  # 非法
    "14752345673",  # 合法
    "1800123456",  # 非法
]

pattern = r"^1[356789]\d{9}$"
# 遍历所有手机号判断
for phone in test:
    # match从头匹配，匹配成功返回对象，失败返回None
    res = re.match(pattern, phone)
    if res:
        print(f"{phone} 合法手机号")
    else:
        print(f"{phone} 非法手机号")
```

```python
"""匹配邮箱"""
import re

test = [
    "example@example.com",
    "user.name@subdomain.example.co",
    "username@.com",
    "@missingusername.com",
    "-dasd@qq.com",
]

# 邮箱正则
email_pattern = r"\w+^@\w+\.\w+$"

for mail in test:
    match = re.fullmatch(email_pattern, mail)
    if match:
        print(f"{mail} 合法邮箱")
    else:
        print(f"{mail} 非法邮箱")
```

```python
"""
匹配0-255之前的数字
个位:0-9
十位：10-99
百位：100-255
    100-199
    200-249
    250-255
"""
import re
test = ["0", "9", "50", "100", "199", "200", "255", "256", "-1", "01", "001"]
pattern = r"^([0-9]|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$"
for num in test:
    res = re.fullmatch(pattern, num)
    if res:
        print(f"{num} 合法（0~255）")
    else:
        print(f"{num} 非法")
```
