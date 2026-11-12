<script setup>
/**
 * 页面切换过渡：顶部细进度条 + 内容区轻微浮入。
 *
 * VitePress 默认是 SPA 硬切：点击后要等页面 chunk 加载完，期间界面没有任何
 * 反馈，然后内容瞬间替换。慢网络下观感就是「点了没反应 → 突然跳变」。
 *
 * 这里用 Router 的 onBeforePageLoad 感知「开始等 chunk」，用 route.path 的
 * watch 感知「新页面已渲染」，把这段时间变成有反馈的过渡。刻意：
 *   - 不做离场动画 / 不用 out-in，避免把切换时长翻倍；
 *   - 不改 Layout 的 DOM 结构，进度条 Teleport 到 body，内容动画用 Web
 *     Animations 一次性播放，不干扰侧栏、代码块复制等既有逻辑；
 *   - 同页锚点（标签跳转、本页目录）不触发；尊重 prefers-reduced-motion。
 */
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vitepress'

const route = useRoute()
const router = useRouter()

const mounted = ref(false)
const running = ref(false)
const done = ref(false)

let hideTimer = null
let lastPath = null
let previousHook
let myHook

function pathOf(to) {
  try {
    return new URL(to, window.location.href).pathname
  } catch {
    return to
  }
}

function playEnter() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const el = document.querySelector('.VPContent')
  if (!el || typeof el.animate !== 'function') return
  el.getAnimations?.().forEach((a) => {
    if (a.id === 'page-enter') a.cancel()
  })
  const anim = el.animate(
    [
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'none' }
    ],
    { duration: 240, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
  )
  anim.id = 'page-enter'
}

onMounted(() => {
  mounted.value = true
  lastPath = pathOf(route.path)

  // VitePress 的 hook 是 router 上的单个属性，先串起上游（若有）再赋值
  previousHook = router.onBeforePageLoad
  myHook = async (to) => {
    if (previousHook) {
      const result = await previousHook(to)
      if (result === false) return false
    }
    if (pathOf(to) === lastPath) return // 纯锚点 / 同页，不做过渡
    clearTimeout(hideTimer)
    done.value = false
    running.value = true
  }
  router.onBeforePageLoad = myHook
})

watch(
  () => route.path,
  async (next) => {
    lastPath = pathOf(next)
    await nextTick()
    playEnter()
    if (!running.value) return
    done.value = true
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      running.value = false
      done.value = false
    }, 300)
  }
)

onBeforeUnmount(() => {
  clearTimeout(hideTimer)
  if (router.onBeforePageLoad === myHook) {
    router.onBeforePageLoad = previousHook
  }
})
</script>

<template>
  <Teleport v-if="mounted" to="body">
    <div
      class="page-progress"
      :class="{ 'is-running': running, 'is-done': done }"
      aria-hidden="true"
    >
      <span />
    </div>
  </Teleport>
</template>
