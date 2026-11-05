<script setup>
/**
 * 按主题视图：数据来自 notes.data.js（聚合 docs/notes 下的 md），按主题分组。
 * 主内容与基础课都是可收起的大标题；统一统计与视图切换由外层 ContentLibrary 负责。
 */
import { data } from './notes.data.js'
import { tagLink } from './tagLink.js'
import CollapsibleGroup from './CollapsibleGroup.vue'
import { useLibraryGroups } from './useLibraryGroups.js'

const groups = useLibraryGroups()
const mainKeys = data.main.map((g) => `topic:${g.key}`)
const archiveKeys = data.archive.map((g) => `topic:${g.key}`)
// 默认只展开第一组，首屏有内容又不至于要滚很久才能找到后面的主题
groups.register([...mainKeys, ...archiveKeys], mainKeys.slice(0, 1))

const formatDate = (d) => {
  if (d == null) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>

<template>
  <div class="notes-index">
    <CollapsibleGroup
      v-for="g in data.main"
      :key="g.key"
      :group-key="`topic:${g.key}`"
      :title="g.text"
      :desc="g.desc"
      :count="g.posts.length"
    >
      <ul class="note-list">
        <li v-for="p in g.posts" :key="p.url">
          <a :href="p.url">{{ p.title }}</a>
          <span class="note-date">{{ formatDate(p.date) }}</span>
          <span class="note-tags">
            <a v-for="t in p.tags" :key="t" :href="tagLink(t)">{{ t }}</a>
          </span>
        </li>
      </ul>
    </CollapsibleGroup>

    <div v-if="data.archive.length" class="section-label">
      <span>基础课 · 入门阶段</span>
      <span class="section-label-note">{{ data.archiveCount }} 篇 · 课堂笔记</span>
    </div>

    <CollapsibleGroup
      v-for="g in data.archive"
      :key="g.key"
      :group-key="`topic:${g.key}`"
      :title="g.text"
      :desc="g.desc"
      :count="g.posts.length"
    >
      <ul class="note-list">
        <li v-for="p in g.posts" :key="p.url">
          <a :href="p.url">{{ p.title }}</a>
          <span class="note-date">{{ formatDate(p.date) }}</span>
        </li>
      </ul>
    </CollapsibleGroup>
  </div>
</template>
