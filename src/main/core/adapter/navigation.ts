import HtmlModuleAdapter from "./html_module_adapter";
import ModuleRouter from "../module/module_router";
import ModuleManager from "../module/module_manager";
import OvarlayManager from "../overlay/overlay_manager";
import Overlay, { ShowOptions } from "../overlay/overlay";
import Container from "../container/container";
import RuntimeError from "../common/runtime_error";
import { Parcel, Result, ActionType } from "../common/dto";

export default class Navigation {
    private adapter: HtmlModuleAdapter;
    private moduleRouter: ModuleRouter = ModuleRouter.getInstance();
    private moduleManager: ModuleManager = ModuleManager.getInstance();
    private overlayManager: OvarlayManager = OvarlayManager.getInstance();

    constructor(adapter: HtmlModuleAdapter) {
        this.adapter = adapter;
    }

    private getCurrentOverlay(): Overlay {
        //呼び出し元モジュールのコンテナの最上位コンテナを取得
        let i = 0; //循環時の無限ループ防止用カウンタ
        let container: Container = this.adapter.getHtmlComponent().getOwnerContainer();
        while (container.getOwner()) {
            container = container.getOwner().getOwnerContainer();
            if (i++ > 100) {
                throw new RuntimeError("コンテナの親子関係に循環が発生しています。");
            }
        }

        //最上位コンテナを保持しているオーバーレイを取得
        return this.overlayManager.findOverlayByContainer(container);
    }

    public async forward(targetIdentifier: string, parcel?: Parcel): Promise<Result> {
        let finalTargetId;
        if (targetIdentifier.split("::").length > 1) {
            finalTargetId = targetIdentifier;
        } else {
            finalTargetId = 
                this.adapter.getHtmlComponent().
                getOwnerContainer().getId() + "::" + targetIdentifier;
        }
        return this.moduleRouter.forward(finalTargetId, parcel);
    }

    public startExitProcess(actionType: ActionType) {
        this.adapter.getHtmlComponent().exit(actionType);
    }

    public async showWindow(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return await this.overlayManager.show(overlayName, parcel, options);
    }

    public async showWindowAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return await this.overlayManager.showAsModal(overlayName, parcel, options);
    }

    public async showContextMenu(overlayName: string, parcel?: Parcel, targetElement?: HTMLElement): Promise<Result> {
        let showOptions: ShowOptions = {
            parent: this.getCurrentOverlay()
        };
        if (targetElement) {
            const {left, bottom} = targetElement.getBoundingClientRect();
            showOptions.position = {x: left, y: bottom};
            return await this.overlayManager.show(overlayName, parcel, showOptions);
        } else {
            return await this.overlayManager.show(overlayName, parcel, showOptions);
        }
    }

    public async showDrawer(overlayName: string, parcel?: Parcel): Promise<Result> {
        return await this.overlayManager.showAsModal(overlayName, parcel);
    }

}