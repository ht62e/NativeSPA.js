import OvarlayManager from "./overlay_manager";
import { Point, Size, CssSize } from "../common/types";
import Overlay from "./overlay";

export default abstract class ResizableOverlay extends Overlay {
    public static resizeHandleThicknessPx: number = 8;

    protected resizable: boolean = true;
    protected isResizing: boolean = false;
    protected resizePositionIndex: number;
    protected resizeStartMousePos: Point;
    protected resizeStartPos: Point;
    protected resizeStartSizePx: Size;

    private resizeHandleEl = new Array<HTMLDivElement>();

    constructor(viewPortElement: HTMLElement, name: string, size: CssSize) {
        super(viewPortElement, name, size);

        const maxPctWithoutFrame: string = "calc(100% - " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";

        this.contentEl.style.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        this.contentEl.style.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        this.contentEl.style.width = maxPctWithoutFrame;
        this.contentEl.style.height = maxPctWithoutFrame;

        this.modalInactiveLayer.style.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        this.modalInactiveLayer.style.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        this.modalInactiveLayer.style.width = maxPctWithoutFrame;
        this.modalInactiveLayer.style.height = maxPctWithoutFrame;

        //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
        this.createResizeHandleElements();

        this.resize(this.size.cssWidth, this.size.cssHeight);
    }

    private createResizeHandleElements() {
        const size: number = ResizableOverlay.resizeHandleThicknessPx * 2;
        //0:左上 1:上中 2:右上 3:左中...8:右下  計8箇所 ※中中は不要
        for (let i = 0; i < 8; i++) {
            const el = document.createElement("div");
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

        this.resizeHandleEl.forEach(element => {
            this.frameEl.appendChild(element);
        });
    }

    public __dispachMouseMoveEvent(x: number, y: number, deltaX: number, deltaY: number) {
        super.__dispachMouseMoveEvent(x, y, deltaX, deltaY);
        let frameWidth: number, frameHeight: number;

        if (this.isResizing && this.resizable) {
            //※リサイズした場合は単位はピクセルに強制的に変更するものとする
            switch (this.resizePositionIndex) {
                case 0 : //左上
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                    break;
                case 1 : //上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    frameWidth = this.resizeStartSizePx.width;
                    frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                    break;
                case 2 : //右上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                    break;
                case 3 : //左
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                    frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height;
                    break;
                case 4 : //右
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height;
                    break;
                case 5 : //左下
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                    frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                    break;
                case 6 : //下
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = this.resizeStartSizePx.width;
                    frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                    break;
                case 7 : //右下
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                    frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                    break;
            }

            frameWidth -= (ResizableOverlay.resizeHandleThicknessPx * 2);
            frameHeight -= (ResizableOverlay.resizeHandleThicknessPx * 2);

            this.resize(frameWidth + "px", frameHeight + "px");
        }
    }

    public __dispachMouseUpEvent(x: number, y: number) {
        super.__dispachMouseUpEvent(x, y);
        this.isResizing = false;
        this.cacheCurrentOffsetSize();
    }

    private onResizeHandleMouseDown(event: MouseEvent) {
        this.isResizing = true;
        this.resizePositionIndex = parseInt((event.target as HTMLElement).dataset["positionIndex"]);
        this.resizeStartMousePos = new Point(event.screenX, event.screenY);
        this.resizeStartPos = new Point(this.position.x, this.position.y);
        this.resizeStartSizePx = new Size(this.frameEl.offsetWidth, this.frameEl.offsetHeight);

        OvarlayManager.getInstance().changeContentsSelectable(false);
    }

    public resize(width: string, height: string): void {
        this.size = new CssSize(width, height);
        this.frameEl.style.width = "calc(" + width + " + " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
        this.frameEl.style.height = "calc(" + height + " + " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
    }

    public setResizable(resizable: boolean) {
        this.resizable = resizable;
        this.refreshResizeHandleElementActivate();
    }

    private refreshResizeHandleElementActivate(): void {
        const canResize = this.resizable && !this.inactiveModalMode;
        this.resizeHandleEl.forEach(element => {
            if (canResize) {
                element.style.display = "";
            } else {
                element.style.display = "none";
            }
        });
    }

}

