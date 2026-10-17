<script setup>
/**
 * 归档页：按年 - 月倒序聚合全部内容，形成一条时间线。
 * 数据来自 archive.data.js。
 */
import { data } from './archive.data.js'
import { tagLink } from './tagLink.js'
</script>

<template>
  <div class="archive-index">
    <p class="notes-stat">共 <strong>{{ data.total }}</strong> 篇内容</p>

    <section v-for="mo in data.months" :key="`${mo.year}-${mo.month}`" class="archive-month">
      <h2>
        {{ mo.year }} 年 {{ Number(mo.month) }} 月
        <span class="tag-group-count">{{ mo.posts.length }} 篇</span>
      </h2>
      <ul class="archive-list">
        <li v-for="p in mo.posts" :key="p.url">
          <span class="archive-day">{{ p.day }}</span>
          <div class="archive-item">
            <a :href="p.url">{{ p.title }}</a>
            <div class="archive-meta">
              <em class="doc-badge" :class="{ raw: p.archived }">
                {{ p.archived ? '课堂速记' : '已整理' }}
              </em>
              <span class="note-tags">
                <a v-for="t in p.tags" :key="t" :href="tagLink(t)">{{ t }}</a>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
