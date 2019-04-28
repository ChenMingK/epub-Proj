// API请求？ 爱克希尔斯 定义接口？
import axios from 'axios'
import { setLocalForage } from '../utils/localForage'

// for ShelfFooter - download() 下载电子书
export function download(book, onSuccess, onError, onProgress) {
  if (!onProgress) { // 如果只穿了3个参数，则把第三个参数赋给第四个参数
    onProgress = onError
    onError = null
  }
  // create()返回一个axios实例，通过实例的get方法实现请求...why?
  return axios.create({
    baseURL: process.env.VUE_APP_EPUB_URL,
    method: 'get',
    responseType: 'blob', // 电子书是blob对象，自动转换成blob对象?
    timeout: 180 * 1000, // 超时设置
    onDownloadProgress: ProgressEvent => { // 下载进度
      if (onProgress) onProgress(ProgressEvent)
    }
  }).get(`${book.categoryText}/${book.fileName}.epub`) // 拼路径 -> Nginx
    .then(res => {
      const blob = new Blob([res.data]) // response中data存储blob对象 epubjs可以直接打开blob对象
      setLocalForage(book.fileName, blob, () => { // 键、值、成功的回调、失败的回调
        if (onSuccess) onSuccess(book)
      }, err => {
        if (onError) onError(err)
      })
    })
      .catch(err => {
        if (onError) onError(err)
      })
}
export function home() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/home`
  })
}

export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}
// 先模拟接口
export function list() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/list`
  })
}

// 书架接口
export function shelf() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BASE_URL}/book/shelf`
  })
}

// 听书接口
export function flatList() {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/flat-list`
  })
}

