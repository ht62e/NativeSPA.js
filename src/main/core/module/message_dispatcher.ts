import ModuleLoader from "./module_loader";

export default class MessageDispatcher {
    constructor(private moduleLoader: ModuleLoader) {

    }

    public async send(destModuleName: string, command: string, params?: any): Promise<any> {
        return this.moduleLoader.getModule(destModuleName).messageHandler(command, params);
    }

    public multicast(destModuleName: string, command: string, params?: any): void {
        this.moduleLoader.getModule(destModuleName).multicastMessageHandler(command, params);
    }
}