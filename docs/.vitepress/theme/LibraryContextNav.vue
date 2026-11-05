<script setup>
/**
 * 文章页左侧目录：用「进来时用的浏览方式」组织，和内容库保持同一套分组。
 *
 * 按主题 → notes.data.js 的主题分组（含基础课）
 * 按标签 → tags.data.js 的标签分组
 * 按时间 → archive.data.js 的月份分组
 *
 * 默认只展开当前文章所在组、当前文章高亮，和内容库页折叠后的节奏一致。
 * 顶部的三个切换项直接回内容库对应视图，不再和内容库形成两套互相打架的目录。
 * 框架自带的全站分组由 style.css 隐藏（见 .VPSidebar:has(.library-context-nav)）。
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { data as notesData } from './notes.data.js'
import { data as tagsData } from './tags.data.js'
import { data as archiveData } from './archive.data.js'
import {
  readLibraryView,
  writeLibraryView,
  libraryLink,
  withView,
  normalizeUrl,
  VIEW_LIST
} from './libraryView.js'

const { page } = useData()
const view = ref('topic')
const openMap = ref({})

const isContent = computed(() => {
  const p = page.value.relativePath || ''
  return p.startsWith('posts/') || (p.startsWith('notes/') && !p.endsWith('index.md'))
})

// 用 relativePath 推导当前文章地址：它是 VitePress 里最稳定的字段（SSR / 客户端 /
// SPA 导航都一致），而 page.path 在不同阶段可能带或不带 .html，直接比对会漏。
const currentPath = computed(() => {
  const rel = page.value.relativePath || ''
  if (rel.endsWith('.md')) return normalizeUrl('/' + rel.slice(0, -3) + '.html')
  return normalizeUrl(page.value.path || '')
})

const groups = computed(() => {
  if (view.value === 'tags') {
    return tagsData.tags.map((t) => ({
      key: `tags:${t.name}`,
      title: t.name,
      posts: t.posts
    }))
  }
  if (view.value === 'timeline') {
    return archiveData.months.map((m) => ({
      key: `timeline:${m.year}-${m.month}`,
      title: `${m.year} 年 ${Number(m.month)} 月`,
      posts: m.posts
    }))
  }
  return [...notesData.main, ...notesData.archive].map((g) => ({
    key: `topic:${g.key}`,
    title: g.text,
    posts: g.posts
  }))
})

const activeKey = computed(() => {
  const cur = currentPath.value
  return groups.value.find((g) => g.posts.some((p) => normalizeUrl(p.url) === cur))?.key || ''
})

// 分组集合或当前文章变化时重置折叠状态：只展开当前所在组
watch(
  [groups, activeKey],
  () => {
    const next = {}
    for (const g of groups.value) next[g.key] = g.key === activeKey.value
    openMap.value = next
  },
  { immediate: true }
)

const toggle = (key) => {
  openMap.value = { ...openMap.value, [key]: !openMap.value[key] }
}
const isCurrent = (url) => normalizeUrl(url) === currentPath.value
const postLink = (p, key) => withView(p.url, view.value, key)

onMounted(() => {
  view.value = readLibraryView()
})
</script>

<template>
  <nav v-if="isContent" class="library-context-nav" aria-label="笔记目录">
    <a class="lcn-home" :href="libraryLink(view)">
      全部笔记 <span aria-hidden="true">↗</span>
    </a>

    <div class="lcn-views" role="group" aria-label="浏览方式">
      <a
        v-for="v in VIEW_LIST"
        :key="v.key"
        :href="libraryLink(v.key)"
        :class="{ active: v.key === view }"
        :aria-current="v.key === view ? 'page' : undefined"
        @click="writeLibraryView(v.key)"
      >{{ v.label }}</a>
    </div>

    <div class="lcn-groups">
      <section
        v-for="g in groups"
        :key="g.key"
        class="lcn-group"
        :class="{ open: openMap[g.key] }"
      >
        <button
          class="lcn-head"
          type="button"
          :aria-expanded="!!openMap[g.key]"
          @click="toggle(g.key)"
        >
          <span class="lcn-title">{{ g.title }}</span>
          <span class="lcn-count">{{ g.posts.length }}</span>
          <span class="lcn-chev" aria-hidden="true"></span>
        </button>
        <ul v-show="openMap[g.key]" class="lcn-list">
          <li v-for="p in g.posts" :key="p.url">
            <a
              :href="postLink(p, g.key)"
              :class="{ current: isCurrent(p.url) }"
              :aria-current="isCurrent(p.url) ? 'page' : undefined"
            >{{ p.title }}</a>
          </li>
        </ul>
      </section>
    </div>
  </nav>
</template>
