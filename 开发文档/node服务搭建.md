## 什么是RestFul设计风格?
REST即表述性状态传递（Representational State Transfer）是Roy Fielding博士在2000年他的博士论文中提出来的一种软件架构风格。
REST基本架构的四个方法：
- GET    用于获取数据
- PUT    用于更新或添加数据
- DELETE 用于删除数据
- POST   用于添加数据

简单来说就是路由与其对应的功能相匹配，比如访问/addList路由就执行把一个数据加入到List中的操作

## 路由路径是如何匹配的？
比方说前端有一个用axios封装的AJAX请求

``` javaScript
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
这里的 `process.env.VUE_APP_BOOK_RUL` 可以在.env.production(生产环境环境变量配置文件)中找到
`VUE_APP_BOOK_URL=http://39.108.122.248:3000`，这样做的好处很明显，便于维护和管理。

也就是说，我们向`http://39.108.122.248:3000/book/detail`这个URL发送了一个GET请求，上面的代码中还带了个参数<br>
那么后台就得这么设置，首先要监听3000端口，然后设置一个对/book/detail这个路径的GET请求的监听，使用express框架的node.js代码如下

``` javaScript
app.get('/book/list', (req, res) => {
  // some code
})
```

但是有一个问题，显然这是一个跨域请求，所以我们的服务器需要允许跨域(JSONP啥的也行)，最简单的方法就是<br>
- `cnpm install cors`
- `app.use(cors())`

这样就搞定了，不过我们得明白这个cors模块到底做了什么，具体来说就差不多是这样

``` javaScript
// 任何请求都会触发这个中间件函数
app.use('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // 任意域名都可以访问
  res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这 样写，只有www.baidu.com 可以访问。
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
