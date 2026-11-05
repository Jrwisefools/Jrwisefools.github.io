<script setup>
/**
 * 内容库里可收起的大标题：按主题 / 按标签 / 按时间三个视图共用。
 *
 * 用按钮 + aria-expanded 而不是原生 details：状态由 useLibraryGroups 统一管理，
 * 才能做「展开全部 / 收起全部」和标签锚点跳转时自动展开目标分组。
 * 内容始终留在 DOM 里（靠 CSS 收起），SEO 与首屏渲染都不受影响。
 */
import { computed } from 'vue'
import { useLibraryGroups } from './useLibraryGroups.js'

const props = defineProps({
  groupKey: { type: String, required: true },
  title: { type: String, required: true },
  count: { type: Number, default: 0 },
  desc: { type: String, default: '' },
  anchorId: { type: String, default: '' }
})

const groups = useLibraryGroups()
const open = computed(() => groups.isOpen(props.groupKey))
</script>

<template>
  <section class="lib-group" :class="{ open }" :id="anchorId || undefined">
    <button
      class="group-head"
      type="button"
      :aria-expanded="open"
      @click="groups.toggle(groupKey)"
    >
      <span class="group-index" aria-hidden="true"></span>
      <span class="group-heading">
        <span class="group-title">{{ title }}</span>
        <span v-if="desc" class="group-desc">{{ desc }}</span>
      </span>
      <span class="group-tail">
        <span class="group-count">{{ count }} 篇</span>
        <span class="group-chevron" aria-hidden="true"></span>
      </span>
    </button>

    <div class="group-panel" :class="{ open }" :aria-hidden="!open">
      <div class="group-panel-inner">
        <slot />
      </div>
    </div>
  </section>
</template>
