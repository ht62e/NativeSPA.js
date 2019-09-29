import DialogWindow, { WindowOptions as DialogWindowOptions } from "./dialog_window";
import Overlay, { ShowOptions } from "./overlay";
import { Parcel, Result } from "../common/dto";
import CssTransitionDriver from "../common/css_transition_driver";
import PopupMenu, { PopupMenuOptions } from "./popup_menu";

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

    private OVERLAY_START_Z_INDEX: number = 10;
    private MODAL_START_Z_INDEX: number = 1000;

    private onFocusInBindedThis: (event: FocusEvent) => void;
    private onMouseDownBindedThis: (event: MouseEvent) => void;
    private onMouseMoveBindedThis: (event: MouseEvent) => void;
    private onMouseUpBindedThis: (event: FocusEvent) => void;
    private onSelectStartBindedThis: (event: FocusEvent) => void;

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
    }

    public static getInstance(): OvarlayManager {
        return OvarlayManager.instance;
    }

    private onMouseDown(event: MouseEvent) {
        if (this.requestedAutoCloseCancelOnlyOnce) {
            this.requestedAutoCloseCancelOnlyOnce = false;
        } else {
            this.overlayManagementTable.forEach((value: OverlayManagementData, key: string) => {
                if (value.isAutoCloseableWhenOutfocus) {
                    console.log(new Date().toString() +  key + " close.");
                }
            });
        }   
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

    public createPopupMenu(overlayName: string, options?: PopupMenuOptions): PopupMenu {
        let overlay = new PopupMenu(this.viewPortEl, overlayName, options);
        this.overlays.set(overlayName, overlay);
        let omd = new OverlayManagementData();
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
        this.overlayManagementTable.get(overlayName).isVisible = true;

        this.activateSpecificOverlay(overlayName);
        const result = await overlay.show(parcel, options);

        this.overlayManagementTable.get(overlayName).reset();
        this.activateTopOverlay();

        return result;
    }

    public async showAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        this.overlayManagementTable.get(overlayName).isModal = true;

        this.beginModalMode();
        const result = await this.show(overlayName, parcel, options);
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

        let i = 0;
        overlayList.forEach((overlay: Overlay) => {
            const mgrData = this.overlayManagementTable.get(overlay.getName());
            if (mgrData.isVisible) {
                if (mgrData.isModal) {
                    overlay.changeZIndex(this.MODAL_START_Z_INDEX + visibleCount--);
                } else {
                    overlay.changeZIndex(this.OVERLAY_START_Z_INDEX + visibleCount--);
                }
                if (i === 0) {
                    overlay.activate();
                } else {
                    overlay.inactivate(mgrData.isModal);
                }
                ++i;
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

    public reset() {
        this.isVisible = false;
        this.isModal = false;
    }
}
