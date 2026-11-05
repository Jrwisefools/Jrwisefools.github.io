<script setup>
/**
 * 内容库：全站唯一的文章浏览入口。
 *
 * 三个视图列的是同一批内容，区别只在组织方式：
 *   topic    按主题目录（NotesIndex）
 *   tags     按标签横向串联（TagsIndex）
 *   timeline 按记录时间倒序（ArchiveIndex）
 *
 * 每个视图的大标题都能收起，状态由 createLibraryGroups 统一持有，
 * 切换视图不清空；顶部可一键展开 / 收起全部。
 *
 * 地址约定（旧链接不失效）：
 *   /notes/                     默认按主题
 *   /notes/?view=tags           按标签，可分享
 *   /notes/?view=timeline       按时间，可分享
 *   /tags#tag-xxx、/archive     旧地址，仍直出对应视图
 *
 * 中文标签锚点不能靠浏览器默认 hash 跳转：浏览器会先解码 hash 再匹配 id，
 * 而 encodeURIComponent 生成的 id 是字面量，两者对不上。定位统一由本组件解析、
 * 把解码后的标签名传给 TagsIndex，由它展开目标分组后滚动定位。
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import NotesIndex from './NotesIndex.vue'
import TagsIndex from './TagsIndex.vue'
import ArchiveIndex from './ArchiveIndex.vue'
import { data as tagsData } from './tags.data.js'
import { data as archiveData } from './archive.data.js'
import { createLibraryGroups } from './useLibraryGroups.js'

const VIEWS = [
  { key: 'topic', label: '按主题', desc: '按课程主题分目录，顺着学习路径一篇篇往下读。' },
  { key: 'tags', label: '按标签', desc: '按知识点横向串联，把散在不同阶段的笔记连起来看。' },
  { key: 'timeline', label: '按时间', desc: '按记录时间倒序，回看这条完整的学习轨迹。' }
]

// 默认视图由页面 md 传入，SSR 阶段就能确定，不依赖 URL：
// /notes/ 用 topic，旧入口 /tags 用 tags、/archive 用 timeline。
const props = defineProps({
  initialView: { type: String, default: 'topic' }
})

const groups = createLibraryGroups()
// 顶层解构，模板里 computed 才能自动解包
const { allOpen, setAll } = groups

const activeView = ref(props.initialView)
const focusTag = ref('')
const focusSeq = ref(0)

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
// onMounted，视图就切不过去。这类点击由容器统一接管：切到标签视图再交给 TagsIndex 定位。
function onInternalTagLink(e) {
  const a = e.target instanceof Element ? e.target.closest('a[href*="view=tags#tag-"]') : null
  if (!a) return
  const href = a.getAttribute('href') || ''
  const raw = decodeURIComponent(href.slice(href.indexOf('#') + 1))
  if (!raw.startsWith('tag-')) return

  e.preventDefault()
  activeView.value = 'tags'
  focusTag.value = raw.slice(4)
  // 同一个标签可能连点两次，用序号保证每次都能触发定位
  focusSeq.value += 1
  history.replaceState(null, '', href)
}

onMounted(() => {
  // query 优先于路径；带 #tag-xxx 进来时强制切到标签视图并记住要定位的标签
  const q = new URLSearchParams(window.location.search).get('view')
  if (VIEWS.some((v) => v.key === q)) activeView.value = q

  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''))
  if (raw.startsWith('tag-')) {
    focusTag.value = raw.slice(4)
    activeView.value = 'tags'
    // 子组件的 onMounted 早于父组件执行，旧链接（如 /tags#tag-xxx）直出标签视图时，
    // TagsIndex 挂载那一刻还拿不到 focusTag。递增序号让它的 watch 补一次展开 + 定位。
    focusSeq.value += 1
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
      <p class="library-eyebrow">全站内容库 <span>LIBRARY</span></p>
      <h1>全部笔记</h1>
      <p class="library-intro">
        全部文章都收在这里。选一种方式翻：按主题顺着课程读，按标签串知识点，按时间回看轨迹。
      </p>
    </header>

    <div class="library-toolbar">
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
      <p class="notes-stat">
        共 <strong>{{ totalPosts }}</strong> 篇内容 · <strong>{{ totalTags }}</strong> 个标签
      </p>
    </div>

    <div class="library-subbar">
      <p class="view-desc" aria-live="polite">{{ currentDesc }}</p>
      <button
        class="bulk-toggle"
        type="button"
        :aria-pressed="allOpen"
        @click="setAll(!allOpen)"
      >
        <span class="bulk-icon" aria-hidden="true">{{ allOpen ? '−' : '+' }}</span>
        {{ allOpen ? '收起全部' : '展开全部' }}
      </button>
    </div>

    <div class="view-panel">
      <NotesIndex v-if="activeView === 'topic'" />
      <TagsIndex v-else-if="activeView === 'tags'" :focus-tag="focusTag" :focus-seq="focusSeq" />
      <ArchiveIndex v-else />
    </div>
  </div>
</template>
