// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HeroHome from './HeroHome.vue'
import HeroAvatar from './HeroAvatar.vue'
import HeroTypewriter from './HeroTypewriter.vue'
import PostList from './PostList.vue'
import ProjectCards from './ProjectCards.vue'
import NotesIndex from './NotesIndex.vue'
import TagsIndex from './TagsIndex.vue'
import ArchiveIndex from './ArchiveIndex.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HeroHome', HeroHome)
    app.component('HeroAvatar', HeroAvatar)
    app.component('HeroTypewriter', HeroTypewriter)
    app.component('PostList', PostList)
    app.component('ProjectCards', ProjectCards)
    app.component('NotesIndex', NotesIndex)
    app.component('TagsIndex', TagsIndex)
    app.component('ArchiveIndex', ArchiveIndex)
  }
}
