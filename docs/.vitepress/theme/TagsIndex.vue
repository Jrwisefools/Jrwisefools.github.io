<script setup>
/**
 * 按标签视图：顶部标签云做锚点导航，下方按标签分组列出文章。
 * 数据来自 tags.data.js，标签按篇数倒序。
 *
 * 中文标签锚点不能依赖浏览器默认 hash 跳转：浏览器会先解码 hash 再匹配 id，
 * 而 encodeURIComponent 生成的 id 是字面量，两者对不上。
 * URL 解析统一交给 ContentLibrary，这里只负责展示与点击定位。
 */
import { onMounted } from 'vue'
import { data } from './tags.data.js'

const props = defineProps({
  focusTag: { type: String, default: '' }
})

const formatDate = (d) => {
  if (d == null) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// id 用原始名称，保证 getElementById 能精确命中
const anchorId = (name) => `tag-${name}`

// href 只作为降级（无 JS 时）和 URL 展示，实际跳转由 scrollToTag 接管
const anchorHref = (name) => `#tag-${encodeURIComponent(name)}`

function scrollToTag(name) {
  const el = document.getElementById(anchorId(name))
  if (!el) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', anchorHref(name))
}

// 带 #tag-xxx 进来时定位到对应分组（标签名已由内容库容器解码）
onMounted(() => {
  if (!props.focusTag) return
  requestAnimationFrame(() => {
    const el = document.getElementById(anchorId(props.focusTag))
    if (el) el.scrollIntoView({ block: 'start' })
  })
})
</script>

<template>
  <div class="tags-index">
    <!-- 统一统计由 ContentLibrary 输出 -->
    <div class="tag-cloud">
      <a
        v-for="t in data.tags"
        :key="t.name"
        class="tag-pill"
        :href="anchorHref(t.name)"
        @click.prevent="scrollToTag(t.name)"
      >
        {{ t.name }}<span class="tag-count">{{ t.count }}</span>
      </a>
    </div>

    <section
      v-for="t in data.tags"
      :key="t.name"
      class="tag-group"
      :id="anchorId(t.name)"
    >
      <h2>
        {{ t.name }}
        <span class="tag-group-count">{{ t.count }} 篇</span>
      </h2>
      <ul class="note-list">
        <li v-for="p in t.posts" :key="p.url">
          <a :href="p.url">{{ p.title }}</a>
          <em v-if="p.archived" class="doc-badge raw">课堂笔记</em>
          <span class="note-date">{{ formatDate(p.date) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
