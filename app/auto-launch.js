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
const { localStorage } = require('electron-browser-storage');
const path = require('path');
class AutoLaunch {
    constructor() {
        this.appFolder = path.dirname(process.execPath);
        this.appExe = path.resolve(this.appFolder, '..', `${electron_1.app.getName()}.exe`);
    }
    init() {
        var _a, _b;
        // Set auto-launch settings if not set
        console.log((_a = electron_1.app.getLoginItemSettings()) === null || _a === void 0 ? void 0 : _a.openAtLogin);
        if (!((_b = electron_1.app.getLoginItemSettings()) === null || _b === void 0 ? void 0 : _b.openAtLogin)) {
            this.setAutoLaunchSettings();
        }
        // Clear local-storage and quit if app was opened in hidden mode
        if (electron_1.app.getLoginItemSettings().wasOpenedAsHidden) {
            this.clearLocalStorageAndQuit();
        }
    }
    setAutoLaunchSettings() {
        electron_1.app.setLoginItemSettings({
            openAtLogin: true,
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
            yield localStorage.clear();
            electron_1.app.quit();
        });
    }
}
exports.default = AutoLaunch;
//# sourceMappingURL=auto-launch.js.map