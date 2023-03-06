'use strict'
import path from 'path'
const fs = require("fs") // 引入node原生fs模块
const os = require("os")
import { app, protocol, BrowserWindow , Tray, Menu, MenuItem,ipcMain  } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { stockIndex } from "./libs/constant"; // api,请求间隔,三大指数

// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'
// 静态路径 __static
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/public').replace(/\\/g, '\\\\')
}
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
let winURL 


// /IndependentWindow这个路由是在渲染进程创建的承载外部链接的独立窗口的页面
// 初始化应用
function init () {
  createSubWindow()
  createWindow()
}
const widthz=630
const hightz=900
let win
async function createWindow() {
  win = new BrowserWindow({
    width: widthz,
    height: hightz,
    minWidth:500,
    minHeight: hightz,

    frame: false,
  
    // skipTaskbar: true,
    backgroundColor:'grey',
    webPreferences: {
      
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false, // 跨域
      enableRemoteModule: true	//新增行
    },
    useContentSize: true
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    winURL = process.env.WEBPACK_DEV_SERVER_URL
    
  } else {
    createProtocol('app')
    winURL='app://./index.html'
  }

  
  win.loadURL(winURL )
  createMainTray() 
  createMainIPCListener() 

}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0)  init()
})


app.on('ready', async () => {

  init()
})


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/**
 * 注册主窗体 IPC 事件
 */
 const createMainIPCListener = function () {
  ipcMain.on('main-window-min', () => {
    win.minimize()
  })
  ipcMain.on('main-window-close', () => {
    app.quit()
  })
  ipcMain.on('main-mouse-enter', mainMouseEnter)
  ipcMain.on('main-mouse-leave', mainMouseLeave)
  ipcMain.on('main-right-click', (event, code,weizhi) => {
    const menu = new Menu()
   
    const stocksIndex = []
    // 市场右键
    if (weizhi == 'ma') {
      menu.append(new MenuItem({
        label: '在雪球中查看',
        click: () => {
          event.sender.send('show-xueqiu-ma', code)
        }
      }))
      menu.append(new MenuItem({
        label: '在股吧中查看',
        click: () => {
          event.sender.send('show-guba-ma', code)
        }
      }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({
        label: '添加自选(todo)',
        click: () => {
          event.sender.send('add-stock-ma', code)
        }
      }))
      menu.append(new MenuItem({type: 'separator'}))
      menu.append(new MenuItem({
        label: '快速置顶',
        click: () => {
          event.sender.send('place-top-ma', code)
        }
      }))

      menu.append(new MenuItem({
        label: '删除',
        click: () => {
          event.sender.send('delete-stock-ma', code)
        }
      }))
      menu.append(new MenuItem({
        label: '清空市场数据',
        submenu:[
          {
            label: "清空",
            click: () => {
              event.sender.send('delete-all-ma', code)
            }
          },
          // {label:"重做"},
          // {label:"清空"},
      ]
       
      }))
      
    }
    if (weizhi == 'my') {
      menu.append(new MenuItem({
        label: '在雪球中查看',
        click: () => {
          event.sender.send('show-xueqiu-my', code)
        }
      }))
      menu.append(new MenuItem({
        label: '在股吧中查看',
        click: () => {
          event.sender.send('show-guba-my', code)
        }
      }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({
        label: '添加自选',
        click: () => {
          event.sender.send('add-stock-my', code)
        }
      }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({
        label: '快速置顶',
        click: () => {
          event.sender.send('place-top-my', code)
        }
      }))
      

      menu.append(new MenuItem({
        label: '删除',
        click: () => {
          event.sender.send('delete-stock-my', code)
        }
      }))
      menu.append(new MenuItem({
        label: '清空市场数据',
        submenu: [
          {
            label: "清空",
            click: () => {
              event.sender.send('delete-all-my', code)
            }
          },
    
        ]
       
      }))
    }
    if (weizhi == 'zy') {
      menu.append(new MenuItem({
        label: '在雪球中查看',
        click: () => {
          event.sender.send('show-xueqiu-zy', code)
        }
      }))
      menu.append(new MenuItem({
        label: '在股吧中查看',
        click: () => {
          event.sender.send('show-guba-zy', code)
        }
      }))
      menu.append(new MenuItem({ type: 'separator' }))
      menu.append(new MenuItem({
        label: '添加自选',
        click: () => {
          event.sender.send('add-stock-zy', code)
        }
      }))
     
    }
  
    menu.popup(win)
  })
  // 更新系统托盘 Tooltips
  ipcMain.on('main-tray-update', (event, arg) => {
    tray.setToolTip('周易：\n' + arg)
  })
  // 开启开发者工具
  ipcMain.on('open-devtools', () => {
    win.openDevTools()
  })

  // 显示详情窗口
   ipcMain.on('create', (event, arg) => {

    if (!subWindow.isVisible()) subWindow.show() 
    subWindow.webContents.send('change-code', arg)
  })
}


/**
 * 创建主窗体的系统托盘
 */
 let tray // 系统托盘
 const createMainTray = function () {
   // 创建系统托盘
   tray = new Tray(path.join(__static, '/logo.ico'))
   // 点击系统托盘显示or隐藏主窗体
   tray.on('click', () => {
     if (win.isVisible()) {
       // 判断是否在顶部，在顶部则执行展开
       if (win.getPosition()[1] < -10) {
         mainMouseEnter()
       } else {
         win.hide()
       }
     } else {
       win.show()
     }
   })
   // 系统托盘菜单
   const contextMenu = Menu.buildFromTemplate([
     {
       label: '退出程序',
       click: () => {
         win.close()
       }
     }
   ])
   tray.setContextMenu(contextMenu)
 }
 
 /**
  * 主窗体展开&缩起
  */
 let timeout = null // 定时器
 let isAnimating = false // 是否动画中标识
 const mainMouseEnter = function () {
   clearTimeout(timeout)
   if (isAnimating) return false
   let pos = win.getPosition()
   if (pos[1] < -10) {
     isAnimating = true
     for (let i = pos[1]; i <= -10; i += 2) {
       win.setPosition(pos[0], i)
     }
     isAnimating = false
     win.focus()
   }
 }
 const mainMouseLeave = function () {
   if (isAnimating) return false
   let pos = win.getPosition()
   if (pos[1] <= -10) {
     timeout = setTimeout(() => {
       isAnimating = true
       const height = win.getSize()[1] - 10
       for (let i = -10; i > (-1 * height + 1); i -= 2) {
         win.setPosition(pos[0], i)
       }
       isAnimating = false
     }, 300)
   }
 }
 
 /**
  * 创建子窗口
  */
 let subWindow // 子窗口
 const createSubWindow = function (code) {
   subWindow = new BrowserWindow({
    //  width: 1360,
    //  height: 1500,
     frame: false,
    //  transparent: true,
    //  alwaysOnTop: true,
    //  maximizable: false,
    //  resizable: false,
    //  skipTaskbar: true,
    //  focusable: true,
     webPreferences: {
      webSecurity: false,
      // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true, 

      enableRemoteModule: true,	//新增行
    },
    //  useContentSize: true
   })
  //  Menu.setApplicationMenu(null) //取消菜单栏

   if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    winURL = process.env.WEBPACK_DEV_SERVER_URL
    
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    winURL='app://./index.html/'
   }
  //  console.log(code)
   if (code == null) {
     subWindow.loadURL(winURL + '#/stock/sh000001')
     subWindow.hide()
     ipcMain.on('sub-window-close', () => {
       subWindow.hide()
     })
     subWindow.webContents.on("before-input-event", (event, input) => {
       subWindow.webContents.setIgnoreMenuShortcuts(input.key === "F4" && input.alt);
       subWindow.hide()
    })
   } else {
    subWindow.loadURL(winURL + '#/stock/'+code)
    subWindow.hide()
    ipcMain.on('sub-window-close', () => {
      subWindow.hide()
    })
 
  }
   
 }
 