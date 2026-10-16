<script setup>
/**
 * 项目作品卡片 —— 请直接编辑下方数组：
 *   name: 项目名称
 *   desc: 一句话描述（技术栈 / 定位）
 *   url:  项目地址（Gitee / GitHub / 线上站点），未填请留空字符串 ''
 */
const projects = [
  {
    name: 'RAG 知识库',
    desc: '技术栈：Python / LangGraph / LLaMA-Factory / vLLM',
    url: ''
  },
  {
    name: 'FastAPI 微服务',
    desc: '基于 FastAPI 的后端 API 服务',
    url: ''
  }
]
</script>

<template>
  <div class="cards-grid">
    <article v-for="p in projects" :key="p.name" class="project-card">
      <h3>{{ p.name }}</h3>
      <p>{{ p.desc }}</p>
      <a v-if="p.url" class="card-link" :href="p.url" target="_blank" rel="noopener">查看项目 ↗</a>
      <span v-else class="card-link pending">链接待填写</span>
    </article>
  </div>
</template>
