// import Mock from 'mockjs'
// import BookHomeApi from './bookHome'
// import BookShelfApi from './bookShelf'
// import BookHomeList from './bookList'
// import BookFlatList from './bookFlatList'

// // Mock.setup({
// //   timeout: '350-600'
// // })

// Mock.mock(/\/book\/home/, 'get', BookHomeApi)
// Mock.mock(/\/book\/shelf/, 'get', BookShelfApi)
// Mock.mock(/\/book\/list/, 'get', BookHomeList)
// Mock.mock(/\/book\/flat-list/, 'get', BookFlatList)

// export default Mock
import Mock from 'mockjs'
import home from './bookHome'
import shelf from './bookShelf'
import list from './bookList'
import flatList from './bookFlatList'

// mock方法，三个参数
Mock.mock(/\/book\/home/, 'get', home) // 前端访问book/home时会请求这里的数据？
Mock.mock(/\/book\/shelf/, 'get', shelf)
Mock.mock(/\/book\/list/, 'get', list)
Mock.mock(/\/book\/flat-list/, 'get', flatList)
