// 内容库「浏览方式」在 内容库 → 文章页 → 返回内容库 之间的传递。
//
// 主通道是 URL query（可分享、SSR 首屏、刷新都拿得到），sessionStorage 只作为
// 兜底：从首页「最新文章」、搜索结果等地方直接进文章页时没有 query，用上次
// 在内容库里选的方式，避免目录突然跳回「按主题」。

const KEY = 'library-view'

export const VIEW_LIST = [
  { key: 'topic', label: '按主题' },
  { key: 'tags', label: '按标签' },
  { key: 'timeline', label: '按时间' }
]

export const DEFAULT_VIEW = 'topic'
const KEYS = VIEW_LIST.map((v) => v.key)

export const normalizeView = (v) => (KEYS.includes(v) ? v : DEFAULT_VIEW)
export const viewLabel = (v) =>
  VIEW_LIST.find((x) => x.key === normalizeView(v))?.label ?? '按主题'

export function readLibraryView() {
  if (typeof window === 'undefined') return DEFAULT_VIEW
  const q = new URLSearchParams(window.location.search).get('view')
  if (q) return normalizeView(q)
  try {
    return normalizeView(window.sessionStorage.getItem(KEY))
  } catch {
    return DEFAULT_VIEW
  }
}

export function writeLibraryView(v) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(KEY, normalizeView(v))
  } catch {
    // 隐私模式下 sessionStorage 可能不可写，query 通道仍然有效
  }
}

export function libraryLink(v) {
  const key = normalizeView(v)
  return key === DEFAULT_VIEW ? '/notes/' : `/notes/?view=${key}`
}

// 给文章链接带上「从哪种视图、哪个分组点进来的」，返回内容库时能回到原位置。
// 标签链接本身已含 view=tags，这里直接跳过，避免拼出两个 view 参数。
export function withView(url, view, group) {
  if (!url || !url.startsWith('/') || url.includes('view=')) return url
  const [path, hash] = url.split('#')
  const q = [`view=${normalizeView(view)}`]
  if (group) q.push(`group=${encodeURIComponent(group)}`)
  return `${path}${path.includes('?') ? '&' : '?'}${q.join('&')}${hash ? '#' + hash : ''}`
}

// data loader 的 url 不带 .html，而 useData().page.path 可能带；统一后再比对
export const normalizeUrl = (u = '') => {
  const p = u.split('?')[0].split('#')[0].replace(/\.html$/, '')
  return p.replace(/\/$/, '') || '/'
}

export function readGroupParam() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('group') || ''
}
