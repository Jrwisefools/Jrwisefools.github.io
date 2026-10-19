<script setup>
/**
 * 项目作品卡片 —— 数据来自 projects.js，
 * 新增/修改仓库请编辑该文件，卡片会自动渲染。
 * 整张卡即为链接，点击直达仓库。
 */
import { projects } from './projects.js'
</script>

<template>
  <div class="cards-grid">
    <a
      v-for="p in projects"
      :key="p.name"
      class="project-card"
      :href="p.url"
      target="_blank"
      rel="noopener"
    >
      <div class="project-card-head">
        <h3>{{ p.name }}</h3>
        <span class="project-arrow" aria-hidden="true">↗</span>
      </div>
      <p v-if="p.desc">{{ p.desc }}</p>
      <span class="card-link">查看项目</span>
    </a>
  </div>
</template>
