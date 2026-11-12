---
title: "CSS 基础：引入方式、选择器与常用样式"
date: 2026-11-09
tags:
  - 前端
  - CSS
archived: true
description: "CSS 与 HTML 的三种结合方式、基本与复合选择器、常用样式属性，以及盒子模型与浮动布局。"
---

# CSS 基础：引入方式、选择器与常用样式
## 本章内容

- CSS和HTML结合
- CSS常用属性

## css介绍

- 概述
  - cascading style sheets : 层叠样式表格
- 作用
  - 通过css可以定义html元素如何显示。
  - html相当于毛坯房,很多效果达不到，css相当于是在毛坯基础上做精装修.
- 优点
  - 通过css可以大大提高工作效率，可以让我们将html代码与样式代码分离

## css和html内联结合

> 概述

在标签上使用style属性

- 语法

  ```html
  <标签 style="属性名1:属性值1 ; 属性名2:属性值2 ; ...."></标签>
  ```

- 代码实现

  ```html
  <html>
  	<head>
  		<meta charset="UTF-8">
  		<title>css和html结合之内联结合</title>
  		<!--
  			优点：简单、方便
  			缺点：代码维护麻烦，可复用性差
  		-->
  	</head>
  	<body>

  		<div style="color: red;font-size: 1020px;">这是一个div</div>
  		<div style="color: red;font-size: 1020px;">这是一个div</div>
  		<div style="color: red;font-size: 1020px;">这是一个div</div>
  		....
  	</body>
  </html>
  ```

- 特点

  - 简单方便
  - 复用性差

## css和html内部结合

> 概述

在head标签中使用style标签

- 语法

  ```html
  <head>
   <style>
    元素名{
     属性名1:属性值1;
     属性名2:属性值2;
     ...
    }
   </style>
  </head>
  ```

- 代码实现

  ```html
  <html>
  	<head>
  		<meta charset="UTF-8">
  		<title>css和html结合之内部结合</title>
  		<!--
  			优点：简单、方便、复用性较强
  			缺点：不同文件中的组件样式不可重复
  		-->

  		<style>

  			div{
  				color: red;
  				font-size: 1020px;
  			}

  		</style>
  	</head>
  	<body>

  		<div >这是一个div</div>
  		<div >这是一个div</div>
  		<div >这是一个div</div>
  		....
  	</body>
  </html>
  ```

- 特点

  - 简单方便、可复用性较强
  - 只能作用于当前页面

## css和html外部结合

> 概述

将css样式代码独立放到一个css样式文件中，通过link标签引入到html文件中

- 语法

  ```html
  <head>
  	<link rel="stylesheet" href="css样式文件" />
  </head>
  ```

- 代码实现

  ```html
  <html>
  	<head>
  		<meta charset="UTF-8">
  		<title>css和html结合之外部结合</title>
  		<!--
  			优点：简单、方便、复用性强、可维护性高
  		-->

  		<link rel="stylesheet" href="css/demo01.css" />
  	</head>
  	<body>

  		<div >这是一个div</div>
  		<div >这是一个div</div>
  		<div >这是一个div</div>
  		....
  	</body>
  </html>
  ```

- 特点

  - 简单方便、可复用性强

## css选择器之id选择器

- 概念

  - 它使用#引入，引用的是元素的id属性值。

- 代码实现

  ```html
  <head>
      <style type="text/css">

      	#div1 {
      		font-size: 20px;
      		color: red;
      	}
      	#div2 {
      		font-size: 10px;
      		color: blue;
      	}
      </style>
  </head>
  <body>
      <div id="div1">这是一个div</div>
      <div id="div2">这是一个div</div>
  </body>
  ```

## css选择器之class选择器

- 概念

  - 使用”.”来描述，引用的的是元素上的class属性值

- 代码实现

  ```html
  <head>
  	<title>内部结合</title>
  	<style type="text/css">

  		.div1 {
  			font-size: 20px;
  			color: red;
  		}
  	</style>
  </head>
  <body>
  	<div class="div1">这是一个div</div>
  	<div class="div1">这是一个div</div>
  </body>
  ```

## css选择器之元素选择器

- 概念

  - 对页面上的标签进行统一的设置，引用的就是标签的名称.

- 代码实现

  ```html
  <head>
  	<title>内部结合</title>
  	<style type="text/css">

  		div {
  			font-size: 20px;
  			color: red;
  		}
  	</style>
  </head>
  <body>
  	<div >这是一个div</div>
  	<div >这是一个div</div>
  </body>
  ```

## css选择器之分组

- 概念

  - 多个选择器使用同一段css,那么就可以使用分组。选择器之间使用逗号分开.

- 代码实现

  ```html
  <head>
  	<title>内部结合</title>
  	<style type="text/css">

  		#div1,.c1 {
  			font-size: 20px;
  			color: red;
  		}
  	</style>
  </head>
  <body>
  	<div id="div1">这是一个div</div>
  	<span class="c1">这是一个span</span>
  </body>
  ```

## css选择器之派生选择器

- 概述

  - 通过依据元素在其位置的上下文关系来定义，可以使标记更加简洁。也称为上下文选择器.

- 格式

  ```text
  父标签名(父id,父类名) 子标签名(子id,子类名){
  	样式代码;
  }
  ```

- 需求

  - 设置span中的font中内容样式。

- 代码实现

  ```html
  <body>
  	<span >
  		<font>这是一个font</font>
  	</span>
  	<div >
  		<font>这是一个font</font>
  	</div>
  </body>
  ```

## css字体属性

- 概念
  - CSS 字体属性允许您设置字体系列 (font-family) 和字体加粗 (font-weight)，您还可以设置字体的大小、字体风格（如斜体）和字体变形（如小型大写字母）。
- 常用属性
  - ![image](https://note.youdao.com/yws/public/resource/9bd539ebd1c1bff0672cfb820c28533e/WEBb99c40bde5564a358ff7a581b75bc33d/WEBRESOURCE9f81226e89904cda937ec3b4d39ebcab?ynotemdtimestamp=1794032126656)
- 需求
  - 使用字体属性对p标签进行修饰

## css文本属性

- 概述
  - 可以改变文本的颜色、字符间距，对齐文本，装饰文本，对文本进行缩进，等等。
- 常用属性
  - ![image](https://note.youdao.com/yws/public/resource/9bd539ebd1c1bff0672cfb820c28533e/WEBb99c40bde5564a358ff7a581b75bc33d/WEBRESOURCE0ef6d69ed35e44eda5801ce007dc6161?ynotemdtimestamp=1794032126656)
- 需求
  - 结合文本属性和字体属性写一封情书，要求如下：
    - 标题：字号3em，颜色红色，居中，楷体。
    - 内容：字号1.2em，颜色黑色，居左，宋体，首行缩进2em，行高2em,字符间距0.1em。
