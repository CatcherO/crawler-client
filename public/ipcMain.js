//主进程

const { ipcMain }  = require('electron')

// 主进程处理渲染进程广播数据
ipcMain.on('sendMsg', (event, data)=> {
    console.log('data\n ', data)
    console.log('event\n ', event)
})