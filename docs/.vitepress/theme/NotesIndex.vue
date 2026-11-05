<script setup>
/**
 * 按主题视图：数据来自 notes.data.js（聚合 docs/notes 下的 md），
 * 按主题分组展示；入门阶段的基础课收在折叠区，不进入首页最新列表。
 * 统一统计与视图切换由外层 ContentLibrary 负责。
 */
import { data } from './notes.data.js'
import { tagLink } from './tagLink.js'

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
    <section v-for="g in data.main" :key="g.text" class="note-group">
      <h2>{{ g.text }}</h2>
      <p class="group-desc">{{ g.desc }}</p>
      <ul class="note-list">
        <li v-for="p in g.posts" :key="p.url">
          <a :href="p.url">{{ p.title }}</a>
          <span class="note-date">{{ formatDate(p.date) }}</span>
          <span class="note-tags">
            <a v-for="t in p.tags" :key="t" :href="tagLink(t)">{{ t }}</a>
          </span>
        </li>
      </ul>
    </section>

    <details class="archive-block">
      <summary>基础课（{{ data.archiveCount }} 篇）</summary>
      <p class="group-desc">
        Python、Linux / MySQL、Java SE 这些入门阶段的课堂笔记，保留作学习轨迹。
      </p>
      <section v-for="g in data.archive" :key="g.text" class="note-group">
        <h3>{{ g.text }}</h3>
        <p class="group-desc">{{ g.desc }}</p>
        <ul class="note-list">
          <li v-for="p in g.posts" :key="p.url">
            <a :href="p.url">{{ p.title }}</a>
            <span class="note-date">{{ formatDate(p.date) }}</span>
          </li>
        </ul>
      </section>
    </details>
  </div>
</template>
