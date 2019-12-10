const fs = require('fs')
const path = require('path')
const { provinces, areas } = require('./cityJson')
const { accounts, passwd } = require('./account')

module.exports = function ({province, city, Search, day, Get}, event) {

const getAreas = (provinces, city, areas) => {
  for (let p of provinces) {
    if (p.name === province) {
      for (let c of p.city) {
        if (c.name === city) {
          event.sender.send('sendStatusFeedBack',`查找${city}内的地区`)
          const result = []
          for (let a of areas) {
            if (a.pid === c.id) {
              event.sender.send('sendStatusFeedBack',a.name)
              result.push(a.name)
            }
          }
          return result
        }
      }
    }
  }
}
const keyAreas = {}
getAreas(provinces, city, areas).forEach((e, i) => {
  if (!accounts[i]) {
    event.sender.send('sendStatusFeedBack',`缺少账号,目前只搜索第${i + 1}个地区${e}`)
    return
  }
  keyAreas[accounts[i]] = e
});

// 创建目录

function mkdirsSync(dirname) {  
  if (fs.existsSync(dirname)) {  
      return true;  
  } else {  
      if (mkdirsSync(path.dirname(dirname))) {  
          fs.mkdirSync(dirname);  
          return true;  
      }  
  }  
}
mkdirsSync(path.join(__dirname,`../data/${province}/${city}/json`))
mkdirsSync(path.join(__dirname,`../data/${province}/${city}/xlsx`))
mkdirsSync(path.join(__dirname,`../data/${province}/${city}/csv`))
mkdirsSync(path.join(__dirname,`../data/${province}/${city}/vcf`))
mkdirsSync(path.join(__dirname,`../data/${province}/${city}/加微信js`))

return {
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
  isSearch: !Search,
  isGet: !Get,
  province,
  city,
  day,
 }

}