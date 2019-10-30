var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Container from "./container";
import RuntimeError from "../common/runtime_error";
import { ActionType } from "../common/dto";
import ModuleManager from "../module/module_manager";
var PageContainer = /** @class */ (function (_super) {
    __extends(PageContainer, _super);
    function PageContainer(id, bindDomElement, owner, cssTransitionOptions) {
        var _this = _super.call(this, id, bindDomElement, owner, cssTransitionOptions) || this;
        bindDomElement.classList.add("itm_page_container");
        return _this;
    }
    PageContainer.prototype.addModule = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mountedModules.set(module.getName(), module);
                        return [4 /*yield*/, module.mount(function (element) {
                                _this.bindDomElement.appendChild(element);
                                return _this;
                            }, this.cssTransitionOptions)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    PageContainer.prototype.initialize = function (parcel) {
        this.moduleChangeHistory = new Array();
        this.hideAllModules();
        if (this.defaultModule) {
            this.forward(this.defaultModule, parcel, true);
        }
    };
    PageContainer.prototype.forward = function (module, parcel, withoutTransition) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.moduleChangeHistory.indexOf(module) !== -1)
                            return [2 /*return*/];
                        this.moduleChangeHistory.push(module);
                        return [4 /*yield*/, this.initializeModule(module, parcel)];
                    case 1:
                        _a.sent();
                        this.activateModule(module, withoutTransition);
                        return [4 /*yield*/, module.waitForExit()];
                    case 2:
                        result = _a.sent();
                        if (!this.inBackProcess) {
                            //backメソッドではなく、モジュールの自主的な終了の場合はページを前に戻す
                            this.showPreviousModule();
                        }
                        this.inBackProcess = false;
                        return [2 /*return*/, result];
                }
            });
        });
    };
    PageContainer.prototype.back = function () {
        var _this = this;
        this.inBackProcess = true;
        this.activeModule.exit(ActionType.BACK).then(function (exited) {
            if (exited) {
                _this.showPreviousModule();
            }
            else {
                _this.inBackProcess = false;
            }
        });
    };
    PageContainer.prototype.initializeModule = function (module, parcel) {
        return __awaiter(this, void 0, void 0, function () {
            var moduleManager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.mountedModules.has(module.getName())) return [3 /*break*/, 2];
                        moduleManager = ModuleManager.getInstance();
                        return [4 /*yield*/, moduleManager.loadModuleRecursively(module.getName(), true)];
                    case 1:
                        _a.sent();
                        if (!this.mountedModules.has(module.getName())) {
                            throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
                        }
                        console.log(module.getName() + " is lazy loaded.");
                        _a.label = 2;
                    case 2:
                        module.initialize(parcel);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    PageContainer.prototype.activateModule = function (module, withoutTransition) {
        if (this.activeModule) {
            this.activeModule.hide();
        }
        this.activeModule = module;
        module.show(withoutTransition);
        this.triggerSubContainerNavigationEvent();
    };
    PageContainer.prototype.showPreviousModule = function () {
        if (this.moduleChangeHistory.length > 0) {
            this.moduleChangeHistory.pop();
        }
        if (this.moduleChangeHistory.length > 0) {
            this.activateModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
        }
        else {
            if (this.activeModule && this.activeModule !== this.defaultModule) {
                this.activeModule.hide();
            }
        }
    };
    PageContainer.prototype.hideAllModules = function () {
        this.mountedModules.forEach(function (m) {
            m.hide();
        });
    };
    return PageContainer;
}(Container));
export default PageContainer;
