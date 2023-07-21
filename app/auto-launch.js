"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require('path');
class AutoLaunch {
    constructor(winRef) {
        this.winRef = null;
        this.winRef = winRef;
        this.appFolder = path.dirname(process.execPath);
        this.appExe = path.resolve(this.appFolder, '..', `${electron_1.app.getName()}.exe`);
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
    init() {
        var _a, _b, _c;
        // Set auto-launch settings if not set
        if (!((_a = electron_1.app.getLoginItemSettings()) === null || _a === void 0 ? void 0 : _a.openAtLogin)) {
            this.setAutoLaunchSettings();
            return;
        }
        // Clear local-storage and quit if app was opened at login
        if (this.loginOptions &&
            (((_b = this.getAutoLaunchSettings()) === null || _b === void 0 ? void 0 : _b.executableWillLaunchAtLogin) ||
                ((_c = this.getAutoLaunchSettings()) === null || _c === void 0 ? void 0 : _c.wasOpenedAtLogin))) {
            this.clearLocalStorageAndQuit();
        }
    }
    setAutoLaunchSettings() {
        this.loginOptions && electron_1.app.setLoginItemSettings(this.loginOptions);
    }
    getAutoLaunchSettings() {
        if (this.loginOptions) {
            const { path, args } = this.loginOptions;
            return electron_1.app.getLoginItemSettings({ path, args });
        }
        return null;
    }
    clearLocalStorageAndQuit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.winRef) {
                this.winRef.webContents.executeJavaScript(`window.localStorage.clear();`);
                electron_1.app.quit();
            }
        });
    }
}
exports.default = AutoLaunch;
//# sourceMappingURL=auto-launch.js.map