import Container from "./container";
import OvarlayManager from "./overlay_manager";
import { Point, Size } from "./types";
import Result from "./result";
import Parcel from "./parcel";

export default abstract class Overlay {
    public static resizeHandleThicknessPx: number = 7;

    protected viewPortElement: HTMLElement;

    protected outerFrameEl: HTMLDivElement;
    protected contentEl: HTMLDivElement;
    protected tabNaviFrontDetector: HTMLDivElement;
    protected tabNaviRearDetector: HTMLDivElement;
    protected lastFocusedEl: HTMLElement;
    protected lastFocusIsDetector: boolean = false;

    protected position: Point;
    protected size: Size;

    protected isResizing: boolean = false;
    protected resizePositionIndex: number;
    protected resizeStartMousePos: Point;
    protected resizeStartPos: Point;
    protected resizeStartSize: Size;

    private resizeHandleEl = new Array<HTMLDivElement>();

    public abstract getContainer(): Container; 
    
    public abstract async show(parcel?: Parcel, options?: ShowOptions): Promise<Result> ;
    public abstract close(): void;
    protected abstract async waitForOverlayClose(): Promise<Result>;

    constructor(viewPortElement: HTMLElement, width: number, height: number) {
        this.viewPortElement = viewPortElement;

        //リサイズ可能領域のためのフレームを作成
        this.outerFrameEl = document.createElement("div");
        this.outerFrameEl.style.position = "absolute";
        this.outerFrameEl.style.backgroundColor = "transparent";
        this.outerFrameEl.style.display = "none";
        this.outerFrameEl.addEventListener("selectstart", this.onSelectStart.bind(this));

        //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
        //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
        this.tabNaviFrontDetector = document.createElement("div");
        this.tabNaviFrontDetector.style.height = "0px";
        this.tabNaviFrontDetector.tabIndex = 0;
        this.tabNaviFrontDetector.addEventListener("focusin", this.onTabNaviFrontDetectorFocusIn.bind(this));

        //コンテンツメインコンテナ生成
        this.contentEl = document.createElement("div");
        this.contentEl.className = "spa_overlay_container";
        this.contentEl.style.position = "absolute";
        this.contentEl.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
        this.contentEl.style.top = String(Overlay.resizeHandleThicknessPx) + "px";
        this.resize(width, height);

        //非表示エレメントの作成（Tabキー対策）
        this.tabNaviRearDetector = document.createElement("div");
        this.tabNaviRearDetector.style.height = "0px";
        this.tabNaviRearDetector.tabIndex = 0;
        this.tabNaviRearDetector.addEventListener("focusin", this.onTabNaviRearDetectorFocusIn.bind(this));

        this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
        this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));

        //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
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
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    this.resize(this.resizeStartSize.width - (x - this.resizeStartMousePos.x), this.resizeStartSize.height - (y - this.resizeStartMousePos.y));
                    break;
                case 1 : //上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    this.resize(this.size.width, this.resizeStartSize.height - (y - this.resizeStartMousePos.y));
                    break;
                case 2 : //右上
                    this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                    this.resize(this.resizeStartSize.width + (x - this.resizeStartMousePos.x), this.resizeStartSize.height - (y - this.resizeStartMousePos.y));
                    break;
                case 3 : //左
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                    this.resize(this.resizeStartSize.width - (x - this.resizeStartMousePos.x), this.size.height);
                    break;
                case 4 : //右
                    this.changePosition(this.position.x, this.position.y);
                    this.resize(this.resizeStartSize.width + (x - this.resizeStartMousePos.x), this.size.height);
                    break;
                case 5 : //左下
                    this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                    this.resize(this.resizeStartSize.width - (x - this.resizeStartMousePos.x), this.resizeStartSize.height + (y - this.resizeStartMousePos.y));
                    break;
                case 6 : //下
                    this.changePosition(this.position.x, this.position.y);
                    this.resize(this.size.width, this.resizeStartSize.height + (y - this.resizeStartMousePos.y));
                    break;
                case 7 : //右下
                    this.changePosition(this.position.x, this.position.y);
                    this.resize(this.resizeStartSize.width + (x - this.resizeStartMousePos.x), this.resizeStartSize.height + (y - this.resizeStartMousePos.y));
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
        this.resizeStartMousePos = new Point(event.x, event.y);
        this.resizeStartPos = new Point(this.position.x, this.position.y);
        this.resizeStartSize = new Size(this.size.width, this.size.height);

        OvarlayManager.getInstance().changeContentsSelectable(false);
    }

    private onSelectStart(event: Event) {
        //console.log(event);
        
        //event.stopPropagation();
        //event.preventDefault();
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
        this.position = new Point(x, y);
        this.outerFrameEl.style.left = String(this.position.x - Overlay.resizeHandleThicknessPx) + "px";
        this.outerFrameEl.style.top = String(this.position.y - Overlay.resizeHandleThicknessPx) + "px";
    }

    public resize(width: number, height: number): void {
        this.size = new Size(width, height);
        this.outerFrameEl.style.width = String(width + Overlay.resizeHandleThicknessPx * 2) + "px";
        this.outerFrameEl.style.height = String(height + Overlay.resizeHandleThicknessPx * 2) + "px";
        this.contentEl.style.width = String(width) + "px";
        this.contentEl.style.height = String(height) + "px";
    }

    

}

export interface ShowOptions {
    x?: number;
    y?: number;
}