---
title: "事务与隔离级别"
date: 2025-08-06
tags:
  - MySQL
  - 数据库
archived: true
description: "事务的 ACID 与四种隔离级别，当前读与快照读的区别，以及 MVCC 的实现：隐式字段、undo log 版本链与 ReadView 判定规则。"
---

# 事务与隔离级别

## 事务与 ACID

> **补充整理**：本篇标题是「事务与隔离级别」，原稿直接从隔离级别讲起，
> 这里先把事务本身补齐。
>
> **事务**是一组要么全部成功、要么全部失败的操作单元，由四个特性（ACID）约束：
>
> | 特性 | 含义 | MySQL 靠什么保证 |
> | --- | --- | --- |
> | 原子性 Atomicity | 要么全做，要么全不做 | undo log |
> | 一致性 Consistency | 从一个合法状态到另一个合法状态 | 由前三者 + 约束共同保证 |
> | 隔离性 Isolation | 并发事务之间互不干扰 | 锁 + MVCC |
> | 持久性 Durability | 提交后即使宕机也不丢 | redo log |
>
> 常用语句：
>
> ```sql
> START TRANSACTION;   -- 或 BEGIN
> -- ... 多条 DML ...
> COMMIT;              -- 提交
> -- 或 ROLLBACK;      -- 回滚
> ```

## 并发事务的三个典型问题

> **补充整理**：隔离级别就是围绕这三个问题设计的——
>
> | 问题 | 现象 |
> | --- | --- |
> | **脏读** | 读到了另一个事务**未提交**的修改 |
> | **不可重复读** | 同一事务内两次读同一行，值不一样（被别的事务**改了**） |
> | **幻读** | 同一事务内两次按同样条件查，行数不一样（被别的事务**增删了**） |

## 四种隔离级别

隔离级别从低到高：

| 隔离级别 | 脏读 | 不可重复读 | 幻读 |
| --- | --- | --- | --- |
| 读未提交 READ UNCOMMITTED | 可能 | 可能 | 可能 |
| 读已提交 READ COMMITTED | 不可能 | 可能 | 可能 |
| 可重复读 REPEATABLE READ | 不可能 | 不可能 | 基本避免\* |
| 串行化 SERIALIZABLE | 不可能 | 不可能 | 不可能 |

> **补充整理**：
>
> - MySQL 默认隔离级别是 **REPEATABLE READ**，Oracle / PostgreSQL 默认是 **READ COMMITTED**
> - `*` 处：MySQL 在 RR 下靠 **MVCC 的快照读** 避免大部分幻读，靠 **next-key lock
>   （行锁 + 间隙锁）** 避免当前读下的幻读，所以严格说不是 100% 消灭
> - 级别越低并发越高、一致性风险越大；绝大多数业务用默认的 RR 即可，
>   只有对一致性要求极高的场景（如金融对账）才考虑 SERIALIZABLE
> - 查看与设置：
>   ```sql
>   SELECT @@transaction_isolation;                       -- MySQL 8.0
>   SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
>   ```

## 当前读

读取的是记录的最新版本，读取时还得保证其他并发事务不能修改当前记录
会对记录进行加锁

```sql
SELECT * FROM stu LOCK IN SHARE MODE;   -- 共享锁（S 锁）
SELECT * FROM stu FOR UPDATE;           -- 排他锁（X 锁）
-- UPDATE / DELETE / INSERT 也都会走当前读
```

## 快照读

简单的 select（不加锁），读取的是记录数据的可见版本，有可能是历史数据，不加锁，是非阻塞读

- READ COMMITTED：每次 select，都生成一个快照读
- REPEATABLE READ：开启事务后第一个 select 语句才是快照读的地方，后面再 select 就还是第一个 select
- SERIALIZABLE：快照读会退化为当前读

> **补充整理**：「当前读 / 快照读」这组概念是理解隔离级别的关键——
>
> | | 当前读 | 快照读 |
> | --- | --- | --- |
> | 读到的版本 | 最新版本 | 事务开始/语句开始时的可见版本 |
> | 是否加锁 | 加（S 锁 / X 锁 / 间隙锁） | 不加 |
> | 是否阻塞 | 可能被阻塞 | 非阻塞 |
> | 典型语句 | `FOR UPDATE`、`UPDATE`、`DELETE` | 普通 `SELECT` |
>
> 正是「快照读不加锁」，才让 MySQL 能在保证 RR 的同时仍维持高并发。

## MVCC

多版本并发控制
使得读写操作没有冲突，快照读为 MySQL 实现 MVCC 提供了一个非阻塞功能
依赖于三个隐式字段、undo log 日志、ReadView

### 记录中的隐式字段

![img_5.png](/images/linux-mysql/img_5.png)

- `DB_TRX_ID`：事务 id，自增，默认开始为 1
- `DB_ROW_ID`：隐藏主键，如果表中没有指定主键才会生成该字段
- `DB_ROLL_PTR`：回滚指针，开始为 null，之后指向上一条

### undo log 日志

在 insert 的时候，产生的 undo log 日志只在回滚的时候需要，可以立即被删除
而 update、delete 的时候，产生的 undo log 日志不仅在回滚的时候需要，在快照读的时候也需要，不会被立即删除

**undo log 版本链**

记录变更之前是什么样子的，之后事务 id 就会发生变化，回滚指针指向回滚日志，通过回滚指针连起来

![img_6.png](/images/linux-mysql/img_6.png)

undo log 不会立即删除，因为有事务在用到 undo log
不同事务或相同事务对同一条记录进行修改，会导致该记录的 undo log 生成一条记录版本链表，
链表头部是最新的旧记录，尾部是最早的旧记录

> **补充整理**：原稿中「事物」统一修正为「事务」，「杉树」修正为「删除」，
> 「updata」修正为「update」。
>
> undo log 的回收时机值得记一下：MySQL 后台有 **purge 线程**负责清理，
> 判断标准是「当前没有任何 ReadView 还需要这条版本」——
> **长事务不提交，undo log 就会一直堆积**，这是生产上 ibdata / undo 表空间暴涨的常见原因。
> 所以大批量操作要拆小事务、`SELECT ... FOR UPDATE` 用完尽快提交。

## ReadView

ReadView（读视图）是快照读 SQL 执行时 MVCC 提取数据的依据
记录并维护系统当前活跃的事务（未提交的）id

核心字段：

- `m_ids`：当前活跃的事务 ID 集合
- `min_trx_id`：最小活跃事务 ID
- `max_trx_id`：预分配事务 ID，当前最大事务 ID + 1（因为事务 ID 是自增的）
- `creator_trx_id`：ReadView 创建者的事务 ID

`trx_id` 代表的是当前事务 ID，可见性判定规则：

1. `trx_id == creator_trx_id` —— 可以访问该版本（是自己改的）
2. `trx_id < min_trx_id` —— 可以访问该版本（已提交且比最早活跃事务还早）
3. `trx_id > max_trx_id` —— 不可访问该版本（是 ReadView 创建之后才开启的事务）
4. `min_trx_id <= trx_id <= max_trx_id` —— 如果 `trx_id` **不在** `m_ids` 中则可以访问该版本（说明已提交）

不同隔离级别下 ReadView 的生成时机：

- READ COMMITTED：事务中每一次执行快照读的时候生成 ReadView
- REPEATABLE READ：仅在事务中第一次执行快照读时生成 ReadView，后续复用

> **补充整理**：这一条就是「可重复读」这个名字的来源——
>
> RR 下 **ReadView 只在第一次快照读时生成一次**，之后整条事务都用它做判定，
> 所以别人提交的修改你看不见，两次读结果必然一致。
> RC 下**每次快照读都重新生成 ReadView**，所以别的事务一提交你就看见了，
> 同一事务内两次读结果可能不同（不可重复读）。
>
> 一句话记忆：**MVCC 靠「版本链 + ReadView」实现，隔离级别靠「ReadView 的生成时机」区分。**
