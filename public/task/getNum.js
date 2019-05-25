const fs = require('fs')
const xlsx = require('node-xlsx').default

module.exports = function getNum(config) {

const accounts = Object.keys(config.keyAreas)
const sheet = []
for (let i = 0; i < accounts.length; i++) {
    let area = config.keyAreas[accounts[i]]
    let  filePath = `./dist/${config.province}/${config.city}/json/${area}${config.day}.json`
    let data = require(filePath)
    let phoneStr = data.filter(e => !/服装|汽车|车|开关|超市|广告|五金|烧烤|家政|汽修|鲜花|洗衣|电脑|喷漆|油|儿童|服饰|轮胎|二手房|商店|诊所|修理|房产|防水|出租|酒行|标牌/.test(e.name)).map(e => {
        return [e.name, ...e.phone.match(/1[3-9][0-9]{9}/g)]
    })
    phoneStr.unshift(['名', '其他手机'])
    
    sheet.push({name: `${area}${config.day}`,data: phoneStr})
}
    const buffer = xlsx.build(sheet)
    console.log(`正在生成${config.city}.xlsx文件`)
    fs.writeFileSync(`./dist/${config.province}/${config.city}/xlsx/${config.city}${config.day}.xlsx`, buffer)
    console.log('完成')
}