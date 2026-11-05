<script setup>
/**
 * 文章页顶部的返回入口：回到内容库，并停在你进来时用的那种浏览方式上。
 * 若链接带了 group 参数，返回时会把它带回内容库，由 ContentLibrary 展开原分组。
 * 只在内容页渲染，索引页 / 关于页 / 首页不出现。
 */
import { computed, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import {
  readLibraryView,
  readGroupParam,
  libraryLink,
  viewLabel
} from './libraryView.js'

const { page } = useData()
const view = ref('topic')
const group = ref('')

const isContent = computed(() => {
  const p = page.value.relativePath || ''
  return p.startsWith('posts/') || (p.startsWith('notes/') && !p.endsWith('index.md'))
})

const back = computed(() => {
  const base = libraryLink(view.value)
  if (!group.value) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}group=${encodeURIComponent(group.value)}`
})

onMounted(() => {
  view.value = readLibraryView()
  group.value = readGroupParam()
})
</script>

<template>
  <nav v-if="isContent" class="library-breadcrumb" aria-label="返回内容库">
    <a :href="back">
      <span class="lbc-arrow" aria-hidden="true">←</span> 返回全部笔记
    </a>
    <span class="lbc-sep" aria-hidden="true">/</span>
    <span class="lbc-view">{{ viewLabel(view) }}</span>
  </nav>
</template>
