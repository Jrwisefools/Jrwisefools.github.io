<script setup>
/**
 * 导航栏左上角的主题吉祥物（小鲨鱼），点击回到首页。
 *
 * 挂在 nav-bar-title-before 插槽（站点名已隐藏，这里就是最左端）。
 * 悬停放大；尊重 prefers-reduced-motion。
 * 换图直接替换 docs/public/theme-shark.png 即可。
 */
import { withBase } from 'vitepress'

const src = withBase('/theme-shark.png')
</script>

<template>
  <a class="nav-mascot" href="/" aria-label="回到首页" title="回到首页">
    <img :src="src" alt="" />
  </a>
</template>
