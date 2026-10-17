<script setup>
/**
 * 标签页：顶部标签云做锚点导航，下方按标签分组列出文章。
 * 数据来自 tags.data.js，标签按篇数倒序。
 *
 * 锚点跳转用 JS 精确定位而不是依赖浏览器默认行为：
 * 浏览器会把 hash 解码后再匹配 id，而中文标签的 id 一旦用 encodeURIComponent
 * 就会变成字面量（tag-%E5%9F%BA%E7%A1%80），解码后对不上，导致中文标签点了没反应。
 */
import { onMounted } from 'vue'
import { data } from './tags.data.js'

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

// 从别处带 hash 直接进来时（/tags#tag-大模型）也定位到对应分组
onMounted(() => {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  if (!raw.startsWith('tag-')) return
  const name = raw.slice(4)
  requestAnimationFrame(() => {
    const el = document.getElementById(anchorId(name))
    if (el) el.scrollIntoView({ block: 'start' })
  })
})
</script>

<template>
  <div class="tags-index">
    <p class="notes-stat">
      共 <strong>{{ data.total }}</strong> 个标签，覆盖 <strong>{{ data.postTotal }}</strong> 篇内容
    </p>

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
          <em class="doc-badge" :class="{ raw: p.archived }">
            {{ p.archived ? '课堂速记' : '已整理' }}
          </em>
          <span class="note-date">{{ formatDate(p.date) }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>
