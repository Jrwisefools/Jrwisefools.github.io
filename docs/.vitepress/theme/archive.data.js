// .vitepress/theme/archive.data.js
// 归档页数据源：聚合 posts 与 notes 下所有 md，按「年 - 月」倒序分组。
import { createContentLoader } from 'vitepress'

const parts = (d) => {
  const date = d instanceof Date ? d : new Date(d)
  return {
    y: date.getFullYear(),
    m: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0')
  }
}

export default createContentLoader(['notes/**/*.md', 'posts/*.md'], {
  transform(rawData) {
    const posts = rawData
      .filter((p) => p.frontmatter && p.frontmatter.title && p.frontmatter.date)
      .filter((p) => p.url !== '/notes/' && p.url !== '/tags' && p.url !== '/archive')
      .map((p) => {
        const { y, m, day } = parts(p.frontmatter.date)
        return {
          url: p.url,
          title: p.frontmatter.title,
          date: p.frontmatter.date,
          year: y,
          month: m,
          day,
          tags: p.frontmatter.tags || [],
          archived: Boolean(p.frontmatter.archived)
        }
      })

    const map = new Map()
    for (const p of posts) {
      const key = `${p.year}-${p.month}`
      if (!map.has(key)) map.set(key, { year: p.year, month: p.month, posts: [] })
      map.get(key).posts.push(p)
    }

    const months = [...map.values()]
      .map((g) => ({
        ...g,
        posts: g.posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))
      }))
      .sort((a, b) => b.year - a.year || Number(b.month) - Number(a.month))

    return { months, total: posts.length }
  }
})
