<script setup>
/**
 * 按标签视图：顶部标签云做锚点导航，下方按标签分组列出文章（大标题可收起）。
 * 数据来自 tags.data.js，标签按篇数倒序。
 *
 * 中文标签锚点不能依赖浏览器默认 hash 跳转：浏览器会先解码 hash 再匹配 id，
 * 而 encodeURIComponent 生成的 id 是字面量，两者对不上。
 * URL 解析统一交给 ContentLibrary，这里负责展示、展开目标分组与滚动定位。
 */
import { nextTick, onMounted, watch } from 'vue'
import { data } from './tags.data.js'
import { tagLink } from './tagLink.js'
import CollapsibleGroup from './CollapsibleGroup.vue'
import { useLibraryGroups } from './useLibraryGroups.js'

const props = defineProps({
  focusTag: { type: String, default: '' },
  focusSeq: { type: Number, default: 0 }
})

const groups = useLibraryGroups()
const groupKey = (name) => `tags:${name}`
const allKeys = data.tags.map((t) => groupKey(t.name))
groups.register(allKeys, allKeys.slice(0, 1))

const formatDate = (d) => {
  if (d == null) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// id 用原始名称，保证 getElementById 能精确命中
const anchorId = (name) => `tag-${name}`
const anchorHref = (name) => `#tag-${encodeURIComponent(name)}`

// 目标分组可能是收起的，先展开再滚动；等两帧让展开动画把布局稳定下来
function revealTag(name) {
  if (!name) return
  groups.set(groupKey(name), true)
  history.replaceState(null, '', tagLink(name))
  nextTick(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(anchorId(name))
        if (!el) return
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
      })
    })
  })
}

// 从别的视图带 #tag-xxx 切过来时，组件是新建的，由挂载钩子定位
onMounted(() => {
  if (props.focusTag) revealTag(props.focusTag)
})

// 已在标签视图内再次点标签，focusTag 可能不变，用序号变化触发
watch(() => props.focusSeq, () => {
  if (props.focusTag) revealTag(props.focusTag)
})
</script>

<template>
  <div class="tags-index">
    <div class="tag-cloud-wrap">
      <p class="cloud-label">快速跳转</p>
      <div class="tag-cloud">
        <a
          v-for="t in data.tags"
          :key="t.name"
          class="tag-pill"
          :href="anchorHref(t.name)"
          @click.prevent="revealTag(t.name)"
        >
          {{ t.name }}<span class="tag-count">{{ t.count }}</span>
        </a>
      </div>
    </div>

    <CollapsibleGroup
      v-for="t in data.tags"
      :key="t.name"
      :group-key="groupKey(t.name)"
      :anchor-id="anchorId(t.name)"
      :title="t.name"
      :count="t.count"
    >
      <ul class="note-list">
        <li v-for="p in t.posts" :key="p.url">
          <span class="note-title">
            <a :href="p.url">{{ p.title }}</a>
            <em v-if="p.archived" class="doc-badge raw">课堂笔记</em>
          </span>
          <span class="note-date">{{ formatDate(p.date) }}</span>
        </li>
      </ul>
    </CollapsibleGroup>
  </div>
</template>
