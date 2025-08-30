// import path from 'path'
// import { app, ipcMain } from 'electron'
// import serve from 'electron-serve'
// import { createWindow } from './helpers'

// const isProd = process.env.NODE_ENV === 'production'

// if (isProd) {
//   serve({ directory: 'app' })
// } else {
//   app.setPath('userData', `${app.getPath('userData')} (development)`)
// }

// ;(async () => {
//   await app.whenReady()

//   const mainWindow = createWindow('main', {
//     width: 1000,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
//     },
//   })

//   if (isProd) {
//     await mainWindow.loadURL('app://./home')
//   } else {
//     const port = process.argv[2]
//     await mainWindow.loadURL(`http://localhost:${port}/home`)
//     mainWindow.webContents.openDevTools()
//   }
// })()

// app.on('window-all-closed', () => {
//   app.quit()
// })

// ipcMain.on('message', async (event, arg) => {
//   event.reply('message', `${arg} World!`)
// })

import { app, BrowserWindow } from "electron";
import path from "path";

let win: BrowserWindow | null;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const devPath = "http://localhost:8888/cashier";
  const prodPath = path.join(app.getAppPath(), ".next/server/pages/index.html");

  win.loadURL(
    process.env.NODE_ENV === "development" ? devPath : `file://${prodPath}`
  );
};

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
