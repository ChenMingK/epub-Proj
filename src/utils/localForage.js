// 基于localforage库做封装
// 该库全部采用异步方式操作
import localForage from 'localforage'

// set方法: cb:成功的回调 cb2:失败的回调
export function setLocalForage(key, data, cb, cb2) {
  // 
  localForage.setItem(key, data).then((value) => {
    if (cb) cb(value)
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

export function getLocalForage(key, cb) {
  localForage.getItem(key, (err, value) => {
    cb(err, value)
  })
}

// 根据给定的key删除指定的值
export function removeLocalForage(key, cb, cb2) {
  localForage.removeItem(key).then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

// 清空
export function clearLocalForage(cb, cb2) {
  localForage.clear().then(function() {
    if (cb) cb()
  }).catch(function(err) {
    if (cb2) cb2(err)
  })
}

// 获取IndexedDB数据库一共有多少个key
export function lengthLocalForage(cb) {
  localForage.length().then(
    numberOfKeys => {
      if (cb) cb(numberOfKeys)
      // console.log(numberOfKeys)
    }).catch(function(err) {
    // console.log(err)
    if (err) {}
  })
}

// 遍历：遍历每个元素
export function iteratorLocalForage() {
  localForage.iterate(function(value, key, iterationNumber) {
    // console.log([key, value])
  }).then(function() {
    // console.log('Iteration has completed')
  }).catch(function(err) {
    // console.log(err)
    if (err) {}
  })
}

export function support() {
  const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || null
  if (indexedDB) {
    return true
  } else {
    return false
  }
}
