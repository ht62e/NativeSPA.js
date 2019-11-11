import Container from "../container/container";
import OverlayManager from "./overlay_manager";
import { CssSize } from "../common/types";
import { Result, ActionType, Parcel } from "../common/dto";
import ResizableOverlay from "./resizable_overlay";
import { ShowOptions } from "./overlay";
import ModuleLoader from "../module/module_loader";

export interface WindowOptions {
    size?: CssSize;
    defaultCaption?: string;
    resizable?: boolean;
    hideHeader?: boolean;
    hideFooter?: boolean;
}

export default class DialogWindow extends ResizableOverlay {
    protected windowOptions: WindowOptions;

    protected wrapperEl: HTMLDivElement;
    protected headerEl: HTMLDivElement;
    protected containerEl: HTMLDivElement;
    protected footerEl: HTMLDivElement;

    protected headerTitleEl: HTMLDivElement;
    protected headerCloseButtonEl: HTMLDivElement;

    protected okButtonEl:  HTMLInputElement;
    protected cancelButtonEl:  HTMLInputElement;
    protected applyButtonEl:  HTMLInputElement;

    protected isDragging: boolean = false;

    protected waitForOverlayCloseResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(name: string, moduleLoader: ModuleLoader, options?: WindowOptions) {
        super(name, options ? options.size : null, moduleLoader);

        this.windowOptions = options;

        if (options && options.resizable === false) {
            this.setResizable(false);
        }
    }

    public mount(overlayManager: OverlayManager): void {
        super.mount(overlayManager);

        const _wop = this.windowOptions;

        let _s: HTMLDivElement;
        _s = this.wrapperEl = document.createElement("div");
        _s.style.position = "absolute";
        _s.style.display = "flex";
        _s.style.flexDirection = "column";
        _s.style.width = "100%";
        _s.style.height = "100%";

        _s = this.headerEl = document.createElement("div");
        _s.className = "itm_dialog_window_header";
        _s.style.position = "relative";
        _s.style.display = "flex";
        _s.style.width = "100%";
        if (_wop && _wop.hideHeader) {
            this.headerEl.style.display = "none";
        }

        _s = this.headerTitleEl = document.createElement("div");
        _s.className = "caption";
        _s.textContent = _wop && _wop.defaultCaption ? _wop.defaultCaption : "";

        _s = this.headerCloseButtonEl = document.createElement("div");
        _s.className = "close_button";
        _s.textContent = "×";
        _s.addEventListener("click", this.onHeaderCloseButtonClick.bind(this));

        _s = this.headerEl;
        _s.appendChild(this.headerTitleEl);
        _s.appendChild(this.headerCloseButtonEl);
        _s.addEventListener("mousedown", this.onHeaderMouseDown.bind(this));
        _s.addEventListener("dragstart", this.onHeaderDragStart.bind(this));

        _s = this.containerEl = document.createElement("div");
        _s.className = "itm_dialog_window_body";
        _s.style.position = "relative";
        _s.style.flexGrow = "1";
        _s.style.flexShrink = "1";
        _s.style.width = "100%";

        this.registerAsContainer("window", this.containerEl);

        _s = this.footerEl = document.createElement("div");
        _s.className = "itm_dialog_window_footer";
        _s.style.position = "relative";
        _s.style.width = "100%";
        if (_wop && _wop.hideFooter) {
            _s.style.display = "none";
        }

        let _t: HTMLInputElement;
        _t = this.okButtonEl = document.createElement("input");
        _t.type = "button";
        _t.classList.add("itm_dialog_window_footer_button", "ok");
        _t.value = "OK";
        _t.addEventListener("click", this.onOkButtonClick.bind(this));

        _t = this.cancelButtonEl = document.createElement("input");
        _t.type = "button";
        _t.classList.add("itm_dialog_window_footer_button", "cancel");
        _t.value = "キャンセル";
        _t.addEventListener("click", this.onCancelButtonClick.bind(this));

        _t = this.applyButtonEl = document.createElement("input");
        _t.type = "button";
        _t.classList.add("itm_dialog_window_footer_button", "apply");
        _t.value = "適用";        

        this.footerEl.appendChild(this.okButtonEl);
        this.footerEl.appendChild(this.cancelButtonEl);
        
        this.wrapperEl.appendChild(this.headerEl);
        this.wrapperEl.appendChild(this.containerEl);
        this.wrapperEl.appendChild(this.footerEl);

        this.contentEl.className = "itm_dialog_window_container";
        this.contentEl.appendChild(this.wrapperEl);

        this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "itm_dialog_window_standy_state",
            enterTransitionClass: "itm_dialog_window_enter_transition",
            leaveTransitionClass: "itm_dialog_window_leave_transition",
            endStateClass: "itm_dialog_window_end_state"
        });

    }

    protected onHeaderMouseDown(event: MouseEvent) {
        this.isDragging = true;
        this.overlayManager.changeContentsSelectable(false);
    }

    protected onHeaderDragStart(event: MouseEvent) {
        event.preventDefault();
    }

    protected onHeaderCloseButtonClick(event: MouseEvent) {
        this.container.getCurrentModule().exit(ActionType.CANCEL).then(exited => {
            if (exited) this.close();
        });        
    }

    protected onOkButtonClick(event: MouseEvent) {
        this.container.getCurrentModule().exit(ActionType.OK).then(exited => {
            if (exited) this.close(this.container.getContainerResult());
        });
    }

    protected onCancelButtonClick(event: MouseEvent) {
        this.container.getCurrentModule().exit(ActionType.CANCEL).then(exited => {
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

    public getChildContainer(): Container {
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

