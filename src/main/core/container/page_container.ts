import Container, { CssTransitionOptions } from "./container";
import Module from "../module/module";
import RuntimeError from "../common/runtime_error";
import { Parcel, Result, ActionType } from "../common/dto";
import ModuleManager from "../module/module_manager";

export default class PageContainer extends Container {

    constructor(id: string, bindDomElement: HTMLDivElement, owner: Module, cssTransitionOptions?: CssTransitionOptions) {
        super(id, bindDomElement, owner, cssTransitionOptions);
        bindDomElement.classList.add("itm_page_container");
    }

    public async addModule(module: Module): Promise<boolean> {       
        this.mountedModules.set(module.getName(), module);

        await module.mount((element: HTMLDivElement): Container => {
            this.bindDomElement.appendChild(element);
            return this;
        }, this.cssTransitionOptions);

        return true;
    }

    public initialize(parcel?: Parcel): void {
        this.moduleChangeHistory = new Array<Module>();
        this.hideAllModules();

        if (this.defaultModule) {
            this.forward(this.defaultModule, parcel, true);
        }
    }

    public async forward(module: Module, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        if (this.moduleChangeHistory.indexOf(module) !== -1) return;
        this.moduleChangeHistory.push(module);

        await this.initializeModule(module, parcel);
        this.activateModule(module, withoutTransition);

        const result = await module.waitForExit();

        if (!this.inBackProcess) {
            //backメソッドではなく、モジュールの自主的な終了の場合はページを前に戻す
            this.showPreviousModule();
        }

        this.inBackProcess = false;

        return result;
    }

    public back(): void {
        this.inBackProcess = true;
        this.activeModule.exit(ActionType.BACK).then(exited => {
            if (exited) {
                this.showPreviousModule();
            } else {
                this.inBackProcess = false;
            }
        });
    }

    protected async initializeModule(module: Module, parcel?: Parcel): Promise<boolean> {
        if (!this.mountedModules.has(module.getName())) {
            const moduleManager = ModuleManager.getInstance();
            await moduleManager.loadModuleRecursively(module.getName(), true);

            if (!this.mountedModules.has(module.getName())) {
                throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
            }

            console.log(module.getName() + " is lazy loaded.");
        }
        
        module.initialize(parcel);

        return true;
    }

    protected activateModule(module: Module, withoutTransition?: boolean) {
        if (this.activeModule) {
            this.activeModule.hide();
        }
        this.activeModule = module;
        module.show(withoutTransition);
        this.triggerSubContainerNavigationEvent();
    }

    protected showPreviousModule(): void {
        if (this.moduleChangeHistory.length > 0) {
            this.moduleChangeHistory.pop();
        }
        if (this.moduleChangeHistory.length > 0) {
            this.activateModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
        } else {
            if (this.activeModule && this.activeModule !== this.defaultModule) {
                this.activeModule.hide();
            }
        }
    }

    protected hideAllModules(): void {
        this.mountedModules.forEach((m: Module) => {
            m.hide();
        });        
    }
}
