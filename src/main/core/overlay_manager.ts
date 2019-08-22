import DialogWindow, { WindowOptions as DialogWindowOptions } from "./dialog_window";
import Overlay, { ShowOptions } from "./overlay";
import Result from "./result";
import Parcel from "./parcel";

export default class OvarlayManager {
    private static instance = new OvarlayManager();
    private viewPortEl: HTMLElement = null;

    public overlayLastFocusedElement: HTMLElement = null;

    private overlays: Map<string, Overlay>;

    private previousMouseX: number = 0;
    private previousMouseY: number = 0;

    private contentsSelectable: boolean = true;

    constructor() {
        this.overlays = new Map<string, Overlay>();
    }

    public static getInstance(): OvarlayManager {
        return OvarlayManager.instance;
    }

    private onMouseMove(event: MouseEvent) {
        let deltaX = event.x - this.previousMouseX;
        let deltaY = event.y - this.previousMouseY;
        this.previousMouseX = event.x;
        this.previousMouseY = event.y;
        this.overlays.forEach(overlay => {
            overlay.__dispachMouseMoveEvent(event.x, event.y, deltaX, deltaY);
        })
    }

    private onMouseUp(event: MouseEvent) {
        this.overlays.forEach(overlay => {
            overlay.__dispachMouseUpEvent(event.x, event.y);
        });
        this.changeContentsSelectable(true);
    }

    private onSelectStart(event: Event) {
        if (!this.contentsSelectable) {
            event.preventDefault();
        }
    }

    private onFocusIn(event: FocusEvent) {
        if (this.overlayLastFocusedElement) {
            //TODO 仮実装
            //this.overlayLastFocusedElement.focus();
        }
        this.overlayLastFocusedElement = null;
    }

    public setViewPortElement(element: HTMLElement) {
        if (this.viewPortEl !== null) {
            this.viewPortEl.removeEventListener("focusin", this.onFocusIn);
        }
        this.viewPortEl = element;
        this.viewPortEl.addEventListener("focusin", this.onFocusIn.bind(this));

        this.viewPortEl.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.viewPortEl.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.viewPortEl.addEventListener("selectstart", this.onSelectStart.bind(this));
    }
    
    public createWindow(overlayName: string, caption: string, options?: DialogWindowOptions): DialogWindow {
        let overlay = new DialogWindow(this.viewPortEl, caption, options);
        overlay.changeZIndex(1000);
        this.overlays.set(overlayName, overlay);
        return overlay;
    }

    public changeContentsSelectable(selectable: boolean) {
        this.contentsSelectable = selectable;
    }

    public showPopupMenu(overlayName: string): Result {
        return null;
    }


    public async showWindow(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        let overlay = this.overlays.get(overlayName);
        return await overlay.show(parcel, options);
    }

    public async showWindowAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        let overlay = this.overlays.get(overlayName);
        return await overlay.show(parcel, options);
    }

}
