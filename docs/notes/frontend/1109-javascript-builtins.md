---
title: "JavaScript 内置对象与 JSON 数据交换"
date: 2026-11-09
tags:
  - 前端
  - JavaScript
archived: true
description: "String、Array、Date、Math 等内置对象的常用 API，以及 JSON.stringify / JSON.parse 在浏览器与服务器之间传递数据的作用。"
---

# JavaScript 内置对象与 JSON 数据交换
## 本章内容

- String对象
- RegExp对象
- Array对象
- JSON对象

## String对象

- 构造器

  | 方法            | 说明                   |
  | --------------- | ---------------------- |
  | String(value)   | 根据指定字符串创建对象 |
  | var s ="字符串" | var s ="字符串"        |

- 方法说明

  | 方法                 | 说明                                   |
  | -------------------- | -------------------------------------- |
  | length属性           | 获取字符串长度                         |
  | charAt(index)        | 获取指定索引处的字符                   |
  | indexOf(value)       | 获取指定字符串出现的索引位置找不到为-1 |
  | substring(start,end) | 根据指定索引范围截取字符串(含头不含尾) |
  | split(value)         | 根据指定规则切割字符串，返回数组       |
  | replace(old,new)     | 使用新字符串替换老字符串               |

## RegExp对象

- 构造方法

  | 方法              | 说明                 |
  | ----------------- | -------------------- |
  | let reg =/^规则$/ | 根据规则创建正则对象 |

- 成员方法

  | 方法         | 说明                           |
  | ------------ | ------------------------------ |
  | test(字符串) | 根据指定规则验证字符串是否符合 |

- 代码实现

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RegExp</title>
  </head>
  <body>

  </body>
  <script>
      //1.验证手机号
      //规则：第一位1，第二位358，第三到十一位必须是数字。总长度11
      var reg1 = /[1][358][0-9]{9}/;
      document.write(reg1.test("18688888888") + "<br>");

  </script>
  </html>
  ```

## Array对象

- 方法说明

  | 方法           | 说明                     |
  | -------------- | ------------------------ |
  | push(元素)     | 添加元素到数组的末尾     |
  | pop()          | 删除数组末尾的元素       |
  | shift()        | 删除数组最前面的元素     |
  | includes(元素) | 判断数组是否包含给定的值 |
  | reverse()      | 反转数组中的元素         |

- 代码实现

  ```html
  <html>
  	<head>
  		<meta charset="utf-8">
  		<title>Array对象</title>

  		<script>
  			//定义数组
  			var arr = [1, 2, 3, 4, 5];
  			//push：追加元素
  			arr.push(6);
  			console.log(arr);
  			//pop：移除最后一个元素并返回
  			var val1 = arr.pop();
  			console.log(val1);
  			console.log(arr);
  			//shift：移除第一个元素并返回
  			var val2 = arr.shift();
  			console.log(val2);
  			console.log(arr);
  			//判断是否包含指定元素
  			console.log(arr.includes(4));
  			//数组反转
  			arr.reverse();
  			console.log(arr);

  		</script>
  	</head>
  	<body>
  	</body>
  </html>
  ```

## JSON对象

![浏览器与服务器之间通过 JSON 交换数据](/images/frontend/json-exchange.png)

> **补充整理**：图上是一次完整的前后端交互——浏览器里的 **JS 对象**不能直接通过网络传输，
> 要先用 `JSON.stringify()` 序列化成 **JSON 字符串**再放进请求；服务器响应回来的 JSON 字符串，
> 浏览器也要用 `JSON.parse()` 反序列化成 **JS 对象**才能读属性。两个方法是一对反向操作。

- 概述

  - JSON（JavaScript Object Notation）：轻量级的数据交换格式。
  - 它是 ECMAScript 规范的一个子集，采用独立于编程语言的文本格式存储和表示数据。
  - 层次结构简洁清晰，易于人阅读编写，也易于机器解析生成，网络传输开销小。

- 方法说明

  | 方法 | 说明 |
  | --- | --- |
  | `JSON.stringify(obj)` | 把 JS 对象转换成 JSON 格式字符串（序列化） |
  | `JSON.parse(str)` | 把 JSON 格式字符串解析成 JS 对象（反序列化） |

- 代码实现

```html
<body>

<button onclick="fn1()">js->json</button>
<button onclick="fn2()">json->js</button>

<script>
    //将js对象转换为json字符串
    function fn1() {

        //定义js对象
        var jsObj = {
            "city" : "深圳市",
            "mytime" : "2021年6月5日",
            "wendu" : "32",
            "shidu" : "22%"
        };

        //js对象 -> json字符串
        var jsonStr = JSON.stringify(jsObj);
        console.log(jsonStr);

    }

    //将json字符串转换为js对象
    function fn2() {
        //定义json字符串：此时它还是字符串，不能直接取属性
        var jsonStr = '{"city":"深圳市","mytime":"2021年6月5日","wendu":"32","shidu":"22%"}';
        console.log(jsonStr.city);        // undefined：字符串没有 city 属性
        var jsObj = JSON.parse(jsonStr);  // 先解析成对象
        console.log(jsObj.city);          // 深圳市
    }

</script>

</body>
```
