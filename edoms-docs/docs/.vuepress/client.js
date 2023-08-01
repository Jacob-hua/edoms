import { defineClientConfig } from '@vuepress/client'
import ArticleTopAd from './components/ArticleTopAd.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('ArticleTopAd', ArticleTopAd)
  },
})