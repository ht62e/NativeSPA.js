import Overlay, { ShowOptions } from "./overlay";
import { Size } from "../common/types";
import { Parcel, Result } from "../common/dto";
import Container from "../container/container";
import OverlayManager from "./overlay_manager";
import ModuleLoader from "../module/module_loader";

export interface DrawerOptions {
    dockType?: DockType;
    dockSize?: string;
}

export enum DockType {
    Top, Right, Bottom, Left
}

export default class Drawer extends Overlay {
    protected containerEl: HTMLDivElement;
    protected onetimeSize: Size;

    protected dockType: DockType;
    protected dockSize: string;

    protected waitForOverlayCloseResolver: (value?: Result | PromiseLike<Result>) => void;

    constructor(name: string, moduleLoader: ModuleLoader, options: DrawerOptions) {
        super(name, null, moduleLoader);

        this.dockType = options.dockType !== undefined ? options.dockType: DockType.Left;
        this.dockSize = options.dockSize !== undefined ? options.dockSize: "33%";
    }

    public mount(overlayManager: OverlayManager): void {
        super.mount(overlayManager);

        this.changeDockType(this.dockType);

        let _s: HTMLDivElement;
        _s = this.containerEl = document.createElement("div");
        _s.className = "";
        _s.style.position = "relative";
        _s.style.width = "100%";
        _s.style.height = "100%";
        this.registerAsContainer("drawer", _s);

        this.contentEl.className = "itm_drawer_container";
        this.contentEl.appendChild(this.containerEl);
        this.contentEl.addEventListener("mousedown", this.onContentMouseDown.bind(this));
        
    }

    public getChildContainer(): Container {
        return this.container;
    }

    public changeDockType(dockType: DockType) {
        //サイズ変更
        if (dockType === DockType.Left || dockType === DockType.Right) {
            this.frameEl.style.width = this.dockSize;
            this.frameEl.style.height = "100%";
            
        } else if (dockType === DockType.Top || dockType === DockType.Bottom) {
            this.frameEl.style.width = "100%";
            this.frameEl.style.height = this.dockSize;
        }

        //位置変更
        this.frameEl.style.left = "";
        this.frameEl.style.right = "";
        this.frameEl.style.top = "";
        this.frameEl.style.bottom = "";
        
        if (dockType === DockType.Left || dockType === DockType.Top || dockType === DockType.Bottom) {
            //left=0パターン
            this.frameEl.style.left = "0px";
        } else {
            //right=0パターン(DockType.Right)
            this.frameEl.style.right = "0px";
        }
        if (dockType === DockType.Left || dockType === DockType.Right || dockType === DockType.Top) {
            //top=0パターン
            this.frameEl.style.top = "0px";
        } else {
            //bottom=0パターン(DockType.Bottom)
            this.frameEl.style.bottom = "0px";
        }

        //TransitionDriverクラス変更
        let dockTypeName: string;
        switch (dockType) {
            case DockType.Left: dockTypeName = "left"; break;
            case DockType.Right: dockTypeName = "right"; break;
            case DockType.Top: dockTypeName = "top"; break;
            case DockType.Bottom: dockTypeName = "bottom"; break;
        }
        this.outerFrameTransitionDriver.setCustomTransitionClasses({
            standyStateClass: "itm_drawer_" + dockTypeName + "_dock_standy_state",
            enterTransitionClass: "itm_drawer_enter_transition",
            leaveTransitionClass: "itm_drawer_leave_transition",
            endStateClass: "itm_drawer_" + dockTypeName + "_dock_end_state"
        });
    }
    
    //Override
    public changePosition(x: number, y: number): void {
        //何もしない
    }
    
    public show(parcel?: Parcel, options?: ShowOptions): Promise<Result> {
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
        this.overlayManager.cancelAutoClosingOnlyOnce();

    }
}