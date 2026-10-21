<script setup>
/**
 * 404 页：鲨鱼迷路了。
 * 挂在默认主题的 not-found 插槽上，替换 VitePress 默认的「PAGE NOT FOUND」。
 */
</script>

<template>
  <div class="notfound">
    <img class="notfound-shark" src="/hero-shark.png" alt="" aria-hidden="true" />
    <p class="notfound-code">404</p>
    <h1 class="notfound-title">这一页游丢了</h1>
    <p class="notfound-text">
      你要找的内容不在这里——可能被挪走了，或者链接打错了。
    </p>
    <div class="notfound-actions">
      <a class="notfound-btn" href="/">回首页</a>
      <a class="notfound-link" href="/notes/">去看笔记 →</a>
    </div>
  </div>
</template>

<style scoped>
.notfound {
  max-width: 480px;
  margin: 0 auto;
  padding: 72px 24px 96px;
  text-align: center;
}

.notfound-shark {
  width: 180px;
  max-width: 50vw;
  height: auto;
  display: block;
  margin: 0 auto 8px;
  animation: nf-float 3.2s ease-in-out infinite;
}

/* 鲨鱼轻轻上下浮动，呼应"游丢了"的文案；尊重系统减动效设置 */
@keyframes nf-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .notfound-shark {
    animation: none;
  }
}

.notfound-code {
  margin: 12px 0 0;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: var(--c-fs-meta, 0.8125rem);
  letter-spacing: 0.3em;
  color: var(--c-text-4);
}

.notfound-title {
  margin: 8px 0 0;
  font-size: 1.6rem;
  font-weight: var(--c-fw-title, 700);
  letter-spacing: var(--c-ls-hero, -0.02em);
  color: var(--c-text-1);
  line-height: 1.3;
}

.notfound-text {
  margin: 14px 0 0;
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--c-text-3);
}

.notfound-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.notfound-btn {
  display: inline-flex;
  align-items: center;
  padding: 10px 26px;
  border-radius: var(--c-radius-pill, 999px);
  background: var(--c-brand);
  color: var(--c-btn-text, #fff);
  font-size: 0.95rem;
  text-decoration: none;
  transition: background-color 0.2s var(--c-ease, ease);
}

.notfound-btn:hover {
  background: var(--c-brand-hover);
}

.notfound-link {
  font-size: 0.95rem;
  color: var(--c-text-2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 2px;
  transition: color 0.2s var(--c-ease, ease), border-color 0.2s var(--c-ease, ease);
}

.notfound-link:hover {
  color: var(--c-brand);
  border-bottom-color: var(--c-brand);
}
</style>
