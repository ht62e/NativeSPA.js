import Module from "./module";
import RuntimeError from "./runtime_error";
import ResultDto from "./result_dto";
import ForwardDto from "./forward_dto";

export default class Container {
    private activeModule: Module;
    private mountedModules: Map<string, Module> = new Map<string, Module>();
    private moduleChangeHistory = new Array<Module>();

    constructor(private id: string, private bindDomElement: HTMLDivElement) {
    }

    public getId(): string {
        return this.id;
    }

    public async addModule(module: Module): Promise<boolean> {
        await module.mount(this);
        this.mountedModules.set(module.getName(), module);

        return true;
    }

    public addModuleElement(element: HTMLDivElement) {
        this.bindDomElement.appendChild(element);
    }

    public getElement(): HTMLDivElement {
        return this.bindDomElement;
    }

    public changeActiveModule(module: Module): void {
        if (!this.mountedModules.has(module.getName())) throw new RuntimeError("指定されたモジュールはマウントされていません。");
        this.mountedModules.forEach((eachModule: Module) => {
            if (eachModule === module) {
                eachModule.show();
                this.activeModule = eachModule;
            } else {
                eachModule.hide();
            }
        })
    }

    public hideModule(): void {
        this.activeModule.hide();
    }

    public onResize(): void {
        const containerWidth = this.bindDomElement.clientWidth;
        const containerHeight = this.bindDomElement.clientHeight;
        
        this.mountedModules.forEach((module: Module) => {
            module.onResize(containerWidth, containerHeight);
        })
    }

    public async forward(module: Module, params?: ForwardDto, callback?: (moduleDto: ResultDto) => void): Promise<ResultDto> {
        module.initialize(null);

        this.changeActiveModule(module);
        this.moduleChangeHistory.push(module);

        const result: ResultDto = await module.waitForClose();

        if (callback) {
            //for ES5
            callback(result);
        } else {
            return result;
        }
        
    }

    public back(): void {
        this.activeModule.closeRequest().then(closed => {
            if (this.moduleChangeHistory.length > 0) {
                this.moduleChangeHistory.pop();
            }
            if (this.moduleChangeHistory.length > 0) {
                this.changeActiveModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
            } else {
                this.hideModule();
            }
        })
    }

    public backWithoutConfirmation(): void {
        if (this.moduleChangeHistory.length > 0) {
            this.moduleChangeHistory.pop();
        }
        if (this.moduleChangeHistory.length > 0) {
            this.changeActiveModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
        } else {
            this.hideModule();
        }
    }
}

export interface ContainerInfo {
    name: string;
    container: Container;
}