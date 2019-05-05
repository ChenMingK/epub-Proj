const env = require('./env')
let resUrl
let mp3FilePath
let dbHost
let dbUser
let dbPwd
if (env === 'dev') {
  resUrl = 'http://192.168.197.1:8081'
  mp3FilePath = 'D:/software/servicetools/nginx-1.14.2/resource/mp3' // 这个是本地路径,本地存储文件?
  dbHost = 'localhost'
  dbUser = 'root'
  dbPwd = 'xiaokang'
} else if (env === 'prod') {
  resUrl = 'http://106.15.231.180'
  mp3FilePath = '/root/nginx/upload/mp3'
  dbHost = '106.15.231.180'
  dbUser = 'root'
  dbPwd = 'Abcd123456.'
}
const category = [
  'Biomedicine',
  'BusinessandManagement',
  'ComputerScience',
  'EarthSciences',
  'Economics',
  'Education',
  'Engineering',
  'Environment',
  'Geography',
  'History',
  'Laws',
  'LifeSciences',
  'Literature',
  'MaterialsScience',
  'Mathematics',
  'MedicineAndPublicHealth',
  'Philosophy',
  'Physics',
  'PoliticalScienceAndInternationalRelations',
  'Psychology',
  'SocialSciences',
  'Statistics'
]
module.exports = {
  resUrl,
  category,
  mp3FilePath,
  dbHost,
  dbUser,
  dbPwd
}