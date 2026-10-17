import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const notesDir = path.resolve(dirname, '../notes')

// 笔记主题分组：主内容在前，基础课归入归档区（collapsed）
const TOPIC_GROUPS = [
  { dir: 'llm', text: '大模型', desc: '大模型基础概念与 RAG 检索增强' },
  { dir: 'langchain', text: 'LangChain', desc: '提示词模板、工具调用与 Agent' },
  { dir: 'langgraph', text: 'LangGraph', desc: '用图的方式编排智能体流程' },
  { dir: 'finetune', text: '模型微调', desc: '微调原理与训练流程' },
  { dir: 'backend', text: '后端', desc: '协程与 FastAPI 服务开发' }
]

const ARCHIVE_GROUPS = [
  { dir: 'python', text: 'Python 基础', desc: '语法、面向对象与并发编程' },
  { dir: 'linux-mysql', text: 'Linux & MySQL', desc: '系统操作、Shell 与数据库' }
]

// 从 frontmatter 取标题，取不到就退回文件名
function readTitle(file) {
  const head = fs.readFileSync(file, 'utf8').split('\n').slice(0, 20).join('\n')
  const m = head.match(/^title:\s*["']?(.+?)["']?\s*$/m)
  return m ? m[1].trim() : path.basename(file, '.md')
}

// 目录内 md 按文件名（MMDD- 前缀）排序，自动生成侧边栏条目
function itemsOf(dir) {
  const full = path.join(notesDir, dir)
  if (!fs.existsSync(full)) return []
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith('.md') && f !== 'index.md')
    .sort()
    .map((f) => ({
      text: readTitle(path.join(full, f)),
      link: `/notes/${dir}/${f.slice(0, -3)}`
    }))
}

export default defineConfig({
  title: '蒋璐新',
  description: '蒋璐新的个人博客',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
      { text: '标签', link: '/tags' },
      { text: '归档', link: '/archive' },
      { text: '关于', link: '/about' }
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/Jrwisefools' }],

    // 本地搜索。索引存原文、由客户端按 MiniSearch 默认规则（空格与标点）分词，
    // 所以搜「协程」「LangGraph」这类短词有效，中文长句建议拆成关键词。
    search: {
      provider: 'local'
    },

    sidebar: {
      '/notes/': [
        { text: '笔记总览', link: '/notes/' },
        ...TOPIC_GROUPS.map((g) => ({ text: g.text, items: itemsOf(g.dir) })),
        {
          text: '基础课归档',
          collapsed: true,
          items: ARCHIVE_GROUPS.map((g) => ({ text: g.text, items: itemsOf(g.dir) }))
        }
      ]
    },

    outline: [2, 3],
    outlineTitle: '本页目录',
    docFooter: { prev: '上一篇', next: '下一篇' }
  }
})
