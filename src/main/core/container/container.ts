import Module from "../module/module";
import { Parcel, Result } from "../common/dto";
import { CssTransitionDriverClasses } from "../common/css_transition_driver";

export default abstract class Container {
    protected id: string;
    protected bindDomElement: HTMLDivElement;
    protected parent: Container;
    protected cssTransitionOptions: CssTransitionOptions;

    protected activeModule: Module;
    protected mountedModules = new Map<string, Module>();
    protected moduleChangeHistory = new Array<Module>();
    protected defaultModule: Module;
    protected inBackProcess: boolean = false;

    protected containerParcel: Parcel = null;
    protected containerResult: Result = null;
    
    public abstract async addModule(module: Module): Promise<boolean>;
    public abstract initialize(parcel?: Parcel): void;
    public abstract async activateModule(module: Module, parcel?: Parcel): Promise<boolean>;
    public abstract async forward(module: Module, parcel?: Parcel): Promise<Result>;
    public abstract back(): void;

    protected abstract showPreviousModule(): void;

    constructor(id: string, bindDomElement: HTMLDivElement, parent: Container, cssTransitionOptions?: CssTransitionOptions) {
        this.id = id;
        this.bindDomElement = bindDomElement;
        this.parent = parent;
        this.cssTransitionOptions = cssTransitionOptions;
        this.bindDomElement.style.position = "relative";
        this.bindDomElement.classList.add("itm_container");
    }

    public getId(): string {
        return this.id;
    }

    public getElement(): HTMLDivElement {
        return this.bindDomElement;
    }

    public getParent(): Container {
        return this.parent;
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

    public onShow(): void {

    }

    public onResize(): void {
        this.mountedModules.forEach((module: Module) => {
            module.dispatchResizeEvent();
        });
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