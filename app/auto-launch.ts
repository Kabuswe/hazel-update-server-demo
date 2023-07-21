import { BrowserWindow, app } from 'electron';
import { platform } from 'os';
const path = require('path');

export default class AutoLaunch {
  private appFolder: string | undefined;
  private appExe: string | undefined;
  private updateExe: string | undefined;
  private winRef: BrowserWindow | null = null;
  private loginOptions: Electron.Settings | undefined;

  constructor(winRef: BrowserWindow) {
    this.winRef = winRef;
    this.appFolder = path.dirname(process.execPath);
    this.appExe = path.basename(process.execPath);
    this.updateExe = path.resolve(this.appFolder, '..', 'Update.exe');
    this.loginOptions = {
      openAtLogin: true,
      openAsHidden: true,
      path: this.updateExe,
      args: [
        '--processStart',
        `"${this.appExe}"`,
        '--process-start-args',
        '"--hidden"',
      ],
    };
  }

  async init(): Promise<void> {
    // Set auto-launch settings if not set
    if (!this.getAutoLaunchSettings()?.openAtLogin) {
      this.setAutoLaunchSettings();
      return;
    }

    // Clear local-storage and quit if app was opened at login
    if (process.argv.includes('--hidden')) {
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
      await this.winRef.webContents.executeJavaScript(
        `window.localStorage.clear();`
      );
      app.quit();
    }
  }
}
