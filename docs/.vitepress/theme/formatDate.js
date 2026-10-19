/**
 * 日期格式化工具：frontmatter 的 date 可能是 Date 对象或字符串，
 * 统一输出 YYYY-MM-DD；无法解析时原样返回。
 */
export function formatDate(d) {
  if (d == null) return ''
  const date = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(date.getTime())) return String(d)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
