import AppModule from "../module/app_module";
import { Parcel, Result } from "../common/dto";
import { CssTransitionDriverClasses } from "../common/css_transition_driver";

export default abstract class Container {
    protected id: string;
    protected bindDomElement: HTMLElement;
    protected owner: AppModule;
    protected cssTransitionOptions: CssTransitionOptions;

    protected currentModule: AppModule;
    protected moduleChangeHistory = new Array<AppModule>();
    protected defaultModuleName: string;
    protected inBackProcess: boolean = false;

    protected containerParcel: Parcel = null;
    protected containerResult: Result = null;
    
    public abstract async addModule(module: AppModule): Promise<void>;
    public abstract initialize(parcel?: Parcel): void;
    public abstract async switch(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result>;

    public abstract getActiveModuleInstance(moduleName: string): AppModule;

    constructor(id: string, bindDomElement: HTMLElement, owner: AppModule, cssTransitionOptions?: CssTransitionOptions) {
        this.id = id;
        this.bindDomElement = bindDomElement;
        this.owner = owner;
        this.cssTransitionOptions = cssTransitionOptions;
        this.bindDomElement.style.position = "relative";
        this.bindDomElement.classList.add("itm_container");
    }

    protected triggerSubContainerNavigationEvent() {
        if (this.owner) {
            this.owner.getOwnerContainer().subContainerNavigationEventHandler(this, this.currentModule);
        }
    }

    public getId(): string {
        return this.id;
    }

    public getOwner(): AppModule {
        return this.owner;
    }

    public getCurrentModule(): AppModule {
        return this.currentModule;
    }

    public setDefaultModule(moduleName: string): void {
        this.defaultModuleName = moduleName;
    }

    public getContainerResult(): Result {
        return this.containerResult;
    }

    public setContainerResult(result: Result) {
        this.containerResult = result;
    }

    public getModuleChangeHistory() {
        return this.moduleChangeHistory;
    }

    public onShow(): void {

    }

    public onResize(): void {
        // this.mountedModules.forEach((module: Module) => {
        //     module.dispatchResizeEvent();
        // });
        // this.mountedModules.forEach((moduleInstances: Array<Module>) => {
        //     moduleInstances.forEach((module: Module) => {
        //         module.dispatchResizeEvent();
        //     })
        // });
    }

    public subContainerNavigationEventHandler(container: Container, module: AppModule) {
        if (!this.currentModule) return;
        
        const info: ContainerNavigationInfo = {
            moduleName: module.getName(),
            caption: module.getCaption()
        };
        const histories = new Array<ContainerNavigationInfo>();
        const moduleHistories: Array<AppModule> = container.getModuleChangeHistory();
        moduleHistories.forEach((m: AppModule) => {
            histories.push({
                moduleName: m.getName(),
                caption: m.getCaption()
            });
        });

        const allowBubbling = this.currentModule.subContainerNavigationEventHandler(
                                container.getId(), info, histories)    
        if (allowBubbling !== false) {
            this.triggerSubContainerNavigationEvent();
        }
    }

    
}

export interface ContainerInfo {
    name: string;
    type: string;
    container: Container;
}

export interface CssTransitionOptions {
    enableCssTransition: boolean,
    cssTransitionDriverClasses?: CssTransitionDriverClasses
}

export interface ContainerNavigationInfo {
    moduleName: string;
    caption: string;

}