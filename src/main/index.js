'use strict'

// require Sentry as soon as possible
import configureSentry from '../common/configure-sentry'
configureSentry()

/* eslint-disable import/first */
import { app, BrowserWindow, Menu, Tray } from 'electron'
import os from 'os'
const path = require('path')
import buildMenuTemplate from './menuTemplate'
import { checkForUpdates } from './appUpdater'
import store from './store'
/* eslint-enable import/first */

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

  function createWindow() {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
      height: os.platform() === 'win32' ? 562 : 542,
      useContentSize: true,
      width: 800,
      titleBarStyle: 'hiddenInset',
      resizable: process.env.NODE_ENV === 'development',
      webPreferences: {
        webSecurity: false,
        contextIsolation: false,
        nodeIntegration: true,
        enableRemoteModule: true,
      },
      show: false // Don't show the window at creation
    })
  
    mainWindow.loadURL(winURL)
  
    mainWindow.on('closed', () => {
      mainWindow = null
    })
  
    const menuTemplate = buildMenuTemplate(app)
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
  }
  
  app.on('ready', () => {
    tray = new Tray(path.join(__dirname, 'app-icon-tray.png'));  // replace 'tray_icon.png' with your tray icon
  
    // Create a context menu for the tray icon
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit', 
        click: () => {
          app.quit()
        }
      }
    ])
  
    tray.on('click', (event, bounds, position) => {
      if (event.defaultPrevented) {
        return;
      }
  
      if (!mainWindow) {
        createWindow()
      }
  
      // Get the bounds of the tray icon
      const trayBounds = tray.getBounds()
  
      // Calculate the window x and y position
      const windowBounds = mainWindow.getBounds()
      const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
      const y = Math.round(trayBounds.y + trayBounds.height)
  
      // Set the window position
      mainWindow.setPosition(x, y)
  
      // Show or hide the window
      if (mainWindow.isVisible()) {
        mainWindow.hide()
      } else {
        mainWindow.show()
      }
    })
  
    tray.on('right-click', () => {
      tray.popUpContextMenu(contextMenu);
    })
  
    if (store.notFirstLaunch) {
      if (process.env.NODE_ENV === 'production') {
        checkForUpdates()
      }
    }
    
    store.notFirstLaunch = true
  })