import DialogWindow, { WindowOptions as DialogWindowOptions } from "./dialog_window";
import Overlay, { ShowOptions } from "./overlay";
import { Parcel, Result, ActionType } from "../common/dto";
import CssTransitionDriver from "../common/css_transition_driver";
import ContextMenu, { ContextMenuOptions } from "./context_menu";
import Container from "../container/container";
import Drawer, { DrawerOptions } from "./drawer";

export default class OvarlayManager {
    private static instance = new OvarlayManager();
    private viewPortEl: HTMLElement = null;

    public overlayLastFocusedElement: HTMLElement = null;

    private modalBackgroundLayer: HTMLDivElement;
    private modalBackgroundLayerTransitionDriver: CssTransitionDriver;

    private overlays: Map<string, Overlay>;
    private overlayManagementTable: Map<string, OverlayManagementData>;

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

    constructor() {
        this.overlays = new Map<string, Overlay>();
        this.overlayManagementTable = new Map<string, OverlayManagementData>();

        this.modalBackgroundLayer = document.createElement("div");
        this.modalBackgroundLayer.className = "fvst_modal_background_layer";
        this.modalBackgroundLayer.style.position = "absolute";
        this.modalBackgroundLayer.style.overflow = "hidden";
        this.modalBackgroundLayer.style.width = "100%";
        this.modalBackgroundLayer.style.height = "100%";
        this.modalBackgroundLayer.style.display = "none";
        this.modalBackgroundLayer.style.zIndex = String(this.MODAL_START_Z_INDEX);

        this.modalBackgroundLayerTransitionDriver = new CssTransitionDriver(this.modalBackgroundLayer);

        this.onFocusInBindedThis = this.onFocusIn.bind(this);
        this.onMouseDownBindedThis = this.onMouseDown.bind(this);
        this.onMouseMoveBindedThis = this.onMouseMove.bind(this);
        this.onMouseUpBindedThis = this.onMouseUp.bind(this);
        this.onSelectStartBindedThis = this.onSelectStart.bind(this);
        this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
    }

    public static getInstance(): OvarlayManager {
        return OvarlayManager.instance;
    }

    public findOverlayByContainer(searchContainer: Container): Overlay {
        //TODO: IE11ではforEachしかつかえない。他ブラウザ用に見つかったらbreakするようなコードに変更したい。
        let res: Overlay = null;
        this.overlays.forEach(overlay => {
            if (overlay.getContainer() === searchContainer) {
                res = overlay;
            }
        });
        return res;
    }

    private onMouseDown(event: MouseEvent) {
        if (!this.requestedAutoCloseCancelOnlyOnce) {
            this.overlayManagementTable.forEach((omd: OverlayManagementData, key: string) => {
                if (omd.isVisible && omd.isAutoCloseableWhenOutfocus) {
                    const overlay = this.overlays.get(key);
                    const module = overlay.getContainer().getActiveModule();
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

    
    public createWindow(overlayName: string, options?: DialogWindowOptions): DialogWindow {
        let overlay = new DialogWindow(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        this.overlayManagementTable.set(overlayName, new OverlayManagementData());
        return overlay;
    }

    public createContextMenu(overlayName: string, options?: ContextMenuOptions): ContextMenu {
        let overlay = new ContextMenu(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        const omd = new OverlayManagementData();
        omd.isAutoCloseableWhenOutfocus = true;
        this.overlayManagementTable.set(overlayName, omd);
        return overlay;
    }

    public createDrawer(overlayName: string, options?: DrawerOptions): Drawer {
        let overlay = new Drawer(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        const omd = new OverlayManagementData();
        omd.isAutoCloseableWhenOutfocus = true;
        this.overlayManagementTable.set(overlayName, omd);
        return overlay;
    }

    public changeContentsSelectable(selectable: boolean) {
        this.contentsSelectable = selectable;
    }

    private beginModalMode() {
        this.modalBackgroundLayerTransitionDriver.show();
    }

    private endModalMode() {
        let existModalOverlay = false;
        this.overlayManagementTable.forEach((value: OverlayManagementData, key: string) => {
            if (value.isVisible && value.isModal) existModalOverlay = true;
        });
        if (!existModalOverlay) {
            this.modalBackgroundLayerTransitionDriver.hide();
        }
    }

    public async show(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        const overlay = this.overlays.get(overlayName);

        const omd = this.overlayManagementTable.get(overlayName);
        omd.parentOverlay = options ? options.parent : null;

        omd.isVisible = true;
        this.activateSpecificOverlay(overlayName);
        const result = await overlay.show(parcel, options);
        omd.isVisible = false;
        this.activateTopOverlay();

        return result;
    }

    public async showAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        const omd = this.overlayManagementTable.get(overlayName);
        
        omd.isModal = true;
        this.beginModalMode();
        const result = await this.show(overlayName, parcel, options);
        omd.isModal = false;
        this.endModalMode();

        return result;
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
        this.overlayManagementTable.forEach((value: OverlayManagementData, key: string) => {
            if (value.isVisible) ++visibleCount;
        });

        let visibleOverlayCounter = 0;
        let previousOmd: OverlayManagementData = null;
        let previousOverlay: Overlay = null;
        overlayList.forEach((overlay: Overlay) => {
            const omd = this.overlayManagementTable.get(overlay.getName());
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
            if (this.overlayManagementTable.get(name).isVisible) {
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
}

class OverlayManagementData {
    public isVisible: boolean = false;
    public isModal: boolean = false;
    public isAutoCloseableWhenOutfocus: boolean = false;
    public parentOverlay: Overlay = null;

    public reset(): OverlayManagementData {
        this.isVisible = false;
        this.isModal = false;
        this.isAutoCloseableWhenOutfocus = false;
        this.parentOverlay = null;
        return this;
    }
}
