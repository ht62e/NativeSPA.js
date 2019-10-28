import OvarlayManager from "./overlay_manager";
import { Point, Size, CssSize } from "../common/types";
import CssTransitionDriver from "../common/css_transition_driver";
import ContainerManager from "../container/container_manager";
var Overlay = /** @class */ (function () {
    function Overlay(viewPortElement, name, size) {
        this.lastFocusIsDetector = false;
        this.active = false;
        this.inactiveModalMode = false;
        this.viewPortEl = viewPortElement;
        this.name = name;
        var cssWidth = size ? size.cssWidth : Overlay.DEFAULT_OVERLAY_SIZE_WIDTH;
        var cssHeight = size ? size.cssHeight : Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT;
        this.originalSize = new CssSize(cssWidth, cssHeight);
        //リサイズ可能領域のためのフレームを作成
        this.frameEl = document.createElement("div");
        this.frameEl.style.position = "absolute";
        this.frameEl.style.backgroundColor = "transparent";
        //正しいスタイル計算のため初回表示まではdisplay:hiddenにはしない
        this.frameEl.style.visibility = "hidden";
        this.frameEl.addEventListener("selectstart", this.onSelectStart.bind(this));
        this.frameEl.addEventListener("mousedown", this.onOuterMouseDown.bind(this));
        //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
        //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
        this.tabFocusMoveHeadStopper = document.createElement("div");
        this.tabFocusMoveHeadStopper.className = "itm_tabfocus_move_stopper";
        this.tabFocusMoveHeadStopper.style.height = "0px";
        this.tabFocusMoveHeadStopper.tabIndex = 0;
        this.tabFocusMoveHeadStopper.addEventListener("focusin", this.onTabFocusMoveHeadStopperFocusIn.bind(this));
        this.tabFocusMoveHeadDetector = document.createElement("div");
        this.tabFocusMoveHeadDetector.className = "itm_tabfocus_move_detector";
        this.tabFocusMoveHeadDetector.style.height = "0px";
        this.tabFocusMoveHeadDetector.tabIndex = 0;
        this.tabFocusMoveHeadDetector.addEventListener("focusin", this.onTabFocusMoveHeadDetectorFocusIn.bind(this));
        //コンテンツ領域生成
        this.contentEl = this.outerContentEl = document.createElement("div");
        this.contentEl.style.position = "absolute";
        this.contentEl.style.overflow = "hidden";
        this.contentEl.style.width = "100%";
        this.contentEl.style.height = "100%";
        //overlayのモーダル表示によって非アクティブ化したときに表示するレイヤー
        this.modalInactiveLayer = document.createElement("div");
        this.modalInactiveLayer.className = "itm_modal_background_layer";
        this.modalInactiveLayer.style.position = "absolute";
        this.modalInactiveLayer.style.overflow = "hidden";
        this.modalInactiveLayer.style.display = "none";
        this.modalInactiveLayer.style.width = "100%";
        this.modalInactiveLayer.style.height = "100%";
        this.modalInactiveLayerTransitionDriver = new CssTransitionDriver(this.modalInactiveLayer);
        this.resize(cssWidth, cssHeight);
        //非表示エレメントの作成（Tabキー対策）
        this.tabFocusMoveTailDetector = document.createElement("div");
        this.tabFocusMoveTailDetector.className = "itm_tabfocus_move_detector";
        this.tabFocusMoveTailDetector.style.height = "0px";
        this.tabFocusMoveTailDetector.tabIndex = 0;
        this.tabFocusMoveTailDetector.addEventListener("focusin", this.onTabFocusMoveTailDetectorFocusIn.bind(this));
        this.tabFocusMoveTailStopper = document.createElement("div");
        this.tabFocusMoveTailStopper.className = "itm_tabfocus_move_stopper";
        this.tabFocusMoveTailStopper.style.height = "0px";
        this.tabFocusMoveTailStopper.tabIndex = 0;
        this.tabFocusMoveTailStopper.addEventListener("focusin", this.onTabFocusMoveTailStopperFocusIn.bind(this));
        this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
        this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));
        this.frameEl.appendChild(this.tabFocusMoveHeadStopper);
        this.frameEl.appendChild(this.tabFocusMoveHeadDetector);
        this.frameEl.appendChild(this.contentEl);
        this.frameEl.appendChild(this.tabFocusMoveTailDetector);
        this.frameEl.appendChild(this.tabFocusMoveTailStopper);
        this.frameEl.appendChild(this.modalInactiveLayer);
        viewPortElement.appendChild(this.frameEl);
        this.cacheCurrentOffsetSize();
        this.outerFrameTransitionDriver = new CssTransitionDriver(this.frameEl);
    }
    Overlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
    };
    Overlay.prototype.__dispachMouseUpEvent = function (x, y) {
    };
    Overlay.prototype.registerAsContainer = function (className, targetEl) {
        var containerManager = ContainerManager.getInstance();
        var seq = Overlay.instanceSequenceTable.get(className);
        if (seq === undefined)
            seq = 0;
        this.container = containerManager.createContainer("__" + className + "_" + String(seq), "", targetEl, null);
        Overlay.instanceSequenceTable.set(className, seq + 1);
    };
    Overlay.prototype.onSelectStart = function (event) {
    };
    Overlay.prototype.onTabFocusMoveHeadStopperFocusIn = function (event) {
        if (this.lastFocusedEl) {
            this.lastFocusedEl.focus();
        }
        else {
            this.tabFocusMoveHeadDetector.focus();
        }
    };
    Overlay.prototype.onTabFocusMoveHeadDetectorFocusIn = function (event) {
        if (!this.lastFocusIsDetector) {
            this.lastFocusIsDetector = true;
            this.tabFocusMoveTailDetector.focus();
        }
        event.stopPropagation();
    };
    Overlay.prototype.onTabFocusMoveTailDetectorFocusIn = function (event) {
        if (!this.lastFocusIsDetector) {
            this.lastFocusIsDetector = true;
            this.tabFocusMoveHeadDetector.focus();
        }
        event.stopPropagation();
    };
    Overlay.prototype.onTabFocusMoveTailStopperFocusIn = function (event) {
        if (this.lastFocusedEl) {
            this.lastFocusedEl.focus();
        }
        else {
            this.tabFocusMoveTailDetector.focus();
        }
    };
    Overlay.prototype.onOuterMouseDown = function (event) {
        if (this.inactiveModalMode)
            return;
        OvarlayManager.getInstance().overlayMouseDownEventHandler(this.name);
    };
    Overlay.prototype.onFocusIn = function (event) {
        this.lastFocusIsDetector = false;
        OvarlayManager.getInstance().overlayLastFocusedElement = null;
    };
    Overlay.prototype.onFocusOut = function (event) {
        this.lastFocusIsDetector = false;
        this.lastFocusedEl = event.target;
        OvarlayManager.getInstance().overlayLastFocusedElement =
            event.target;
    };
    Overlay.prototype.cacheCurrentOffsetSize = function () {
        var w = this.frameEl.offsetWidth;
        var h = this.frameEl.offsetHeight;
        if (w > 0 && h > 0)
            this.offsetSizeCache = new Size(w, h);
    };
    Overlay.prototype.restoreOriginalSize = function () {
        this.resize(this.originalSize.cssWidth, this.originalSize.cssHeight);
    };
    Overlay.prototype.changeZIndex = function (zIndex) {
        this.zIndex = zIndex;
        this.frameEl.style.zIndex = String(zIndex);
    };
    Overlay.prototype.getName = function () {
        return this.name;
    };
    Overlay.prototype.getZIndex = function () {
        return this.zIndex;
    };
    Overlay.prototype.changePosition = function (x, y) {
        this.position = new Point(x, y);
        this.frameEl.style.left = String(x) + "px";
        this.frameEl.style.top = String(y) + "px";
    };
    Overlay.prototype.moveToViewPortCenter = function () {
        var x = Math.round((this.viewPortEl.offsetWidth - this.offsetSizeCache.width) / 2);
        var y = Math.round((this.viewPortEl.offsetHeight - this.offsetSizeCache.height) / 2);
        this.changePosition(x, y);
    };
    Overlay.prototype.resize = function (width, height) {
        this.size = new CssSize(width, height);
        this.frameEl.style.width = width;
        this.frameEl.style.height = height;
    };
    Overlay.prototype.activate = function () {
        this.active = true;
        this.inactiveModalMode = false;
        this.modalInactiveLayerTransitionDriver.hide();
    };
    Overlay.prototype.inactivate = function (withModal) {
        this.active = false;
        this.inactiveModalMode = withModal;
        if (withModal) {
            this.modalInactiveLayerTransitionDriver.show();
        }
    };
    Overlay.prototype.isActive = function () {
        return this.active;
    };
    Overlay.DEFAULT_OVERLAY_SIZE_WIDTH = "50%";
    Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT = "50%";
    Overlay.instanceSequenceTable = new Map();
    return Overlay;
}());
export default Overlay;
//# sourceMappingURL=overlay.js.map