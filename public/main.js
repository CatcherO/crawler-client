// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
// const isDev = require('electron-is-dev')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
    resizable: false,
    icon: `${__dirname}/icon/favicon.ico`
  })

  // and load the index.html of the app.
  // if(!isDev) {
    // console.log(isDev)
    // mainWindow.loadURL('http://localhost:3000/')
  // } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
  // }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  ipcMain.on('sendCloseWindow', (event, data) => {
    mainWindow.close()
  })
  require('./ipcMain')
}
// 实例检测
//  const moreInstance = app.makeSingleInstance((commandline, workingDirectory) => {
//   if(mainWindow) { // 如果存在执行以下
//     // 判断主实例窗口是否最小化 如果是的话 恢复到之前的状态
//     // if (mainWindow.isMaximized()) mainWindow.restore()
//     mainWindow.focus() // 主实例窗口focus
//   }
// })
// // 判断是否存在主实例
// if (moreInstance) {
//   // 离开当前的进程
//   app.quit()
// }
// 主进程准备完毕
app.on('ready', () => {
  // 创建窗口的方法
})
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
