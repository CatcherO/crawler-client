const fs = require('fs')
const path = require('path')
const { provinces, areas } = require('./cityJson')
const { accounts, passwd } = require('./account')
const config = require('./config.json')
const province = config.province
const city = config.city
const dir = config.dir
const getAreas = (provinces, city, areas) => {
  for (let p of provinces) {
    if (p.name === province) {
      console.log(`查找${province}的城市`)
      for (let c of p.city) {
        console.log(c.name)
        if (c.name === city) {
          console.log(`查找${city}内的地区`)
          const result = []
          for (let a of areas) {
            if (a.pid === c.id) {
              console.log(a.name)
              result.push(a.name)
            }
          }
          return result
        }
      }
      throw new Error('省份或城市输入错误！')
    }
  }
}
const keyAreas = {}
getAreas(provinces, city, areas).forEach((e, i) => {
  if (!accounts[i]) {
    console.log(`缺少账号,目前只搜索第${i + 1}个地区${e}`)
    return
  }
  keyAreas[accounts[i]] = e
});

// 创建目录

function mkdirsSync(dirname) {  
  //console.log(dirname);  
  if (fs.existsSync(dirname)) {  
      return true;  
  } else {  
      if (mkdirsSync(path.dirname(dirname))) {  
          fs.mkdirSync(dirname);  
          return true;  
      }  
  }  
}
mkdirsSync(`./dist/${province}/${city}/json`)
mkdirsSync(`./dist/${province}/${city}/xlsx`)

module.exports = {
  url1: '/index.php/Home/index/search.html',
  url2: '/index.php/home/search/search_handel.html',
  keyAreas,
  passwd,
  searchData1: {
    city: '',
    tradedic: '装修',
    type: 1,
    searchcount: 25
  },
  searchData2: {
    location: '',
    category: '装修',
    type: 1
  },
  isSearch: false,
  isGet: false,
  province,
  city,
  day: new Date().toISOString().slice(0, 10),
}