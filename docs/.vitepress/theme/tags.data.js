// .vitepress/theme/tags.data.js
// 标签页数据源：聚合 posts 与 notes 下所有 md，按标签分组，标签按篇数倒序。
import { createContentLoader } from 'vitepress'

export default createContentLoader(['notes/**/*.md', 'posts/*.md'], {
  transform(rawData) {
    const posts = rawData
      .filter((p) => p.frontmatter && p.frontmatter.title && p.frontmatter.date)
      .filter((p) => p.url !== '/notes/' && p.url !== '/tags' && p.url !== '/archive')
      .map((p) => ({
        url: p.url,
        title: p.frontmatter.title,
        date: p.frontmatter.date,
        description: p.frontmatter.description || '',
        tags: p.frontmatter.tags || [],
        archived: Boolean(p.frontmatter.archived)
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))

    const map = new Map()
    for (const p of posts) {
      for (const t of p.tags) {
        if (!map.has(t)) map.set(t, [])
        map.get(t).push(p)
      }
    }

    const tags = [...map.entries()]
      .map(([name, list]) => ({ name, count: list.length, posts: list }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh'))

    return { tags, total: tags.length, postTotal: posts.length }
  }
})
