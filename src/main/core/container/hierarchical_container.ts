import Container from "./container";
import Module from "../module/module";
import RuntimeError from "../runtime_error";
import { Parcel, Result } from "../dto";

export default class HierarchicalContainer extends Container {
    constructor(protected id: string, protected bindDomElement: HTMLDivElement) {
        super(id, bindDomElement);

    }

    public async addModule(module: Module): Promise<boolean> {
        await module.mount(this.elementAttachHandler.bind(this));
        this.mountedModules.set(module.getName(), module);
        return true;
    }

    public initialize(parcel?: Parcel): void {
        if (this.defaultModule) {
            this.forward(this.defaultModule, parcel);
        }
    }

    public async forward(module: Module, parcel?: Parcel): Promise<Result> {
        if (this.moduleChangeHistory.indexOf(module) !== -1) return;
        this.moduleChangeHistory.push(module);

        this.activateModule(module, parcel);        

        const result = await module.waitForExit();

        if (!this.inBackProcess) {
            //backメソッドではなく、モジュールの自主的な終了の場合はページを前に戻す
            this.showPreviousModule();
        }

        this.inBackProcess = false;

        return result;
    }

    protected elementAttachHandler(element: HTMLDivElement, ownerModuleName: string): Container {
        this.bindDomElement.appendChild(element);
        return this;
    }

    public activateModule(module: Module, parcel?: Parcel): void {
        if (!this.mountedModules.has(module.getName())) throw new RuntimeError("指定されたモジュールはマウントされていません。");
        
        this.mountedModules.forEach((m: Module) => {
            if (m === module) {
                m.initialize(parcel);
                m.show();
                this.activeModule = m;
            } else {
                m.hide();
            }
        });
    }

    protected showPreviousModule(): void {
        if (this.moduleChangeHistory.length > 0) {
            this.moduleChangeHistory.pop();
        }
        if (this.moduleChangeHistory.length > 0) {
            this.activateModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
        } else {
            this.activeModule.hide();
        }
    }
}
