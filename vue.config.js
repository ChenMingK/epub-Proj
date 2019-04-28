/*
// 添加自定义的接口  参数：全局对象，模拟的url，要传递的数据
function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data) // 将data变为json对象传入
  })
}

// what?模拟接口？
const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')*/
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/',
    devServer: {
      /*
      // 在应用启动之前模拟接口
      before(app) {
        mock(app, '/book/home', homeData)       // 访问/book/home这个路径能获取数据？
        mock(app, '/book/shelf', shelfData)
        mock(app, '/book/list', listData)
        mock(app, '/book/flat-list', flatListData)
      }*/
    },
    // 配置Webpack
    configureWebpack: {
      // 文件大小?
      // build配置
      performance: {
        hints: 'warning', // false的话则不提示
        maxAssetSize: 524288, // 512K 512*1024
        maxEntrypointSize: 524288
      }
    }
}
