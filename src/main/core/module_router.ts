import ContainerManager from "./container_manager";
import ModuleManager from "./module_manager";
import Container from "./container";
import Module from "./module";
import { Parcel, Result } from "./dto";

export default class ModuleRouter {
    private static instance = new ModuleRouter();

    public static getInstance(): ModuleRouter {
        return ModuleRouter.instance;
    }

    constructor() {

    }

    public async forward(targetIdentifier: string, params?: Parcel): Promise<Result> {
        const s = targetIdentifier.split("::");
        const targetContainerId = s[0];
        const moduleName = s[1];

        const target: Container = ContainerManager.getInstance().getContainer(targetContainerId);
        const module: Module = ModuleManager.getInstance().getModule(moduleName);

        return target.forward(module, params);       
    }

    public back(targetContainerId: string): void {
        const target: Container = ContainerManager.getInstance().getContainer(targetContainerId);
        target.back();
    }

}