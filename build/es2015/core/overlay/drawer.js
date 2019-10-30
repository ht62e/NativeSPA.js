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
import OvarlayManager from "./overlay_manager";
export var DockType;
(function (DockType) {
    DockType[DockType["Top"] = 0] = "Top";
    DockType[DockType["Right"] = 1] = "Right";
    DockType[DockType["Bottom"] = 2] = "Bottom";
    DockType[DockType["Left"] = 3] = "Left";
})(DockType || (DockType = {}));
var Drawer = /** @class */ (function (_super) {
    __extends(Drawer, _super);
    function Drawer(viewPortElement, name, options) {
        var _this = _super.call(this, viewPortElement, name, null) || this;
        _this.dockType = options.dockType !== undefined ? options.dockType : DockType.Left;
        _this.dockSize = options.dockSize !== undefined ? options.dockSize : "33%";
        _this.changeDockType(_this.dockType);
        _this.containerEl = document.createElement("div");
        _this.containerEl.className = "";
        _this.containerEl.style.position = "relative";
        _this.containerEl.style.width = "100%";
        _this.containerEl.style.height = "100%";
        _this.registerAsContainer("drawer", _this.containerEl);
        _this.contentEl.className = "itm_drawer_container";
        _this.contentEl.appendChild(_this.containerEl);
        _this.contentEl.addEventListener("mousedown", _this.onContentMouseDown.bind(_this));
        return _this;
    }
    Drawer.prototype.getContainer = function () {
        return this.container;
    };
    Drawer.prototype.changeDockType = function (dockType) {
        //サイズ変更
        if (dockType === DockType.Left || dockType === DockType.Right) {
            this.frameEl.style.width = this.dockSize;
            this.frameEl.style.height = "100%";
        }
        else if (dockType === DockType.Top || dockType === DockType.Bottom) {
            this.frameEl.style.width = "100%";
            this.frameEl.style.height = this.dockSize;
        }
        //位置変更
        this.frameEl.style.left = "";
        this.frameEl.style.right = "";
        this.frameEl.style.top = "";
        this.frameEl.style.bottom = "";
        if (dockType === DockType.Left || dockType === DockType.Top || dockType === DockType.Bottom) {
            //left=0パターン
            this.frameEl.style.left = "0px";
        }
        else {
            //right=0パターン(DockType.Right)
            this.frameEl.style.right = "0px";
        }
        if (dockType === DockType.Left || dockType === DockType.Right || dockType === DockType.Top) {
            //top=0パターン
            this.frameEl.style.top = "0px";
        }
        else {
            //bottom=0パターン(DockType.Bottom)
            this.frameEl.style.bottom = "0px";
        }
        //TransitionDriverクラス変更
        var dockTypeName;
        switch (dockType) {
            case DockType.Left:
                dockTypeName = "left";
                break;
            case DockType.Right:
                dockTypeName = "right";
                break;
            case DockType.Top:
                dockTypeName = "top";
                break;
            case DockType.Bottom:
                dockTypeName = "bottom";
                break;
        }
        this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "itm_drawer_" + dockTypeName + "_dock_standy_state",
            enterTransitionClass: "itm_drawer_enter_transition",
            leaveTransitionClass: "itm_drawer_leave_transition",
            endStateClass: "itm_drawer_" + dockTypeName + "_dock_end_state"
        });
    };
    //Override
    Drawer.prototype.changePosition = function (x, y) {
        //何もしない
    };
    Drawer.prototype.show = function (parcel, options) {
        this.container.initialize(parcel);
        this.outerFrameTransitionDriver.show();
        return this.waitForOverlayClose();
    };
    Drawer.prototype.showAsModal = function (parcel, options) {
        return this.show(parcel, options);
    };
    Drawer.prototype.close = function (result) {
        this.outerFrameTransitionDriver.hide();
        //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
        window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
    };
    Drawer.prototype.waitForOverlayClose = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.waitForOverlayCloseResolver = resolve;
        });
    };
    Drawer.prototype.onContentMouseDown = function (event) {
        var overlayManager = OvarlayManager.getInstance();
        overlayManager.cancelAutoClosingOnlyOnce();
    };
    return Drawer;
}(Overlay));
export default Drawer;
