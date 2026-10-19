<script setup>
/**
 * 笔记侧栏收放开关。
 *
 * VitePress 在桌面宽度（≥960px）下侧栏常驻，没有内置的收起入口，
 * 这里通过切换 <html> 上的 class 来控制：
 *   - 收起：把 --vp-sidebar-width 置 0，内容区自然占满
 *   - 状态写入 localStorage，刷新和翻页都保持
 * 仅在 /notes/ 下出现（其他页面本来就没有侧栏），窄屏隐藏。
 */
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vitepress'

const CLASS = 'notes-sidebar-collapsed'
const KEY = 'vp-notes-sidebar-collapsed'

const route = useRoute()
const collapsed = ref(false)

const show = computed(() => route.path.startsWith('/notes/'))

onMounted(() => {
  collapsed.value = localStorage.getItem(KEY) === '1'
  apply()
})

function apply() {
  document.documentElement.classList.toggle(CLASS, collapsed.value)
}

function toggle() {
  collapsed.value = !collapsed.value
  apply()
  localStorage.setItem(KEY, collapsed.value ? '1' : '0')
}
</script>

<template>
  <button
    v-if="show"
    class="sidebar-toggle"
    type="button"
    :aria-expanded="!collapsed"
    :title="collapsed ? '展开侧栏' : '收起侧栏'"
    :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
    @click="toggle"
  >
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
    </svg>
  </button>
</template>
