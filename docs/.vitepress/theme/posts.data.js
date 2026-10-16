// .vitepress/theme/posts.data.js
// 首页「最新文章」数据源：聚合 docs/posts/*.md，
// frontmatter 必填 title、date（YYYY-MM-DD）
import { createContentLoader } from 'vitepress'

export default createContentLoader('posts/*.md', {
  transform(rawData) {
    return rawData
      .filter((page) => page.frontmatter && page.frontmatter.date)
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .slice(0, 5)
  }
})
