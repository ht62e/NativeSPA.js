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

    public async addModule(module: Module): Promise<void> {
        const moduleName = module.getName();
        if (!this.mountedModules.has(moduleName)) {
            this.mountedModules.set(moduleName, new Array<Module>());
        } 
        this.mountedModules.get(moduleName).push(module);

        await module.mount((element: HTMLDivElement): Container => {
            this.bindDomElement.appendChild(element);
            return this;
        }, this.cssTransitionOptions);
    }

    public initialize(parcel?: Parcel): void {
        this.moduleChangeHistory = new Array<Module>();
        this.hideAllModules();

        if (this.defaultModuleName) {
            this.jump(this.defaultModuleName, parcel, true);
        }
    }

    public async jump(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        this.moduleChangeHistory.length = 0;
        return await this.navigate(moduleName, parcel, withoutTransition);
    }    

    public async forward(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        //if (this.moduleChangeHistory.indexOf(moduleName) !== -1) return;

        return await this.navigate(moduleName, parcel, withoutTransition);
    }

    private async navigate(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        const module: Module = await this.prepareModule(moduleName);
        module.initialize(parcel);
        this.activateModule(module, withoutTransition);

        this.moduleChangeHistory.push(module);

        const result = await module.waitForExit();

        if (!this.inBackProcess) {
            //backメソッドではなく、モジュールの自主的な終了の場合はページを前に戻す
            this.showPreviousModule();
        }

        this.inBackProcess = false;

        return result;
    }

    // private async navigate(module: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
    //     await this.initializeModule(module, parcel);
    //     this.activateModule(module, withoutTransition);

    //     const result = await module.waitForExit();

    //     if (!this.inBackProcess) {
    //         //backメソッドではなく、モジュールの自主的な終了の場合はページを前に戻す
    //         this.showPreviousModule();
    //     }

    //     this.inBackProcess = false;

    //     return result;
    // }

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

    // protected async initializeModule(module: Module, parcel?: Parcel): Promise<boolean> {
    //     if (!this.mountedModules.has(module.getName())) {
    //         const moduleManager = ModuleManager.getInstance();
    //         await moduleManager.loadModuleRecursively(module.getName(), true);

    //         if (!this.mountedModules.has(module.getName())) {
    //             throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
    //         }

    //         console.log(module.getName() + " is lazy loaded.");
    //     }
        
    //     module.initialize(parcel);

    //     return true;
    // }

    protected async prepareModule(moduleName: string): Promise<Module> {
        let availableModule: Module = null;

        //ロード済みのモジュールを使いまわせるかどうかをチェック
        const moduleList: Array<Module> = this.mountedModules.get(moduleName);
        if (moduleList) {
            for (let i in moduleList) {
                if (this.moduleChangeHistory.indexOf(moduleList[i]) !== -1) {
                    availableModule = moduleList[i];
                    break;
                }
            }
        }

        //なかったら新たにロードする
        if (!availableModule) {
            const moduleManager = ModuleManager.getInstance();
            availableModule = await moduleManager.loadModuleRecursively(moduleName);
            if (availableModule.getOwnerContainer() !== this) {
                throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
            }

            console.log(availableModule.getName() + " is lazy loaded.");
        }

        //availableModule.initialize(parcel);

        return availableModule;
    }

    // protected getAvailableModule(moduleName: string): Module {
        
    // }

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
            //if (this.activeModule && this.activeModule !== this.defaultModule) {
            if (this.activeModule) {
                this.activeModule.hide();
            }
        }
    }

    protected hideAllModules(): void {
        // this.mountedModules.forEach((m: Module) => {
        //     m.hide();
        // });

        this.mountedModules.forEach((moduleInstances: Array<Module>) => {
            moduleInstances.forEach((module: Module) => {
                module.hide();
            })
        });
    }
}
