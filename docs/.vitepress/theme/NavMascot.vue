<script setup>
/**
 * 导航栏左上角的主题吉祥物（小鲨鱼）。
 *
 * 注意这里**故意不做成链接**：它挂在 nav-bar-title-before 插槽，
 * 该插槽渲染在 <a class="title"> 内部。站点标题本身就是回首页的链接，
 * 鲨鱼作为其中的一部分，点击即可回首页；若再包一层 <a> 就是嵌套锚点，
 * HTML 不合法，浏览器会拆断 DOM。
 *
 * 悬停放大，键盘 focus 同样生效，尊重 prefers-reduced-motion。
 * 换图直接替换 docs/public/theme-shark.png 即可。
 */
import { withBase } from 'vitepress'

const src = withBase('/theme-shark.png')
</script>

<template>
  <span class="nav-mascot" aria-hidden="true">
    <img :src="src" alt="" />
  </span>
</template>
