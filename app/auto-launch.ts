import { BrowserWindow, app, ipcRenderer } from 'electron';
const path = require('path');

export default class AutoLaunch {
  private appFolder: string | undefined;
  private appExe: string | undefined;
  private winRef: BrowserWindow | null = null;
  private loginOptions: Electron.Settings | undefined;

  constructor(winRef: BrowserWindow) {
    this.winRef = winRef;
    this.appFolder = path.dirname(process.execPath);
    this.appExe = path.resolve(this.appFolder, '..', `${app.getName()}.exe`);
    this.loginOptions = {
      openAtLogin: true,
      openAsHidden: true,
      path: this.appExe,
      args: [
        '--processStart',
        `"${this.appFolder}"`,
        '--process-start-args',
        '"--hidden"',
      ],
    };
  }

  init(): void {
    // Set auto-launch settings if not set
    if (!app.getLoginItemSettings()?.openAtLogin) {
      this.setAutoLaunchSettings();
      return;
    }

    // Clear local-storage and quit if app was opened at login
    if (
      this.loginOptions &&
      (this.getAutoLaunchSettings()?.executableWillLaunchAtLogin ||
        this.getAutoLaunchSettings()?.wasOpenedAtLogin)
    ) {
      this.clearLocalStorageAndQuit();
    }
  }

  setAutoLaunchSettings(): void {
    this.loginOptions && app.setLoginItemSettings(this.loginOptions);
  }

  getAutoLaunchSettings(): Electron.LoginItemSettings | null {
    if (this.loginOptions) {
      const { path, args } = this.loginOptions;
      return app.getLoginItemSettings({ path, args });
    }

    return null;
  }

  async clearLocalStorageAndQuit(): Promise<void> {
    if (this.winRef) {
      this.winRef.webContents.executeJavaScript(`window.localStorage.clear();`);
      app.quit();
    }
  }
}
