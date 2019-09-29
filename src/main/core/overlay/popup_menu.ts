import Overlay, { ShowOptions } from "./overlay";
import { Size } from "../common/types";
import ContainerManager from "../container/container_manager";
import { Parcel, Result } from "../common/dto";
import Container from "../container/container";
import Common from "../common/common";
import OvarlayManager from "./overlay_manager";

export interface PopupMenuOptions {
    size?: Size;
}

export default class PopupMenu extends Overlay {
    private static instanceSequence = 0;

    protected bodyEl: HTMLDivElement;
    protected onetimeSize: Size;

    protected container: Container;

    protected waitForOverlayCloseResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(viewPortElement: HTMLElement, name: string, options: PopupMenuOptions) {
        super(viewPortElement, name, options ? options.size : null, false);

        const containerManager = ContainerManager.getInstance();

        this.bodyEl = document.createElement("div");
        this.bodyEl.className = "";
        this.bodyEl.style.position = "relative";
        this.bodyEl.style.width = "100%";
        this.bodyEl.style.height = "100%";

        this.container = containerManager.createContainer(
            "__popupmenu_" + String(PopupMenu.instanceSequence++), "", this.bodyEl);

        this.contentEl.appendChild(this.bodyEl);
        this.contentEl.addEventListener("mousedown", this.onContentMouseDown.bind(this));
    }

    public getContainer(): Container {
        return this.container;
    }
    
    
    public show(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        let x: number, y: number;

        x = Common.currentMouseClientX;
        y = Common.currentMouseClientY;

        const overlayRightSideX: number = x + this.size.width;
        const overlayBottomSideY: number = y + this.size.height;

        const visibleAreaWidth: number = window.document.documentElement.clientWidth;
        const visibleAreaHeight: number = window.document.documentElement.clientHeight;

        const xVisibleAreaIsLargerThanOverlay: boolean = this.size.width < visibleAreaWidth;
        const yVisibleAreaIsLargerThanOverlay: boolean = this.size.height < visibleAreaHeight;

        const xCanDisplayOnNormalPosition: boolean = overlayRightSideX <= visibleAreaWidth;
        const yCanDisplayOnNormalPosition: boolean = overlayBottomSideY <= visibleAreaHeight;

        const xCanDisplayOnReversePosition: boolean = x >= this.size.width;
        const yCanDisplayOnReversePosition: boolean = y >= this.size.height;

        this.restoreOriginalSize();

        //x方向
        if (xVisibleAreaIsLargerThanOverlay) {
            if (xCanDisplayOnNormalPosition) {
                //指定された位置をそのまま左上座標にする
            } else if (xCanDisplayOnReversePosition) {
                x -= this.size.width;
            } else {
                //右端に寄せる
                x = visibleAreaWidth - this.size.width;
            }
        } else {
            x = 0; //入りきらない場合でも横方向は縮小せずに左端に寄せるだけにする
        }

        //y方向
        if (yVisibleAreaIsLargerThanOverlay) {
            if (yCanDisplayOnNormalPosition) {
                //指定された位置をそのまま左上座標にする
            } else if (yCanDisplayOnReversePosition) {
                y -= this.size.height;
            } else {
                //下端に寄せる
                y = visibleAreaHeight - this.size.height;
            }
        } else {
            //入りきらない場合は上端に寄せたのち、入りきらない分を一時的に縮小する
            y = 0;
            this.resize(this.size.width, visibleAreaHeight);
        }

        this.changePosition(x, y);

        this.container.initialize(parcel);
        this.outerFrameTransitionDriver.show();
  
        return this.waitForOverlayClose();
    }

    public showAsModal(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return this.show(parcel, options);
    }

    public close(result?: Result): void {
        this.outerFrameTransitionDriver.hide();
        //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
        window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
    }

    protected waitForOverlayClose(): Promise<Result> {
        return new Promise(resolve => {
            this.waitForOverlayCloseResolver = resolve;
        });
    }

    protected onContentMouseDown(event: MouseEvent) {
        const overlayManager = OvarlayManager.getInstance();
        overlayManager.cancelAutoClosingOnlyOnce();

    }
}