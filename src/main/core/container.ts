import Module from "./module";
import RuntimeError from "./runtime_error";

export default class Container {
    private activeModule: Module;
    private mountedModules: Map<string, Module> = new Map<string, Module>();

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

    public onResize(): void {
        const containerWidth = this.bindDomElement.clientWidth;
        const containerHeight = this.bindDomElement.clientHeight;
        
        this.mountedModules.forEach((module: Module) => {
            module.onResize(containerWidth, containerHeight);
        })
    }
}

export interface ContainerInfo {
    name: string;
    container: Container;
}