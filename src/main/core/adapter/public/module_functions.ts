import { ActionType, Parcel, Result } from "../../common/dto";
import HtmlModule from "../../module/html_module";
import ModuleLoader, { RegisterOptions } from "../../module/module_loader";
import OverlayManager from "../../overlay/overlay_manager";
import Overlay, { ShowOptions } from "../../overlay/overlay";
import Container from "../../container/container";
import RuntimeError from "../../common/runtime_error";
import AppModule from "../../module/app_module";
import PageContainer from "../../container/page_container";

export default class ModuleFunctions {
    private htmlModule: HtmlModule;
    private moduleLoader: ModuleLoader;
    private overlayManager: OverlayManager;

    constructor(htmlModule: HtmlModule) {
        this.moduleLoader = htmlModule.getModuleLoader();
        this.overlayManager = this.moduleLoader.getViewPort().getOverlayManager();
        this.htmlModule = htmlModule;
    }

    public $id(id: string): HTMLElement {
        return window.document.querySelector("#" + this.htmlModule.getLocalDomIdPrefix() + id);
    }

    public setCaption(caption: string) {
        this.htmlModule.setCaption(caption);
    }

    public exit(actionType: ActionType) {
        this.htmlModule.exit(actionType);
    }

    public async sendMessage(destination: string, command: string, message?: any): Promise<any> {
        const dispatcher = this.htmlModule.getModuleLoader().getMessageDispatcher();
        return dispatcher.send(destination, command, message);
    }

    public async multicastMessage(destination: string, command: string, message?: any): Promise<any> {
        const dispatcher = this.htmlModule.getModuleLoader().getMessageDispatcher();
        return dispatcher.multicast(destination, command, message);
    }

    public register(moduleName: string , sourceUri: string, targetContainerName: string, 
        isContainerDefault: boolean, options?: RegisterOptions): void {

        let containerId: string = this.htmlModule.getName() + "." + targetContainerName;
        this.htmlModule.getModuleLoader().register(moduleName, sourceUri, containerId, isContainerDefault, options);
    }

    private getCurrentOverlay(): Overlay {
        //呼び出し元モジュールのコンテナの最上位コンテナを取得
        let i = 0; //循環時の無限ループ防止用カウンタ
        let container: Container = this.htmlModule.getOwnerContainer();
        while (container.getOwner()) {
            container = container.getOwner().getOwnerContainer();
            if (i++ > 100) {
                throw new RuntimeError("コンテナの親子関係に循環が発生しています。");
            }
        }

        //最上位コンテナを保持しているオーバーレイを取得
        return this.overlayManager.findOverlayByContainer(container);
    }

    public async switch(targetIdentifier: string, parcel?: Parcel): Promise<Result> {
        let targetContainerId: string;
        let moduleName: string;
        const tiParts: Array<string> = targetIdentifier.split("::");

        if (tiParts.length > 1) {
            targetContainerId = tiParts[0];
            moduleName  = tiParts[1];
        } else {
            targetContainerId = this.htmlModule.getOwnerContainer().getId();
            moduleName = targetIdentifier;
        }
        const parts: Array<string> = targetContainerId.split(".");
        const targetModuleName: string = parts[0];
        const targetContainerName: string = parts[1];

        const baseModuleInstance: AppModule = this.moduleLoader.getModule(targetModuleName);
        const activeModuleInstance: AppModule = baseModuleInstance.getOwnerContainer().getActiveModuleInstance(targetModuleName);
        const target: Container = activeModuleInstance.getChildContainer(targetContainerName);

        return target.switch(moduleName, parcel);
    }

    public async push(targetIdentifier: string, parcel?: Parcel): Promise<Result> {
        let targetContainerId: string;
        let moduleName: string;
        const tiParts: Array<string> = targetIdentifier.split("::");

        if (tiParts.length > 1) {
            targetContainerId = tiParts[0];
            moduleName  = tiParts[1];
        } else {
            targetContainerId = this.htmlModule.getOwnerContainer().getId();
            moduleName = targetIdentifier;
        }
        const parts: Array<string> = targetContainerId.split(".");
        const targetModuleName: string = parts[0];
        const targetContainerName: string = parts[1];

        const baseModuleInstance: AppModule = this.moduleLoader.getModule(targetModuleName);
        const activeModuleInstance: AppModule = baseModuleInstance.getOwnerContainer().getActiveModuleInstance(targetModuleName);
        const target: Container = activeModuleInstance.getChildContainer(targetContainerName);

        if (target instanceof PageContainer) {
            return target.push(moduleName, parcel);
        } else {
            throw new RuntimeError("Container [" + target.getId + "] is not PageContainer.");
        }

    }



    public pop(targetContainerId: string): void {
        let containerId: string;
        if (targetContainerId) {
            containerId = targetContainerId;
        } else {
            containerId = this.htmlModule.getOwnerContainer().getId();
        }
        const parts: Array<string> = containerId.split(".");
        const targetModuleName: string = parts[0];
        const targetContainerName: string = parts[1];

        const baseModuleInstance: AppModule = this.moduleLoader.getModule(targetModuleName);
        const activeModuleInstance: AppModule = baseModuleInstance.getOwnerContainer().getActiveModuleInstance(targetModuleName);
        const target: Container = activeModuleInstance.getChildContainer(targetContainerName);

        if (target instanceof PageContainer) {
            return target.pop();
        } else {
            throw new RuntimeError("Container [" + target.getId + "] is not PageContainer.");
        }
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