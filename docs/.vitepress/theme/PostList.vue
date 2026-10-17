<script setup>
/**
 * 最新文章（卡片式）：
 * 数据来自 posts.data.js（createContentLoader 聚合 posts 与 notes 下未被归档的 md），
 * 按日期倒序取前 5 条；目录为空时展示占位文案。
 */
import { data } from './posts.data.js'

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
  <section class="home-section" id="latest-posts">
    <h2>最新文章</h2>
    <ul v-if="data.length" class="post-cards">
      <li v-for="post in data" :key="post.url" class="post-card">
        <a class="post-card-title" :href="post.url">
          {{ post.frontmatter.title || '(未命名文章)' }}
        </a>
        <p v-if="post.frontmatter.description" class="post-card-desc">
          {{ post.frontmatter.description }}
        </p>
        <div class="post-card-meta">
          <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
          <span v-if="post.frontmatter.tags && post.frontmatter.tags.length" class="note-tags">
            <em v-for="t in post.frontmatter.tags.slice(0, 3)" :key="t">{{ t }}</em>
          </span>
        </div>
      </li>
    </ul>
    <p v-else class="empty-note">还没有发布文章，欢迎稍后再来看看。</p>
  </section>
</template>
