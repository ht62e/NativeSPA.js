import Module from "../module/module";
import { Parcel, Result } from "../common/dto";
import { CssTransitionDriverClasses } from "../common/css_transition_driver";

export default abstract class Container {
    protected id: string;
    protected bindDomElement: HTMLDivElement;
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
    public abstract activateModule(module: Module, parcel?: Parcel): void;
    public abstract async forward(module: Module, parcel?: Parcel): Promise<Result>;
    public abstract back(): void;

    protected abstract showPreviousModule(): void;

    constructor(id: string, bindDomElement: HTMLDivElement, cssTransitionOptions?: CssTransitionOptions) {
        this.id = id;
        this.bindDomElement = bindDomElement;
        this.cssTransitionOptions = cssTransitionOptions;
        this.bindDomElement.style.position = "relative";
        this.bindDomElement.classList.add("fvst_container");
    }

    public getId(): string {
        return this.id;
    }

    public getElement(): HTMLDivElement {
        return this.bindDomElement;
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
            module.dispachResizeEvent();
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