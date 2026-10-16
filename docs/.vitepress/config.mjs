import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "蒋璐新",
  description: "蒋璐新的个人博客",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '关于', link: '/about' }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Jrwisefools' }
    ]
  }
})
