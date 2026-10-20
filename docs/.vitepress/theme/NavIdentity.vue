<script setup>
/**
 * 导航栏右侧身份标识：小头像 + 作者名
 * 头像来自 docs/public/avatar.jpg（由 HeroAvatar 探测），缺失时回退为名字徽标。
 * 窄屏只保留头像，避免挤压导航项。
 *
 * 注意：这里必须是「作者名」，不能图省事用 theme.siteTitle——站点名会随
 * 品牌调整（且比名字长），拿它当作者名会出现导航栏左右两侧文字重复。
 */
import HeroAvatar from './HeroAvatar.vue'

const name = '路中麋鹿'
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
