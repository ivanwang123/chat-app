const {app, BrowserWindow} = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

const windows = new Set()

function createWindow() {
    let newWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    newWindow.loadURL(
            isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
        )

    newWindow.once('ready-to-show', () => {
        newWindow.show()
    })

    newWindow.on('closed', () => {
        windows.delete(newWindow)
        newWindow = null
    })

    windows.add(newWindow)
    return newWindow


}

app.whenReady().then(()=>{
    createWindow()
    // createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})