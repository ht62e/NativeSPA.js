import ContainerManager from "./container_manager";
import ModuleManager from "./module_manager";
import Container from "./container";
import Module from "./module";
import ModuleDTO from "./module_dto";

export default class ModuleRouter {
    private static instance = new ModuleRouter();

    public static getInstance(): ModuleRouter {
        return ModuleRouter.instance;
    }

    private history = new Map<string, Array<RouterHistoryInfo>>();

    constructor() {

    }

    public async forward(targetIdentifier: string, callback?: (moduleDto: ModuleDTO) => void): Promise<ModuleDTO> {
        const s = targetIdentifier.split("::");
        const targetContainerId = s[0];
        const moduleName = s[1];

        const target: Container = ContainerManager.getInstance().getContainer(targetContainerId);
        const module: Module = ModuleManager.getInstance().getModule(moduleName);

        module.initialize(null);

        target.changeActiveModule(module);

        const routerHisInfo = new RouterHistoryInfo(module, "test")    ;
        if (!this.history.has(targetContainerId)) {
            const newHisStack: Array<RouterHistoryInfo> = [routerHisInfo];
            this.history.set(targetContainerId, newHisStack);
        } else {
            this.history.get(targetContainerId).push(routerHisInfo);
        }

        const result: ModuleDTO = await module.waitForClose();

        if (callback) {
            //for ES5
            callback(result);
        } else {
            return result;
        }
        
    }

    public back(targetContainerId: string): void {
        const target: Container = ContainerManager.getInstance().getContainer(targetContainerId);
        const historyStack = this.history.get(targetContainerId);
        const currentModule: Module = historyStack[historyStack.length - 1].getModule();

        currentModule.closeRequest().then(closed => {
            historyStack.pop();
            target.changeActiveModule(historyStack[historyStack.length - 1].getModule());
        })
    }
}

class RouterHistoryInfo {
    constructor(
        private module: Module, 
        private title: string
    ) {

    }
    public getModule(): Module {
        return this.module;
    }
    public getTitle(): string {
        return this.title;
    }
}