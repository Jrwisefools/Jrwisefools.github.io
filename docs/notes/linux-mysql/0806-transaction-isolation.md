---
title: "事务与隔离级别"
date: 2025-08-06
tags:
  - MySQL
  - 数据库
archived: true
description: "隔离级别 读取的是记录的最新版本,读取时还得保证其他并发事务不能修改当前记录 会对记录进行加锁 select * from stu lock in share mode(共享锁); 简单的select…"
---
隔离级别
### 当前读
读取的是记录的最新版本,读取时还得保证其他并发事务不能修改当前记录
会对记录进行加锁
select * from stu lock in share mode(共享锁);
### 快照读
简单的select（不加锁），读取的是记录数据的可见版本,有可能是历史数据,不加锁,是非阻塞读
read committed:每次select,都生成一个快照读
repeatable read：开启事物后第一个select语句才是快照读的地方，后面再select就还是第一个select
serializable:快照读会退化为当前读
### MVCC
多版本并发控制
使得读写操作没有冲突，快照读为MySQL实现mvcc提供了一个非阻塞功能
依赖于三个隐式字段，undo log日志,readView
#### 记录中隐式字段
![img_5.png](/images/linux-mysql/img_5.png)
DB_TRX_ID 事物id自增默认开始为1
DB_ROW_ID 隐藏主键，如果表中没有指定主键才会生成该字段
DB_ROLL_PTR 回滚指针，开始为null，之后指向上一条

#### undo log日志
在insert的时候，产生的undo log日志只在回滚的时候需要，可以立即被杉树
而updata、delete的时候，产生的undo log日志不仅在回滚的时候需要，在快照读的时候也需要不会被立即删除

** undo log 版本链 **
记录变更之前是什么样子的,之后事物id就会发生变化，回滚指针指向回滚日志
通过回滚指针连起来
![img_6.png](/images/linux-mysql/img_6.png)
undo log 不会立即删除，因为有事务在用到undo log
不同事务或相同事务对同一条记录进行修改，会导致该记录的undolog
生成一条记录版本链表，链表头部是最新的旧记录
尾部是最早的旧记录

### readview
Readview（读视图）是快照读SQL执行时MVCC提前数据的依据
记录并维护系统当前活跃的事务（未提交的）id
核心字段：
m_ids :当前活跃的事务ID集合
min_trx_id :最小活跃事务ID
max_trx_id :预分配事务ID,当前最大事务ID+1(以为事务ID是自增的)
creator_trx_id :ReadView创建者的事务ID

trx_id: 代表的是当前事务ID
1.trx_id == creator_trx_id ----可以访问该版本
2.trx_id < min_trx_id ---------可以访问该版本
3.trx_id > nax_trx_id----------不可访问该版本
4.min_trx_id<=trx_id<=max_trx_id
---如果trx_id不在m_ids中是可以访问该版本的，说明数据已提交
不同隔离级别：
read committed ：事务中每一次执行快照读的时候生成read view
repeatable read：仅在事务中第一次执行快照读时生成ReadView，后续复用

### 用户管理
#### 用户管理的目标
