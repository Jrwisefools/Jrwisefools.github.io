<script setup>
/**
 * 笔记总览页：
 * 数据来自 notes.data.js（createContentLoader 聚合 docs/notes/**\/*.md），
 * 按主题分组展示；基础课归入「归档」折叠区，不进入首页最新列表。
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
    <p class="notes-stat">
      共 <strong>{{ data.total }}</strong> 篇笔记 · 主内容 <strong>{{ data.mainCount }}</strong> 篇 ·
      基础课归档 <strong>{{ data.archiveCount }}</strong> 篇
    </p>

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
      <summary>基础课归档（{{ data.archiveCount }} 篇）</summary>
      <p class="group-desc">入门阶段的课堂笔记，保留作学习轨迹，不进入首页最新列表。</p>
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
