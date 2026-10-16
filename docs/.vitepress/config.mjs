import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "蒋璐新",
  description: "蒋璐新的个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/python' },
      { text: '项目', link: '/projects/rag' },
      { text: '关于', link: '/about' }
    ],

    sidebar: [
      {
        text: '笔记',
        items: [
          { text: 'Python', link: '/notes/python' },
          { text: 'LLM', link: '/notes/llm' }
        ]
      },
      {
        text: '项目',
        items: [
          { text: 'RAG', link: '/projects/rag' },
          { text: 'FastAPI', link: '/projects/fastapi' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Jrwisefools' }
    ]
  }
})
