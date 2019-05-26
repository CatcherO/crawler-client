const fs = require('fs')
const puppeteer = require('puppeteer')
const path = require('path')

const _searchAjax = require('./search')
const getRecord = require('./getRecord')
const getNum = require('./getNum')
const url = 'http://skb.91jierong.com'

// 进度
let percentage = 0
const run = async (config, event) => {
  event.sender.send('sendSearchFeedBack', 1)
  const browser = await puppeteer.launch(
    {
      headless: true,
      defaultViewport: {
        width: 1000,
        height: 800
      }
    }
  )
  const page = await browser.newPage()
  await page.setRequestInterception(true)
  page.on('request', interceptedRequest => {
    if (interceptedRequest.url().endsWith('.png') || interceptedRequest.url().endsWith('.jpg'))
      interceptedRequest.abort()
    else
      interceptedRequest.continue()
  })
  const accounts = Object.keys(config.keyAreas) // 登录账号

  let count = Math.floor(50/accounts.length) // 进度间隔

  for (let i = 0; i < accounts.length; i++) {
    await page.goto(`${url}/index.php/Home/Login/login.html`)

    await page.$eval('#phone-num', input => input.value = '')
    await page.type('#phone-num', accounts[i])
    await page.$eval('#pass-one', input => input.value = '')
    await page.type('#pass-one', config.passwd)
    await page.click('#pass-login')
    await page.waitForNavigation()
    
    const regConsole = /Failed to load resource: net::ERR_FAILED|index.php/ // 控制台输出过滤

    await page.on('console', msg => {
      if(!regConsole.test(msg.text())) {
        event.sender.send('sendStatusFeedBack', msg.text())
      }
     })

    let area = config.keyAreas[accounts[i]] //地区
    //搜索数据
    event.sender.send('sendSearchFeedBack', percentage += count)
    if (!config.isSearch) {
      config.searchData1.city = area
      config.searchData2.location = `${config.province}-${config.city}-${area}`
      await page.evaluate(_searchAjax, config.url1, config.searchData1)
     
      await page.evaluate(_searchAjax, config.url2, config.searchData2)
      event.sender.send('sendStatusFeedBack',`${area}搜索完成`)
    }
    // 获取已浏览数据
    event.sender.send('sendSearchFeedBack', percentage += count)
    if (!config.isGet) {
      await page.goto(`${url}/index.php/home/View/views.html`)

      const dataJson = await page.evaluate(getRecord, config.day)
      
      if (dataJson) {
        await new Promise((r, j) => {
          fs.writeFile(path.join(__dirname,`../data/${config.province}/${config.city}/json/${area}${config.day}.json`), JSON.stringify(dataJson.flat()), 'utf8', (err) => {
            if(err) {
              j(err)
            }else{
            r()
            event.sender.send('sendStatusFeedBack',`${area}生成JSON数据`)
            }
         })
        })
      }
    }
  }

  await browser.close()
  getNum(config, event)
}
module.exports = {
  run
}
