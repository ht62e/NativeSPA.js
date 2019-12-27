import Container, { CssTransitionOptions } from "./container";
import AppModule, { MountOption } from "../module/app_module";
import RuntimeError from "../common/runtime_error";
import { Parcel, Result, ActionType } from "../common/dto";

export default class PageContainer extends Container {
    protected mountedModules = new Map<string, Array<AppModule>>();

    constructor(id: string, bindDomElement: HTMLElement, owner: AppModule, cssTransitionOptions?: CssTransitionOptions) {
        super(id, bindDomElement, owner, cssTransitionOptions);
        bindDomElement.classList.add("itm_page_container");
    }

    public async addModule(module: AppModule): Promise<void> {
        const moduleName = module.getName();
        if (!this.mountedModules.has(moduleName)) {
            this.mountedModules.set(moduleName, new Array<AppModule>());
        } 
        this.mountedModules.get(moduleName).push(module);

        await module.mount((element: HTMLDivElement, option?: MountOption): Container => {
            this.bindDomElement.appendChild(element);
            return this;
        }, this.cssTransitionOptions);
    }

    public initialize(parcel?: Parcel): void {
        this.moduleChangeHistory = new Array<AppModule>();
        this.hideAllModules();

        if (this.defaultModuleName) {
            this.switch(this.defaultModuleName, parcel, true);
        }
    }

    public async switch(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        this.moduleChangeHistory.length = 0;
        return await this.navigate(moduleName, parcel, withoutTransition);
    }    

    public async push(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        //if (this.moduleChangeHistory.indexOf(moduleName) !== -1) return;

        return await this.navigate(moduleName, parcel, withoutTransition);
    }

    private async navigate(moduleName: string, parcel?: Parcel, withoutTransition?: boolean): Promise<Result> {
        const module: AppModule = await this.prepareModule(moduleName);
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

    public pop(): void {
        this.inBackProcess = true;
        this.currentModule.exit(ActionType.BACK).then(exited => {
            if (exited) {
                this.showPreviousModule();
            } else {
                this.inBackProcess = false;
            }
        });
    }

    protected async prepareModule(moduleName: string): Promise<AppModule> {
        let availableModule: AppModule = null;

        //ロード済みのモジュールを使いまわせるかどうかをチェック
        const moduleInstances: Array<AppModule> = this.mountedModules.get(moduleName);
        if (moduleInstances) {
            for (let i in moduleInstances) {
                if (this.moduleChangeHistory.indexOf(moduleInstances[i]) === -1) {
                    availableModule = moduleInstances[i];
                    break;
                }
            }
        }

        //なかったら新たにロードする
        if (!availableModule) {
            const moduleLoader = this.owner.getModuleLoader();
            availableModule = await moduleLoader.loadModuleRecursively(moduleName, this.owner);
            if (availableModule.getOwnerContainer() !== this) {
                throw new RuntimeError("指定されたモジュールはコンテナに登録されていません。");
            }

            console.log(availableModule.getName() + " is lazy loaded.");
        }

        return availableModule;
    }

    protected activateModule(module: AppModule, withoutTransition?: boolean) {
        if (this.currentModule) {
            this.currentModule.hide();
        }
        this.currentModule = module;
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
            if (this.currentModule && this.currentModule.getName() !== this.defaultModuleName) {
                //defaultModuleの時に閉じないのはOverlay保持のコンテナの場合でOverlayのCloseアニメーションとの二重アニメーションを防ぐため
                this.currentModule.hide();
            }
        }
    }

    protected hideAllModules(): void {
        this.mountedModules.forEach((moduleInstances: Array<AppModule>) => {
            moduleInstances.forEach((module: AppModule) => {
                module.hide();
            })
        });
    }

    public getActiveModuleInstance(moduleName: string): AppModule {
        let lastInstance: AppModule = null;
        this.moduleChangeHistory.forEach((module: AppModule) => {
            if (module.getName() === moduleName) {
                lastInstance = module;
            }
        });
        return lastInstance;
    }
}
