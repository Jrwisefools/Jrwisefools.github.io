<script setup>
/**
 * 导航过渡，两件事：
 *   1) 页面切换：顶部细进度条 + 内容区轻微浮入；
 *   2) 本页目录锚点：平滑滚动 + 目标标题「翻页落定」的浮入高亮。
 *
 * VitePress 默认是 SPA 硬切：点击后要等页面 chunk 加载完，期间界面没有任何
 * 反馈，然后内容瞬间替换；本页目录则是原生 hash 跳转，瞬间到位。
 *
 * 页面切换用 Router 的 onBeforePageLoad 感知「开始等 chunk」、route.path 的
 * watch 感知「新页面已渲染」。刻意：
 *   - 不做离场动画 / 不用 out-in，避免把切换时长翻倍；
 *   - 不改 Layout 的 DOM 结构，进度条 Teleport 到 body，动画用 Web
 *     Animations 一次性播放，不干扰侧栏、代码块复制等既有逻辑；
 *   - 同页锚点不触发页面级过渡，改由下面的锚点逻辑处理。
 * 锚点部分不接管滚动（保留框架算好的 scrollOffset），只在捕获阶段临时打开
 * CSS 平滑滚动。不做真 3D 翻页：长文档里翻页会打断连续阅读，目录是锚点不是分页。
 * 全程尊重 prefers-reduced-motion，颜色读 --c-accent-soft 不写死。
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
let onAnchorClick
const timers = new Set()

function later(fn, ms) {
  const t = setTimeout(() => {
    timers.delete(t)
    fn()
  }, ms)
  timers.add(t)
}

const reduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function pathOf(to) {
  try {
    return new URL(to, window.location.href).pathname
  } catch {
    return to
  }
}

function playEnter() {
  if (reduced()) return
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

/** 锚点落定：目标标题轻轻浮入 + 淡色高亮渐隐，像「翻到了这一节」 */
function landing(el) {
  if (!el || typeof el.animate !== 'function') return
  // 跳过 skip-link 之类指向大容器的锚点，否则整篇内容会一起高亮位移
  if (el.matches?.('.VPContent, .VPDoc, .VPPage, main, body')) return
  if (el.getBoundingClientRect().height > window.innerHeight * 0.6) return
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue('--c-accent-soft')
      .trim() || 'transparent'
  el.getAnimations?.().forEach((a) => {
    if (a.id === 'anchor-land') a.cancel()
  })
  const anim = el.animate(
    [
      { transform: 'translateY(8px)', opacity: 0.55, backgroundColor: accent },
      { transform: 'none', opacity: 1, backgroundColor: 'transparent' }
    ],
    { duration: 720, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' }
  )
  anim.id = 'anchor-land'
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

  // 本页目录：捕获阶段先开平滑滚动，冒泡阶段 VitePress 的 scrollTo /
  // 浏览器原生 hash 跳转会继承它；落定后再播一次浮入高亮。
  onAnchorClick = (e) => {
    if (reduced()) return
    const a = e.target.closest?.('a[href^="#"]')
    if (!a) return
    const raw = a.getAttribute('href').slice(1)
    if (!raw) return
    let id
    try {
      id = decodeURIComponent(raw)
    } catch {
      id = raw
    }
    const target = document.getElementById(id)
    if (!target) return

    const root = document.documentElement
    root.style.scrollBehavior = 'smooth'
    later(() => {
      root.style.scrollBehavior = ''
    }, 700)
    later(() => landing(target), 420)
  }
  document.addEventListener('click', onAnchorClick, true)
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
  timers.forEach(clearTimeout)
  if (onAnchorClick) document.removeEventListener('click', onAnchorClick, true)
  document.documentElement.style.scrollBehavior = ''
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
