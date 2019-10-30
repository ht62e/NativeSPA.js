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
import OvarlayManager from "./overlay_manager";
import { ActionType } from "../common/dto";
import ResizableOverlay from "./resizable_overlay";
var DialogWindow = /** @class */ (function (_super) {
    __extends(DialogWindow, _super);
    function DialogWindow(viewPortElement, name, options) {
        var _this = _super.call(this, viewPortElement, name, options ? options.size : null) || this;
        _this.isDragging = false;
        if (options && options.resizable === false) {
            _this.setResizable(false);
        }
        _this.wrapperEl = document.createElement("div");
        _this.wrapperEl.style.position = "absolute";
        _this.wrapperEl.style.display = "flex";
        _this.wrapperEl.style.flexDirection = "column";
        _this.wrapperEl.style.width = "100%";
        _this.wrapperEl.style.height = "100%";
        _this.headerEl = document.createElement("div");
        _this.headerEl.className = "itm_dialog_window_header";
        _this.headerEl.style.position = "relative";
        _this.headerEl.style.display = "flex";
        _this.headerEl.style.width = "100%";
        if (options && options.hideHeader) {
            _this.headerEl.style.display = "none";
        }
        _this.headerTitleEl = document.createElement("div");
        _this.headerTitleEl.className = "caption";
        _this.headerTitleEl.textContent = options && options.defaultCaption ? options.defaultCaption : "";
        _this.headerCloseButtonEl = document.createElement("div");
        _this.headerCloseButtonEl.className = "close_button";
        _this.headerCloseButtonEl.textContent = "×";
        _this.headerCloseButtonEl.addEventListener("click", _this.onHeaderCloseButtonClick.bind(_this));
        _this.headerEl.appendChild(_this.headerTitleEl);
        _this.headerEl.appendChild(_this.headerCloseButtonEl);
        _this.headerEl.addEventListener("mousedown", _this.onHeaderMouseDown.bind(_this));
        _this.headerEl.addEventListener("dragstart", _this.onHeaderDragStart.bind(_this));
        _this.containerEl = document.createElement("div");
        _this.containerEl.className = "itm_dialog_window_body";
        _this.containerEl.style.position = "relative";
        _this.containerEl.style.flexGrow = "1";
        _this.containerEl.style.flexShrink = "1";
        _this.containerEl.style.width = "100%";
        _this.registerAsContainer("window", _this.containerEl);
        _this.footerEl = document.createElement("div");
        _this.footerEl.className = "itm_dialog_window_footer";
        _this.footerEl.style.position = "relative";
        _this.footerEl.style.width = "100%";
        if (options && options.hideFooter) {
            _this.footerEl.style.display = "none";
        }
        _this.okButtonEl = document.createElement("input");
        _this.okButtonEl.type = "button";
        _this.okButtonEl.classList.add("itm_dialog_window_footer_button", "ok");
        _this.okButtonEl.value = "OK";
        _this.okButtonEl.addEventListener("click", _this.onOkButtonClick.bind(_this));
        _this.cancelButtonEl = document.createElement("input");
        _this.cancelButtonEl.type = "button";
        _this.cancelButtonEl.classList.add("itm_dialog_window_footer_button", "cancel");
        _this.cancelButtonEl.value = "キャンセル";
        _this.cancelButtonEl.addEventListener("click", _this.onCancelButtonClick.bind(_this));
        _this.applyButtonEl = document.createElement("input");
        _this.applyButtonEl.type = "button";
        _this.applyButtonEl.classList.add("itm_dialog_window_footer_button", "apply");
        _this.applyButtonEl.value = "適用";
        _this.footerEl.appendChild(_this.okButtonEl);
        _this.footerEl.appendChild(_this.cancelButtonEl);
        _this.wrapperEl.appendChild(_this.headerEl);
        _this.wrapperEl.appendChild(_this.containerEl);
        _this.wrapperEl.appendChild(_this.footerEl);
        _this.contentEl.className = "itm_dialog_window_container";
        _this.contentEl.appendChild(_this.wrapperEl);
        _this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "itm_dialog_window_standy_state",
            enterTransitionClass: "itm_dialog_window_enter_transition",
            leaveTransitionClass: "itm_dialog_window_leave_transition",
            endStateClass: "itm_dialog_window_end_state"
        });
        return _this;
    }
    DialogWindow.prototype.onHeaderMouseDown = function (event) {
        this.isDragging = true;
        OvarlayManager.getInstance().changeContentsSelectable(false);
    };
    DialogWindow.prototype.onHeaderDragStart = function (event) {
        event.preventDefault();
    };
    DialogWindow.prototype.onHeaderCloseButtonClick = function (event) {
        var _this = this;
        this.container.getActiveModule().exit(ActionType.CANCEL).then(function (exited) {
            if (exited)
                _this.close();
        });
    };
    DialogWindow.prototype.onOkButtonClick = function (event) {
        var _this = this;
        this.container.getActiveModule().exit(ActionType.OK).then(function (exited) {
            if (exited)
                _this.close(_this.container.getContainerResult());
        });
    };
    DialogWindow.prototype.onCancelButtonClick = function (event) {
        var _this = this;
        this.container.getActiveModule().exit(ActionType.CANCEL).then(function (exited) {
            if (exited)
                _this.close();
        });
    };
    DialogWindow.prototype.onApplyButtonClick = function (event) {
    };
    DialogWindow.prototype.waitForOverlayClose = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.waitForOverlayCloseResolver = resolve;
        });
    };
    //override
    DialogWindow.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
        _super.prototype.__dispachMouseMoveEvent.call(this, x, y, deltaX, deltaY);
        if (!this.isDragging)
            return;
        this.changePosition(this.position.x + deltaX, this.position.y + deltaY);
    };
    //override
    DialogWindow.prototype.__dispachMouseUpEvent = function (x, y) {
        _super.prototype.__dispachMouseUpEvent.call(this, x, y);
        this.isDragging = false;
    };
    DialogWindow.prototype.getContainer = function () {
        return this.container;
    };
    DialogWindow.prototype.setWindowTitle = function (title) {
        this.headerTitleEl.textContent = title;
    };
    DialogWindow.prototype.show = function (parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (options && options.position) {
                    this.changePosition(options.position.x, options.position.y);
                }
                else {
                    //デフォルト表示位置は表示領域（ビューポート）の中央
                    this.moveToViewPortCenter();
                }
                this.container.initialize(parcel);
                this.outerFrameTransitionDriver.show();
                return [2 /*return*/, this.waitForOverlayClose()];
            });
        });
    };
    DialogWindow.prototype.showAsModal = function (parcel, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.show(parcel, options)];
            });
        });
    };
    //override
    DialogWindow.prototype.close = function (result) {
        this.outerFrameTransitionDriver.hide();
        //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
        window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
    };
    //override
    DialogWindow.prototype.activate = function () {
        _super.prototype.activate.call(this);
        this.headerEl.classList.remove("inactive");
    };
    //override
    DialogWindow.prototype.inactivate = function (withModal) {
        _super.prototype.inactivate.call(this, withModal);
        this.headerEl.classList.add("inactive");
    };
    return DialogWindow;
}(ResizableOverlay));
export default DialogWindow;
