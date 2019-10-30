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
import Overlay from "./overlay";
import Common from "../common/common";
import OvarlayManager from "./overlay_manager";
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(viewPortElement, name, options) {
        var _this = _super.call(this, viewPortElement, name, options ? options.size : null) || this;
        _this.containerEl = document.createElement("div");
        _this.containerEl.className = "";
        _this.containerEl.style.position = "relative";
        _this.containerEl.style.width = "100%";
        _this.containerEl.style.height = "100%";
        _this.registerAsContainer("contextmenu", _this.containerEl);
        _this.contentEl.className = "itm_context_menu_container";
        _this.contentEl.appendChild(_this.containerEl);
        _this.contentEl.addEventListener("mousedown", _this.onContentMouseDown.bind(_this));
        _this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "itm_context_menu_standy_state",
            enterTransitionClass: "itm_context_menu_enter_transition",
            leaveTransitionClass: "itm_context_menu_leave_transition",
            endStateClass: "itm_context_menu_end_state"
        });
        return _this;
    }
    ContextMenu.prototype.getContainer = function () {
        return this.container;
    };
    ContextMenu.prototype.show = function (parcel, options) {
        var x, y;
        x = Common.currentMouseClientX;
        y = Common.currentMouseClientY;
        var widthPx = this.offsetSizeCache.width;
        var heightPx = this.offsetSizeCache.height;
        var overlayRightSideX = x + widthPx;
        var overlayBottomSideY = y + heightPx;
        var visibleAreaWidth = window.document.documentElement.clientWidth;
        var visibleAreaHeight = window.document.documentElement.clientHeight;
        var xVisibleAreaIsLargerThanOverlay = widthPx < visibleAreaWidth;
        var yVisibleAreaIsLargerThanOverlay = heightPx < visibleAreaHeight;
        var xCanDisplayOnNormalPosition = overlayRightSideX <= visibleAreaWidth;
        var yCanDisplayOnNormalPosition = overlayBottomSideY <= visibleAreaHeight;
        var xCanDisplayOnReversePosition = x >= widthPx;
        var yCanDisplayOnReversePosition = y >= heightPx;
        this.restoreOriginalSize();
        //x方向
        if (xVisibleAreaIsLargerThanOverlay) {
            if (xCanDisplayOnNormalPosition) {
                //指定された位置をそのまま左上座標にする
            }
            else if (xCanDisplayOnReversePosition) {
                x -= widthPx;
            }
            else {
                //右端に寄せる
                x = visibleAreaWidth - widthPx;
            }
        }
        else {
            x = 0; //入りきらない場合でも横方向は縮小せずに左端に寄せるだけにする
        }
        //y方向
        if (yVisibleAreaIsLargerThanOverlay) {
            if (yCanDisplayOnNormalPosition) {
                //指定された位置をそのまま左上座標にする
            }
            else if (yCanDisplayOnReversePosition) {
                y -= heightPx;
            }
            else {
                //下端に寄せる
                y = visibleAreaHeight - heightPx;
            }
        }
        else {
            //入りきらない場合は上端に寄せたのち、入りきらない分を一時的に縮小する
            y = 0;
            this.resize(widthPx + "px", visibleAreaHeight + "px");
        }
        this.changePosition(x, y);
        this.container.initialize(parcel);
        this.outerFrameTransitionDriver.show();
        return this.waitForOverlayClose();
    };
    ContextMenu.prototype.showAsModal = function (parcel, options) {
        return this.show(parcel, options);
    };
    ContextMenu.prototype.close = function (result) {
        this.outerFrameTransitionDriver.hide();
        //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
        window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
    };
    ContextMenu.prototype.waitForOverlayClose = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.waitForOverlayCloseResolver = resolve;
        });
    };
    ContextMenu.prototype.onContentMouseDown = function (event) {
        var overlayManager = OvarlayManager.getInstance();
        overlayManager.cancelAutoClosingOnlyOnce();
    };
    return ContextMenu;
}(Overlay));
export default ContextMenu;
