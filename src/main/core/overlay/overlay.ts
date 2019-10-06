import Container from "../container/container";
import OvarlayManager from "./overlay_manager";
import { Point, Size } from "../common/types";
import CssTransitionDriver from "../common/css_transition_driver";
import { Parcel, Result } from "../common/dto";

export interface ShowOptions {
    position?: Point;
    parent?: Overlay;
}

export default abstract class Overlay {
    public static resizeHandleThicknessPx: number = 7;

    public static DEFAULT_OVERLAY_SIZE_WIDTH: number = 640;
    public static DEFAULT_OVERLAY_SIZE_HEIGHT: number = 480;

    protected name: string;

    protected viewPortEl: HTMLElement;

    protected outerFrameEl: HTMLDivElement;
    protected contentEl: HTMLDivElement;

    protected outerFrameTransitionDriver: CssTransitionDriver;

    //MEMO フォーカス移動検知パターン
    //(1) 最後のDOM→[tab]→tabFocusMoveTailDetector→(onfocusイベント内で)→tabFocusMoveHeadDetector
    //(2) 最初のDOM→[Shift+tab]→tabFocusMoveHeadDetector(onfocusイベント内で)→tabFocusMoveTailDetector
    //(3) tabFocusMoveHeadDetector(※1の直後)→[Shift+tab]→tabFocusMoveHeadStopper→(onfocusイベント内で)→最後のDOM(lastFocusedEl)
    //(4) tabFocusMoveTailDetector(※2の直後)→[tab]→tabFocusMoveTailStopper→(onfocusイベント内で)→最初のDOM(lastFocusedEl)
    //※3,4でlastFocusedElがnullの場合は反対側のDetectorにフォーカスを移動する
    protected tabFocusMoveHeadStopper: HTMLDivElement;
    protected tabFocusMoveHeadDetector: HTMLDivElement;
    protected tabFocusMoveTailDetector: HTMLDivElement;
    protected tabFocusMoveTailStopper: HTMLDivElement;

    protected lastFocusedEl: HTMLElement;
    protected lastFocusIsDetector: boolean = false;

    protected modalInactiveLayer: HTMLDivElement;
    protected modalInactiveLayerTransitionDriver: CssTransitionDriver;

    protected position: Point;
    protected size: Size;
    protected originalSize: Size;
    protected zIndex: number;
    //protected overlayLevel: OverlayLevel;

    protected active: boolean = false;
    protected inactiveModalMode: boolean = false;

    protected resizable: boolean = false;
    protected isResizing: boolean = false;
    protected resizePositionIndex: number;
    protected resizeStartMousePos: Point;
    protected resizeStartPos: Point;
    protected resizeStartSize: Size;

    private resizeHandleEl = new Array<HTMLDivElement>();

    public abstract getContainer(): Container; 
    
    public abstract async show(parcel?: Parcel, options?: ShowOptions): Promise<Result>;
    public abstract async showAsModal(parcel?: Parcel, options?: ShowOptions): Promise<Result> ;
    public abstract close(result?: Result): void;
    protected abstract async waitForOverlayClose(): Promise<Result>;

    constructor(viewPortElement: HTMLElement, name: string, size: Size) {
        this.viewPortEl = viewPortElement;
        this.name = name;
        //this.overlayLevel = overlayLevel !== undefined ? overlayLevel : OverlayLevel.default;

        const width = size ? size.width : Overlay.DEFAULT_OVERLAY_SIZE_WIDTH;
        const height = size ? size.height : Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT;

        this.originalSize = new Size(width, height);

        //リサイズ可能領域のためのフレームを作成
        this.outerFrameEl = document.createElement("div");
        this.outerFrameEl.style.position = "absolute";
        this.outerFrameEl.style.backgroundColor = "transparent";
        this.outerFrameEl.style.display = "none";
        this.outerFrameEl.addEventListener("selectstart", this.onSelectStart.bind(this));
        this.outerFrameEl.addEventListener("mousedown", this.onOuterMouseDown.bind(this));
        

        //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
        //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
        this.tabFocusMoveHeadStopper = document.createElement("div");
        this.tabFocusMoveHeadStopper.className = "fvst_tabfocus_move_stopper";
        this.tabFocusMoveHeadStopper.style.height = "0px";
        this.tabFocusMoveHeadStopper.tabIndex = 0;
        this.tabFocusMoveHeadStopper.addEventListener("focusin", this.onTabFocusMoveHeadStopperFocusIn.bind(this));

        this.tabFocusMoveHeadDetector = document.createElement("div");
        this.tabFocusMoveHeadDetector.className = "fvst_tabfocus_move_detector";
        this.tabFocusMoveHeadDetector.style.height = "0px";
        this.tabFocusMoveHeadDetector.tabIndex = 0;
        this.tabFocusMoveHeadDetector.addEventListener("focusin", this.onTabFocusMoveHeadDetectorFocusIn.bind(this));

        //コンテンツ領域生成
        this.contentEl = document.createElement("div");
        this.contentEl.style.position = "absolute";
        this.contentEl.style.overflow = "hidden";
        this.contentEl.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
        this.contentEl.style.top = String(Overlay.resizeHandleThicknessPx) + "px";

        //overlayのモーダル表示によって非アクティブ化したときに表示するレイヤー
        this.modalInactiveLayer = document.createElement("div");
        this.modalInactiveLayer.className = "fvst_modal_background_layer";
        this.modalInactiveLayer.style.position = "absolute";
        this.modalInactiveLayer.style.overflow = "hidden";
        this.modalInactiveLayer.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
        this.modalInactiveLayer.style.top = String(Overlay.resizeHandleThicknessPx) + "px";
        this.modalInactiveLayer.style.display = "none";

        this.modalInactiveLayerTransitionDriver = new CssTransitionDriver(this.modalInactiveLayer);

        this.resize(width, height);

        //非表示エレメントの作成（Tabキー対策）
        this.tabFocusMoveTailDetector = document.createElement("div");
        this.tabFocusMoveTailDetector.className = "fvst_tabfocus_move_detector";
        this.tabFocusMoveTailDetector.style.height = "0px";
        this.tabFocusMoveTailDetector.tabIndex = 0;
        this.tabFocusMoveTailDetector.addEventListener("focusin", this.onTabFocusMoveTailDetectorFocusIn.bind(this));
        
        this.tabFocusMoveTailStopper = document.createElement("div");
        this.tabFocusMoveTailStopper.className = "fvst_tabfocus_move_stopper";
        this.tabFocusMoveTailStopper.style.height = "0px";
        this.tabFocusMoveTailStopper.tabIndex = 0;
        this.tabFocusMoveTailStopper.addEventListener("focusin", this.onTabFocusMoveTailStopperFocusIn.bind(this));


        this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
        this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));

        //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
        this.createResizeHandleElements();

        this.outerFrameEl.appendChild(this.tabFocusMoveHeadStopper);
        this.outerFrameEl.appendChild(this.tabFocusMoveHeadDetector);
        this.outerFrameEl.appendChild(this.contentEl);
        this.outerFrameEl.appendChild(this.tabFocusMoveTailDetector);
        this.outerFrameEl.appendChild(this.tabFocusMoveTailStopper);
        this.outerFrameEl.appendChild(this.modalInactiveLayer);
        viewPortElement.appendChild(this.outerFrameEl);

        this.outerFrameTransitionDriver = new CssTransitionDriver(this.outerFrameEl);
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

        this.resizeHandleEl.forEach(element => {
            this.outerFrameEl.appendChild(element);
        });
    }

    public setResizable(resizable: boolean) {
        this.resizable = resizable;
        this.refreshResizeHandleElementActivate();
    }

    public __dispachMouseMoveEvent(x: number, y: number, deltaX: number, deltaY: number) {
        if (this.isResizing && this.resizable) {
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
        this.resizeStartMousePos = new Point(event.screenX, event.screenY);
        this.resizeStartPos = new Point(this.position.x, this.position.y);
        this.resizeStartSize = new Size(this.size.width, this.size.height);

        OvarlayManager.getInstance().changeContentsSelectable(false);
    }

    private onSelectStart(event: Event) {

    }

    private onTabFocusMoveHeadStopperFocusIn(event: FocusEvent) {
        if (this.lastFocusedEl) {
            this.lastFocusedEl.focus();
        } else {
            this.tabFocusMoveHeadDetector.focus();
        }
    }

    private onTabFocusMoveHeadDetectorFocusIn(event: FocusEvent) {
        if (!this.lastFocusIsDetector) {
            this.lastFocusIsDetector = true;
            this.tabFocusMoveTailDetector.focus();
        }
        event.stopPropagation();
    }

    private onTabFocusMoveTailDetectorFocusIn(event: FocusEvent) {
        if (!this.lastFocusIsDetector) {
            this.lastFocusIsDetector = true;
            this.tabFocusMoveHeadDetector.focus();
        }
        event.stopPropagation();
    }

    private onTabFocusMoveTailStopperFocusIn(event: FocusEvent) {
        if (this.lastFocusedEl) {
            this.lastFocusedEl.focus();
        } else {
            this.tabFocusMoveTailDetector.focus();
        }
    }

    private onOuterMouseDown(event: MouseEvent) {
        if (this.inactiveModalMode) return;
        OvarlayManager.getInstance().overlayMouseDownEventHandler(this.name);
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

    protected restoreOriginalSize() {
        this.resize(this.originalSize.width, this.originalSize.height);
    }

    public changeZIndex(zIndex: number): void {
        this.zIndex = zIndex;
        this.outerFrameEl.style.zIndex = String(zIndex);
    }

    public getName(): string {
        return this.name;
    }

    public getZIndex(): number {
        return this.zIndex;
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
        this.modalInactiveLayer.style.width = String(width) + "px";
        this.modalInactiveLayer.style.height = String(height) + "px";
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

    public activate(): void {
        this.active = true;
        this.inactiveModalMode = false;
        this.modalInactiveLayerTransitionDriver.hide();
        this.refreshResizeHandleElementActivate();
    }

    public inactivate(withModal: boolean): void {
        this.active = false;
        this.inactiveModalMode = withModal;
        if (withModal) {
            this.modalInactiveLayerTransitionDriver.show();
            this.refreshResizeHandleElementActivate();
        }
    }

    public isActive(): boolean {
        return this.active;
    }

}

