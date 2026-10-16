import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "蒋璐新|技术博客",
  description: "2026届计算机应届生 | Python / LLM / RAG / FastAPI 项目笔记",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '学习笔记', link: '/notes/python' },
      { text: '项目实战', link: '/projects/rag' },
      { text: '关于我', link: '/about' }
    ],

    sidebar: [
      {
        text: '学习笔记',
        items: [
          { text: 'LLM 大模型', link: '/notes/llm' },
          { text: 'Python', link: '/notes/python' }
        ]
      },
      {
        text: '项目实战',
        items: [
          { text: 'FastAPI 微服务', link: '/projects/fastapi' },
          { text: 'RAG 知识库', link: '/projects/rag' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://gitee.com/luzhongmilu' }
    ]
  }
})
