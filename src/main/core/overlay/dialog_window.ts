import Container from "../container/container";
import Overlay, { ShowOptions } from "./overlay";
import OvarlayManager from "./overlay_manager";
import ContainerManager from "../container/container_manager";
import { Size, Point } from "../common/types";
import { Result, ActionType, Parcel } from "../common/dto";

export interface WindowOptions {
    size?: Size;
    defaultCaption?: string;
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

    protected waitForOverlayCloseResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(viewPortElement: HTMLElement, name: string, options?: WindowOptions) {
        super(viewPortElement, name, options ? options.size : null);

        this.setResizable(true);

        const containerManager = ContainerManager.getInstance();

        this.wrapperEl = document.createElement("div");
        this.wrapperEl.style.position = "absolute";
        this.wrapperEl.style.display = "flex";
        this.wrapperEl.style.flexDirection = "column";
        this.wrapperEl.style.width = "100%";
        this.wrapperEl.style.height = "100%";

        this.headerEl = document.createElement("div");
        this.headerEl.className = "fvst_dialog_window_header";
        this.headerEl.style.position = "relative";
        this.headerEl.style.display = "flex";
        this.headerEl.style.width = "100%";

        this.headerTitleEl = document.createElement("div");
        this.headerTitleEl.className = "caption";
        this.headerTitleEl.textContent = options && options.defaultCaption ? options.defaultCaption : "";

        this.headerCloseButtonEl = document.createElement("div");
        this.headerCloseButtonEl.className = "close_button";
        this.headerCloseButtonEl.textContent = "×";
        this.headerCloseButtonEl.addEventListener("click", this.onHeaderCloseButtonClick.bind(this));

        this.headerEl.appendChild(this.headerTitleEl);
        this.headerEl.appendChild(this.headerCloseButtonEl);

        this.headerEl.addEventListener("mousedown", this.onHeaderMouseDown.bind(this));
        this.headerEl.addEventListener("dragstart", this.onHeaderDragStart.bind(this));

        this.bodyEl = document.createElement("div");
        this.bodyEl.className = "fvst_dialog_window_body";
        this.bodyEl.style.position = "relative";
        this.bodyEl.style.flexGrow = "1";
        this.bodyEl.style.flexShrink = "1";
        this.bodyEl.style.width = "100%";

        this.container = containerManager.createContainer(
            "__window_" + String(DialogWindow.instanceSequence++), "", this.bodyEl, null);

        this.footerEl = document.createElement("div");
        this.footerEl.className = "fvst_dialog_window_footer";
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

        this.contentEl.className = "fvst_dialog_window_container";
        this.contentEl.appendChild(this.wrapperEl);

        this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "fvst_dialog_window_standy_state",
            enterTransitionClass: "fvst_dialog_window_enter_transition",
            leaveTransitionClass: "fvst_dialog_window_leave_transition",
            endStateClass: "fvst_dialog_window_end_state"
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

    protected onOkButtonClick(event: MouseEvent) {
        this.container.getActiveModule().exit(ActionType.OK).then(exited => {
            if (exited) this.close(this.container.getContainerResult());
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
            this.waitForOverlayCloseResolver = resolve;
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

    public setWindowTitle(title: string) {
        this.headerTitleEl.textContent = title;
    }

    public async show(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        if (options && options.position) {
            this.changePosition(options.position.x, options.position.y);
        } else {
            //デフォルト表示位置は表示領域（ビューポート）の中央
            this.moveToViewPortCenter();
        }        

        this.container.initialize(parcel);
        this.outerFrameTransitionDriver.show();
        
        return this.waitForOverlayClose();
    }

    public async showAsModal(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return this.show(parcel, options);
    }

    public moveToViewPortCenter(): void {
        const x = Math.round((this.viewPortEl.offsetWidth - this.size.width) / 2);
        const y = Math.round((this.viewPortEl.offsetHeight - this.size.height) / 2);
        this.changePosition(x, y);
    }

    //override
    public close(result?: Result): void {
        this.outerFrameTransitionDriver.hide();
        //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
        window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
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

