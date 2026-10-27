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
  { dir: 'deepagents', text: '深度智能体', desc: 'DeepAgents 多智能体与上下文工程' },
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
  // 浏览器标签页与 SEO 标题（各页面标签为「页面名 | 路中麋鹿」）
  title: '路中麋鹿',
  description: '路中麋鹿：RAG、大模型应用与 FastAPI 后端的学习笔记',

  // 浏览器标签页图标用主题鲨鱼（64px 缩放版；原图 theme-shark.png 仅导航栏用）
  head: [['link', { rel: 'icon', href: '/favicon.png' }]],

  themeConfig: {
    // 导航栏左上角显示站点名（与右上角的头像 + 作者名「路中麋鹿」是同一品牌的
    // 两种呈现：左边是站名，右边是身份入口）
    siteTitle: '路中麋鹿',
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' },
      { text: '标签', link: '/tags' },
      { text: '归档', link: '/archive' },
      { text: '关于', link: '/about' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Jrwisefools' },
      {
        // Gitee 无内置预设图标，使用官方矢量图
        icon: {
          svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Gitee</title><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>'
        },
        link: 'https://gitee.com/luzhongmilu',
        ariaLabel: 'Gitee'
      }
    ],

    // 本地搜索。索引存原文、由客户端按 MiniSearch 默认规则（空格与标点）分词，
    // 所以搜「协程」「LangGraph」这类短词有效，中文长句建议拆成关键词。
    search: {
      provider: 'local'
    },

    sidebar: {
    '/notes/': [
      { text: '笔记总览', link: '/notes/' },
      // collapsed 必须显式给出才会渲染折叠箭头（VitePress 判空决定是否可折叠）；
      // false = 默认展开但可手动收起
      ...TOPIC_GROUPS.map((g) => ({ text: g.text, collapsed: false, items: itemsOf(g.dir) })),
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
