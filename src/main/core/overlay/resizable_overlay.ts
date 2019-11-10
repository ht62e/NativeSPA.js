import OverlayManager from "./overlay_manager";
import { Point, Size, CssSize } from "../common/types";
import Overlay from "./overlay";
import ModuleLoader from "../module/module_loader";

export default abstract class ResizableOverlay extends Overlay {
    public static resizeHandleThicknessPx: number = 8;

    protected resizable: boolean = true;
    protected isResizing: boolean = false;
    protected resizePositionIndex: number;
    protected resizeStartMousePos: Point;
    protected resizeStartPos: Point;
    protected resizeStartSizePx: Size;

    private resizeHandleEl = new Array<HTMLDivElement>();

    constructor(name: string, size: CssSize, moduleLoader: ModuleLoader) {
        super(name, size, moduleLoader);
    }

    public mount(overlayManager: OverlayManager): void {
        super.mount(overlayManager);

        const maxPctWithoutFrame: string = "calc(100% - " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";

        const _cs = this.contentEl.style;
        _cs.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _cs.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _cs.width = maxPctWithoutFrame;
        _cs.height = maxPctWithoutFrame;

        const _ls = this.modalInactiveLayer.style;
        _ls.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _ls.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
        _ls.width = maxPctWithoutFrame;
        _ls.height = maxPctWithoutFrame;

        //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
        this.createResizeHandleElements();

        this.resize(this.size.cssWidth, this.size.cssHeight);
    }

    private createResizeHandleElements() {
        const _rh: Array<HTMLDivElement> = this.resizeHandleEl;

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
            
            _rh.push(el);
        }
        //左上
        _rh[0].style.cursor = "nwse-resize";
        //上
        _rh[1].style.left = String(size) + "px";
        _rh[1].style.width = "calc(100% - " + String(size * 2) + "px)";
        _rh[1].style.cursor = "ns-resize";
        //右上
        _rh[2].style.right = "0px";
        _rh[2].style.cursor = "nesw-resize";
        //左中
        _rh[3].style.top = String(size) + "px";
        _rh[3].style.height = "calc(100% - " + String(size * 2) + "px)";
        _rh[3].style.cursor = "ew-resize";
        //右中
        _rh[4].style.right = "0px";
        _rh[4].style.top = String(size) + "px";
        _rh[4].style.height = "calc(100% - " + String(size * 2) + "px)";
        _rh[4].style.cursor = "ew-resize";
        //左下
        _rh[5].style.bottom = "0px";
        _rh[5].style.cursor = "nesw-resize";
        //下
        _rh[6].style.left = String(size) + "px";
        _rh[6].style.bottom = "0px";
        _rh[6].style.width = "calc(100% - " + String(size * 2) + "px)";
        _rh[6].style.cursor = "ns-resize";
        //右下
        _rh[7].style.right = "0px";
        _rh[7].style.bottom = "0px";
        _rh[7].style.cursor = "nwse-resize";

        _rh.forEach(element => {
            this.frameEl.appendChild(element);
        });
    }

    public __dispachMouseMoveEvent(x: number, y: number, deltaX: number, deltaY: number) {
        super.__dispachMouseMoveEvent(x, y, deltaX, deltaY);
        let frameWidth: number, frameHeight: number;

        if (this.isResizing && this.resizable) {
            const _ssw: number = this.resizeStartSizePx.width;
            const _ssh: number = this.resizeStartSizePx.height;
            const _smx: number = this.resizeStartMousePos.x;
            const _smy: number = this.resizeStartMousePos.y;

            //※リサイズした場合は単位はピクセルに強制的に変更するものとする
            switch (this.resizePositionIndex) {
                case 0 : //左上
                    this.changePosition(this.resizeStartPos.x + (x - _smx), this.resizeStartPos.y + (y - _smy));
                    frameWidth = _ssw - (x - _smx);
                    frameHeight = _ssh - (y - _smy);
                    break;
                case 1 : //上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - _smy));
                    frameWidth = _ssw;
                    frameHeight = _ssh - (y - _smy);
                    break;
                case 2 : //右上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - _smy));
                    frameWidth = _ssw + (x - _smx);
                    frameHeight = _ssh - (y - _smy);
                    break;
                case 3 : //左
                    this.changePosition(this.resizeStartPos.x + (x - _smx), this.position.y);
                    frameWidth = _ssw - (x - _smx);
                    frameHeight = _ssh;
                    break;
                case 4 : //右
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = _ssw + (x - _smx);
                    frameHeight = _ssh;
                    break;
                case 5 : //左下
                    this.changePosition(this.resizeStartPos.x + (x - _smx), this.position.y);
                    frameWidth = _ssw - (x - _smx);
                    frameHeight = _ssh + (y - _smy);
                    break;
                case 6 : //下
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = _ssw;
                    frameHeight = _ssh + (y - _smy);
                    break;
                case 7 : //右下
                    this.changePosition(this.position.x, this.position.y);
                    frameWidth = _ssw + (x - _smx);
                    frameHeight = _ssh + (y - _smy);
                    break;
            }

            frameWidth -= (ResizableOverlay.resizeHandleThicknessPx * 2);
            frameHeight -= (ResizableOverlay.resizeHandleThicknessPx * 2);

            this.resize(frameWidth + "px", frameHeight + "px");
        }
    }

    public __dispachMouseUpEvent(x: number, y: number) {
        if (!this.isMounted) return;
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

        this.overlayManager.changeContentsSelectable(false);
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

