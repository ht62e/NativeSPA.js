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
import DialogWindow from "./dialog_window";
import { ActionType } from "../common/dto";
import CssTransitionDriver from "../common/css_transition_driver";
import ContextMenu from "./context_menu";
import Drawer from "./drawer";
import ModuleManager from "../module/module_manager";
import RuntimeError from "../common/runtime_error";
var OvarlayManager = /** @class */ (function () {
    function OvarlayManager() {
        this.viewPortEl = null;
        this.overlayLastFocusedElement = null;
        this.previousMouseX = 0;
        this.previousMouseY = 0;
        this.contentsSelectable = true;
        this.requestedAutoCloseCancelOnlyOnce = false;
        this.DEFAULT_OVERLAY_START_Z_INDEX = 10;
        this.MODAL_START_Z_INDEX = 1000;
        this.FOREGROUND_START_Z_INDEX = 2000;
        this.overlays = new Map();
        this.overlayManagementTable = new Map();
        this.modalBackgroundLayer = document.createElement("div");
        this.modalBackgroundLayer.className = "itm_modal_background_layer";
        this.modalBackgroundLayer.style.position = "absolute";
        this.modalBackgroundLayer.style.overflow = "hidden";
        this.modalBackgroundLayer.style.width = "100%";
        this.modalBackgroundLayer.style.height = "100%";
        this.modalBackgroundLayer.style.display = "none";
        this.modalBackgroundLayer.style.zIndex = String(this.MODAL_START_Z_INDEX);
        this.modalBackgroundLayerTransitionDriver = new CssTransitionDriver(this.modalBackgroundLayer);
        this.onFocusInBindedThis = this.onFocusIn.bind(this);
        this.onMouseDownBindedThis = this.onMouseDown.bind(this);
        this.onMouseMoveBindedThis = this.onMouseMove.bind(this);
        this.onMouseUpBindedThis = this.onMouseUp.bind(this);
        this.onSelectStartBindedThis = this.onSelectStart.bind(this);
        this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
    }
    OvarlayManager.getInstance = function () {
        return OvarlayManager.instance;
    };
    OvarlayManager.prototype.findOverlayByContainer = function (searchContainer) {
        //TODO: IE11ではforEachしかつかえない。他ブラウザ用に見つかったらbreakするようなコードに変更したい。
        var res = null;
        this.overlays.forEach(function (overlay) {
            if (overlay.getContainer() === searchContainer) {
                res = overlay;
            }
        });
        return res;
    };
    OvarlayManager.prototype.onMouseDown = function (event) {
        var _this = this;
        if (!this.requestedAutoCloseCancelOnlyOnce) {
            this.overlayManagementTable.forEach(function (omd, key) {
                if (omd.isVisible && omd.isAutoCloseableWhenOutfocus) {
                    var overlay_1 = _this.overlays.get(key);
                    var module = overlay_1.getContainer().getActiveModule();
                    module.exit(ActionType.CANCEL).then(function (exited) {
                        if (exited)
                            overlay_1.close();
                    });
                }
            });
        }
        this.requestedAutoCloseCancelOnlyOnce = false;
    };
    OvarlayManager.prototype.onMouseMove = function (event) {
        var deltaX = event.screenX - this.previousMouseX;
        var deltaY = event.screenY - this.previousMouseY;
        this.previousMouseX = event.screenX;
        this.previousMouseY = event.screenY;
        this.overlays.forEach(function (overlay) {
            overlay.__dispachMouseMoveEvent(event.screenX, event.screenY, deltaX, deltaY);
        });
    };
    OvarlayManager.prototype.onMouseUp = function (event) {
        this.overlays.forEach(function (overlay) {
            overlay.__dispachMouseUpEvent(event.screenX, event.screenY);
        });
        this.changeContentsSelectable(true);
    };
    OvarlayManager.prototype.windowResizeEventHandler = function (event) {
    };
    OvarlayManager.prototype.onSelectStart = function (event) {
        if (!this.contentsSelectable) {
            event.preventDefault();
        }
    };
    OvarlayManager.prototype.onFocusIn = function (event) {
        this.overlayLastFocusedElement = null;
    };
    OvarlayManager.prototype.setViewPortElement = function (element) {
        if (this.viewPortEl !== null) {
            this.viewPortEl.removeEventListener("focusin", this.onFocusInBindedThis);
            this.viewPortEl.removeEventListener("mousedown", this.onMouseDownBindedThis);
            this.viewPortEl.removeEventListener("mousemove", this.onMouseMoveBindedThis);
            this.viewPortEl.removeEventListener("mouseup", this.onMouseUpBindedThis);
            this.viewPortEl.removeEventListener("selectstart", this.onSelectStartBindedThis);
        }
        this.viewPortEl = element;
        this.viewPortEl.addEventListener("focusin", this.onFocusInBindedThis);
        this.viewPortEl.addEventListener("mousedown", this.onMouseDownBindedThis);
        this.viewPortEl.addEventListener("mousemove", this.onMouseMoveBindedThis);
        this.viewPortEl.addEventListener("mouseup", this.onMouseUpBindedThis);
        this.viewPortEl.addEventListener("selectstart", this.onSelectStartBindedThis);
        this.viewPortEl.appendChild(this.modalBackgroundLayer);
    };
    OvarlayManager.prototype.createWindow = function (overlayName, options) {
        var overlay = new DialogWindow(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        this.overlayManagementTable.set(overlayName, new OverlayManagementData());
        return overlay;
    };
    OvarlayManager.prototype.createContextMenu = function (overlayName, options) {
        var overlay = new ContextMenu(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        var omd = new OverlayManagementData();
        omd.isAutoCloseableWhenOutfocus = true;
        this.overlayManagementTable.set(overlayName, omd);
        return overlay;
    };
    OvarlayManager.prototype.createDrawer = function (overlayName, options) {
        var overlay = new Drawer(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        var omd = new OverlayManagementData();
        omd.isAutoCloseableWhenOutfocus = true;
        this.overlayManagementTable.set(overlayName, omd);
        return overlay;
    };
    OvarlayManager.prototype.changeContentsSelectable = function (selectable) {
        this.contentsSelectable = selectable;
    };
    OvarlayManager.prototype.beginModalMode = function () {
        this.modalBackgroundLayerTransitionDriver.show();
    };
    OvarlayManager.prototype.endModalMode = function () {
        var existModalOverlay = false;
        this.overlayManagementTable.forEach(function (value, key) {
            if (value.isVisible && value.isModal)
                existModalOverlay = true;
        });
        if (!existModalOverlay) {
            this.modalBackgroundLayerTransitionDriver.hide();
        }
    };
    OvarlayManager.prototype.show = function (overlayName, parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            var overlay, omd, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkAndLoadLazyModule(overlayName)];
                    case 1:
                        _a.sent();
                        overlay = this.overlays.get(overlayName);
                        omd = this.overlayManagementTable.get(overlayName);
                        omd.parentOverlay = options ? options.parent : null;
                        omd.isVisible = true;
                        this.activateSpecificOverlay(overlayName);
                        return [4 /*yield*/, overlay.show(parcel, options)];
                    case 2:
                        result = _a.sent();
                        omd.isVisible = false;
                        this.activateTopOverlay();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    OvarlayManager.prototype.showAsModal = function (overlayName, parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            var omd, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.checkAndLoadLazyModule(overlayName)];
                    case 1:
                        _a.sent();
                        omd = this.overlayManagementTable.get(overlayName);
                        omd.isModal = true;
                        this.beginModalMode();
                        return [4 /*yield*/, this.show(overlayName, parcel, options)];
                    case 2:
                        result = _a.sent();
                        omd.isModal = false;
                        this.endModalMode();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    OvarlayManager.prototype.checkAndLoadLazyModule = function (overlayName) {
        return __awaiter(this, void 0, void 0, function () {
            var moduleManager;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.overlayManagementTable.has(overlayName)) return [3 /*break*/, 2];
                        moduleManager = ModuleManager.getInstance();
                        return [4 /*yield*/, moduleManager.loadModuleRecursively(overlayName, true)];
                    case 1:
                        _a.sent();
                        if (!this.overlayManagementTable.has(overlayName)) {
                            throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/, true];
                }
            });
        });
    };
    OvarlayManager.prototype.overlayMouseDownEventHandler = function (overlayName) {
        //TODO 要モーダル状態チェック
        this.activateSpecificOverlay(overlayName);
    };
    OvarlayManager.prototype.activateSpecificOverlay = function (overlayName) {
        var _this = this;
        var overlayList = new Array();
        var targetOverlay = this.overlays.get(overlayName);
        this.overlays.forEach(function (value, key) {
            if (key !== overlayName)
                overlayList.push(value);
        });
        overlayList.sort(function (a, b) {
            return b.getZIndex() - a.getZIndex();
        });
        overlayList.unshift(targetOverlay);
        var visibleCount = 0;
        this.overlayManagementTable.forEach(function (value, key) {
            if (value.isVisible)
                ++visibleCount;
        });
        var visibleOverlayCounter = 0;
        var previousOmd = null;
        var previousOverlay = null;
        overlayList.forEach(function (overlay) {
            var omd = _this.overlayManagementTable.get(overlay.getName());
            if (omd.isVisible) {
                if (omd.isAutoCloseableWhenOutfocus) {
                    overlay.changeZIndex(_this.FOREGROUND_START_Z_INDEX + visibleCount--);
                }
                else if (omd.isModal) {
                    overlay.changeZIndex(_this.MODAL_START_Z_INDEX + visibleCount--);
                }
                else {
                    overlay.changeZIndex(_this.DEFAULT_OVERLAY_START_Z_INDEX + visibleCount--);
                }
                if (visibleOverlayCounter === 0 ||
                    (previousOverlay.isActive() && overlay === previousOmd.parentOverlay)) {
                    overlay.activate();
                }
                else {
                    overlay.inactivate(omd.isModal);
                }
                previousOmd = omd;
                previousOverlay = overlay;
                ++visibleOverlayCounter;
            }
        });
    };
    OvarlayManager.prototype.activateTopOverlay = function () {
        var _this = this;
        //zindexが一番大きいoverlayを有効化する
        var maxZIndex = -1;
        var targetOverlayName;
        this.overlays.forEach(function (overlay, name) {
            if (_this.overlayManagementTable.get(name).isVisible) {
                if (overlay.getZIndex() > maxZIndex) {
                    maxZIndex = overlay.getZIndex();
                    targetOverlayName = name;
                }
            }
        });
        if (maxZIndex > -1) {
            this.activateSpecificOverlay(targetOverlayName);
        }
    };
    OvarlayManager.prototype.cancelAutoClosingOnlyOnce = function () {
        this.requestedAutoCloseCancelOnlyOnce = true;
    };
    OvarlayManager.instance = new OvarlayManager();
    return OvarlayManager;
}());
export default OvarlayManager;
var OverlayManagementData = /** @class */ (function () {
    function OverlayManagementData() {
        this.isVisible = false;
        this.isModal = false;
        this.isAutoCloseableWhenOutfocus = false;
        this.parentOverlay = null;
    }
    OverlayManagementData.prototype.reset = function () {
        this.isVisible = false;
        this.isModal = false;
        this.isAutoCloseableWhenOutfocus = false;
        this.parentOverlay = null;
        return this;
    };
    return OverlayManagementData;
}());
//# sourceMappingURL=overlay_manager.js.map