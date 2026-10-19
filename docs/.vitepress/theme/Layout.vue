<script setup>
/**
 * 自定义 Layout：在默认主题基础上挂载全局增强能力
 *   - doc-before  → 文章元信息条（日期 / 字数 / 阅读时长 / 标签）
 *   - layout-bottom → 图片灯箱
 * 代码块复制按钮随路由切换重新挂载。
 */
import DefaultTheme from 'vitepress/theme'
import { onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vitepress'
import PostMeta from './PostMeta.vue'
import ImageLightbox from './ImageLightbox.vue'
import NavIdentity from './NavIdentity.vue'
import SidebarToggle from './SidebarToggle.vue'
import NavMascot from './NavMascot.vue'
import { setupCodeCopy } from './codeCopy.js'

const { Layout } = DefaultTheme
const route = useRoute()

onMounted(() => nextTick(setupCodeCopy))
watch(
  () => route.path,
  () => nextTick(setupCodeCopy)
)
</script>

<template>
  <Layout>
    <template #doc-before>
      <PostMeta />
    </template>

    <!-- 导航栏最左侧：主题吉祥物（点击回首页）+ 侧栏收放开关。
         吉祥物不用 nav-bar-title-before：那个插槽在 <a class="title"> 内部，
         再放一个链接会形成嵌套 <a>，HTML 不合法。这里改用绝对定位摆到左端。 -->
    <template #nav-bar-content-before>
      <NavMascot />
      <SidebarToggle />
    </template>

    <!-- 导航栏右侧：头像 + 名字，点击去关于页 -->
    <template #nav-bar-content-after>
      <NavIdentity />
    </template>

    <template #layout-bottom>
      <ImageLightbox />
    </template>
  </Layout>
</template>
