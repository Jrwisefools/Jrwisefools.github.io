---
title: "JavaScript 事件：绑定方式与常见事件"
date: 2026-11-07
tags:
  - 前端
  - JavaScript
archived: true
description: "事件绑定的几种方式、常见鼠标/键盘/表单事件、事件对象与事件传播机制。"
---

# JavaScript 事件：绑定方式与常见事件
## 本章内容

- JavaScript事件

## 01_事件概述

- 概述

  - Javascript中事件一般是与函数配合使用，当事件产生时，相对应的函数可以执行。

- 名词解释

  - 事件：就是一件事情，例如点击按钮。
  - 事件源:它是事件产生的源头。按钮是事件源
  - 监听器:它是用于监听特定事件的组件，当事件产生时，监听器就可以执行。
  - 注册监听(绑定监听):是将事件源与监听器绑定到一起，当事件源产生了这个事件，监听器就可以知道 并执行相应的操作。

- 分类

  | 事件名                               | 说明                                 |
  | ------------------------------------ | ------------------------------------ |
  | onload                               | 某个页面或图像被完成加载             |
  | onsubmit                             | 当表单提交时触发该事件               |
  | onclick                              | 鼠标单击事件                         |
  | ondblclick                           | 鼠标双击事件                         |
  | onblur                               | 元素失去焦点                         |
  | onfocus                              | 元素获得焦点                         |
  | onchange                             | 用户改变域的内容                     |
  | ------------------------------------ | ------------------------------------ |
  | onkeydown                            | 某个键盘的键被按下                   |
  | onkeypress                           | 某个键盘的键被按下或按住             |
  | onkeyup                              | 某个键盘的键被松开                   |
  | onmousedown                          | 某个鼠标按键被按下                   |
  | onmouseup                            | 某个鼠标按键被松开                   |
  | onmouseover                          | 鼠标被移到某元素之上                 |
  | onmouseout                           | 鼠标从某元素移开                     |

## 02_事件绑定

- 分类

  - 使用事件属性
  - 使用dom分配

- 事件绑定

  ```html
  //通过标签中的事件属性进行绑定。
  <head>
      <meta charset="UTF-8">
      <title>Title</title>
      <script>

          function  fn1() {
             console.log("点击了");
          }

      </script>
  </head>
  <body>
      <button  onclick="fn1()">测试</button>
  </body>
  ```

  ```html
  //通过 DOM 元素属性绑定。
  <head>
      <meta charset="UTF-8">
      <title>Title</title>

  </head>
  <body>
      <button id="btn" >测试</button>
  </body>

  <script>
      document.getElementById("btn").onclick = function () {
          console.log("点击了");
      }
  </script>
  ```

## 03_onload事件

- 概述

  - 某个页面或图像被完成加载

- 需求

  - 监听页面加载完成

- 代码实现

  ```html
  <head>
    <title>ECMAScript常用事件之onload</title>
    <%--如果使用dom分配事件，推荐使用这种方式!!--%>
    <script>
        window.onload = function () {
            console.log("页面加载完成");
            var ele = document.getElementById("girl");
            ele.onclick = function () {
                console.log("我正在疯狂地点击美女~~~")
            }
        }
    </script>
  </head>
  <body>
      <img src="girl01.jpg" id="girl" >
  </body>
  ```

## 04_焦点事件

- 概述

  - onfocus : 监听元素获取焦点、
  - onblur : 监听元素失去焦点

- 代码实现

  ```html
  <head>
    <title>ECMAScript事件之onfocus、onblur</title>
    <%--
        onfocus：监听获取焦点
        onblur：监听失去焦点
    --%>
    <script>

        function fn1() {
            console.log("1获取焦点");
        }
        function fn2() {
            console.log("1失去焦点");
        }

        function fn3() {
            console.log("2获取焦点");
        }
        function fn4() {
            console.log("2失去焦点");
        }

    </script>
  </head>
  <body>
    <input type="text" onfocus="fn1()" onblur="fn2()"/>
    <input type="text" onfocus="fn3()" onblur="fn4()"/>
  </body>
  ```

## 05_onchange事件

- 概述

  - 用户改变域的内容

- 代码实现

  ```html
  <head>
    <title>ECMAScript事件之onchange</title>
    <script>
        function fn1() {
            console.log("内容发生改变")
        }

        function fn2() {
            console.log("内容发生改变2")
        }
    </script>
  </head>
  <body>

  <input type="text" onchange="fn1()"/>

  <select onchange="fn2()">
    <option>选项一</option>
    <option>选项二</option>
  </select>
  ```

## 06_onsubmit事件

- onsubmit

  - 监听表单提交

- 代码实现

  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>04-onsubmit事件</title>
      <script>

          /**
           * 监听form表单提交
           */
          function fn1() {
              console.log("表单提交了~~~~~~~~~");

              var result = true;
              if (!result) {
                  //表单校验失败, 禁止表单提交
                  return false;
              } else {
                  //表单校验成功, 允许表单提交
                  return true;
              }

          }

          function fn2() {
              var result = true;
              if (!result) {
                  //表单校验失败, 禁止表单提交
                  event.preventDefault();
                  return;
              }
              //表单校验成功, 执行业务
              console.log("校验成功!");
          }

      </script>
  </head>
  <body>

  <form action="index.html" method="get" onsubmit="return fn1()">
      账户:<input type="text" name="username"><br>
      密码:<input type="text" name="password"><br>
      <button type="submit">提交</button>
  </form>

  ----------------------------------

  <form action="index.html" method="get" onsubmit="fn2()">
      账户:<input type="text" name="username"><br>
      密码:<input type="text" name="password"><br>
      <button type="submit">提交</button>
  </form>
  </body>
  </html>
  ```
