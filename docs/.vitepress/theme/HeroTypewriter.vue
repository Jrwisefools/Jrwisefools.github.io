<script setup>
/**
 * tagline 打字机：
 * SSR/无 JS 环境直接渲染全文；浏览器端逐字键入，
 * prefers-reduced-motion（减少动态效果）下直接显示全文不播动画。
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  speed: { type: Number, default: 90 }
})

const shown = ref(props.text)
const typing = ref(false)
let timer = null

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return
  shown.value = ''
  typing.value = true
  let i = 0
  timer = setInterval(() => {
    i += 1
    shown.value = props.text.slice(0, i)
    if (i >= props.text.length) {
      typing.value = false
      clearInterval(timer)
      timer = null
    }
  }, props.speed)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <p class="tagline typewriter" :aria-label="text">
    <span aria-hidden="true">{{ shown }}</span>
    <span v-show="typing" class="caret" aria-hidden="true"></span>
  </p>
</template>
