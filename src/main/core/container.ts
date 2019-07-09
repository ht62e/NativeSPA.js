import AbstractContainer from "./abstract_container";
import Module from "./module";

export default class Container extends AbstractContainer {
    private activeModuleName: string;
    private mountedModules: Map<string, Module> = new Map<string, Module>();

    constructor(private id: string, private bindDomElement: HTMLDivElement) {
        super();

    }

    public getId(): string {
        return this.id;
    }

    public async addModule(module: Module): Promise<boolean> {
        await module.mount(this.bindDomElement);
        this.mountedModules.set(module.getName(), module);

        return true;
    }
}