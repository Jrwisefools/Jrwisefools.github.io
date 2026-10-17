<script setup>
/**
 * 图片灯箱：点击正文图片放大查看，点遮罩或按 Esc 关闭。
 * 用事件委托而不是给每张图绑事件，页面切换后无需重新绑定。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(false)
const src = ref('')
const alt = ref('')

function onDocClick(e) {
  const img = e.target && e.target.closest && e.target.closest('.VPDoc img')
  if (!img) return
  src.value = img.getAttribute('src') || ''
  alt.value = img.getAttribute('alt') || ''
  visible.value = true
  document.body.classList.add('lb-open')
}

function close() {
  visible.value = false
  document.body.classList.remove('lb-open')
}

function onKey(e) {
  if (e.key === 'Escape' && visible.value) close()
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
  document.body.classList.remove('lb-open')
})
</script>

<template>
  <div
    v-if="visible"
    class="img-lightbox"
    role="dialog"
    aria-modal="true"
    @click="close"
  >
    <button class="lb-close" type="button" aria-label="关闭">×</button>
    <img class="lb-img" :src="src" :alt="alt" @click.stop />
  </div>
</template>
