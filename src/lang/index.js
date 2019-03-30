import Vue from 'vue'
import VueI18N from 'vue-i18n'
import en from './en'
import cn from './cn'
import { getLocale, saveLocale } from '../utils/localStorage'

Vue.use(VueI18N) // 使用插件

const messages = {
  en,
  cn
}

let locale = getLocale()
if (!locale) {
  locale = 'cn'
  saveLocale(locale)
}
const i18n = new VueI18N({
  locale, // 当前语言
  messages // 语言对应的文本
})

export default i18n
