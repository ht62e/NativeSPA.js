import Container, { CssTransitionOptions } from "./container";
import AppModule, { MountOption } from "../module/app_module";
import RuntimeError from "../common/runtime_error";
import { Parcel, Result } from "../common/dto";

export default class FlatContainer extends Container {
    protected mountedModules = new Map<string, AppModule>();
    protected scrollBoxElement: HTMLDivElement;
    protected moduleOrders = new Map<string, number>();

    protected specifiedOrderModules = new Map<string, number>();
    protected notSpecifiedOrderModules = new Array<string>();

    protected initialParcel: Parcel;

    constructor(id: string, bindDomElement: HTMLElement, owner: AppModule, cssTransitionOptions?: CssTransitionOptions) {
        super(id, bindDomElement, owner, cssTransitionOptions);

        this.scrollBoxElement = document.createElement("div");

        this.scrollBoxElement.style.position = "absolute";
        this.scrollBoxElement.style.overflow = "hidden";
        this.scrollBoxElement.style.width = "100%";
        this.scrollBoxElement.style.height = "100%";

        this.scrollBoxElement.className = "itm_flat_container_transition";

        bindDomElement.classList.add("itm_flat_container");
        bindDomElement.appendChild(this.scrollBoxElement);
    }

    //Override
    public onShow(): void {

    }

    public async addModule(module: AppModule): Promise<void> {
        this.mountedModules.set(module.getName(), module);

        await module.mount((element: HTMLDivElement, option?: MountOption): Container => {
            this.scrollBoxElement.appendChild(element);

            if (option && !isNaN(option.order)) {
                this.specifiedOrderModules.set(module.getName(), option.order);
            } else {
                this.notSpecifiedOrderModules.push(module.getName());
            }

            return this;
        });

        this.updateAllModulePositionAndSize();
    }

    public initialize(parcel?: Parcel): void {
        this.initialParcel = parcel;
        this.mountedModules.forEach((m: AppModule) => {
            m.initialize(parcel);
            m.show(true);
        });

        if (this.defaultModuleName) {
            this.switch(this.defaultModuleName, parcel);
        }
    }

    public async activateModule(module: AppModule): Promise<boolean> {
        if (!this.mountedModules.has(module.getName())) {
            throw new RuntimeError("マウントされていないモジュールです。");
        }
        const leftIndex = this.moduleOrders.get(module.getName());
        const transX = Math.round(10000 / this.mountedModules.size * leftIndex) / 100;
        this.scrollBoxElement.style.transform = "translate(-" + String(transX) + "%)";

        this.currentModule = module;

        this.triggerSubContainerNavigationEvent();

        return true;
    }

    public async switch(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        const module: AppModule = await this.prepareModule(moduleName);
        if (parcel) {
            module.initialize(parcel);
        }
        this.activateModule(module);
        return null;
    }

    protected async prepareModule(moduleName: string): Promise<AppModule> {
        let availableModule: AppModule = this.mountedModules.get(moduleName);

        if (!availableModule) {
            const moduleLoader = this.owner.getModuleLoader();
            availableModule = await moduleLoader.loadModuleRecursively(moduleName, this.owner);
            if (availableModule.getOwnerContainer() !== this) {
                throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
            }
            availableModule.initialize(this.initialParcel);
            availableModule.show(true);

            console.log(availableModule.getName() + " is lazy loaded.");
        }

        return availableModule;
    }

    public getActiveModuleInstance(moduleName: string): AppModule {
        return this.mountedModules.get(moduleName);
    }

    protected calcModuleOrders(): void {
        const tempOrders = this.notSpecifiedOrderModules.slice();
        this.specifiedOrderModules.forEach((order: number, moduleName: string) => {
            tempOrders.splice(order, 0, moduleName);
        });
        this.moduleOrders.clear();
        tempOrders.forEach((moduleName: string, index: number) => {
            this.moduleOrders.set(moduleName, index);
        });
    }
    
    protected updateAllModulePositionAndSize() {
        this.calcModuleOrders();
        this.scrollBoxElement.style.width = "calc(100% * " + this.mountedModules.size + ")";
        const leftValueCommon = "calc(100% / " + this.mountedModules.size + " * ";
        const widthValue = String(Math.round(1.0 / this.mountedModules.size * 10000) / 100) + "%";
        this.mountedModules.forEach((m: AppModule) => {
            const order = this.moduleOrders.get(m.getName());
            const leftValue = leftValueCommon + order + ")";
            m.changeModuleCssPosition(leftValue, "0px");
            m.changeModuleCssSize(widthValue, "100%");
        });        
    }

}