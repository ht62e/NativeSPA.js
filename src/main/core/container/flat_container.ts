import Container from "./container";
import Module from "../module/module";
import RuntimeError from "../runtime_error";
import { Parcel, Result } from "../dto";

export default class FlatContainer extends Container {
    protected scrollBoxElement: HTMLDivElement;
    protected moduleOrders = new Map<string, number>();

    constructor(protected id: string, protected bindDomElement: HTMLDivElement) {
        super(id, bindDomElement);

        this.scrollBoxElement = document.createElement("div");

        this.scrollBoxElement.style.position = "absolute";
        this.scrollBoxElement.style.overflow = "hidden";
        this.scrollBoxElement.style.width = "100%";
        this.scrollBoxElement.style.height = "100%";

        this.scrollBoxElement.style.transitionProperty = "transform";
        this.scrollBoxElement.style.transitionDuration = "200ms";
        this.scrollBoxElement.style.transitionTimingFunction = "ease";

        bindDomElement.appendChild(this.scrollBoxElement);
    }

    //Override
    public onShow(): void {

    }

    public async addModule(module: Module): Promise<boolean> {
        this.mountedModules.set(module.getName(), module);
        this.moduleOrders.set(module.getName(), this.mountedModules.size - 1);
        await module.mount(this.elementAttachHandler.bind(this));
        return true;
    }

    public initialize(parcel?: Parcel): void {
        this.updateAllModulePositionAndSize();
        this.mountedModules.forEach((m: Module) => {
            m.initialize(parcel);
            m.show();
        });
    }

    public activateModule(module: Module, parcel?: Parcel): void {
        if (!this.mountedModules.has(module.getName())) {
            throw new RuntimeError("マウントされていないモジュールです。");
        }
        const leftIndex = this.moduleOrders.get(module.getName());
        if (true) {
            //IE11以外
            this.scrollBoxElement.style.transform = "translate(calc(-100% / " + this.mountedModules.size + " * " + leftIndex + "))";
        } else {
            //IE11（transformでcalcが使えない）

        }
    }

    public async forward(module: Module, parcel?: Parcel): Promise<Result> {
        this.activateModule(module, parcel);
        return null;
    }
    
    //TODO デリゲート的な方法ではなく、addModule内の匿名関数に変更したい
    protected elementAttachHandler(element: HTMLDivElement, ownerModuleName: string): Container {
        this.scrollBoxElement.appendChild(element);        
        this.scrollBoxElement.style.width = "calc(100% * " + this.mountedModules.size + ")";

        return this;
    }

    protected updateAllModulePositionAndSize() {
        const leftValueCommon = "calc(100% / " + this.mountedModules.size + " * "; //+ leftIndex + ")";
        const widthValue = String(Math.round(1.0 / this.mountedModules.size * 10000) / 100) + "%";
        this.mountedModules.forEach((m: Module) => {
            const order = this.moduleOrders.get(m.getName());
            const leftValue = leftValueCommon + order + ")";
            m.changeModuleCssPosition(leftValue, "0px");
            m.changeModuleCssSize(widthValue, "100%");
        });        
    }

    protected showPreviousModule(): void {
        throw new Error("Method not implemented.");
    }


}