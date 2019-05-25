const fs = require('fs')
const puppeteer = require('puppeteer-core')

const _searchAjax = require('./search')
const getRecord = require('./getRecord')
const config = require('./searchConfig')
const getNum = require('./getNum')
const day = config.day
const url = 'http://skb.91jierong.com'



const run = async () => {

  const browser = await puppeteer.launch(
    {
      headless: false,
      defaultViewport: {
        width: 1000,
        height: 800
      },
      executablePath: config.dir,
      ignoreDefaultArgs: ['--disable-extensions']
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
  const accounts = Object.keys(config.keyAreas)
  for (let i = 0; i < accounts.length; i++) {

    await page.goto(`${url}/index.php/Home/Login/login.html`)

    await page.$eval('#phone-num', input => input.value = '')
    await page.type('#phone-num', accounts[i])
    await page.$eval('#pass-one', input => input.value = '')
    await page.type('#pass-one', config.passwd)
    await page.click('#pass-login')
    await page.waitForNavigation()
    

    // await page.on('console', msg => console.log(msg.text()))

    let area = config.keyAreas[accounts[i]]
    //搜索数据
    if (!config.isSearch) {
      config.searchData1.city = area
      config.searchData2.location = `${config.province}-${config.city}-${area}`
      await page.evaluate(_searchAjax, config.url1, config.searchData1)
      await page.evaluate(_searchAjax, config.url2, config.searchData2)
      console.log(`${area}搜索完成`)
    }
    // 获取已浏览数据
    if (!config.isGet) {
      await page.goto(`${url}/index.php/home/View/views.html`)

      const dataJson = await page.evaluate(getRecord, day)
      
      if (dataJson) {
        await new Promise((r, j) => {
          fs.writeFile(`./dist/${config.province}/${config.city}/json/${area}${day}.json`, JSON.stringify(dataJson.flat()), 'utf8', () => {
            r()
            console.log(`${area}生成JSON数据`)
          })
        })
      }
    }


  }
  await browser.close()
  getNum(config)
}
run()

