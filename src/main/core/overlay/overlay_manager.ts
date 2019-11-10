import Overlay, { ShowOptions } from "./overlay";
import { Parcel, Result, ActionType } from "../common/dto";
import CssTransitionDriver from "../common/css_transition_driver";
import Container from "../container/container";
import RuntimeError from "../common/runtime_error";

export default class OverlayManager {
    private viewPortEl: HTMLElement = null;

    public overlayLastFocusedElement: HTMLElement = null;

    private modalBackgroundLayer: HTMLDivElement;
    private modalBackgroundLayerTransitionDriver: CssTransitionDriver;

    private overlays: Map<string, Overlay>;
    private statusTable: Map<string, OverlayStatus>;
    private configTable: Map<string, OverlayConfig>;

    private previousMouseX: number = 0;
    private previousMouseY: number = 0;

    private contentsSelectable: boolean = true;

    private requestedAutoCloseCancelOnlyOnce: boolean = false;

    private DEFAULT_OVERLAY_START_Z_INDEX: number = 10;
    private MODAL_START_Z_INDEX: number = 1000;
    private FOREGROUND_START_Z_INDEX: number = 2000;

    private onFocusInBindedThis: (event: FocusEvent) => void;
    private onMouseDownBindedThis: (event: MouseEvent) => void;
    private onMouseMoveBindedThis: (event: MouseEvent) => void;
    private onMouseUpBindedThis: (event: FocusEvent) => void;
    private onSelectStartBindedThis: (event: FocusEvent) => void;
    private windowResizeEventHandlerBindThis: (event: Event) => void;

    constructor(viewPortElement: HTMLElement) {
        this.overlays = new Map<string, Overlay>();
        this.statusTable = new Map<string, OverlayStatus>();
        this.configTable = new Map<string, OverlayConfig>();

        let _s = this.modalBackgroundLayer = document.createElement("div");
        _s.className = "itm_modal_background_layer";
        _s.style.position = "absolute";
        _s.style.overflow = "hidden";
        _s.style.width = "100%";
        _s.style.height = "100%";
        _s.style.display = "none";
        _s.style.zIndex = String(this.MODAL_START_Z_INDEX);

        this.modalBackgroundLayerTransitionDriver = new CssTransitionDriver(this.modalBackgroundLayer);

        this.onFocusInBindedThis = this.onFocusIn.bind(this);
        this.onMouseDownBindedThis = this.onMouseDown.bind(this);
        this.onMouseMoveBindedThis = this.onMouseMove.bind(this);
        this.onMouseUpBindedThis = this.onMouseUp.bind(this);
        this.onSelectStartBindedThis = this.onSelectStart.bind(this);
        this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);

        this.setViewPortElement(viewPortElement);
    }

    public findOverlayByContainer(searchContainer: Container): Overlay {
        //TODO: IE11ではforEachしかつかえない。他ブラウザ用に見つかったらbreakするようなコードに変更したい。
        let res: Overlay = null;
        this.overlays.forEach(overlay => {
            if (overlay.getChildContainer() === searchContainer) {
                res = overlay;
            }
        });
        return res;
    }

    private onMouseDown(event: MouseEvent) {
        if (!this.requestedAutoCloseCancelOnlyOnce) {
            this.statusTable.forEach((omd: OverlayStatus, key: string) => {
                if (omd.isVisible && omd.isAutoCloseableWhenOutfocus) {
                    const overlay = this.overlays.get(key);
                    const module = overlay.getChildContainer().getCurrentModule();
                    module.exit(ActionType.CANCEL).then(exited => {
                        if (exited) overlay.close();
                    });
                }
            });
        }
        this.requestedAutoCloseCancelOnlyOnce = false;
    }

    private onMouseMove(event: MouseEvent) {
        let deltaX = event.screenX - this.previousMouseX;
        let deltaY = event.screenY - this.previousMouseY;
        this.previousMouseX = event.screenX;
        this.previousMouseY = event.screenY;
        this.overlays.forEach(overlay => {
            overlay.__dispachMouseMoveEvent(event.screenX, event.screenY, deltaX, deltaY);
        });
    }

    private onMouseUp(event: MouseEvent) {
        this.overlays.forEach(overlay => {
            overlay.__dispachMouseUpEvent(event.screenX, event.screenY);
        });
        this.changeContentsSelectable(true);
    }

    private windowResizeEventHandler(event: Event): void {
        
    }

    private onSelectStart(event: Event) {
        if (!this.contentsSelectable) {
            event.preventDefault();
        }
    }

    private onFocusIn(event: FocusEvent) {
        this.overlayLastFocusedElement = null;
    }

    public getViewPortElement() {
        return this.viewPortEl;
    }

    public setViewPortElement(element: HTMLElement) {
        if (this.viewPortEl !== null) {
            this.viewPortEl.removeEventListener("focusin", this.onFocusInBindedThis);
            this.viewPortEl.removeEventListener("mousedown", this.onMouseDownBindedThis);
            this.viewPortEl.removeEventListener("mousemove", this.onMouseMoveBindedThis);
            this.viewPortEl.removeEventListener("mouseup", this.onMouseUpBindedThis);
            this.viewPortEl.removeEventListener("selectstart", this.onSelectStartBindedThis);
        }
        this.viewPortEl = element;
        this.viewPortEl.addEventListener("focusin", this.onFocusInBindedThis);
        this.viewPortEl.addEventListener("mousedown", this.onMouseDownBindedThis);
        this.viewPortEl.addEventListener("mousemove", this.onMouseMoveBindedThis);
        this.viewPortEl.addEventListener("mouseup", this.onMouseUpBindedThis);
        this.viewPortEl.addEventListener("selectstart", this.onSelectStartBindedThis);

        this.viewPortEl.appendChild(this.modalBackgroundLayer);
    }

    public register(overlay: Overlay, overlayConfig: OverlayConfig): void {
        this.overlays.set(overlay.getName(), overlay);
        this.statusTable.set(overlay.getName(), new OverlayStatus());
        this.configTable.set(overlay.getName(), overlayConfig);
    }


    public async initialize(): Promise<void> {
        const names = new Array<string>(); //IE11ではMapの繰り返し中でawaitを使う方法がないため配列に入れてループ
        this.overlays.forEach((value, key) => {
            names.push(key);
        });

        for (let i in names) {
            const overlayName = names[i];
            if (!this.configTable.get(overlayName).lazyLoading) {
                const overlay: Overlay = this.overlays.get(overlayName);
                overlay.mount(this);
                await overlay.loadModule();
            }
        }
    }

    public changeContentsSelectable(selectable: boolean) {
        this.contentsSelectable = selectable;
    }

    private beginModalMode() {
        this.modalBackgroundLayerTransitionDriver.show();
    }

    private endModalMode() {
        let existModalOverlay = false;
        this.statusTable.forEach((value: OverlayStatus, key: string) => {
            if (value.isVisible && value.isModal) existModalOverlay = true;
        });
        if (!existModalOverlay) {
            this.modalBackgroundLayerTransitionDriver.hide();
        }
    }

    public async show(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        await this.checkAndLoadLazyModule(overlayName);
        const overlay = this.overlays.get(overlayName);

        const omd = this.statusTable.get(overlayName);
        omd.parentOverlay = options ? options.parent : null;

        omd.isVisible = true;
        this.activateSpecificOverlay(overlayName);
        const result = await overlay.show(parcel, options);
        omd.isVisible = false;
        this.activateTopOverlay();

        return result;
    }

    public async showAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        await this.checkAndLoadLazyModule(overlayName);
        const omd = this.statusTable.get(overlayName);
        
        omd.isModal = true;
        this.beginModalMode();
        const result = await this.show(overlayName, parcel, options);
        omd.isModal = false;
        this.endModalMode();

        return result;
    }

    private async checkAndLoadLazyModule(overlayName: string): Promise<boolean> {
        if (this.overlays.has(overlayName)) {
            const overlay: Overlay = this.overlays.get(overlayName);
            if (!overlay.getIsMounted()) {
                overlay.mount(this);
                await overlay.loadModule();
            }
        } else {
            throw new RuntimeError("指定されたモジュールは登録されていません。");
        }
        return true;
    }


    public overlayMouseDownEventHandler(overlayName: string) {
        //TODO 要モーダル状態チェック
        this.activateSpecificOverlay(overlayName);
    }

    public activateSpecificOverlay(overlayName: string) {
        const overlayList = new Array<Overlay>();
        const targetOverlay = this.overlays.get(overlayName);

        this.overlays.forEach((value: Overlay, key: string) => {
            if (key !== overlayName) overlayList.push(value);
        });

        overlayList.sort((a: Overlay, b: Overlay): number => {
            return b.getZIndex() - a.getZIndex();
        });

        overlayList.unshift(targetOverlay);

        let visibleCount = 0;
        this.statusTable.forEach((value: OverlayStatus, key: string) => {
            if (value.isVisible) ++visibleCount;
        });

        let visibleOverlayCounter = 0;
        let previousOmd: OverlayStatus = null;
        let previousOverlay: Overlay = null;
        overlayList.forEach((overlay: Overlay) => {
            const omd = this.statusTable.get(overlay.getName());
            if (omd.isVisible) {
                if (omd.isAutoCloseableWhenOutfocus) {
                    overlay.changeZIndex(this.FOREGROUND_START_Z_INDEX + visibleCount--);
                } else if (omd.isModal) {
                    overlay.changeZIndex(this.MODAL_START_Z_INDEX + visibleCount--);
                } else {
                    overlay.changeZIndex(this.DEFAULT_OVERLAY_START_Z_INDEX + visibleCount--);
                }
                if (visibleOverlayCounter === 0 || 
                    (previousOverlay.isActive() && overlay === previousOmd.parentOverlay)) {
                    overlay.activate();
                } else {
                    overlay.inactivate(omd.isModal);
                }
                previousOmd = omd;
                previousOverlay = overlay;
                ++visibleOverlayCounter;
            }
        });

        
    }

    public activateTopOverlay() {
        //zindexが一番大きいoverlayを有効化する
        let maxZIndex = -1;
        let targetOverlayName;

        this.overlays.forEach((overlay: Overlay, name: string) => {
            if (this.statusTable.get(name).isVisible) {
                if (overlay.getZIndex() > maxZIndex) {
                    maxZIndex = overlay.getZIndex();
                    targetOverlayName = name;
                }
            }
        });
        
        if (maxZIndex > -1) {
            this.activateSpecificOverlay(targetOverlayName);
        }
    }

    public cancelAutoClosingOnlyOnce() {
        this.requestedAutoCloseCancelOnlyOnce = true;
    }

    public getOverlay(overlayName: string): Overlay {
        return this.overlays.get(overlayName);
    }
}

export interface OverlayConfig {
    lazyLoading?: boolean;
    autoCloseWhenOutfocus?: boolean;
}

class OverlayStatus {
    public isVisible: boolean = false;
    public isModal: boolean = false;
    public isAutoCloseableWhenOutfocus: boolean = false;
    public parentOverlay: Overlay = null;

    public reset(): OverlayStatus {
        this.isVisible = false;
        this.isModal = false;
        this.isAutoCloseableWhenOutfocus = false;
        this.parentOverlay = null;
        return this;
    }
}
