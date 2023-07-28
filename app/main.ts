import { app, BrowserWindow, screen, BrowserView, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import AppUpdater from './app-updater';
import AutoLaunch from './auto-launch';

if (require('electron-squirrel-startup')) app.quit();

let win: BrowserWindow | null = null;
let winRef: BrowserWindow | null = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
    },
  });

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    win.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let pathIndex = './index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      // Path when running electron in local folder
      pathIndex = '../dist/index.html';
    }

    const url = new URL(path.join('file:', __dirname, pathIndex));
    win.loadURL(url.href);
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    win = null;
  });

  return win;
}

try {
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on('ready', () => {
    setTimeout(() => {
      winRef = createWindow();
      new AutoLaunch(winRef).init();
      // Auto updater config
      new AppUpdater('http://192.168.101.173:8080', 120000).init();
    }, 400);

    const appMenu = Menu.getApplicationMenu();

    console.log(appMenu);
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  console.error(e);
}
