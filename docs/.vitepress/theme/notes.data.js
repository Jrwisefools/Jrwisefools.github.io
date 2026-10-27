// .vitepress/theme/notes.data.js
// 笔记总览页数据源：聚合 docs/notes/**/*.md，按主题分组。
// 主题顺序与 config.mjs 的侧边栏分组保持一致。
import { createContentLoader } from 'vitepress'

const TOPICS = [
  { key: 'llm', text: '大模型', desc: '大模型基础概念与 RAG 检索增强', archived: false },
  { key: 'langchain', text: 'LangChain', desc: '提示词模板、工具调用与 Agent', archived: false },
  { key: 'langgraph', text: 'LangGraph', desc: '用图的方式编排智能体流程', archived: false },
  { key: 'finetune', text: '模型微调', desc: '微调原理与训练流程', archived: false },
  { key: 'deepagents', text: '深度智能体', desc: 'DeepAgents 多智能体与上下文工程', archived: false },
  { key: 'backend', text: '后端', desc: '协程与 FastAPI 服务开发', archived: false },
  { key: 'python', text: 'Python 基础', desc: '语法、面向对象与并发编程', archived: true },
  { key: 'linux-mysql', text: 'Linux & MySQL', desc: '系统操作、Shell 与数据库', archived: true }
]

export default createContentLoader('notes/**/*.md', {
  transform(rawData) {
    const posts = rawData
      .filter((p) => p.frontmatter && p.frontmatter.title && p.frontmatter.date)
      .filter((p) => p.url !== '/notes/')
      .map((p) => ({
        url: p.url,
        title: p.frontmatter.title,
        date: p.frontmatter.date,
        tags: p.frontmatter.tags || [],
        archived: Boolean(p.frontmatter.archived)
      }))
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))

    const topicOf = (url) => {
      const m = url.match(/^\/notes\/([^/]+)\//)
      return m ? m[1] : 'other'
    }

    const groups = TOPICS.map((t) => ({
      ...t,
      posts: posts.filter((p) => topicOf(p.url) === t.key)
    })).filter((g) => g.posts.length)

    return {
      groups,
      main: groups.filter((g) => !g.archived),
      archive: groups.filter((g) => g.archived),
      total: posts.length,
      mainCount: posts.filter((p) => !p.archived).length,
      archiveCount: posts.filter((p) => p.archived).length
    }
  }
})
