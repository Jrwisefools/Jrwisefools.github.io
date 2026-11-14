---
title: "HTML 基础：文档结构与常用标签"
date: 2026-11-07
tags:
  - 前端
  - HTML
archived: true
description: "从超文本与标记语言的概念出发，梳理 HTML 书写规范、文件标签、文本/图片/链接/表格/表单等常用标签与属性。"
---

# HTML 基础：文档结构与常用标签
## 本阶段技术体系

​	客户端技术

- html、css、javascript、vue、ajax、axios

- 服务端技术
  - tomcat、servlet、request、response、cookie、session、filter、listener

## html介绍

- 概述
  - Hyper Text Markup Language : 超文本标记语言
  - Html是一种描述网页语言。
- 名词解释
  - 什么是超文本?
    - 超文本指的是网页上可以包含图片，视频，链接信息。
  - 什么是标记
    - 标记也叫做标签
  - 什么语言
    - 语言就是一种交流工具，html是我们开发人员与浏览器之间交互工具。

## html书写规范

> 语法

```html
<开始标签 属性1="属性值" 属性2="属性值">内容</结束标签>
```

> 注意事项

html文件的后缀可以是html或htm
属性必须写在开始标签中

## 文件标签

- 分类
  - html标签
    - 代表当前书写的是一个html文档
  - head标签
    - 存储的本页面的一些重要的信息，它不会显示
  - title标签
    - 用于定义页面的标题的。
  - body标签
    - 书写的内容会显示出来
- 需求
  - 页面标题显示"html"
  - 页面内容显示"hellohtml"

## 标签属性

- 概述
  - 大多数标签它具有属性,属性值要使用引号引起来,对标签中的内容进行修改.
- body常用属性
  - text:用于设置文字颜色
  - bgcolor:用于设置页面的背景色
  - background:用于设置页面的背景图片
- 颜色取值
  - 直接写颜色单词，比如:red、blue、green
  - 通过16进制描述颜色，比如：#FF0000（红色） #00FF00 （绿色）

## 文本标签之br标签

- 概述

  - 可插入一个简单的换行符。`<br/>`自关闭标签

- 代码实现

  ```html
  <html>
    <head>
     <meta charset="UTF-8">
     <title>br标签</title>
    </head>
    <body>
     不忘初心，<br/>方得始终。

    </body>
  </html>
  ```

## 文本标签之p标签

- 概述

  - 标签定义段落。
  - p 元素会自动在其前后创建一些空白。浏览器会自动添加这些空间，您也可以在样式表中规定。
  - 自动占满一行,属于块级标签

- 常用属性

  ```html
  align: 规定p标签中的内容的文本对齐方式，值有：left 、right、center
  ```

- 代码实现

  ```html
  <html>
   <head>
    <meta charset="UTF-8">
    <title>p标签</title>
   </head>
   <body>
    <br>
    空山不见人，<br><br>但闻人语响。<br><br>
    返景入深林，<br><br>复照青苔上。<br><br>

    <p align="center">鹿柴</p>
    <p align="center">空山不见人</p>
    <p align="center">但闻人语响</p>
    <p align="center">返景入深林</p>
    <p align="center">复照青苔上</p>
   </body>
  </html>
  ```

## 文本属性之font标签

- 概述

  - 规定文本的字体、字体尺寸、字体颜色。

- 常用属性

  | 属性名称 | 属性介绍     | 可能的值                 |
  | -------- | ------------ | ------------------------ |
  | color    | 设置文本颜色 | 颜色名称、颜色的十六进制 |
  | face     | 设置字体样式 | 微软雅黑、楷体等等       |
  | size     | 设置字体大小 | 1~7                      |

- 代码实现

  ```html
  <html>
    <head>
     <meta charset="UTF-8">
     <title>font标签</title>

    </head>
    <body>

     <p align="center">
      <font color="#0055FF" face="楷体" size="9">鹿柴</font>
     </p>
     <hr size="7" width="50%" align="center" />
     <p align="center">空山不见人</p>
     <p align="center">但闻人语响</p>
     <p align="center">返景入深林</p>
     <p align="center">复照青苔上</p>
    </body>
  </html>
  ```

## 文本标签之标题标签

- 概述

  ```text
  <h1> - <h6> 标签可定义标题。<h1> 定义最大的标题。<h6> 定义最小的标题。
  ```

- 常用属性

  | 属性名称 | 属性介绍     | 可能的值            |
  | -------- | ------------ | ------------------- |
  | align    | 设置对齐方式 | left、center、right |

- 代码实现

  ```html
  <html>
    <head>
     <meta charset="UTF-8">
     <title>h标签</title>
    </head>
    <body>

     <h1 align="center">标题1</h1>
     <h2 align="center">标题2</h2>
     <h3 align="center">标题3</h3>
     <h4 align="center">标题4</h4>
     <h5 align="center">标题5</h5>
     <h6 align="center">标题6</h6>

    </body>
  </html>
  ```

## img标签

- 概述

  - 可定义一副图像。

- 常用属性

  | 属性名称 | 属性介绍       | 可能的值           |
  | -------- | -------------- | ------------------ |
  | src      | 图片的路径     | 本地图片、网络图片 |
  | alt      | 替代图片的文本 |                    |
  | border   | 设置图片的边框 | px                 |
  | width    | 图片的宽度     | px、%              |
  | height   | 图片的高度     | px、%              |

## 列表标签

- 分类

  - 有序列表(ol)
  - 无序列表(ul)

- 有序列表(ol)

  | 属性名称 | 属性介绍           | 可能的值  |
  | -------- | ------------------ | --------- |
  | start    | 规定列表中的起始点 |           |
  | type     | 规定列表的类型     | A a I i 1 |

- 无序列表(ul)-->unorderlist

  | 属性名称 | 属性介绍       | 可能的值           |
  | -------- | -------------- | ------------------ |
  | type     | 规定列表的类型 | disc square circle |

- 代码实现

  ```html
  <html>
    <head>
     <meta charset="UTF-8">
     <title>ol标签</title>
     <!--
      ol : order list
     -->
    </head>
    <body>

     <ol start="3" type="A">
      <li>选项1</li>
      <li>选项2</li>
      <li>选项3</li>
      <li>选项4</li>
      <li>选项5</li>
     </ol>
    </body>
  </html>
  ```

  ```html
  <html>
    <head>
     <meta charset="UTF-8">
     <title>ul标签</title>
     <!--
      ul : unorder list
     -->
    </head>
    <body>

     <ul type="square">
      <li>选项1</li>
      <li>选项2</li>
      <li type="circle">选项3</li>
      <li>选项4</li>
      <li>选项5</li>

     </ul>
    </body>
  </html>
  ```

## 超链接标签

- 作用

  - 实现跳转到其它页面,超链接内容不仅可以是文本，也可以是图片等信息.

- 常用属性

  | 属性   | 值             | 说明         |
  | ------ | -------------- | ------------ |
  | href   |                | 要跳转的路径 |
  | target | blank/self/new |              |

## 表格标签

- 作用

  - 在网页上实现一个表格

- table标签

  | 属性        | 值   | 说明                 |
  | ----------- | ---- | -------------------- |
  | border      |      | 表格的边框           |
  | width       |      | 表格的宽度           |
  | align       |      | 表格的对齐方式       |
  | cellpadding |      | 边框和内容之间的距离 |
  | cellspacing |      | 单元格之间的距离     |
  | bgcolor     |      | 表格的背景颜色       |

- tr标签:表格中的行

  | 属性  | 值   | 说明                 |
  | ----- | ---- | -------------------- |
  | align |      | 当前行内容的对齐方式 |

- td标签：表格中的单元格

  | 属性    | 值   | 说明                     |
  | ------- | ---- | ------------------------ |
  | align   |      | 当前单元格内容的对齐方式 |
  | width   |      | 单元格宽度               |
  | height  |      | 单元格高度               |
  | colspan |      | 指示列的合并             |
  | rowspan |      | 指示行的合并             |

  - d.th标签：表格的标题,默认是居中对齐，并且文字加粗显示

## 容器标签

- div--块级标签,不管多大都占满一行
- span--行内标签,内容多大就是多大

## 表单标签

- 概念
  - 表单可以将页面上录入的信息携带到服务器端。
  - `<form></form>`标签来定义表单
- 需求
  - ![image](/images/frontend/form-requirement.png)

## rm 表单核心属性

```html
<form action="" method="" enctype="">
```

1. **action（必须属性）** 作用：指定**表单数据提交给谁（服务器地址）**

   - 值：后端接口 URL（相对路径 / 绝对地址）

   - `action=""`：提交给当前页面

   - `action="#"`：不提交，仅占位

1. **method：提交方式，常用 get /post**

- ```
  method="get"
  ```properties

  - 数据拼在 URL 后面，地址栏可见
  - 长度有限，不安全，适合查询、搜索
  - 不适合传文件、密码

- ```
  method="post"
  ```

  - 放在请求体里传递
  - 大小限制更大，适合登录、注册、上传

1. **enctype：表单编码类型（只有 post 才生效！get 忽略这个属性）** 三种取值： | enctype 值 | 说明 | 使用场景

| enctype 值 | 特点 | 适用场景 |
| --- | --- | --- |
| application/x-www-form-urlencoded | 默认编码，键值对 url 编码 | 普通文本表单（文字、数字），**不支持文件上传** |
| multipart/form-data | 二进制分段传输 | 文件上传（图片、文档）必须搭配这个 |
| text/plain | 不编码，纯文本 | 极少使用，多用于调试 |

