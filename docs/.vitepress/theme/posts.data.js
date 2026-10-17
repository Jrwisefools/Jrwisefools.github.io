// .vitepress/theme/posts.data.js
// 首页「最新文章」数据源：聚合 docs/posts/*.md 与 docs/notes/**/*.md。
// frontmatter 必填 title、date（YYYY-MM-DD）；
// 带 archived: true 的基础课笔记只进归档区，不出现在首页最新列表。
import { createContentLoader } from 'vitepress'

export default createContentLoader(['posts/*.md', 'notes/**/*.md'], {
  transform(rawData) {
    return rawData
      .filter((page) => page.frontmatter && page.frontmatter.title && page.frontmatter.date)
      .filter((page) => page.url !== '/notes/')
      .filter((page) => !page.frontmatter.archived)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .slice(0, 5)
  }
})
