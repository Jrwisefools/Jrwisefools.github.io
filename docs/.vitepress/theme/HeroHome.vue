<script setup>
/**
 * 首页主组件：Hero 区 + 双栏布局
 *   左主栏：最新文章（卡片式）
 *   右侧栏：关于我 / 技能标签 / 项目作品
 * 数据接口：
 *   - posts.data.js  → 自动聚合 posts 与 notes 下未被归档的 md
 *   - projects 数组  → 在 ProjectCards.vue 内直接编辑
 *   - avatar         → 若 docs/public/avatar.jpg 存在则显示图片，否则显示名字徽标
 */
import { computed } from 'vue'
import HeroTypewriter from './HeroTypewriter.vue'
import PostList from './PostList.vue'
import ProjectCards from './ProjectCards.vue'
import { data as latest } from './posts.data.js'
import { data as notes } from './notes.data.js'
import { data as tags } from './tags.data.js'

import { projects } from './projects.js'
import { formatDate } from './formatDate.js'

const skills = ['Python', 'LangGraph', 'LLaMA-Factory', 'vLLM', 'FastAPI', 'RAG']
const githubUrl = 'https://github.com/Jrwisefools'
const giteeUrl = 'https://gitee.com/luzhongmilu'

const stats = computed(() => [
  { label: '篇笔记', value: notes.total ?? 0, to: '/notes/' },
  { label: '个标签', value: tags.total ?? 0, to: '/tags' },
  { label: '个项目', value: projects.length, to: '/about' }
])
</script>

<template>
  <div class="home-wrap">
    <!-- Hero 区：杂志式左对齐 -->
    <section class="hero-section">
      <span class="hero-eyebrow">
        <i class="hero-dot" aria-hidden="true"></i>
        {{ latest.length ? `最近更新 ${formatDate(latest[0].frontmatter.date)}` : '持续更新中' }}
      </span>
      <h1 class="hero-title">RAG &amp; 后端开发学习者</h1>
      <HeroTypewriter text="记录笔记与项目点滴" />
      <div class="hero-actions">
        <a class="hero-btn primary" href="#latest-posts">看文章</a>
        <a class="hero-btn" href="/notes/">全部笔记</a>
        <div class="hero-social">
          <a class="hero-social-btn" :href="githubUrl" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
          <a class="hero-social-btn" :href="giteeUrl" target="_blank" rel="noopener" aria-label="Gitee">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z" />
            </svg>
          </a>
        </div>
      </div>
      <div class="hero-stats">
        <a v-for="s in stats" :key="s.label" class="hero-stat" :href="s.to">
          <strong>{{ s.value }}</strong>
          <span>{{ s.label }}</span>
        </a>
      </div>
    </section>

    <!-- 双栏主体 -->
    <div class="home-columns">
      <main class="home-main">
        <PostList />
        <div class="home-more">
          <a href="/notes/">浏览全部笔记 →</a>
        </div>
      </main>

      <aside class="home-side">
        <section class="side-block">
          <h2>关于我</h2>
          <p class="intro-text">
            专注大模型应用方向：RAG 知识库构建、模型训练与推理部署，以及 FastAPI 后端服务开发。
          </p>
          <div class="skill-tags">
            <span v-for="s in skills" :key="s" class="skill-tag">{{ s }}</span>
          </div>
          <a class="side-link" href="/about">了解更多 →</a>
        </section>

        <section class="side-block">
          <h2>项目作品</h2>
          <ProjectCards />
        </section>
      </aside>
    </div>
  </div>
</template>
