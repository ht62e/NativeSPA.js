import Container from "../container/container";
import Overlay, { ShowOptions } from "./overlay";
import OvarlayManager from "./overlay_manager";
import ContainerManager from "../container/container_manager";
import { Size } from "../types";
import { Result, ActionType, Parcel } from "../dto";

export interface WindowOptions {
    size?: Size;
}

export default class DialogWindow extends Overlay {
    private static instanceSequence = 0;

    protected wrapperEl: HTMLDivElement;
    protected headerEl: HTMLDivElement;
    protected bodyEl: HTMLDivElement;
    protected footerEl: HTMLDivElement;

    protected headerTitleEl: HTMLDivElement;
    protected headerCloseButtonEl: HTMLDivElement;

    protected okButtonEl:  HTMLInputElement;
    protected cancelButtonEl:  HTMLInputElement;
    protected applyButtonEl:  HTMLInputElement;

    protected isDragging: boolean = false;

    protected container: Container;

    protected closeForWaitResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(viewPortElement: HTMLElement, name: string, caption: string, options?: WindowOptions) {
        super(viewPortElement, name, options ? options.size : null);

        const containerManager = ContainerManager.getInstance();

        this.wrapperEl = document.createElement("div");
        this.wrapperEl.style.position = "absolute";
        this.wrapperEl.style.display = "flex";
        this.wrapperEl.style.flexDirection = "column";
        this.wrapperEl.style.width = "100%";
        this.wrapperEl.style.height = "100%";

        this.headerEl = document.createElement("div");
        this.headerEl.className = "fivestage_dialog_window_header";
        this.headerEl.style.position = "relative";
        this.headerEl.style.display = "flex";
        this.headerEl.style.width = "100%";

        this.headerTitleEl = document.createElement("div");
        this.headerTitleEl.className = "caption";
        this.headerTitleEl.textContent = caption;

        this.headerCloseButtonEl = document.createElement("div");
        this.headerCloseButtonEl.className = "close_button";
        this.headerCloseButtonEl.textContent = "×";
        this.headerCloseButtonEl.addEventListener("click", this.onHeaderCloseButtonClick.bind(this));

        this.headerEl.appendChild(this.headerTitleEl);
        this.headerEl.appendChild(this.headerCloseButtonEl);

        this.headerEl.addEventListener("mousedown", this.onHeaderMouseDown.bind(this));
        this.headerEl.addEventListener("dragstart", this.onHeaderDragStart.bind(this));

        this.bodyEl = document.createElement("div");
        this.bodyEl.className = "fivestage_dialog_window_body";
        this.bodyEl.style.position = "relative";
        this.bodyEl.style.flexGrow = "1";
        this.bodyEl.style.flexShrink = "1";
        this.bodyEl.style.width = "100%";

        this.container = containerManager.createContainer(
            "__window" + String(DialogWindow.instanceSequence++), "", this.bodyEl);

        this.footerEl = document.createElement("div");
        this.footerEl.className = "fivestage_dialog_window_footer";
        this.footerEl.style.position = "relative";
        this.footerEl.style.width = "100%";

        this.okButtonEl = document.createElement("input");
        this.okButtonEl.type = "button";
        this.okButtonEl.value = "OK";
        this.okButtonEl.addEventListener("click", this.onOkButtonClick.bind(this));

        this.cancelButtonEl = document.createElement("input");
        this.cancelButtonEl.type = "button";
        this.cancelButtonEl.value = "キャンセル";
        this.cancelButtonEl.addEventListener("click", this.onCancelButtonClick.bind(this));

        this.applyButtonEl = document.createElement("input");
        this.applyButtonEl.type = "button";
        this.applyButtonEl.value = "適用";        

        this.footerEl.appendChild(this.okButtonEl);
        this.footerEl.appendChild(this.cancelButtonEl);
        
        this.wrapperEl.appendChild(this.headerEl);
        this.wrapperEl.appendChild(this.bodyEl);
        this.wrapperEl.appendChild(this.footerEl);

        this.contentEl.appendChild(this.wrapperEl);

        this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "fivestage_dialog_window_standy_state",
            enterTransitionClass: "fivestage_dialog_window_enter_transition",
            leaveTransitionClass: "fivestage_dialog_window_leave_transition",
            endStateClass: "fivestage_dialog_window_end_state"
        });
    }

    protected onHeaderMouseDown(event: MouseEvent) {
        this.isDragging = true;
        OvarlayManager.getInstance().changeContentsSelectable(false);
    }

    protected onHeaderDragStart(event: MouseEvent) {
        event.preventDefault();
    }

    protected onHeaderCloseButtonClick(event: MouseEvent) {
        this.container.getActiveModule().exit(ActionType.CANCEL).then(exited => {
            if (exited) this.close();
        });        
    }

    // private onMouseUp(event: MouseEvent) {
    //     this.isDragging = false;
    // }

    


    protected onOkButtonClick(event: MouseEvent) {
        this.container.getActiveModule().exit(ActionType.OK).then(exited => {
            if (exited) this.close();
        });
    }

    protected onCancelButtonClick(event: MouseEvent) {
        this.container.getActiveModule().exit(ActionType.CANCEL).then(exited => {
            if (exited) this.close();
        });
    }

    protected onApplyButtonClick(event: MouseEvent) {

    }

    protected waitForOverlayClose(): Promise<Result> {
        return new Promise(resolve => {
            this.closeForWaitResolver = resolve;
        });
    }

    //override
    public __dispachMouseMoveEvent(x: number, y: number, deltaX: number, deltaY: number) {
        super.__dispachMouseMoveEvent(x, y, deltaX, deltaY);
        if (!this.isDragging) return;
        this.changePosition(this.position.x + deltaX, this.position.y + deltaY);
    }

    //override
    public __dispachMouseUpEvent(x: number, y: number) {
        super.__dispachMouseUpEvent(x, y);
        this.isDragging = false;
    }

    public getContainer(): Container {
        return this.container;
    }

    public async show(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        let px: number, py: number;
        if (options && options.x !== undefined && options.y !== undefined) {
            px = options.x; py = options.y;
        } else {
            //デフォルト表示位置は表示領域（ビューポート）の中央
            px = Math.round((this.viewPortEl.offsetWidth - this.size.width) / 2);
            py = Math.round((this.viewPortEl.offsetHeight - this.size.height) / 2);
        }
        this.changePosition(px, py);

        this.outerFrameTransitionDriver.show();

        this.container.getActiveModule().waitForExit().then(result => {
            this.close();
            //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
            window.setTimeout(this.closeForWaitResolver.bind(this), 0, result);
        });

        
        return this.waitForOverlayClose();
    }

    public async showAsModal(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return this.show(parcel, options);
    }

    public close(): void {
        this.outerFrameTransitionDriver.hide();
    }

    //override
    public activate(): void {
        super.activate();

        this.headerEl.classList.remove("inactive");
    }

    //override
    public inactivate(withModal: boolean): void {
        super.inactivate(withModal);

        this.headerEl.classList.add("inactive");
    }     
}

