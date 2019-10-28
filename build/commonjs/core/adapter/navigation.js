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
import ModuleRouter from "../module/module_router";
import ModuleManager from "../module/module_manager";
import OvarlayManager from "../overlay/overlay_manager";
import RuntimeError from "../common/runtime_error";
var Navigation = /** @class */ (function () {
    function Navigation(adapter) {
        this.moduleRouter = ModuleRouter.getInstance();
        this.moduleManager = ModuleManager.getInstance();
        this.overlayManager = OvarlayManager.getInstance();
        this.adapter = adapter;
    }
    Navigation.prototype.getCurrentOverlay = function () {
        //呼び出し元モジュールのコンテナの最上位コンテナを取得
        var i = 0; //循環時の無限ループ防止用カウンタ
        var container = this.adapter.getHtmlComponent().getOwnerContainer();
        while (container.getOwner()) {
            container = container.getOwner().getOwnerContainer();
            if (i++ > 100) {
                throw new RuntimeError("コンテナの親子関係に循環が発生しています。");
            }
        }
        //最上位コンテナを保持しているオーバーレイを取得
        return this.overlayManager.findOverlayByContainer(container);
    };
    Navigation.prototype.forward = function (targetIdentifier, parcel) {
        return __awaiter(this, void 0, void 0, function () {
            var finalTargetId;
            return __generator(this, function (_a) {
                if (targetIdentifier.split("::").length > 1) {
                    finalTargetId = targetIdentifier;
                }
                else {
                    finalTargetId =
                        this.adapter.getHtmlComponent().
                            getOwnerContainer().getId() + "::" + targetIdentifier;
                }
                return [2 /*return*/, this.moduleRouter.forward(finalTargetId, parcel)];
            });
        });
    };
    Navigation.prototype.startExitProcess = function (actionType) {
        this.adapter.getHtmlComponent().exit(actionType);
    };
    Navigation.prototype.showWindow = function (overlayName, parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Navigation.prototype.showWindowAsModal = function (overlayName, parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayManager.showAsModal(overlayName, parcel, options)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Navigation.prototype.showContextMenu = function (overlayName, parcel, targetElement) {
        return __awaiter(this, void 0, void 0, function () {
            var showOptions, _a, left, bottom;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        showOptions = {
                            parent: this.getCurrentOverlay()
                        };
                        if (!targetElement) return [3 /*break*/, 2];
                        _a = targetElement.getBoundingClientRect(), left = _a.left, bottom = _a.bottom;
                        showOptions.position = { x: left, y: bottom };
                        return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, showOptions)];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2: return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, showOptions)];
                    case 3: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    Navigation.prototype.showDrawer = function (overlayName, parcel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.overlayManager.showAsModal(overlayName, parcel)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Navigation;
}());
export default Navigation;
//# sourceMappingURL=navigation.js.map