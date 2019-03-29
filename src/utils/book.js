// 这个文件管理静态变量
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

export function themeList(vue) {
    return [
        {
            alias: vue.$t('book.themeDefault'),
            name: 'Default',
            style: {
                body: {
                    'color': '#4c5059',
                    'background': '#cecece'
                }   
            }
        },
        {
            alias: vue.$t('book.themeGold'),
            name: 'Gold',
            style: {
                body: {
                    'color': '#5c5b56',
                    'background': '#c6c2b6'
                }
            }
        },
        {
            alias: vue.$t('book.themeEye'),
            name: 'Eye',
            style: {
                body: {
                    'color': '#404c42',
                    'background': '#a9c1a9'
                }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: 'Night',
            style: {
                body: {
                    'color': '#cecece',
                    'background': '#000000'
                } 
            }
        }
    ]
}
// 全局主题设置功能实现(包括菜单栏等)
export function addCss(href) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet') // 属性：样式表
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', href)
    document.getElementsByTagName('head')[0].appendChild(link) // 相当于通过link标签引入新的css样式
}
// 上面用的是添加样式，重复添加只是覆盖之前的效果，加载了多个CSS，需要删除之前的
// 这里只是删除了重复的
export function removeCss(href) {
    const links = document.getElementsByTagName('link')
    for (let i = links.length; i >= 0; i--) {
        const link = links[i]
        if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
            link.parentNode.removeChild(link) // 调用head标签的removeChild
        }
    }
}
// 这里设置一个删除全部的css样式的方法
export function removeAllCss() {
    removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
    removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
    removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
    removeCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
}
