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
import HeroAvatar from './HeroAvatar.vue'
import HeroTypewriter from './HeroTypewriter.vue'
import PostList from './PostList.vue'
import ProjectCards from './ProjectCards.vue'

const skills = ['Python', 'LangGraph', 'LLaMA-Factory', 'vLLM', 'FastAPI', 'RAG']
const githubUrl = 'https://github.com/Jrwisefools'
</script>

<template>
  <div class="home-wrap">
    <!-- Hero 区：杂志式左对齐 -->
    <section class="hero-section">
      <div class="hero-identity">
        <HeroAvatar name="蒋璐新" src="/avatar.jpg" />
        <span class="hero-name">蒋璐新</span>
      </div>
      <h1 class="hero-title">RAG &amp; 后端开发学习者</h1>
      <HeroTypewriter text="记录笔记与项目点滴" />
      <div class="hero-actions">
        <a class="hero-btn primary" href="#latest-posts">看文章</a>
        <a class="hero-btn" href="/notes/">全部笔记</a>
      </div>
      <a class="hero-github" :href="githubUrl" target="_blank" rel="noopener">
        <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
        <span>GitHub</span>
      </a>
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
