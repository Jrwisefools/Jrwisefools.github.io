// .vitepress/theme/posts.data.js
// 首页「最新文章」数据源：聚合 docs/posts/*.md 与 docs/notes/**/*.md。
// frontmatter 必填 title、date（YYYY-MM-DD）。
// 按 date 倒序取全站最近 5 篇：archived 只控制内容库里的「基础课」分组，
// 不参与首页筛选，否则日期最新的基础课笔记会被挡在「最新文章」之外。
import { createContentLoader } from 'vitepress'

export default createContentLoader(['posts/*.md', 'notes/**/*.md'], {
  transform(rawData) {
    return rawData
      .filter((page) => page.frontmatter && page.frontmatter.title && page.frontmatter.date)
      .filter((page) => page.url !== '/notes/')
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .slice(0, 5)
  }
})
