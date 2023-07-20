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
    }
    init() {
        var _a;
        // Set auto-launch settings if not set
        if (!((_a = electron_1.app.getLoginItemSettings()) === null || _a === void 0 ? void 0 : _a.openAtLogin)) {
            this.setAutoLaunchSettings();
        }
        // Clear local-storage and quit if app was opened in hidden mode
        if (electron_1.app.getLoginItemSettings().wasOpenedAsHidden ||
            electron_1.app.getLoginItemSettings().openAsHidden) {
            this.clearLocalStorageAndQuit();
        }
    }
    setAutoLaunchSettings() {
        electron_1.app.setLoginItemSettings({
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