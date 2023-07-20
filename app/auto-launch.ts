import { app } from 'electron';
const { localStorage } = require('electron-browser-storage');
const path = require('path');

export default class AutoLaunch {
  private appFolder: string | undefined;
  private appExe: string | undefined;

  constructor() {
    this.appFolder = path.dirname(process.execPath);
    this.appExe = path.resolve(this.appFolder, '..', `${app.getName()}.exe`);
  }

  init(): void {
    // Set auto-launch settings if not set
    if (!app.getLoginItemSettings()?.openAtLogin) {
      this.setAutoLaunchSettings();
    }

    // Clear local-storage and quit if app was opened in hidden mode
    if (
      app.getLoginItemSettings().wasOpenedAsHidden ||
      app.getLoginItemSettings().openAsHidden
    ) {
      this.clearLocalStorageAndQuit();
    }
  }

  setAutoLaunchSettings(): void {
    app.setLoginItemSettings({
      openAtLogin: true,
      openAsHidden: true,
      path: this.appExe,
      args: [
        '--processStart',
        `"${this.appFolder}"`,
        '--process-start-args',
        '"--hidden"',
      ],
    });
  }

  async clearLocalStorageAndQuit(): Promise<void> {
    await localStorage.clear();
    app.quit();
  }
}
