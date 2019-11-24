import HtmlModule from "../module/html_module";
import { Parcel, ActionType, Result } from "../common/dto";
import ModuleAdapterNavigation from "./public/navigation";
import { ContainerNavigationInfo } from "../container/container";
import ModuleAdapterInternal from "./internal/internal";
import ModuleFunctions from "./public/module_functions";

export const htmlModuleAdapters = new Map<number, HtmlModuleAdapter>();

export default abstract class HtmlModuleAdapter {
    public _htmlModule: HtmlModule;
    public _internal: ModuleAdapterInternal;

    public $module: ModuleFunctions;
    public $navigation: ModuleAdapterNavigation;

    constructor(moduleIndex) {
        htmlModuleAdapters.set(moduleIndex, this);
    }

    public _setHtmlModule(htmlModule: HtmlModule) {
        this._htmlModule = htmlModule;
        this._internal = new ModuleAdapterInternal(this);
        this.$module = new ModuleFunctions(htmlModule);
        this.$navigation = new ModuleAdapterNavigation(this._htmlModule.getModuleLoader(), this._htmlModule);
    }

    public abstract onLoad(param: any): void;
    public abstract onInitialize(param: Parcel): void;
    public abstract onShow(isFirst: boolean, param: any): void;
    public abstract onHide(param: any): void;
    public abstract onExit(actionType: ActionType, returnFunctions: ExitReturnFunctions): void;
    public abstract onMessageReceived(command: string, doResponse: ResponseFunction, message?: any): void;
    public abstract onSubContainerNavigated(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean;

}

export interface ExitReturnFunctions {
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
