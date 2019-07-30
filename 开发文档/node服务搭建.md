## 什么是RestFul设计风格?
具体可以参考我做的整理 <a href="https://www.kancloud.cn/chenmk/web-knowledges/1176565#RESTFUL_200">点击跳转</a>

RESTful 的设计就是：
- 通过 URL 设计资源
- 请求方法定义资源的操作
- 通过 Accept 决定资源的表现形式

这是朴灵在 《深入浅出 node.js》 中的总结。

举个例子：

过去，我们对用户的增删查改或许是这么设计 URL 的：
```js
POST /user/add?username=jacksontian
GET /user/remove?username=jacksontian
POST /user/update/username=jacksontian
GET /user/get?username=jacksontian
```

在 RestFul 设计中，它应该是这样的：
```js
POST /user/username=jacksontian
DELETE /user/username=jacksontian
PUT /user/username=jacksontian
GET /user/username=jacksontian
```


## 路由路径是如何匹配的？
比方说前端有一个用 axios 封装的 AJAX 请求

``` js
export function detail(book) {
  return axios({
    method: 'get',
    url: `${process.env.VUE_APP_BOOK_URL}/book/detail`,
    params: {
      fileName: book.fileName
    }
  })
}
```
这里的 `process.env.VUE_APP_BOOK_RUL` 可以在.env.production 中找到，两个 .env 文件配置的是开发环境和线上环境的环境变量

所谓环境变量，就是你执行 `npm run serve` 和 `npm run build` 会自动改变的，因为服务器使用的 ip 和 端口不同，自然要做相应的修改。

`VUE_APP_BOOK_URL=http://39.108.122.248:3000`，这样做的好处很明显，便于维护和管理。

也就是说，我们向 `http://39.108.122.248:3000/book/detail` 这个 URL 发送了一个 GET 请求，上面的代码中还带了个参数

那么后台就得这么设置，首先要监听 3000 端口，然后设置一个对 /book/detail 这个路径的 GET 请求的监听，使用 express 框架的 node.js 代码如下

``` javaScript
app.get('/book/list', (req, res) => {
  // some code
})
```

但是有一个问题，显然这是一个跨域请求，所以我们的服务器需要允许跨域(JSONP 啥的也行)，最简单的方法就是
- `cnpm install cors`
- `app.use(cors())`

这样就搞定了，不过我们得明白这个 cors 模块到底做了什么，具体来说就差不多是这样

``` javaScript
// 任何请求都会触发这个中间件函数
app.use('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // 任意域名都可以访问
  res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');//设置方法
  res.header('Access-Control-Allow-Credentials', true); // 支持cookie
  if (req.method == 'OPTIONS') {
    res.send(200); // 意思是，在正常的请求之前，会发送一个验证，是否可以请求。
  }
  else {
    next();
  }
});
```
