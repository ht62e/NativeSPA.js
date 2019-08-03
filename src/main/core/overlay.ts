import Container from "./container";
import OvarlayManager from "./overlay_manager";

export default abstract class Overlay {
    public static resizeHandleThicknessPx: number = 6;

    protected outerFrameEl: HTMLDivElement;
    protected contentEl: HTMLDivElement;
    protected tabNaviFrontDetector: HTMLDivElement;
    protected tabNaviRearDetector: HTMLDivElement;
    protected lastFocusedEl: HTMLElement;
    protected lastFocusIsDetector: boolean = false;

    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;

    protected isResizing: boolean = false;
    protected resizePositionIndex: number;
    protected resizeStartMouseX: number;
    protected resizeStartMouseY: number;
    protected resizeStartX: number;
    protected resizeStartY: number;
    protected resizeStartWidth: number;
    protected resizeStartHeight: number;

    private resizeHandleEl = new Array<HTMLDivElement>();

    constructor(viewPortElement: HTMLElement, width: number, height: number) {
        this.outerFrameEl = document.createElement("div");
        this.outerFrameEl.style.position = "absolute";
        // this.outerFrameEl.style.width = String(width + Overlay.resizeHandleThicknessPx * 2) + "px";
        // this.outerFrameEl.style.height = String(height + Overlay.resizeHandleThicknessPx * 2) + "px";
        this.outerFrameEl.style.backgroundColor = "transparent";
        this.changePosition(70, 70);
        //this.outerFrameEl.style.display = "none";

        this.tabNaviFrontDetector = document.createElement("div");
        this.tabNaviFrontDetector.style.height = "0px";
        this.tabNaviFrontDetector.tabIndex = 0;
        this.tabNaviFrontDetector.addEventListener("focusin", this.onTabNaviFrontDetectorFocusIn.bind(this));

        this.contentEl = document.createElement("div");
        this.contentEl.className = "spa_overlay_container";
        this.contentEl.style.position = "absolute";
        // this.contentEl.style.width = String(width) + "px";
        // this.contentEl.style.height = String(height) + "px";
        this.contentEl.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
        this.contentEl.style.top = String(Overlay.resizeHandleThicknessPx) + "px";
        this.resize(width, height);

        this.tabNaviRearDetector = document.createElement("div");
        this.tabNaviRearDetector.style.height = "0px";
        this.tabNaviRearDetector.tabIndex = 0;
        this.tabNaviRearDetector.addEventListener("focusin", this.onTabNaviRearDetectorFocusIn.bind(this));

        this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
        this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));

        this.createResizeHandleElements();

        this.outerFrameEl.appendChild(this.tabNaviFrontDetector);
        this.outerFrameEl.appendChild(this.contentEl);
        this.outerFrameEl.appendChild(this.tabNaviRearDetector);
        viewPortElement.appendChild(this.outerFrameEl);
    }

    private createResizeHandleElements() {
        const size: number = Overlay.resizeHandleThicknessPx * 2;
        //0:左上 1:上中 2:右上 3:左中...8:右下  計8箇所 ※中中は無し
        for (let i = 0; i < 8; i++) {
            const el = document.createElement("div");
            el.dataset["positionIndex"] = String(i);
            el.style.position = "absolute";
            el.style.width = size + "px";
            el.style.height = size + "px";
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

        for (let i = 0; i < 8; i++) {
            this.outerFrameEl.appendChild(this.resizeHandleEl[i]);
        }
    }

    public __dispachMouseMoveEvent(x: number, y: number, deltaX: number, deltaY: number) {
        if (this.isResizing) {
            switch (this.resizePositionIndex) {
                case 0 : //左上
                    this.changePosition(this.resizeStartX + (x - this.resizeStartMouseX), this.resizeStartY + (y - this.resizeStartMouseY));
                    this.resize(this.resizeStartWidth - (x - this.resizeStartMouseX), this.resizeStartHeight - (y - this.resizeStartMouseY));
                    break;
                case 1 : //上
                    this.changePosition(this.x, this.resizeStartY + (y - this.resizeStartMouseY));
                    this.resize(this.width, this.resizeStartHeight - (y - this.resizeStartMouseY));
                    break;
            }
        }
    }

    public __dispachMouseUpEvent(x: number, y: number) {
        this.isResizing = false;
    }

    private onResizeHandleMouseDown(event: MouseEvent) {
        this.isResizing = true;
        this.resizePositionIndex = parseInt((event.target as HTMLElement).dataset["positionIndex"]);
        this.resizeStartMouseX = event.x;
        this.resizeStartMouseY = event.y;
        this.resizeStartX = this.x;
        this.resizeStartY = this.y;
        this.resizeStartWidth = this.width;
        this.resizeStartHeight = this.height;
    }

    private onTabNaviFrontDetectorFocusIn(event: FocusEvent) {
        if (!this.lastFocusIsDetector) {
            this.lastFocusIsDetector = true;
            this.tabNaviRearDetector.focus();
        }
        event.stopPropagation();
    }

    private onTabNaviRearDetectorFocusIn(event: FocusEvent) {
        if (!this.lastFocusIsDetector) {
            this.lastFocusIsDetector = true;
            this.tabNaviFrontDetector.focus();
        }
        event.stopPropagation();
    }

    private onFocusIn(event: FocusEvent) {
        this.lastFocusIsDetector = false;
        OvarlayManager.getInstance().overlayLastFocusedElement = null;
    }

    private onFocusOut(event: FocusEvent) {
        this.lastFocusIsDetector = false;
        this.lastFocusedEl = event.target as HTMLElement;
        OvarlayManager.getInstance().overlayLastFocusedElement = 
            event.target as HTMLElement;
    }

    public changeZIndex(zIndex: number): void {
        this.contentEl.style.zIndex = String(zIndex);
    }

    public changePosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.outerFrameEl.style.left = String(this.x - Overlay.resizeHandleThicknessPx) + "px";
        this.outerFrameEl.style.top = String(this.y - Overlay.resizeHandleThicknessPx) + "px";
    }

    public resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.outerFrameEl.style.width = String(width + Overlay.resizeHandleThicknessPx * 2) + "px";
        this.outerFrameEl.style.height = String(height + Overlay.resizeHandleThicknessPx * 2) + "px";
        this.contentEl.style.width = String(width) + "px";
        this.contentEl.style.height = String(height) + "px";
    }

    public abstract getContainer(): Container; 
    
    public abstract show(x?: number, y?: number): void;
    public abstract hide(): void;

}