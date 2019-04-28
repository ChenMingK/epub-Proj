// 这个文件管理静态变量和通用方法
import { getReadTime } from './localStorage'
import { realPx } from './utils' 
export const FONT_SIZE_LIST = [
  { fontSize: 12 },
  { fontSize: 14 },
  { fontSize: 16 },
  { fontSize: 18 },
  { fontSize: 20 },
  { fontSize: 22 },
  { fontSize: 24 }
]

export const FONT_FAMILY = [
  { font: 'Default' },
  { font: 'Cabin' },
  { font: 'Days One' },
  { font: 'Montserrat' },
  { font: 'Tangerine' }
]
// 主题列表
export function themeList(vue) {
  return [
    {
      alias: vue.$t('book.themeDefault'), // 国际化文字
      name: 'Default',
      style: {
        body: {
          'color': '#4c5059',                         // 字体颜色
          'background': '#cecece',                    // 背景颜色
          'padding-top': `${realPx(48)}px!important`, // 自适应的padding，留给页眉和页脚
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeGold'),
      name: 'Gold',
      style: {
        body: {
          'color': '#5c5b56',
          'background': '#c6c2b6',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeEye'),
      name: 'Eye',
      style: {
        body: {
          'color': '#404c42',
          'background': '#a9c1a9',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    },
    {
      alias: vue.$t('book.themeNight'),
      name: 'Night',
      style: {
        body: {
          'color': '#cecece',
          'background': '#000000',
          'padding-top': `${realPx(48)}px!important`,
          'padding-bottom': `${realPx(48)}px!important`
        }
      }
    }
  ]
}
// 全局主题设置功能实现(包括菜单栏等)
export function addCss(href) {
  const link = document.createElement('link') // 创建link标签
  link.setAttribute('rel', 'stylesheet')      // 设置属性：样式表
  link.setAttribute('type', 'text/css')       // css文件
  link.setAttribute('href', href)             // 路径
  document.getElementsByTagName('head')[0].appendChild(link) // 相当于通过link标签引入新的css样式
}
// 上面用的是添加样式，重复添加只是覆盖之前的效果，加载了多个CSS，需要删除之前的
export function removeCss(href) {
  const links = document.getElementsByTagName('link')
  for (let i = links.length; i >= 0; i--) { // 从后往前遍历
    const link = links[i]
    if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
      link.parentNode.removeChild(link) // 调用head标签的removeChild, 要删除的那个节点, 而不是传入节点下标什么的
    }
  }
}
// 这里设置一个删除全部的css样式的方法, 通过匹配href属性来删除, 注意不能删除其他的样式
export function removeAllCss() {
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
  removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}

export function getReadTimeByMinute(fileName) {
  const readTime = getReadTime(fileName)
  if (!readTime) {
    return 0
  } else {
    return Math.ceil(readTime / 60) // 向上取整
  }
}

export function flatten(array) {
  return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}
