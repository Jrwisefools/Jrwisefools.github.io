<script setup>
/**
 * 文章元信息条：日期、标签、字数、预计阅读时长。
 * 只在 notes/ 与 posts/ 下的内容页显示，总览页和关于页不显示。
 * 字数在客户端从渲染后的正文统计，避免为取字数把全文塞进 data loader。
 */
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()
const wordCount = ref(0)

const isContent = computed(() => {
  const p = page.value.relativePath || ''
  if (p.startsWith('posts/')) return true
  return p.startsWith('notes/') && !p.endsWith('index.md')
})

const readMinutes = computed(() => Math.max(1, Math.round(wordCount.value / 300)))

const formatDate = (d) => {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function count() {
  if (typeof document === 'undefined') return
  const el = document.querySelector('.VPDoc .vp-doc')
  if (!el) return
  const text = el.textContent || ''
  const cn = (text.match(/[一-龥]/g) || []).length
  const en = (text.match(/[a-zA-Z0-9]+/g) || []).length
  wordCount.value = cn + en
}

onMounted(() => nextTick(count))
watch(() => page.value.relativePath, () => nextTick(count))
</script>

<template>
  <div v-if="isContent" class="post-meta">
    <span v-if="frontmatter.date" class="pm-date">{{ formatDate(frontmatter.date) }}</span>
    <span class="pm-sep">·</span>
    <span>{{ wordCount }} 字</span>
    <span class="pm-sep">·</span>
    <span>约 {{ readMinutes }} 分钟</span>
    <span v-if="frontmatter.tags && frontmatter.tags.length" class="pm-tags">
      <em v-for="t in frontmatter.tags" :key="t">{{ t }}</em>
    </span>
  </div>
</template>
