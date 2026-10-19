<script setup>
/**
 * 导航栏右侧身份标识：小头像 + 名字
 * 头像来自 docs/public/avatar.jpg（由 HeroAvatar 探测），缺失时回退为名字徽标。
 * 窄屏只保留头像，避免挤压导航项。
 */
import { useData } from 'vitepress'
import HeroAvatar from './HeroAvatar.vue'
import { computed } from 'vue'

const { theme, site } = useData()
const name = computed(() => theme.value.siteTitle || site.value.title)
</script>

<template>
  <a class="nav-identity" href="/about" :aria-label="`关于${name}`" title="关于我">
    <HeroAvatar :name="name" src="/avatar.jpg" />
    <span class="nav-identity-name">{{ name }}</span>
  </a>
</template>

<style scoped>
.nav-identity {
  display: flex;
  align-items: center;
  gap: 8px;
  height: var(--vp-nav-height);
  text-decoration: none;
}

.nav-identity-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--c-text-2);
  white-space: nowrap;
}

.nav-identity:hover .nav-identity-name {
  color: var(--c-brand);
}

/* 窄屏只保留头像 */
@media (max-width: 640px) {
  .nav-identity-name {
    display: none;
  }
}
</style>
