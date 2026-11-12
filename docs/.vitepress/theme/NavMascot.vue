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
 * 显示仅 40px，所以用 128px 的缩放版（Retina 2x~3x 都够清晰），
 * 体积从 369KB 降到约 16KB；796px 原始素材见 design-assets/theme-shark-original.png。
 */
import { withBase } from 'vitepress'

const src = withBase('/theme-shark-nav.png')
</script>

<template>
  <span class="nav-mascot" aria-hidden="true">
    <img :src="src" alt="" />
  </span>
</template>
