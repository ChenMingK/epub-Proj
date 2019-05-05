// 处理在线语音合成API
const Base64 = require('js-base64').Base64 // Base64库用来加密
const md5 = require('js-md5') // 也是加密库
const qs = require('qs')      // 对字符串进行处理，让其变为POST请求中可以识别的键值对形式
const http = require('http')
const mp3FilePath = require('./const').mp3FilePath
const resUrl = require('./const').resUrl
const fs = require('fs')  // fs库，文件操作

function createVoice(req, res) {
  const text = req.query.text
  const lang = req.query.lang
  // const text = '测试科大讯飞在线语音合成api的功能，比如说，我们输入一段话，科大讯飞api会在线实时生成语音返回给客户端'
  // const lang = 'cn'

  // 中文引擎
  let engineType = 'intp65'
  // 如果传入的是英文，需要修改引擎类型
  if (lang.toLowerCase() === 'en') {
    engineType = 'intp65_en'
  }
  // 朗读速度
  const speed = '30'
  // 参数,具体参考科大讯飞开发文档,需要使用Base64编码后生成字符串放到Header
  const voiceParam = {
    auf: 'audio/L16;rate=16000', // 返回的语音格式 & 压缩率
    aue: 'lame',                 // mp3格式
    voice_name: 'xiaoyan',
    speed,
    volume: '50',
    pitch: '50',
    engine_type: engineType,
    text_type: 'text'
  }
  
  // 需要转化为UTC时间戳 --- floor(.../1000) 浮点型带小数点的数floor转化为整数
  const currentTime = Math.floor(new Date().getTime() / 1000)
  const appId = '5ca896ce'                                  // 注册时的Aappid
  const apiKey = 'dd3f9e9e19ac54c31b82b58fd3a23ecc'         // encode方法加密
  const xParam = Base64.encode(JSON.stringify(voiceParam))  // UTC时间戳
  const checkSum = md5(apiKey + currentTime + xParam)       // MP5加密
  // 封装一个Header
  const headers = {}
  headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8' // 必须为utf-8
  headers['X-Param'] = xParam
  headers['X-Appid'] = appId
  headers['X-CurTime'] = currentTime
  headers['X-CheckSum'] = checkSum
  headers['X-Real-Ip'] = '127.0.0.1'
  // 将文本传入，利用qs库的stringify方法
  const data = qs.stringify({
    text: text
  })
  // 参数具体见语音合成文档接口地址
  const options = {
    host: 'api.xfyun.cn',
    path: '/v1/service/v1/tts',
    method: 'POST', // must be POST
    headers
  }
  // 发送HTTP请求(原生的) 需要将返回的内容转化为一个MP3文件
  const request = http.request(options, response => {
    let mp3 = ''
    const contentLength = response.headers['content-length']
    response.setEncoding('binary')  // 编码格式设置为二进制
    // 多次调用data回调?
    response.on('data', data => {
      mp3 += data
      const process = data.length / contentLength * 100
      const percent = parseInt(process.toFixed(2))  // 进度百分比
      // console.log(percent)
    })
    // end回调表示数据已经接收完成
    response.on('end', () => {
      // console.log(response.headers)
      // console.log(mp3)
      // 有可能返回一个text-html而不是audio，404?
      const contentType = response.headers['content-type']
      if (contentType === 'text/html') {
        res.send(mp3) // 直接发送把错误发送给前台(浏览器)
      } else if (contentType === 'text/plain') {
        res.send(mp3)
      } else {
        const fileName = new Date().getTime() // 希望文件名不重复，所以用时间戳
        const filePath = `${mp3FilePath}/${fileName}.mp3` // 保存到一个路径(本地)
        const downloadUrl = `${resUrl}/mp3/${fileName}.mp3` // 下载链接
        // console.log(filePath, downloadUrl)
        // 将这个mp3文件写入到文件系统
        // 路径，数据，文件类型，成功的回调
        fs.writeFile(filePath, mp3, 'binary', err => {
          if (err) { // 如果返回一个错误
            // res.json返回一个结果
            res.json({
              error: 1,
              msg: '下载失败'
            })
          } else {
            res.json({
              error: 0,
              msg: '下载成功',
              path: downloadUrl
            })
          }
        })
      }
    })
  })
  request.write(data)
  request.end()
}

module.exports = createVoice
