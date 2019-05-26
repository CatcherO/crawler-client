//主进程
const { ipcMain }  = require('electron')
const { run } = require('./task/app')
const getNum = require('./task/getNum')
const getSearchConfig = require('./config/getSearchConfig')

// 主进程处理渲染进程广播数据
ipcMain.on('sendSearchMsg', (event, data)=> {
    const config = getSearchConfig(data, event)
    if(config.isGet && config.isSearch) {
        getNum(config, event)
    }else {
        run(config, event)
    }
})