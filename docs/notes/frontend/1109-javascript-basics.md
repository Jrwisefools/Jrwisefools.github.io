---
title: "JavaScript 基础：语法、函数与流程控制"
date: 2026-11-09
tags:
  - 前端
  - JavaScript
archived: true
description: "JavaScript 的定位、引入方式、变量与数据类型、运算符、函数定义与调用，以及分支与循环。"
---

# JavaScript 基础：语法、函数与流程控制
## 本章内容

- JavaScript的概述
- ECMAScript基本语法

## 01_JavaScript的概述

- 概念
  - 一门客户端脚本语言.
  - 脚本语言：不需要编译，直接就可以被浏览器解析执行.
- 作用
  - 核心功能就是增强用户和 HTML 页面的交互过程，让页面有一些动态效果。以此来增强用户的体验！
- 发展史
  - 1995年，Netscape(网景)公司，开发了一门客户端脚本语言：LiveScript。后来，请来SUN公司的专家，修改LiveScript，命名为JavaScript
  - 1996年，微软抄袭JavaScript开发出JScript语言
  - 1997年，ECMA(欧洲计算机制造商协会)，制定出客户端脚本语言的标准：**ECMAScript**(javascrpt基础)，就是统一了所有客户端脚本语言的编码方式。
- D.总结
  - JavaScript = ECMAScript + JavaScript自己特有的东西(`BOM`浏览器对象模型  +  `DOM`节点对象模型)

## 02_ECMAScript之与html结合

- 分类
  - 内部结合
    - 定义`<script>`，标签体内容就是js代码
  - 外部结合
    - 定义`<script>`，通过src属性引入外部的js文件

## 03_ECMAScript之注释

- 语法

  ```text
  //单行注释
  ```

  ```text
  /*多行注释*/
  ```

## 04_ECMAScript之变量和常量

- 语法

  ```text
  var 变量名 = 值;//定义变量
  const 常量名 = 值;//定义常量
  ```

## 05_ECMAScript之数据类型

- 概述

  - javascript是一个弱类型语言，java是一个强类型语言
  - 强类型语言
    - 定义变量时，必须确定变量的数据类型
  - 弱类型语言
    - 定义变量时，不确定变量的数据类型

- 数据类型

  | 数据类型     | 说明                   |
  | ------------ | ---------------------- |
  | boolean      | 布尔类型，true或false  |
  | null         | 声明null值的特殊关键字 |
  | undefined    | 代表变量未定义         |
  | number       | 整数或浮点型           |
  | string       | 字符串                 |
  | 引用数据类型 | 对象                   |

- 代码实现

  ```html
  <html>
  	<head>
  		<meta charset="utf-8" />
  		<title></title>
  		<script>
  			var v1 = true;
  			console.log(typeof(v1));//boolean
  			var v2 = null;
  			console.log(typeof(v2));//null
  			var v3 ;
  			console.log(typeof(v3));//undefined
  			var v4 = 1;
  			console.log(typeof(v4));//number
  			var v5 = "hello";
  			console.log(typeof(v5));//string
  		</script>
  	</head>
  	<body>
  	</body>
  </html>
  ```

- 注意事项

  - 您也许会问，为什么 typeof 运算符对于 null 值会返回 "Object"。这实际上是 JavaScript 最初实现中的一个错误，然后被 ECMAScript 沿用了。

## 07_ECMAScript之运算符

- 算术运算符
  ![image](https://note.youdao.com/yws/public/resource/9bd539ebd1c1bff0672cfb820c28533e/WEBf1cf46d4fb00442687a8d30c1835182b/WEBRESOURCE0fd1c9213b0545778e5925225bede408?ynotemdtimestamp=1794032975077)

- 赋值运算符
  ![image](https://note.youdao.com/yws/public/resource/9bd539ebd1c1bff0672cfb820c28533e/WEBf1cf46d4fb00442687a8d30c1835182b/WEBRESOURCE8e5368b224e14f2180b7f3985dee9d92?ynotemdtimestamp=1794032975077)

- 比较运算符
  ![image](https://note.youdao.com/yws/public/resource/9bd539ebd1c1bff0672cfb820c28533e/WEBf1cf46d4fb00442687a8d30c1835182b/WEBRESOURCEd3cf5db095834ebaa185ff5594709e90?ynotemdtimestamp=1794032975077)

- 逻辑运算符
  ![image](https://note.youdao.com/yws/public/resource/9bd539ebd1c1bff0672cfb820c28533e/WEBf1cf46d4fb00442687a8d30c1835182b/WEBRESOURCE99501bc23a4c419b8fec137bdb2fe26e?ynotemdtimestamp=1794032975077)

- 三元运算符

- 代码实现

  ```html
  <html>
  	<head>
  		<meta charset="utf-8" />
  		<title></title>
  		<script>
  			var v1 = 1;
  			var v2 = "1";
  			console.log(v1 == v2);//true
  			console.log(v1 === v2);//false
  		</script>
  	</head>
  	<body>
  	</body>
  </html>
  ```

## ECMAScript之流程控制

- if 语句
- switch语句
- for循环
- while 循环

## ECMAScript之函数

- 09-ECMAScript之函数

  概述 函数类似于 java 中的方法，可以将一些代码进行抽取，达到复用的效果

  语法

  ```js
  // 函数声明（命名函数）
  function 函数名(形式参数列表){
    函数体;
  }

  // 匿名函数（函数表达式）
  var 方法名 = function(形式参数列表){
    函数体;
  };
  ```

  注意事项

  1. 匿名函数通常是在事件监听中使用。
  2. 函数声明：存在**变量提升**，调用可以写在函数定义之前
  3. 函数表达式（匿名函数）：不存在变量提升，**必须先定义，后调用**
  4. 形参和实参数量可以不一致
     - 实参少于形参：未传值的形参默认为 `undefined`，数字和undefined运算得到 `NaN`
     - 实参多于形参：多余实参直接被忽略
  5. `==` 宽松相等：会自动进行类型转换；`===` 严格相等：不做类型转换，类型和值都相同才为true

  示例代码

  ```javascript
  // 函数声明
  function fn1(){
      console.log("fn1...")
  }
  fn1()

  // 匿名函数（函数表达式）
  let fn2 = function (){
      console.log("fn2...")
  }
  fn2()

  // 带参数函数
  function sum(num1,num2){
      console.log(num1+num2)
  }
  sum(1)   // NaN
  sum(1,2) // 3
  ```

  ------

  ### 考点速记

  - 函数声明：`function 名字() {}` ✅ 提升
  - 函数表达式：`let/var 变量 = function(){}` ❌ 不提升
  - 少传参数 → 缺失形参 = undefined
  - 数字 + undefined → NaN
