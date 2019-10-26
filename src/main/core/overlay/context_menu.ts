import Overlay, { ShowOptions } from "./overlay";
import { Size, CssSize } from "../common/types";
import { Parcel, Result } from "../common/dto";
import Container from "../container/container";
import Common from "../common/common";
import OvarlayManager from "./overlay_manager";

export interface ContextMenuOptions {
    size?: CssSize;
}

export default class ContextMenu extends Overlay {
    protected containerEl: HTMLDivElement;
    protected onetimeSize: Size;

    protected waitForOverlayCloseResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(viewPortElement: HTMLElement, name: string, options: ContextMenuOptions) {
        super(viewPortElement, name, options ? options.size : null);

        this.containerEl = document.createElement("div");
        this.containerEl.className = "";
        this.containerEl.style.position = "relative";
        this.containerEl.style.width = "100%";
        this.containerEl.style.height = "100%";

        this.registerAsContainer("contextmenu", this.containerEl);

        this.contentEl.className = "itm_context_menu_container";
        this.contentEl.appendChild(this.containerEl);
        this.contentEl.addEventListener("mousedown", this.onContentMouseDown.bind(this));

        this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "itm_context_menu_standy_state",
            enterTransitionClass: "itm_context_menu_enter_transition",
            leaveTransitionClass: "itm_context_menu_leave_transition",
            endStateClass: "itm_context_menu_end_state"
        });
    }

    public getContainer(): Container {
        return this.container;
    }
    
    
    public show(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        let x: number, y: number;

        x = Common.currentMouseClientX;
        y = Common.currentMouseClientY;
        const widthPx = this.offsetSizeCache.width;
        const heightPx = this.offsetSizeCache.height;

        const overlayRightSideX: number = x + widthPx;
        const overlayBottomSideY: number = y + heightPx;

        const visibleAreaWidth: number = window.document.documentElement.clientWidth;
        const visibleAreaHeight: number = window.document.documentElement.clientHeight;

        const xVisibleAreaIsLargerThanOverlay: boolean = widthPx < visibleAreaWidth;
        const yVisibleAreaIsLargerThanOverlay: boolean = heightPx < visibleAreaHeight;

        const xCanDisplayOnNormalPosition: boolean = overlayRightSideX <= visibleAreaWidth;
        const yCanDisplayOnNormalPosition: boolean = overlayBottomSideY <= visibleAreaHeight;

        const xCanDisplayOnReversePosition: boolean = x >= widthPx;
        const yCanDisplayOnReversePosition: boolean = y >= heightPx;

        this.restoreOriginalSize();

        //x方向
        if (xVisibleAreaIsLargerThanOverlay) {
            if (xCanDisplayOnNormalPosition) {
                //指定された位置をそのまま左上座標にする
            } else if (xCanDisplayOnReversePosition) {
                x -= widthPx;
            } else {
                //右端に寄せる
                x = visibleAreaWidth - widthPx;
            }
        } else {
            x = 0; //入りきらない場合でも横方向は縮小せずに左端に寄せるだけにする
        }

        //y方向
        if (yVisibleAreaIsLargerThanOverlay) {
            if (yCanDisplayOnNormalPosition) {
                //指定された位置をそのまま左上座標にする
            } else if (yCanDisplayOnReversePosition) {
                y -= heightPx;
            } else {
                //下端に寄せる
                y = visibleAreaHeight - heightPx;
            }
        } else {
            //入りきらない場合は上端に寄せたのち、入りきらない分を一時的に縮小する
            y = 0;
            this.resize(widthPx + "px", visibleAreaHeight + "px");
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