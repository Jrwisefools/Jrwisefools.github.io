// 内容库分组折叠状态：由 ContentLibrary 持有，三个视图通过 inject 共用。
// 状态放在组件实例里而不是模块级变量，SSR 构建时不会在页面之间串状态；
// 切换视图时容器不重建，所以各组展开/收起的状态会保留下来。
import { computed, inject, provide, ref } from 'vue'

const GROUP_STATE = Symbol('library-groups')

export function createLibraryGroups() {
  // key -> 是否展开。key 形如 topic:llm / tags:RAG / timeline:2026-10
  const openMap = ref({})
  const keys = ref([])
  const defaults = ref([])

  // 每个视图在 setup 阶段登记自己的分组 key 与默认展开项。
  // 登记时把未设置过的 key 显式写入，切换视图后 defaults 变化也不会误改别组的初始状态。
  function register(nextKeys, nextDefaults = []) {
    keys.value = nextKeys
    defaults.value = nextDefaults
    const next = { ...openMap.value }
    for (const k of nextKeys) {
      if (!(k in next)) next[k] = nextDefaults.includes(k)
    }
    openMap.value = next
  }

  const isOpen = (key) => openMap.value[key] ?? defaults.value.includes(key)

  function toggle(key) {
    openMap.value = { ...openMap.value, [key]: !isOpen(key) }
  }

  function set(key, value) {
    if (isOpen(key) === value) return
    openMap.value = { ...openMap.value, [key]: value }
  }

  function setAll(value) {
    const next = { ...openMap.value }
    for (const k of keys.value) next[k] = value
    openMap.value = next
  }

  const allOpen = computed(
    () => keys.value.length > 0 && keys.value.every(isOpen)
  )

  const api = { register, isOpen, toggle, set, setAll, allOpen }
  provide(GROUP_STATE, api)
  return api
}

export function useLibraryGroups() {
  return inject(GROUP_STATE)
}
