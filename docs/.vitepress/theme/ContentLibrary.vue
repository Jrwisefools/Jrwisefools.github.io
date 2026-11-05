<script setup>
/**
 * 内容库：全站唯一的文章浏览入口。
 *
 * 三个视图列的是同一批内容，区别只在组织方式：
 *   topic    按主题目录（NotesIndex）
 *   tags     按标签横向串联（TagsIndex）
 *   timeline 按记录时间倒序（ArchiveIndex）
 *
 * 地址约定（旧链接不失效）：
 *   /notes/                     默认按主题
 *   /notes/?view=tags           按标签，可分享
 *   /notes/?view=timeline       按时间，可分享
 *   /tags#tag-xxx、/archive     旧地址，仍直出对应视图
 *
 * 中文标签锚点不能靠浏览器默认 hash 跳转：浏览器会先解码 hash 再匹配 id，
 * 而 encodeURIComponent 生成的 id 是字面量，两者对不上。定位统一由本组件解析、
 * 把解码后的标签名传给 TagsIndex，再由 getElementById + scrollIntoView 完成。
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import NotesIndex from './NotesIndex.vue'
import TagsIndex from './TagsIndex.vue'
import ArchiveIndex from './ArchiveIndex.vue'
import { data as tagsData } from './tags.data.js'
import { data as archiveData } from './archive.data.js'

const VIEWS = [
  { key: 'topic', label: '按主题', desc: '按课程主题分目录，顺着学习路径一篇篇往下读。' },
  { key: 'tags', label: '按标签', desc: '按知识点横向串联，把散在不同阶段的笔记连起来看。' },
  { key: 'timeline', label: '按时间', desc: '按记录时间倒序，回顾这条完整的学习时间线。' }
]

// 默认视图由页面 md 传入，SSR 阶段就能确定，不依赖 URL：
// /notes/ 用 topic，旧入口 /tags 用 tags、/archive 用 timeline。
const props = defineProps({
  initialView: { type: String, default: 'topic' }
})

const activeView = ref(props.initialView)
const focusTag = ref('')

const currentDesc = computed(
  () => VIEWS.find((v) => v.key === activeView.value)?.desc ?? ''
)
const totalPosts = computed(() => archiveData.total ?? 0)
const totalTags = computed(() => tagsData.total ?? 0)

function setView(key) {
  activeView.value = key
  focusTag.value = ''
  if (typeof window === 'undefined') return
  // 统一规范到 /notes/，清掉旧 hash；只改地址不重载页面
  history.replaceState(null, '', `/notes/?view=${key}`)
}

// 在内容库内部点标签链接时 path 不变，组件不会重新挂载，SPA 导航也不会触发
// onMounted，视图就切不过去。这类点击由容器统一接管：切到标签视图再滚动定位。
function onInternalTagLink(e) {
  const a = e.target instanceof Element ? e.target.closest('a[href*="view=tags#tag-"]') : null
  if (!a) return
  const href = a.getAttribute('href') || ''
  const raw = decodeURIComponent(href.slice(href.indexOf('#') + 1))
  if (!raw.startsWith('tag-')) return

  e.preventDefault()
  const name = raw.slice(4)
  activeView.value = 'tags'
  focusTag.value = name
  history.replaceState(null, '', href)
  nextTick(() => {
    const el = document.getElementById(`tag-${name}`)
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  })
}

onMounted(() => {
  // query 优先于路径；带 #tag-xxx 进来时强制切到标签视图并记住要定位的标签
  const q = new URLSearchParams(window.location.search).get('view')
  if (VIEWS.some((v) => v.key === q)) activeView.value = q

  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  if (raw.startsWith('tag-')) {
    focusTag.value = raw.slice(4)
    activeView.value = 'tags'
  }

  document.addEventListener('click', onInternalTagLink)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onInternalTagLink)
})
</script>

<template>
  <div class="content-library">
    <header class="library-head">
      <h1>全部笔记</h1>
      <p class="library-intro">
        这里是全站唯一的内容库，同一批文章换个看法而已：
        按主题顺着课程读，按标签串知识点，按时间回顾学习轨迹。
      </p>
      <p class="notes-stat">
        共 <strong>{{ totalPosts }}</strong> 篇内容 · <strong>{{ totalTags }}</strong> 个标签
      </p>
    </header>

    <div class="view-switch" role="group" aria-label="浏览方式">
      <button
        v-for="v in VIEWS"
        :key="v.key"
        class="view-tab"
        :class="{ active: activeView === v.key }"
        type="button"
        :aria-pressed="activeView === v.key"
        @click="setView(v.key)"
      >{{ v.label }}</button>
    </div>

    <p class="view-desc" aria-live="polite">{{ currentDesc }}</p>

    <div class="view-panel">
      <NotesIndex v-if="activeView === 'topic'" />
      <TagsIndex v-else-if="activeView === 'tags'" :focus-tag="focusTag" />
      <ArchiveIndex v-else />
    </div>
  </div>
</template>
