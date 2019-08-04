import Container from "./container";
import Overlay from "./overlay";
import ContainerManager from "./container_manager";

export default class DialogWindow extends Overlay {
    private static instanceSequence = 0;

    protected wrapperEl: HTMLDivElement;
    protected headerEl: HTMLDivElement;
    protected bodyEl: HTMLDivElement;
    protected footerEl: HTMLDivElement;

    protected isDragging: boolean = false;

    protected container: Container;

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

    public show(x?: number, y?: number): void {
        if (x !== undefined && y !== undefined) {
            this.changePosition(x, y);
        }
        this.outerFrameEl.style.display = "block";
    }
    public hide(): void {
        this.outerFrameEl.style.display = "none";
    }
}

export interface WindowOptions {

}