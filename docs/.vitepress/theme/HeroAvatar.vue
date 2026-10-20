<script setup>
/**
 * 头像（接口式）：
 * 默认渲染 docs/public/avatar.jpg，加载失败才回退为名字徽标。
 *
 * 注意：图片必须由 SSR 直接输出，不能改成监听 afterMount 再插入 ——
 * 否则在 JS 未就绪时只会显示名字徽标，而导航里并存的名字文字会出现
 * 「路中麋鹿 路中麋鹿」的重复。这里用 @error 回退，不依赖 JS。
 */
import { ref } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  name: { type: String, required: true },
  src: { type: String, default: '/avatar.jpg' }
})

const failed = ref(false)
const avatarUrl = withBase(props.src)
</script>

<template>
  <div class="avatar-block">
    <img
      v-if="!failed"
      class="avatar"
      :src="avatarUrl"
      :alt="`${name}头像`"
      @error="failed = true"
    />
    <span v-else class="avatar avatar-fallback" aria-hidden="true">{{ name }}</span>
  </div>
</template>
