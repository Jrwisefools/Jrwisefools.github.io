<script setup>
/**
 * 标签页：顶部标签云做锚点导航，下方按标签分组列出文章。
 * 数据来自 tags.data.js，标签按篇数倒序。
 */
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

const anchor = (name) => `tag-${encodeURIComponent(name)}`
</script>

<template>
  <div class="tags-index">
    <p class="notes-stat">
      共 <strong>{{ data.total }}</strong> 个标签，覆盖 <strong>{{ data.postTotal }}</strong> 篇内容
    </p>

    <div class="tag-cloud">
      <a v-for="t in data.tags" :key="t.name" class="tag-pill" :href="`#${anchor(t.name)}`">
        {{ t.name }}<span class="tag-count">{{ t.count }}</span>
      </a>
    </div>

    <section
      v-for="t in data.tags"
      :key="t.name"
      class="tag-group"
      :id="anchor(t.name)"
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
