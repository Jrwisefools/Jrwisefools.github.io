<script setup>
/**
 * 按时间视图：按年 - 月倒序聚合全部内容，形成一条时间线，月份标题可收起。
 * 数据来自 archive.data.js；统一统计与视图切换由 ContentLibrary 负责。
 */
import { data } from './archive.data.js'
import { tagLink } from './tagLink.js'
import CollapsibleGroup from './CollapsibleGroup.vue'
import { useLibraryGroups } from './useLibraryGroups.js'

const groups = useLibraryGroups()
const monthKey = (mo) => `timeline:${mo.year}-${mo.month}`
const allKeys = data.months.map(monthKey)
groups.register(allKeys, allKeys.slice(0, 1))
</script>

<template>
  <div class="archive-index">
    <CollapsibleGroup
      v-for="mo in data.months"
      :key="`${mo.year}-${mo.month}`"
      :group-key="monthKey(mo)"
      :title="`${mo.year} 年 ${Number(mo.month)} 月`"
      :count="mo.posts.length"
    >
      <ul class="archive-list">
        <li v-for="p in mo.posts" :key="p.url">
          <span class="archive-day">{{ p.day }}</span>
          <div class="archive-item">
            <a :href="p.url">{{ p.title }}</a>
            <div class="archive-meta">
              <em v-if="p.archived" class="doc-badge raw">课堂笔记</em>
              <span class="note-tags">
                <a v-for="t in p.tags" :key="t" :href="tagLink(t)">{{ t }}</a>
              </span>
            </div>
          </div>
        </li>
      </ul>
    </CollapsibleGroup>
  </div>
</template>
