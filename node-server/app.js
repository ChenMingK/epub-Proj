const express = require('express')
const mysql = require('mysql')
const constant = require('./const')
const cors = require('cors') // cors库，跨域
const voice = require('./voice')

const app = express()
// 使用cors,原理?
app.use(cors())
// 根目录
app.get('/', (req, res) => {
  res.send(new Date().toDateString())
})
// 连接数据库
function connect() {
  return mysql.createConnection({
    host: constant.dbHost,
    user: constant.dbUser,
    password: constant.dbPwd,
    database: 'book'
  })
}

function randomArray(n, l) {
  let rnd = []
  for (let i = 0; i < n; i++) {
    rnd.push(Math.floor(Math.random() * l))
  }
  return rnd
}

function createGuessYouLike(data) {
  const n = parseInt(randomArray(1, 3)) + 1
  data['type'] = n
  switch (n) {
    case 1:
      data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
      break
    case 2:
      data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
      break
    case 3:
      data['result'] = '《Living with Disfigurement》'
      data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
      break
  }
  return data
}

function createRecommendData(data) {
  data['readers'] = Math.floor(data.id / 2 * randomArray(1, 100))
  return data
}

function createData(results, key) {
  return handleData(results[key])
}

function handleData(data) {
  if (!data.cover.startsWith('http://')) {
    data['cover'] = `${constant.resUrl}/img${data.cover}`
  }
  data['selected'] = false
  data['private'] = false
  data['cache'] = false
  data['haveRead'] = 0
  return data
}

function createCategoryIds(n) {
  const arr = []
  constant.category.forEach((item, index) => {
    arr.push(index + 1)
  })
  const result = []
  for (let i = 0; i < n; i++) {
    // 获取的随机数不能重复
    const ran = Math.floor(Math.random() * (arr.length - i))
    // 获取分类对应的序号
    result.push(arr[ran])
    // 将已经获取的随机数取代，用最后一位数
    arr[ran] = arr[arr.length - i - 1]
  }
  return result
}

function createCategoryData(data) {
  const categoryIds = createCategoryIds(6)
  const result = []
  categoryIds.forEach(categoryId => {
    const subList = data.filter(item => item.category === categoryId).slice(0, 4)
    subList.map(item => {
      return handleData(item)
    })
    result.push({
      category: categoryId,
      list: subList
    })
  })
  return result.filter(item => item.list.length === 4)
}
// home页API
app.get('/book/home', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover != \'\'',
    (err, results) => {
      const length = results.length
      const guessYouLike = []
      const banner = constant.resUrl + '/home_banner2.jpg'
      const recommend = []
      const featured = []
      const random = []
      const categoryList = createCategoryData(results)
      const categories = [
        {
          category: 1,
          num: 56,
          img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
        },
        {
          category: 2,
          num: 51,
          img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
        },
        {
          category: 3,
          num: 32,
          img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
        },
        {
          category: 4,
          num: 60,
          img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
        },
        {
          category: 5,
          num: 23,
          img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
        },
        {
          category: 6,
          num: 42,
          img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
        },
        {
          category: 7,
          num: 7,
          img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
        },
        {
          category: 8,
          num: 18,
          img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
        },
        {
          category: 9,
          num: 13,
          img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
          img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
        },
        {
          category: 10,
          num: 24,
          img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
          img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
        },
        {
          category: 11,
          num: 6,
          img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
          img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
        },
        {
          category: 12,
          num: 14,
          img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
          img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
        },
        {
          category: 13,
          num: 16,
          img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
          img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
        },
        {
          category: 14,
          num: 16,
          img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
          img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
        },
        {
          category: 15,
          num: 2,
          img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
          img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
        },
        {
          category: 16,
          num: 9,
          img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
          img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
        },
        {
          category: 17,
          num: 20,
          img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
          img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
        },
        {
          category: 18,
          num: 16,
          img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
          img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
        },
        {
          category: 19,
          num: 10,
          img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
          img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
        },
        {
          category: 20,
          num: 26,
          img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
          img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
        },
        {
          category: 21,
          num: 3,
          img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
          img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
        },
        {
          category: 22,
          num: 1,
          img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
          img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
        }
      ]
      randomArray(9, length).forEach(key => {
        guessYouLike.push(createGuessYouLike(createData(results, key)))
      })
      randomArray(3, length).forEach(key => {
        recommend.push(createRecommendData(createData(results, key)))
      })
      randomArray(6, length).forEach(key => {
        featured.push(createData(results, key))
      })
      randomArray(1, length).forEach(key => {
        random.push(createData(results, key))
      })
      res.json({
        guessYouLike,
        banner,
        recommend,
        featured,
        categoryList,
        categories,
        random
      })
      conn.end()
    })
})

// 详情页API
/* 数据库操作:1.sql语句 2.conn.query()查询 */
app.get('/book/detail', (req, res) => {
  const conn = connect()
  const fileName = req.query.fileName
  const sql = `select * from book where fileName='${fileName}'`
  conn.query(sql, (err, results) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '电子书详情获取失败'
      })
    } else {
      if (results && results.length === 0) {
        res.json({
          error_code: 1,
          msg: '电子书详情获取失败'
        })
      } else {
        const book = handleData(results[0])
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: book
        })
      }
    }
    conn.end() // 注意关闭数据库链接
  })
})

// list路由API 返回数据 json:{err_code: '', msg: '', data: data, total: Number}
app.get('/book/list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        const data = {}
        constant.category.forEach(categoryText => {
          data[categoryText] = results.filter(item => item.categoryText === categoryText)
        })
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: data,
          total: results.length
        })
      }
      conn.end()
    })
})

// flat-list路由API
app.get('/book/flat-list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'',
    (err, results) => {
      if (err) {
        res.json({
          error_code: 1,
          msg: '获取失败'
        })
      } else {
        results.map(item => handleData(item))
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: results,
          total: results.length
        })
      }
      conn.end()
    })
})

// shlef路由API
app.get('/book/shelf', (req, res) => {
  res.json({
    bookList: []
  })
})

// voice
app.get('/voice', (req, res) => {
  voice(req, res)
})

const server = app.listen(3000, () => {
  const host = server.address().address
  const port = server.address().port
  console.log('server is listening at http://%s:%s', host, port)
})