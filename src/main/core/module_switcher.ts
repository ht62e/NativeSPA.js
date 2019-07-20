import ContainerManager from "./container_manager";
import ModuleManager from "./module_manager";
import Container from "./container";
import Module from "./module";

export default class ModuleSwitcher {
    private static instance: ModuleSwitcher = new ModuleSwitcher();

    constructor() {

    }

    public static getInstance(): ModuleSwitcher {
        return ModuleSwitcher.instance;
    }

    public forward(targetContainerId: string, nextModuleName: string): void {
        const containerManager = ContainerManager.getInstance();
        const moduleManager = ModuleManager.getInstance();

        const target: Container = containerManager.getContainer(targetContainerId);
        const module: Module = moduleManager.getModule(nextModuleName);
        target.changeActiveModule(module);
    }

    public back(targetContainerId: string): void {

    }
}