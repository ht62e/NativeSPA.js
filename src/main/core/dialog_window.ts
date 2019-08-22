import Container from "./container";
import Overlay, { ShowOptions } from "./overlay";
import ContainerManager from "./container_manager";
import Result, { ActionType } from "./result";
import Parcel from "./parcel";

export default class DialogWindow extends Overlay {
    private static instanceSequence = 0;

    protected wrapperEl: HTMLDivElement;
    protected headerEl: HTMLDivElement;
    protected bodyEl: HTMLDivElement;
    protected footerEl: HTMLDivElement;

    protected okButtonEl:  HTMLInputElement;
    protected cancelButtonEl:  HTMLInputElement;
    protected applyButtonEl:  HTMLInputElement;

    protected isDragging: boolean = false;

    protected container: Container;

    protected closeForWaitResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(viewPortElement: HTMLElement, caption: string, options?: WindowOptions) {
        super(viewPortElement, 640, 480);

        const containerManager = ContainerManager.getInstance();

        this.wrapperEl = document.createElement("div");
        this.wrapperEl.style.position = "absolute";
        this.wrapperEl.style.display = "flex";
        this.wrapperEl.style.flexDirection = "column";
        this.wrapperEl.style.width = "100%";
        this.wrapperEl.style.height = "100%";

        this.headerEl = document.createElement("div");
        this.headerEl.className = "spa_dialog_window_header";
        this.headerEl.style.position = "relative";
        this.headerEl.style.width = "100%";
        this.headerEl.textContent = caption;

        this.headerEl.addEventListener("mousedown", this.onHeaderMouseDown.bind(this));
        this.headerEl.addEventListener("dragstart", this.onHeaderDragStart.bind(this));

        this.bodyEl = document.createElement("div");
        this.bodyEl.className = "spa_dialog_window_body";
        this.bodyEl.style.position = "relative";
        this.bodyEl.style.flexGrow = "1";
        this.bodyEl.style.flexShrink = "1";
        this.bodyEl.style.width = "100%";

        this.container = containerManager.createContainer(
            "__window" + String(DialogWindow.instanceSequence++), "", this.bodyEl);

        this.footerEl = document.createElement("div");
        this.footerEl.className = "spa_dialog_window_footer";
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
    }

    private onHeaderMouseDown(event: MouseEvent) {
        this.isDragging = true;
    }

    private onHeaderDragStart(event: MouseEvent) {
        event.preventDefault();
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
            px = Math.round((this.viewPortElement.offsetWidth - this.size.width) / 2);
            py = Math.round((this.viewPortElement.offsetHeight - this.size.height) / 2);
        }
        this.changePosition(px, py);
        this.outerFrameEl.style.display = "block";

        this.container.getActiveModule().waitForExit().then(result => {
            this.closeForWaitResolver(result);
            this.close();
        })
        
        return await this.waitForOverlayClose();
    }

    public close(): void {
        this.outerFrameEl.style.display = "none";
    }
}

export interface WindowOptions {

}