"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
class AppUpdater {
    constructor(serverUrl, updateInterval = 300000) {
        this.updateServerUrl = serverUrl;
        this.updateInterval = updateInterval;
    }
    init() {
        this.checkForUpdates();
        this.addUpdateDownloadedListener();
        this.addUpdateErrorListener();
    }
    get updateServerUrl() {
        return this._updateServerUrl;
    }
    set updateServerUrl(url) {
        this._updateServerUrl = url;
        const feedUrl = `${url}/update/${process.platform}/${electron_1.app.getVersion()}`;
        electron_1.autoUpdater.setFeedURL({ url: feedUrl });
    }
    setMessageBoxOptions(messageBoxOptions) {
        this.messageBoxOptions = messageBoxOptions;
    }
    checkForUpdates() {
        if (this.updateServerUrl) {
            setInterval(() => {
                electron_1.autoUpdater.checkForUpdates();
            }, this.updateInterval);
        }
    }
    addUpdateDownloadedListener() {
        electron_1.autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const dialogOpts = {
                type: 'info',
                buttons: [
                    (_b = (_a = this.messageBoxOptions) === null || _a === void 0 ? void 0 : _a.confirmButtonLabel) !== null && _b !== void 0 ? _b : 'Restart',
                    (_d = (_c = this.messageBoxOptions) === null || _c === void 0 ? void 0 : _c.ignoreButtonLabel) !== null && _d !== void 0 ? _d : 'Later',
                ],
                title: (_f = (_e = this.messageBoxOptions) === null || _e === void 0 ? void 0 : _e.title) !== null && _f !== void 0 ? _f : 'Application Update',
                message: process.platform === 'win32' ? releaseNotes : releaseName,
                detail: (_h = (_g = this.messageBoxOptions) === null || _g === void 0 ? void 0 : _g.details) !== null && _h !== void 0 ? _h : 'A new version has been downloaded. Restart the application to apply the updates.',
            };
            electron_1.dialog.showMessageBox(dialogOpts).then((returnValue) => {
                if (returnValue.response === 0)
                    electron_1.autoUpdater.quitAndInstall();
            });
        });
    }
    addUpdateErrorListener() {
        electron_1.autoUpdater.on('error', (message) => {
            console.error('There was a problem updating the application');
            console.error(message);
        });
    }
}
exports.default = AppUpdater;
//# sourceMappingURL=app-updater.js.map