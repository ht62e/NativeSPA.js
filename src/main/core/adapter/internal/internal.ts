import HtmlModuleAdapter, { ExitReturnFunctions } from "../html_module_adapter";
import HtmlModule from "../../module/html_module";
import ModuleAdapterNavigation from "../public/navigation";
import { ActionType, Result } from "../../common/dto";
import { ContainerNavigationInfo } from "../../container/container";
import ModuleFunctions from "../public/module_functions";

export default class ModuleAdapterInternal {
    private adapter: HtmlModuleAdapter;
    private htmlModule: HtmlModule;
    private exitCallbackReturnFunctionsObject: ExitReturnFunctions;

    constructor(adapter: HtmlModuleAdapter) {
        this.adapter = adapter;
        this.htmlModule = adapter._htmlModule;

        this.exitCallbackReturnFunctionsObject = {
            cancelExit: this.cancelExit.bind(this),
            continueExit: this.continueExit.bind(this)
        };
    }

    public getHtmlModule(): HtmlModule {
        return this.htmlModule;
    }

    public triggerOnLoad(param: any): void {
        if (this.adapter.onLoad) this.adapter.onLoad(param);
    }

    public triggerOnInitialize(param: any): void {
        if (this.adapter.onInitialize) this.adapter.onInitialize(param);
    }

    public triggerOnShow(isFirst: boolean, param: any): void {
        if (this.adapter.onShow) this.adapter.onShow(isFirst, param);
    }

    public triggerOnHide(param: any): void {
        if (this.adapter.onHide) this.adapter.onHide(param);
    }

    public triggerOnExit(actionType: ActionType): void {
        if (this.adapter.onExit) {
            this.adapter.onExit(actionType, this.exitCallbackReturnFunctionsObject);
        } else {
            this.continueExit(new Result(actionType, true));
        }
    }

    public triggerOnReceiveMessage(command: string, params?: any): void {
        if (this.adapter.onMessageReceived) {
            this.adapter.onMessageReceived(command, this.returnMessageResponse.bind(this), params);
        } else {
            this.returnMessageResponse(null);
        }
    }

    public triggerOnSubContainerNavigated(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean {
        if (this.adapter.onSubContainerNavigated) {
            return this.adapter.onSubContainerNavigated(subContainerId, currentInfo, histories);
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
