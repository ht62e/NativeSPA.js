import HtmlModule from "../module/html_module";
import { Parcel, ActionType, Result } from "../common/dto";
import Navigation from "./navigation";
import { ContainerNavigationInfo } from "../container/container";
import MessageDispatcher from "../module/message_dispatcher";

export const htmlModuleAdapters = new Map<number, HtmlModuleAdapter>();

export default abstract class HtmlModuleAdapter {
    protected htmlModule: HtmlModule;
    protected isModified: boolean = false;

    public navigation: Navigation;

    private exitCallbackReturnFunctionsObject: ExitReturnFunctions;

    constructor() {
        this.exitCallbackReturnFunctionsObject = {
            cancelExit: this.cancelExit.bind(this),
            continueExit: this.continueExit.bind(this)
        };
    }

    public setHtmlComponent(htmlModule: HtmlModule) {
        this.htmlModule = htmlModule;
        this.navigation = new Navigation(this.htmlModule.getModuleLoader(), this);
    }

    public getHtmlModule(): HtmlModule {
        return this.htmlModule;
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

    protected abstract onLoad(param: any): void;
    protected abstract onInitialize(param: Parcel): void;
    protected abstract onShow(isFirst: boolean, param: any): void;
    protected abstract onHide(param: any): void;
    protected abstract onExit(actionType: ActionType, returnFunctions: ExitReturnFunctions): void;
    protected abstract onMessageReceived(command: string, doResponse: ResponseFunction, message?: any): void;
    protected abstract onSubContainerNavigated(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean;

    public triggerOnLoad(param: any): void {
        if (this.onLoad) this.onLoad(param);
    }

    public triggerOnInitialize(param: any): void {
        if (this.onInitialize) this.onInitialize(param);
    }

    public triggerOnShow(isFirst: boolean, param: any): void {
        if (this.onShow) this.onShow(isFirst, param);
    }

    public triggerOnHide(param: any): void {
        if (this.onHide) this.onHide(param);
    }

    public triggerOnExit(actionType: ActionType): void {
        if (this.onExit) {
            this.onExit(actionType, this.exitCallbackReturnFunctionsObject);
        } else {
            this.continueExit(new Result(actionType, true));
        }
    }

    public triggerOnReceiveMessage(command: string, params?: any): void {
        if (this.onMessageReceived) {
            this.onMessageReceived(command, this.returnMessageResponse.bind(this), params);
        } else {
            this.htmlModule.returnMessageResponse(null);
        }
    }

    public triggerOnSubContainerNavigated(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean {
        if (this.onSubContainerNavigated) {
            return this.onSubContainerNavigated(subContainerId, currentInfo, histories);
        } else {
            return null;
        }
    }

    private continueExit(result: Result): void {
        this.htmlModule.continueExitProcess(result);
    }

    private cancelExit(): void {
        this.htmlModule.cancelExitProcess();
    }

    private returnMessageResponse(response: any): void {
        this.htmlModule.returnMessageResponse(response);
    }


}

interface ExitReturnFunctions {
    readonly cancelExit: () => void;
    readonly continueExit: (result: Result) => void;
}

interface ResponseFunction {
    (response: any): void;
}

const __global = window as any;
__global.__HtmlModuleAdapter = HtmlModuleAdapter;

__global.__registerHtmlModuleAdapter = function(moduleIndex: number, componentClass: HtmlModuleAdapter) {
    htmlModuleAdapters.set(moduleIndex, componentClass);
}