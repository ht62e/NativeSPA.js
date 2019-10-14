import Container from "../container/container";
import OvarlayManager from "./overlay_manager";
import { Point, Size, CssSize } from "../common/types";
import CssTransitionDriver from "../common/css_transition_driver";
import { Parcel, Result } from "../common/dto";
import ContainerManager from "../container/container_manager";

export interface ShowOptions {
    position?: Point;
    parent?: Overlay;
}

export default abstract class Overlay {
    public static DEFAULT_OVERLAY_SIZE_WIDTH: string = "50%";
    public static DEFAULT_OVERLAY_SIZE_HEIGHT: string = "50%";

    private static instanceSequenceTable = new Map<string, number>();

    protected name: string;

    protected viewPortEl: HTMLElement;

    protected frameEl: HTMLDivElement;
    protected outerContentEl: HTMLDivElement;
    protected contentEl: HTMLDivElement;

    protected container: Container;

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
    protected size: CssSize;
    protected originalSize: CssSize;
    protected offsetSizeCache: Size;
    protected zIndex: number;

    protected active: boolean = false;
    protected inactiveModalMode: boolean = false;

    public abstract getContainer(): Container; 
    
    public abstract async show(parcel?: Parcel, options?: ShowOptions): Promise<Result>;
    public abstract async showAsModal(parcel?: Parcel, options?: ShowOptions): Promise<Result> ;
    public abstract close(result?: Result): void;
    protected abstract async waitForOverlayClose(): Promise<Result>;

    constructor(viewPortElement: HTMLElement, name: string, size: CssSize) {
        this.viewPortEl = viewPortElement;
        this.name = name;

        const cssWidth = size ? size.cssWidth : Overlay.DEFAULT_OVERLAY_SIZE_WIDTH;
        const cssHeight = size ? size.cssHeight : Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT;

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
        this.contentEl = this.outerContentEl = document.createElement("div");
        this.contentEl.style.position = "absolute";
        this.contentEl.style.overflow = "hidden";
        this.contentEl.style.width = "100%";
        this.contentEl.style.height = "100%";

        //overlayのモーダル表示によって非アクティブ化したときに表示するレイヤー
        this.modalInactiveLayer = document.createElement("div");
        this.modalInactiveLayer.className = "fvst_modal_background_layer";
        this.modalInactiveLayer.style.position = "absolute";
        this.modalInactiveLayer.style.overflow = "hidden";
        this.modalInactiveLayer.style.display = "none";
        this.modalInactiveLayer.style.width = "100%";
        this.modalInactiveLayer.style.height = "100%";

        this.modalInactiveLayerTransitionDriver = new CssTransitionDriver(this.modalInactiveLayer);

        this.resize(cssWidth, cssHeight);

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

    public __dispachMouseMoveEvent(x: number, y: number, deltaX: number, deltaY: number) {
    }

    public __dispachMouseUpEvent(x: number, y: number) {
    }

    protected registerAsContainer(className: string, targetEl: HTMLDivElement) {
        const containerManager = ContainerManager.getInstance();
        let seq: number = Overlay.instanceSequenceTable.get(className);
        if (seq === undefined) seq = 0;
        this.container = containerManager.createContainer(
            "__" + className + "_" + String(seq), "", targetEl, null);
        Overlay.instanceSequenceTable.set(className, seq + 1);
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

    protected cacheCurrentOffsetSize() {
        const w = this.frameEl.offsetWidth;
        const h = this.frameEl.offsetHeight
        if (w > 0 && h > 0) this.offsetSizeCache = new Size(w, h);
    }

    protected restoreOriginalSize() {
        this.resize(this.originalSize.cssWidth, this.originalSize.cssHeight);
    }

    public changeZIndex(zIndex: number): void {
        this.zIndex = zIndex;
        this.frameEl.style.zIndex = String(zIndex);
    }

    public getName(): string {
        return this.name;
    }

    public getZIndex(): number {
        return this.zIndex;
    }

    public changePosition(x: number, y: number): void {
        this.position = new Point(x, y);
        this.frameEl.style.left = String(x) + "px";
        this.frameEl.style.top = String(y) + "px";
    }

    public moveToViewPortCenter(): void {
        const x = Math.round((this.viewPortEl.offsetWidth - this.offsetSizeCache.width) / 2);
        const y = Math.round((this.viewPortEl.offsetHeight - this.offsetSizeCache.height) / 2);
        this.changePosition(x, y);
    }

    public resize(width: string, height: string): void {
        this.size = new CssSize(width, height);
        this.frameEl.style.width = width;
        this.frameEl.style.height = height;
    }

    public activate(): void {
        this.active = true;
        this.inactiveModalMode = false;
        this.modalInactiveLayerTransitionDriver.hide();
    }

    public inactivate(withModal: boolean): void {
        this.active = false;
        this.inactiveModalMode = withModal;
        if (withModal) {
            this.modalInactiveLayerTransitionDriver.show();
        }
    }

    public isActive(): boolean {
        return this.active;
    }

}

