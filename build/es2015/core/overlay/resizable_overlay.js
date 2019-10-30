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
import OvarlayManager from "./overlay_manager";
import { Point, Size, CssSize } from "../common/types";
import Overlay from "./overlay";
var ResizableOverlay = /** @class */ (function (_super) {
    __extends(ResizableOverlay, _super);
    function ResizableOverlay(viewPortElement, name, size) {
        var _this = _super.call(this, viewPortElement, name, size) || this;
        _this.resizable = true;
        _this.isResizing = false;
        _this.resizeHandleEl = new Array();
        var maxPctWithoutFrame = "calc(100% - " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
        _this.contentEl.style.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _this.contentEl.style.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _this.contentEl.style.width = maxPctWithoutFrame;
        _this.contentEl.style.height = maxPctWithoutFrame;
        _this.modalInactiveLayer.style.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _this.modalInactiveLayer.style.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _this.modalInactiveLayer.style.width = maxPctWithoutFrame;
        _this.modalInactiveLayer.style.height = maxPctWithoutFrame;
        //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
        _this.createResizeHandleElements();
        _this.resize(_this.size.cssWidth, _this.size.cssHeight);
        return _this;
    }
    ResizableOverlay.prototype.createResizeHandleElements = function () {
        var _this = this;
        var size = ResizableOverlay.resizeHandleThicknessPx * 2;
        //0:左上 1:上中 2:右上 3:左中...8:右下  計8箇所 ※中中は不要
        for (var i = 0; i < 8; i++) {
            var el = document.createElement("div");
            el.dataset["positionIndex"] = String(i);
            el.style.position = "absolute";
            el.style.width = size + "px";
            el.style.height = size + "px";
            el.style.zIndex = "-1";
            el.addEventListener("mousedown", this.onResizeHandleMouseDown.bind(this));
            this.resizeHandleEl.push(el);
        }
        //左上
        this.resizeHandleEl[0].style.cursor = "nwse-resize";
        //上
        this.resizeHandleEl[1].style.left = String(size) + "px";
        this.resizeHandleEl[1].style.width = "calc(100% - " + String(size * 2) + "px)";
        this.resizeHandleEl[1].style.cursor = "ns-resize";
        //右上
        this.resizeHandleEl[2].style.right = "0px";
        this.resizeHandleEl[2].style.cursor = "nesw-resize";
        //左中
        this.resizeHandleEl[3].style.top = String(size) + "px";
        this.resizeHandleEl[3].style.height = "calc(100% - " + String(size * 2) + "px)";
        this.resizeHandleEl[3].style.cursor = "ew-resize";
        //右中
        this.resizeHandleEl[4].style.right = "0px";
        this.resizeHandleEl[4].style.top = String(size) + "px";
        this.resizeHandleEl[4].style.height = "calc(100% - " + String(size * 2) + "px)";
        this.resizeHandleEl[4].style.cursor = "ew-resize";
        //左下
        this.resizeHandleEl[5].style.bottom = "0px";
        this.resizeHandleEl[5].style.cursor = "nesw-resize";
        //下
        this.resizeHandleEl[6].style.left = String(size) + "px";
        this.resizeHandleEl[6].style.bottom = "0px";
        this.resizeHandleEl[6].style.width = "calc(100% - " + String(size * 2) + "px)";
        this.resizeHandleEl[6].style.cursor = "ns-resize";
        //右下
        this.resizeHandleEl[7].style.right = "0px";
        this.resizeHandleEl[7].style.bottom = "0px";
        this.resizeHandleEl[7].style.cursor = "nwse-resize";
        this.resizeHandleEl.forEach(function (element) {
            _this.frameEl.appendChild(element);
        });
    };
    ResizableOverlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
        _super.prototype.__dispachMouseMoveEvent.call(this, x, y, deltaX, deltaY);
        var frameWidth, frameHeight;
        if (this.isResizing && this.resizable) {
            //※リサイズした場合は単位はピクセルに強制的に変更するものとする
            switch (this.resizePositionIndex) {
                case 0: //左上
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                    break;
                case 1: //上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    frameWidth = this.resizeStartSizePx.width;
                    frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                    break;
                case 2: //右上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                    break;
                case 3: //左
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                    frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height;
                    break;
                case 4: //右
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height;
                    break;
                case 5: //左下
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                    frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                    break;
                case 6: //下
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = this.resizeStartSizePx.width;
                    frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                    break;
                case 7: //右下
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                    break;
            }
            frameWidth -= (ResizableOverlay.resizeHandleThicknessPx * 2);
            frameHeight -= (ResizableOverlay.resizeHandleThicknessPx * 2);
            this.resize(frameWidth + "px", frameHeight + "px");
        }
    };
    ResizableOverlay.prototype.__dispachMouseUpEvent = function (x, y) {
        _super.prototype.__dispachMouseUpEvent.call(this, x, y);
        this.isResizing = false;
        this.cacheCurrentOffsetSize();
    };
    ResizableOverlay.prototype.onResizeHandleMouseDown = function (event) {
        this.isResizing = true;
        this.resizePositionIndex = parseInt(event.target.dataset["positionIndex"]);
        this.resizeStartMousePos = new Point(event.screenX, event.screenY);
        this.resizeStartPos = new Point(this.position.x, this.position.y);
        this.resizeStartSizePx = new Size(this.frameEl.offsetWidth, this.frameEl.offsetHeight);
        OvarlayManager.getInstance().changeContentsSelectable(false);
    };
    ResizableOverlay.prototype.resize = function (width, height) {
        this.size = new CssSize(width, height);
        this.frameEl.style.width = "calc(" + width + " + " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
        this.frameEl.style.height = "calc(" + height + " + " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
    };
    ResizableOverlay.prototype.setResizable = function (resizable) {
        this.resizable = resizable;
        this.refreshResizeHandleElementActivate();
    };
    ResizableOverlay.prototype.refreshResizeHandleElementActivate = function () {
        var canResize = this.resizable && !this.inactiveModalMode;
        this.resizeHandleEl.forEach(function (element) {
            if (canResize) {
                element.style.display = "";
            }
            else {
                element.style.display = "none";
            }
        });
    };
    ResizableOverlay.resizeHandleThicknessPx = 8;
    return ResizableOverlay;
}(Overlay));
export default ResizableOverlay;
