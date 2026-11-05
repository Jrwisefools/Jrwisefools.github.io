---
title: "集合框架与泛型"
date: 2026-11-05
tags:
  - Java
  - 集合
  - 泛型
archived: true
description: "集合与数组的取舍、Collection / Map 两大体系、自定义泛型类 / 接口 / 方法、Collection 与 Map 方法速查、HashSet 去重原理、迭代器与 Collections 工具类。"
---

# Day 5 · 集合框架与泛型

## Java 集合框架

- 数组长度**固定**，集合**可变**，更好添加、修改
- 数组只能存同类型，集合配合泛型可以灵活存储
- 数组不灵活、不够单一；集合灵活、强大，但集合比数组性能差

### 集合两大体系

**`Collection` 接口**（单列集合，存一个一个的元素）

- `List`（有序、可重复）
  → `ArrayList`（查询效率高，但删除和添加效率低）、`LinkedList`（增加删除效率高，查询效率低）
- `Set`（无序、不可重复，要去重的时候用）
  → `HashSet`、`TreeSet`（红黑树，排序用）——实际上只会常用 `HashSet`

**`Map` 接口**（双列集合，存一个键、一个值）

- `HashMap`（最常用，无序）
- `TreeMap`
- `LinkedHashMap`（由链表演变而来）

### 集合 VS 数组

| 维度 | 数组 | 集合 |
| --- | --- | --- |
| 长度 | 固定 | 可变 |
| 类型 | 一种 | 配合泛型灵活 |
| 功能 | 增删改查麻烦 | 方法丰富 |
| 性能 | 更高 | 略低（够用） |

> 集合底层还是有数组的。

> **补充整理**：把上面的体系画成树，选型时按「**要不要去重 / 要不要键值 / 要不要排序**」三问往下走：
>
> ```text
> Collection（单列）
> ├─ List 有序可重复
> │   ├─ ArrayList   数组实现，随机访问 O(1)、中间增删 O(n) → 默认首选
> │   └─ LinkedList  双向链表，头尾增删 O(1)、随机访问 O(n) → 队列 / 栈
> └─ Set  不可重复
>     ├─ HashSet     哈希表，无序，查询 O(1) → 默认首选
>     ├─ LinkedHashSet 哈希表 + 链表，保留插入顺序
>     └─ TreeSet     红黑树，自动排序 O(log n)
>
> Map（键值对，key 不可重复，不是 Collection 的子接口）
> ├─ HashMap        哈希表，无序 → 默认首选
> ├─ LinkedHashMap  保留插入顺序，可实现 LRU
> └─ TreeMap        按 key 排序
> ```
>
> 两个常见误区：
>
> - `LinkedList` 除了**头尾**增删，中间位置照样要先遍历到那个下标，并不比 `ArrayList` 快；实际业务 95% 用 `ArrayList`。
> - `Map` **不继承 `Collection`**，它是独立的另一套接口，只是习惯上和它们一起叫「集合框架」。
>
> 性能那句「集合比数组差」也要加前提：主要指包装类拆装箱、扩容拷贝和额外的对象头开销；
> 在绝大多数业务代码里这点开销完全可以忽略，**可读性和开发效率优先**。

## 泛型

用来规定集合的类型（但泛型可以用在任何位置）。

若没有泛型，任何类型的参数都可以加到集合里，会被默认变成 `Object` 类型，
之后就需要强转来改变类型（该过程容易发生类型转换错误）。
所以加泛型可以**省略强转、指定集合内元素类型**。

新特性**菱形泛型**：省去后面的类型名。

```java
List<String> list = new ArrayList<String>();   // 只能存 String
List<String> list2 = new ArrayList<>();       // 菱形泛型，JDK 7 起推荐
```

> **补充整理**：泛型最核心、也最反直觉的一条是**类型擦除**：
> 泛型只存在于**编译期**，编译后 `List<String>` 和 `List<Integer>` 在 JVM 里都是裸 `List`，
> 运行时拿不到 `T` 的具体类型（`list instanceof List<String>` 是非法写法）。
> 由此推出一串限制，面试和踩坑都很常见：
>
> - 不能 `new T()`、不能 `new T[]`、不能用基本类型做泛型参数（所以才要包装类）
> - 静态方法 / 静态字段**不能使用类上定义的泛型**（下面「静态泛型方法」那节会说原因）
> - 不能 `catch (T e)`，也不能创建泛型异常类
> - 想绕过擦除拿类型，得显式传一个 `Class<T>` 参数（很多 JSON 库就是这么做的）
>
> 另外 `List<Object>` **不是** `List<String>` 的父类（泛型不协变），
> `List<Object> o = stringList;` 直接编译报错，否则就能往里塞 `Integer` 破坏类型安全。
> 需要「接收任意类型的 List」用通配符 `List<?>`；
> 只读场景用 `List<? extends Number>`，只写场景用 `List<? super Integer>`（PECS 原则）。

### 自定义泛型类

如果泛型不确定就是 `Object`，但没必要——规定泛型就是为了规定类型。

```java
class MyGenericClass<T, R> {   // 可以给一个，也可以给多个，常用的就是 T、R、K、V、E
}
```

> 泛型确定的时机：1. 创建该类对象时；2. 继承泛型类的时候。
> 定义子类的时候可以不确定泛型，让子类也是一个泛型类，到创建子类对象时再确定。

```java
// 自定义泛型类
public class Demo {
    public static void main(String[] args) {
        MyClass<String, Integer> myClass = new MyClass<>();
        myClass.t = "我是T类型";
        String a = myClass.show(myClass.t, 1);
        System.out.println(a);
    }
}

// 注意尖括号写在哪，就是在哪声明一套新的泛型参数
class MyClass<T, E> {
    // 如果要定义成员变量为泛型类型，必须用类中已声明的泛型，
    // 不能凭空定义一个类里没有的泛型
    public T t;

    // 反例：方法上再声明一个新的 <T> 会隐藏掉类的 <T>，
    // 两个 T 其实不一定是同一种类型，写同一个字母容易混淆
    // public <T> T show(T b, E a) { ... }

    public T show(T b, E a) {
        System.out.println(b);
        System.out.println(a);
        return t;
    }
}
```

> **补充整理**：原稿这段示例里先定义了 `myclass`、后面却调用 `myclass1.show(...)`，
> 变量名对不上编译不过，已统一成 `myClass`，顺手把右侧换成菱形写法。
>
> 关于「尖括号写在哪就在哪声明一套新泛型」这句，值得再强调一次：
> 类上的 `<T, E>` 作用域是**整个类的实例成员**；方法上单独写 `<T>` 是**这一方法专用**的一套，
> 会遮蔽同名的类泛型。原稿注释里的反例说的就是这件事——
> 所以方法级泛型建议换个字母（如 `<R>`），避免看代码的人以为它和类的 `T` 是同一个类型。

### 自定义泛型接口

```java
interface 接口名<泛型1, 泛型2, ...> {
    返回值类型 方法名(形参列表);
}
```

> 在匿名内部类中确定类型，或者子类实现接口的时候确定类型。
> 子类实现接口时不能再定义一套新的 `<泛型>`，直接不写 `<>`；
> 也有可能不写 `<>`，让接口的泛型沿用子类的泛型。

> **补充整理**：三种用法放一起看最清楚（以 JDK 自带的 `Comparable<T>` / `List<E>` 为例）：
>
> ```java
> // ① 实现时直接定死类型
> class UserSorter implements Comparator<User> { ... }
>
> // ② 子类继续保留泛型，交给创建者决定
> class MyList<E> implements List<E> { ... }
>
> // ③ 匿名内部类里确定（Day 3 讲过匿名内部类）
> Comparator<User> c = new Comparator<User>() {
>     public int compare(User a, User b) { return a.getId() - b.getId(); }
> };
> ```
>
> 原稿说「子类不能再定义 `<泛型>`」指的是第 ① 种情况——接口已经把类型定死了，
> 实现类再写一遍 `<E>` 反而变成声明了一个**新的、毫无关系的**泛型参数，属于常见笔误。
> 顺带一提：泛型接口 + Lambda 是 `Comparator` / `Function` 的日常写法，很少再手写实现类。

### 自定义泛型方法

在**方法上**定义泛型，不在类中定义泛型。

```java
修饰符 <泛型1, 泛型2, ...> 返回值类型 方法名(形参列表) {
    方法体;
    return 结果;
}
```

> 泛型方法在**调用方法的时候**确定类型，传入什么类型就确定什么类型。

### 静态泛型方法

普通泛型方法可以用类上面的泛型；
**静态泛型方法无法用类的泛型**——静态方法随着类的加载而加载，类加载时还没有创建对象，无法确定泛型，所以不能用。

```java
修饰符 static <泛型1, 泛型2, ...> 返回值类型 方法名(形参列表) {
    方法体;
    return 结果;
}
```

> 静态泛型方法在**调用静态方法的时候**确定类型，不能使用类上定义的泛型。

> **补充整理**：给个能跑的例子，「泛型方法」和「用类泛型的普通方法」区别一眼就明白：
>
> ```java
> class Box<T> {
>     // 普通方法：用的就是类上的 T，所有实例共享同一个 T
>     public T get(T v) { return v; }
>
>     // 泛型方法：自己声明的 <R>，和类的 T 无关，每次调用独立推断
>     public <R> R convert(R v) { return v; }
>
>     // 静态泛型方法：必须自己声明 <R>，不能碰类上的 T
>     public static <R> R of(R v) { return v; }
> }
>
> String s = Box.<String>of("hi");   // 也可省略，靠实参自动推断
> ```
>
> 根本原因就是原稿那句：**类的泛型属于「对象」，静态方法属于「类」，类加载时对象还不存在**。
> 所以静态方法里既不能用类的 `T`，也不能访问 `this`、不能访问实例成员（Day 2 讲过）。

## Collection 接口

单列集合体系的**根接口**，这里面的方法相当于所有单列集合的通用方法。

| 返回值 | 方法 | 说明 |
| --- | --- | --- |
| `boolean` | `add(E e)` | 确保此 collection 包含指定的元素（可选操作） |
| `boolean` | `addAll(Collection<? extends E> c)` | 将指定 collection 中的所有元素添加到此 collection |
| `void` | `clear()` | 移除此 collection 中的所有元素（可选操作） |
| `boolean` | `contains(Object o)` | 如果此 collection 包含指定的元素，则返回 true |
| `boolean` | `containsAll(Collection<?> c)` | 如果此 collection 包含指定 collection 中的所有元素，则返回 true |
| `boolean` | `equals(Object o)` | 比较此 collection 与指定对象是否相等 |
| `int` | `hashCode()` | 返回此 collection 的哈希码值 |
| `boolean` | `isEmpty()` | 如果此 collection 不包含元素，则返回 true |
| `Iterator<E>` | `iterator()` | 返回在此 collection 的元素上进行迭代的迭代器 |
| `boolean` | `remove(Object o)` | 从此 collection 中移除指定元素的单个实例，如果存在的话 |
| `boolean` | `removeAll(Collection<?> c)` | 移除此 collection 中那些也包含在指定 collection 中的元素 |
| `boolean` | `retainAll(Collection<?> c)` | 仅保留此 collection 中那些也包含在指定 collection 的元素 |
| `int` | `size()` | 返回此 collection 的元素数 |
| `Object[]` | `toArray()` | 返回包含此 collection 中所有元素的数组 |
| `<T> T[]` | `toArray(T[] a)` | 返回包含此 collection 中所有元素的数组；返回数组的运行时类型与指定数组的类型相同 |

### List 接口（有序、可重复）

> **补充整理**：原稿这里只有标题，补一下 `List` 相比 `Collection` 多出来的能力——
> **有下标**，所以能按下标精确增删改查：
>
> ```java
> List<String> list = new ArrayList<>();
> list.add("A");  list.add("B");
> list.add(1, "X");            // 指定下标插入：[A, X, B]
> list.get(1);                  // 按下标取：X
> list.set(1, "Y");            // 按下标改：[A, Y, B]
> list.remove(1);              // 按下标删：[A, B]
> list.indexOf("B");           // 查下标
> List<String> sub = list.subList(0, 1);   // 截取视图（改它会影响原集合）
> ```
>
> 一个坑：`List<Integer>` 调 `remove(1)` 走的是**按下标删**，不是「删掉元素 1」；
> 想按值删要写 `remove(Integer.valueOf(1))`。另外 `Arrays.asList(...)` 返回的是**固定长度**
> 的列表，`add` / `remove` 会抛 `UnsupportedOperationException`，需要可变列表就再包一层
> `new ArrayList<>(Arrays.asList(...))`。

### Set 接口（无序、不可重复）

数字会恰好满足哈希码的顺序，Set 接口就是根据哈希码排序。

> **补充整理**：这句记反了，很容易误导。**`HashSet` 是无序的**，它按 `hashCode` 算出
> 桶下标来存，遍历顺序既不保证插入顺序、也不保证大小顺序；
> 之所以「存一堆小整数看起来是有序的」，只是因为 `Integer` 的 `hashCode` 就等于它自身的值，
> 小整数恰好落在连续的桶里，**纯属巧合**，换成大数或字符串立刻就乱。
>
> 真要顺序只有两种：`LinkedHashSet`（按插入顺序）、`TreeSet`（按大小 / 比较器排序）。
> 另外 `Set` 判断重复**不靠 `==`、也不靠内容比对**，而是 `hashCode` + `equals` 两步，
> 这正是下一节的重点。

### 自定义对象存入 HashSet

一句话：**`HashSet` 底层是 `HashMap`，存入元素时先比较 `hashCode`，
`hashCode` 不同直接判定不同；`hashCode` 相同再用 `equals` 比较，
`equals` 相等则判定为重复，不存入。**

> **补充整理**：由此得出一条铁律——**自定义对象放进 `HashSet` / 当 `HashMap` 的 key，
> 必须同时重写 `hashCode()` 和 `equals()`**（Day 4 的 `Object` 类那节讲过契约）。
> 只重写 `equals` 的话，两个「内容相同」的对象因为哈希码不同会被放进两个桶，去重直接失效。
>
> 还有一条同样重要：**当 key 的字段不要被修改**。对象存入后如果改了参与哈希计算的字段，
> 它的哈希码变了，`contains` / `remove` / `get` 就再也找不到它了（还造成内存泄漏）。
> 所以 Map 的 key 首选不可变对象：`String`、`Integer`、或用 `record` / `final` 字段定义的类。

### 迭代器

> 所有 `Collection` 都可以用迭代器遍历。

```java
List<String> list = Arrays.asList("A", "B", "C");
Iterator<String> it = list.iterator();

while (it.hasNext()) {
    String s = it.next();
    System.out.println(s);
    if ("B".equals(s)) {
        it.remove();   // 安全的删除方式
    }
}
```

> **补充整理**：`it.remove()` 是遍历中删元素的正确姿势。
> 增强 for 循环底层就是迭代器，**遍历时直接 `list.remove(...)` 会抛
> `ConcurrentModificationException`**（fail-fast 机制：迭代器发现 `modCount` 被外部改动了）。
>
> 上面的例子其实还有个隐患：`Arrays.asList` 返回定长列表，`it.remove()` 会抛
> `UnsupportedOperationException`，实际代码请改用 `new ArrayList<>(Arrays.asList(...))`。
>
> 另外几个选择：单线程删元素用 `Iterator.remove()` 或 `list.removeIf(...)`（JDK 8+，最省心）；
> **多线程**场景要用 `java.util.concurrent` 下的 `ConcurrentHashMap` / `CopyOnWriteArrayList`，
> 它们的迭代器是弱一致性的，不会抛这个异常。

### Map 接口（双列集合）

将**键**映射到值的对象，键不能重复。

#### Map 接口方法速查表（整理）

| 方法 | 返回值 | 作用说明 |
| --- | --- | --- |
| `clear()` | `void` | 清空当前 Map 里所有键值对（可选操作） |
| `containsKey(Object key)` | `boolean` | 判断 Map 是否存在指定 key，存在返回 true |
| `containsValue(Object value)` | `boolean` | 判断 Map 是否有任意一个 key 映射到该 value |
| `entrySet()` | `Set<Map.Entry<K,V>>` | 返回所有键值对（Entry）的 Set 视图，**遍历键值对用它** |
| `equals(Object o)` | `boolean` | 和另一个 Map 比较，判断两个 Map 键值对是否完全一样 |
| `get(Object key)` | `V` | 根据 key 获取对应的 value；key 不存在返回 `null` |
| `hashCode()` | `int` | 获取当前 Map 的哈希码 |
| `isEmpty()` | `boolean` | 判断 Map 是否为空（没有键值对） |
| `keySet()` | `Set<K>` | 返回所有 key 组成的 Set 视图，**单独遍历 key 用它** |
| `put(K key, V value)` | `V` | 添加 / 覆盖键值对；key 旧值存在则返回旧 value，不存在返回 `null` |
| `putAll(Map<? extends K,? extends V> m)` | `void` | 把传入 Map 的全部键值对复制进来 |
| `remove(Object key)` | `V` | 根据 key 删除键值对；删除成功返回被删的 value，不存在返回 `null` |
| `size()` | `int` | 获取 Map 中键值对的数量 |
| `values()` | `Collection<V>` | 返回所有 value 组成的 Collection 视图，**只遍历值用它** |

> **补充整理**：三种遍历方式，效率差别很实在：
>
> ```java
> // ① 推荐：一次拿到 key 和 value，只查一次哈希
> for (Map.Entry<String, Integer> e : map.entrySet()) {
>     System.out.println(e.getKey() + "=" + e.getValue());
> }
>
> // ② 只要 key
> for (String k : map.keySet()) { ... }
>
> // ③ 反模式：先取 key 再 get 一次，多一轮哈希查找
> for (String k : map.keySet()) { Integer v = map.get(k); }
> ```
>
> 几个高频 API（原稿表里没有但天天用）：`getOrDefault(k, 默认值)` 避免 null 判断、
> `putIfAbsent` / `computeIfAbsent` 做分组或缓存、`merge` 做计数、
> `Map.of("a", 1, "b", 2)`（JDK 9+）创建不可变小 Map。
>
> `HashMap` 底层是「数组 + 链表 / 红黑树」：链表长度 ≥ 8 且数组容量 ≥ 64 时转红黑树，
> 默认负载因子 0.75，扩容翻倍。它不是线程安全的，多线程请用 `ConcurrentHashMap`，
> **别用 `Hashtable`**（全表加锁，早已过时）。

### Collections 工具类

> 类似 Python 的内建函数，提供了大量集合的静态方法。

```java
List<Integer> list = new ArrayList<>(Arrays.asList(5, 1, 3, 2, 4));

// 排序
Collections.sort(list);                  // [1, 2, 3, 4, 5]
Collections.reverse(list);               // [5, 4, 3, 2, 1]
Collections.shuffle(list);               // 随机打乱

// 最大最小
Collections.max(list);
Collections.min(list);

// 二分查找（要求已排序）
Collections.binarySearch(list, 3);

// 线程安全包装
List<Integer> syncList = Collections.synchronizedList(new ArrayList<>());

// 不可变集合
List<Integer> immutable = Collections.unmodifiableList(list);
immutable.add(6);   // 抛 UnsupportedOperationException

// 填充
Collections.fill(list, 0);   // [0, 0, 0, 0, 0]

// 频次
Collections.frequency(list, 3);   // 统计 3 出现次数
```

> **补充整理**：两点小提醒——
>
> - `Collections.binarySearch` 有个坑：**必须先排序**，否则结果未定义；没找到时返回的是
>   `-(插入点) - 1`（一个负数），不是简单的 `-1`。
> - `unmodifiableList` / `synchronizedList` 返回的都是**原列表的视图**，
>   持有原引用照样能改动它，并不是真的做了一份快照。
>   想要真正不可变的副本用 JDK 9+ 的 `List.copyOf(list)` 或 `List.of(...)`，
>   注意这些不可变集合**不允许 `null` 元素**。
>
> 另外 `Collections.sort` 现在更常直接写 `list.sort(Comparator.naturalOrder())`，
> 需要按对象字段排序就 `list.sort(Comparator.comparing(User::getAge))`（方法引用，Day 4 讲过）。
