import HtmlModuleAdapter from "./html_module_adapter";
import ModuleManager from "../module/module_manager";
import OvarlayManager from "../overlay/overlay_manager";
import Overlay, { ShowOptions } from "../overlay/overlay";
import Container from "../container/container";
import RuntimeError from "../common/runtime_error";
import { Parcel, Result, ActionType } from "../common/dto";
import ContainerManager from "../container/container_manager";
import Module from "../module/module";

export default class Navigation {
    private adapter: HtmlModuleAdapter;
    private containerManager: ContainerManager = ContainerManager.getInstance();
    private overlayManager: OvarlayManager = OvarlayManager.getInstance();

    constructor(adapter: HtmlModuleAdapter) {
        this.adapter = adapter;
    }

    private getCurrentOverlay(): Overlay {
        //呼び出し元モジュールのコンテナの最上位コンテナを取得
        let i = 0; //循環時の無限ループ防止用カウンタ
        let container: Container = this.adapter.getHtmlModule().getOwnerContainer();
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
        let targetContainerId;
        let moduleName;
        const tiParts: Array<string> = targetIdentifier.split("::");

        if (tiParts.length > 1) {
            targetContainerId = tiParts[0];
            moduleName  = tiParts[1];
        } else {
            targetContainerId = this.adapter.getHtmlModule().getOwnerContainer().getId();
            moduleName = targetIdentifier;
        }

        const target: Container = ContainerManager.getInstance().getContainer(targetContainerId);
        //const module: Module = ModuleManager.getInstance().getModule(moduleName);

        return target.forward(moduleName, parcel);
    }

    public back(targetContainerId: string): void {
        let containerId;
        if (targetContainerId) {
            containerId = targetContainerId;
        } else {
            containerId = this.adapter.getHtmlModule().getOwnerContainer().getId();
        }
        this.containerManager.getContainer(containerId).back();
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