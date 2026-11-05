// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HeroHome from './HeroHome.vue'
import HeroAvatar from './HeroAvatar.vue'
import PostList from './PostList.vue'
import ProjectCards from './ProjectCards.vue'
import ContentLibrary from './ContentLibrary.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HeroHome', HeroHome)
    app.component('HeroAvatar', HeroAvatar)
    app.component('PostList', PostList)
    app.component('ProjectCards', ProjectCards)
    app.component('ContentLibrary', ContentLibrary)
    // 三个视图组件由 ContentLibrary 直接 import，不再全局注册：
    // 它们依赖内容库注入的折叠状态，单独使用会拿不到 inject。
  }
}
