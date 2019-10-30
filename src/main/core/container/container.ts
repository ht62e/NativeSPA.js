import Module from "../module/module";
import { Parcel, Result } from "../common/dto";
import { CssTransitionDriverClasses } from "../common/css_transition_driver";

export default abstract class Container {
    protected id: string;
    protected bindDomElement: HTMLDivElement;
    protected owner: Module;
    protected cssTransitionOptions: CssTransitionOptions;

    protected activeModule: Module;
    //protected mountedModules = new Map<string, Module>();
    protected mountedModules = new Map<string, Array<Module>>();
    protected moduleChangeHistory = new Array<Module>();
    protected defaultModule: Module;
    protected inBackProcess: boolean = false;

    protected containerParcel: Parcel = null;
    protected containerResult: Result = null;
    
    public abstract async addModule(module: Module): Promise<boolean>;
    public abstract initialize(parcel?: Parcel): void;
    public abstract async forward(module: Module, parcel?: Parcel): Promise<Result>;
    public abstract back(): void;

    protected abstract showPreviousModule(): void;

    constructor(id: string, bindDomElement: HTMLDivElement, owner: Module, cssTransitionOptions?: CssTransitionOptions) {
        this.id = id;
        this.bindDomElement = bindDomElement;
        this.owner = owner;
        this.cssTransitionOptions = cssTransitionOptions;
        this.bindDomElement.style.position = "relative";
        this.bindDomElement.classList.add("itm_container");
    }

    protected triggerSubContainerNavigationEvent() {
        if (this.owner) {
            this.owner.getOwnerContainer().subContainerNavigationEventHandler(this, this.activeModule);
        }
    }

    public getId(): string {
        return this.id;
    }

    public getElement(): HTMLDivElement {
        return this.bindDomElement;
    }

    // public getParent(): Container {
    //     return this.parent;
    // }

    public getOwner(): Module {
        return this.owner;
    }

    public getActiveModule(): Module {
        return this.activeModule;
    }

    public setDefaultModule(module: Module): void {
        this.defaultModule = module;
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
        this.mountedModules.forEach((moduleInstances: Array<Module>) => {
            moduleInstances.forEach((module: Module) => {
                module.dispatchResizeEvent();
            })
        });
    }

    public subContainerNavigationEventHandler(container: Container, module: Module) {
        if (!this.activeModule) return;
        
        const info: ContainerNavigationInfo = {
            moduleName: module.getName(),
            caption: module.getCaption()
        };
        const histories = new Array<ContainerNavigationInfo>();
        const moduleHistories: Array<Module> = container.getModuleChangeHistory();
        moduleHistories.forEach((m: Module) => {
            histories.push({
                moduleName: m.getName(),
                caption: m.getCaption()
            });
        });

        const allowBubbling = this.activeModule.subContainerNavigationEventHandler(
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