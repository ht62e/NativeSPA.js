var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
import SourceRepository from "../source_repository";
var HtmlModule = /** @class */ (function () {
    function HtmlModule(name, sourceUri, moduleIndex) {
        this.name = name;
        this.sourceUri = sourceUri;
        this.moduleIndex = moduleIndex;
        this.isFetched = false;
        this.isMounted = false;
        this.isInitialized = false;
        this.subContainerInfos = new Map();
        this.caption = "";
        this.htmlAdapter = null;
        this.onCreate();
    }
    HtmlModule.prototype.setCaption = function (caption) {
        this.caption = caption;
    };
    HtmlModule.prototype.subContainerNavigationEventHandler = function (subContainerId, currentInfo, histories) {
        return this.htmlAdapter.triggerOnSubContainerNavigated(subContainerId, currentInfo, histories);
    };
    HtmlModule.prototype.dispatchResizeEvent = function () {
        if (!this.wrapperElement)
            return;
        this.subContainerInfos.forEach(function (containerInfo) {
            containerInfo.container.onResize();
        });
    };
    HtmlModule.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            var repository, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        repository = SourceRepository.getInstance();
                        _a = this;
                        return [4 /*yield*/, repository.fetch(this.sourceUri)];
                    case 1:
                        _a.source = _b.sent();
                        this.loadSubContainerInfos();
                        this.isFetched = true;
                        return [2 /*return*/, null];
                }
            });
        });
    };
    HtmlModule.prototype.initialize = function (parcel) {
        this.subContainerInfos.forEach(function (containerInfo) {
            containerInfo.container.initialize(parcel);
        });
        this.htmlAdapter.triggerOnInitialize(parcel);
    };
    HtmlModule.prototype.show = function (withoutTransition) {
        if (this.cssTransitionDriver) {
            this.cssTransitionDriver.show(withoutTransition);
        }
        else {
            this.wrapperElement.style.display = "";
            this.wrapperElement.style.visibility = "";
        }
        this.htmlAdapter.triggerOnShow(false, null);
        this.subContainerInfos.forEach(function (containerInfo) {
            containerInfo.container.onShow();
        });
    };
    HtmlModule.prototype.hide = function (withoutTransition) {
        if (this.cssTransitionDriver) {
            this.cssTransitionDriver.hide(withoutTransition);
        }
        else {
            if (this.wrapperElement.style.visibility !== "hidden") {
                this.wrapperElement.style.display = "none";
            }
        }
        this.htmlAdapter.triggerOnHide(null);
    };
    HtmlModule.prototype.waitForExit = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.exitForWaitResolver = resolve;
        });
    };
    HtmlModule.prototype.exit = function (actionType) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.exitResolver = resolve;
                        _this.htmlAdapter.triggerOnExit(actionType);
                    })];
            });
        });
    };
    HtmlModule.prototype.continueExitProcess = function (result) {
        if (this.exitResolver) {
            this.exitResolver(true);
            this.exitResolver = null;
        }
        if (this.exitForWaitResolver) {
            this.exitForWaitResolver(result);
            this.exitForWaitResolver = null;
        }
    };
    HtmlModule.prototype.cancelExitProcess = function () {
        if (this.exitResolver) {
            this.exitResolver(false);
            this.exitResolver = null;
        }
    };
    HtmlModule.prototype.passMessage = function (command, message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve) {
                        _this.passMessageResolver = resolve;
                        _this.htmlAdapter.triggerOnReceiveMessage(command, message);
                    })];
            });
        });
    };
    HtmlModule.prototype.returnMessageResponse = function (messageResponse) {
        if (this.passMessage) {
            this.passMessageResolver(messageResponse);
            this.passMessageResolver = null;
        }
    };
    HtmlModule.prototype.getElement = function () {
        throw this.wrapperElement;
    };
    HtmlModule.prototype.getOwnerContainer = function () {
        return this.currentContainer;
    };
    HtmlModule.prototype.getSubContainerNames = function () {
        var ary = new Array();
        this.subContainerInfos.forEach(function (c) {
            ary.push(c.name);
        });
        return ary;
    };
    HtmlModule.prototype.getName = function () {
        return this.name;
    };
    HtmlModule.prototype.getCaption = function () {
        return this.caption;
    };
    HtmlModule.prototype.extractTemplateContent = function (source) {
        return "";
    };
    return HtmlModule;
}());
export default HtmlModule;
//# sourceMappingURL=html_module.js.map