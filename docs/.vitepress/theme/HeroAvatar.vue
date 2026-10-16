<script setup>
/**
 * Hero 头像（接口式）：
 * 若 docs/public/avatar.jpg 存在（建议 400x400）则自动展示图片，
 * 否则回退为显示名字的圆形徽标。
 */
import { onMounted, ref } from 'vue'
import { withBase } from 'vitepress'

const props = defineProps({
  name: { type: String, required: true },
  src: { type: String, default: '/avatar.jpg' }
})

const hasImage = ref(false)
const avatarUrl = withBase(props.src)

onMounted(() => {
  const img = new Image()
  img.onload = () => {
    hasImage.value = true
  }
  img.src = avatarUrl
})
</script>

<template>
  <div class="avatar-block">
    <span class="avatar avatar-fallback" :class="{ 'is-hidden': hasImage }">{{ name }}</span>
    <img v-if="hasImage" class="avatar" :src="avatarUrl" :alt="`${name}头像`" />
  </div>
</template>
