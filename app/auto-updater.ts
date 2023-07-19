import { MessageBoxOptions, app, autoUpdater, dialog } from 'electron';

interface IMessageBoxOptions {
  confirmButtonLabel?: string;
  ignoreButtonLabel?: string;
  title?: string;
  details?: string;
}

export class AutoUpdater {
  private _updateServerUrl: string | undefined;
  private updateInterval: number | undefined;

  private messageBoxOptions: IMessageBoxOptions | undefined;

  constructor(serverUrl: string, updateInterval: number = 300000) {
    this.updateServerUrl = serverUrl;
    this.updateInterval = updateInterval;
  }

  get updateServerUrl(): string | undefined {
    return this._updateServerUrl;
  }

  set updateServerUrl(url: string | undefined) {
    this._updateServerUrl = url;
    const feedUrl: string = `${url}/update/${process.platform}/${app.getVersion()}`;

    autoUpdater.setFeedURL({ url: feedUrl });
  }

  public setMessageBoxOptions(messageBoxOptions: Partial<IMessageBoxOptions>): void {
    this.messageBoxOptions = messageBoxOptions;
  }

  public checkForUpdates(): void {
    if (this.updateServerUrl) {
      setInterval(() => {
        autoUpdater.checkForUpdates();
      }, this.updateInterval);
    }
  }

  public addUpdateDownloadedListener(): void {
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
      const dialogOpts: MessageBoxOptions = {
        type: 'info',
        buttons: [this.messageBoxOptions?.confirmButtonLabel ?? 'Restart', this.messageBoxOptions?.ignoreButtonLabel ?? 'Later'],
        title: this.messageBoxOptions?.title ?? 'Application Update',
        message: process.platform === 'win32' ? releaseNotes : releaseName,
        detail:
          this.messageBoxOptions?.details ?? 'A new version has been downloaded. Restart the application to apply the updates.'
      }

      dialog.showMessageBox(dialogOpts).then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall();
      })
    })
  }
}
