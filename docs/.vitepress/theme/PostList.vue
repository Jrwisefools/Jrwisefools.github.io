<script setup>
/**
 * 最新文章（杂志目录式）：
 * 序号 + 标题/描述 + 右对齐日期与标签，靠细分隔线组织节奏，不用卡片盒子。
 * 数据来自 posts.data.js（createContentLoader 聚合 posts 与 notes 下未被归档的 md），
 * 按日期倒序取前 5 条；目录为空时展示占位文案。
 */
import { data } from './posts.data.js'
import { tagLink } from './tagLink.js'
import { formatDate } from './formatDate.js'
</script>

<template>
  <section class="home-section" id="latest-posts">
    <h2>最新文章</h2>
    <ul v-if="data.length" class="post-cards">
      <li v-for="(post, i) in data" :key="post.url" class="post-card">
        <span class="post-index" aria-hidden="true">
          {{ String(i + 1).padStart(2, '0') }}
        </span>
        <div class="post-body">
          <a class="post-card-title" :href="post.url">
            {{ post.frontmatter.title || '(未命名文章)' }}
          </a>
          <p v-if="post.frontmatter.description" class="post-card-desc">
            {{ post.frontmatter.description }}
          </p>
        </div>
        <div class="post-card-meta">
          <span class="post-date">{{ formatDate(post.frontmatter.date) }}</span>
          <span v-if="post.frontmatter.tags && post.frontmatter.tags.length" class="note-tags">
            <a
              v-for="t in post.frontmatter.tags.slice(0, 3)"
              :key="t"
              :href="tagLink(t)"
            >{{ t }}</a>
          </span>
        </div>
      </li>
    </ul>
    <p v-else class="empty-note">还没有发布文章，欢迎稍后再来看看。</p>
  </section>
</template>
