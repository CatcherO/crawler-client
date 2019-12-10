const fs = require('fs')
const path = require('path')

const xlsx = require('node-xlsx').default

module.exports = function getNum(config, event) {
const accounts = Object.keys(config.keyAreas)
const sheet = []
const txtData = []
for (let i = 0; i < accounts.length; i++) {
    let area = config.keyAreas[accounts[i]]
    let  filePath = path.join(__dirname,`../data/${config.province}/${config.city}/json/${area}${config.day}.json`)
    
    let data = require(filePath)
    event.sender.send('sendStatusFeedBack',`正在过滤${area}数据`)
    let phoneStr = data.filter(e => !/服装|汽车|羽绒|基础工程|办公|钢|纺织|维修|材料|雕塑|牌匾|批发|眼镜|档$|零售|门|雕刻|木业|建筑工程|灯|玻璃|器材|电器|租赁|煤|铝|能源|社$|保温|绿化|队$|部$|处$|代理|全羊|全牛|站$|铺$|包装|发展|教育|修缮|准备工程|.+场$|.+屋$|.+馆$|面包屋|美食屋|零食屋|美甲屋|宠物屋|廊$|水晶屋|大排档|制衣厂|货运|业$|自动门|物资|水暖|配套|仪器|基建|通信|不锈钢|管道|建设|景观|展示|拆|建设|布艺|结构|烘培|塑业|宾馆|厅$|花屋|针织|化妆|图文|船务|媒体|酒|车|开关|超市|广告|五金|会计|技术|婚礼|时装|环保|进出口|物业|管理|策划|护理|合作社|中心|土石方|产品|工贸|交通|资源|再生|石材|仓储|电力|光电|劳务|智能|实业|不动产|运输|小吃|精品|毛衣|编织|咖啡|摄影|建材|健康|餐馆|店|农业|商务|服务|销售|设施|游乐|快递|建设|地坪|安装|水电|置业|设备|药|医|甜品|点心|摊|商贸|童装|公寓|电脑|训练|培训|美发|美容|设备|贸易|化工|文化|发型|园林|日杂|废品|金属|电气|绿化|面粉|农林|房地产|经纪|消防|检测|机械|餐饮|茶|回收|系统|水产|电子|模具|钣金|网络|科技|物流|社区|石业|珠宝|网吧|蔬菜|加工场|饰品|饭|棋牌|配件|咨询|医疗|经营|造型|家用|鞋|奶|食品|饼|自动化|行$|便利|蟹|百货|古建|机电|环境|糖果|俱乐部|培训|烧烤|家政|印刷|汽修|鲜花|洗衣|投资|电脑|喷漆|油|儿童|服饰|轮胎|门窗|二手房|商店|诊所|修理|房产|防水|出租|酒行|标牌/.test(e.name)).map(e => {
        return [e.name, ...e.phone.match(/1[3-9][0-9]{9}/g)]
    })
    txtData.push(phoneStr.map(e => e[1]))
    let vcfData = phoneStr.map(e => {
      return `BEGIN:VCARD\nFN: ${e[0]}\nN: ${e[0]}\nTEL;CELL: ${e[1]}\nEND:VCARD\n`
    }).join('\n')
    fs.writeFile(path.join(__dirname,`../data/${config.province}/${config.city}/vcf/${config.city}${area}${config.day}.vcf`), vcfData ,'utf8', (err) =>{
      if(err){
          event.sender.send('sendStatusFeedBack',err)
      }
    })
    
    phoneStr.unshift(['名', '其他手机', '其他手机', '其他手机'])
    
    sheet.push({name: `${area}${config.day}`,data: phoneStr})
   
    let csvData = phoneStr.map(e => {
        e.length= 4
        return e.join(',') 
    }).join('\n')
    fs.writeFile(path.join(__dirname,`../data/${config.province}/${config.city}/csv/${config.city}${area}${config.day}.csv`), csvData ,'utf8', (err) =>{
        if(err){
            event.sender.send('sendStatusFeedBack',err)
        }
    })
}
    const buffer = xlsx.build(sheet)
    event.sender.send('sendStatusFeedBack',`正在生成${config.city}.xlsx文件`)
    fs.writeFileSync(path.join(__dirname,`../data/${config.province}/${config.city}/xlsx/${config.city}${config.day}.xlsx`), buffer)
    event.sender.send('sendStatusFeedBack',`正在生成${config.city}加微信js文件`)
    fs.writeFileSync(path.join(__dirname,`../data/${config.province}/${config.city}/加微信js/${config.city}${config.day}.txt`), txtData.flat().join('\n'))
    
    
    event.sender.send('sendStatusFeedBack','完成')
    event.sender.send('sendSearchFeedBack', 100)
}