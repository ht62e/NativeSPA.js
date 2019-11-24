import { ActionType } from "../../common/dto";
import HtmlModule from "../../module/html_module";
import { RegisterOptions } from "../../module/module_loader";

export default class ModuleFunctions {
    private htmlModule: HtmlModule;

    constructor(htmlModule: HtmlModule) {
        this.htmlModule = htmlModule;
    }

    public $id(id: string): HTMLElement {
        return window.document.querySelector("#" + this.htmlModule.getLocalDomIdPrefix() + id);
    }

    public setCaption(caption: string) {
        this.htmlModule.setCaption(caption);
    }

    public exit(actionType: ActionType) {
        this.htmlModule.exit(actionType);
    }

    public async sendMessage(destination: string, command: string, message?: any): Promise<any> {
        const dispatcher = this.htmlModule.getModuleLoader().getMessageDispatcher();
        return dispatcher.send(destination, command, message);
    }

    public async multicastMessage(destination: string, command: string, message?: any): Promise<any> {
        const dispatcher = this.htmlModule.getModuleLoader().getMessageDispatcher();
        return dispatcher.multicast(destination, command, message);
    }

    public register(moduleName: string , sourceUri: string, targetContainerName: string, 
        isContainerDefault: boolean, options?: RegisterOptions): void {

        let containerId: string = this.htmlModule.getName() + "." + targetContainerName;
        this.htmlModule.getModuleLoader().register(moduleName, sourceUri, containerId, isContainerDefault, options);
    }
}