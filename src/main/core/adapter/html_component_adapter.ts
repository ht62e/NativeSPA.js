import ModuleRouter from "../module/module_router";
import HTMLComponent from "../module/html_component";
import OvarlayManager from "../overlay/overlay_manager";
import { ShowOptions } from "../overlay/overlay";
import { Parcel, ActionType, Result } from "../common/dto";
import ModuleManager from "../module/module_manager";

export const htmlComponentAdapters = new Map<number, HTMLComponentAdapter>();

export default abstract class HTMLComponentAdapter {
    protected htmlComponent: HTMLComponent;
    protected isModified: boolean = false;

    protected moduleRouter: ModuleRouter = ModuleRouter.getInstance();
    protected moduleManager: ModuleManager = ModuleManager.getInstance();
    protected overlayManager: OvarlayManager = OvarlayManager.getInstance();

    public navigator: Navigator;

    private exitCallbackReturnFunctionsObject: ExitReturnFunctions;

    constructor() {
        this.exitCallbackReturnFunctionsObject = {
            cancelExit: this.cancelExit.bind(this),
            continueExit: this.continueExit.bind(this)
        };
        this.navigator = new Navigator(this);
    }

    public setHtmlComponent(htmlComponent: HTMLComponent) {
        this.htmlComponent = htmlComponent;
    }

    public getHtmlComponent(): HTMLComponent {
        return this.htmlComponent;
    }

    protected abstract onLoad(param: any): void;
    protected abstract onInitialize(param: Parcel): void;
    protected abstract onShow(isFirst: boolean, param: any): void;
    protected abstract onHide(param: any): void;
    protected abstract onExit(actionType: ActionType, returnFunctions: ExitReturnFunctions): void;
    protected abstract onReceiveMessage(command: string, doResponse: ResponseFunction, message?: any): void;
    

    public triggerOnLoadHandler(param: any): void {
        if (this.onLoad) this.onLoad(param);
    }

    public triggerOnInitializeHandler(param: any): void {
        if (this.onInitialize) this.onInitialize(param);
    }

    public triggerOnShowHandler(isFirst: boolean, param: any): void {
        if (this.onShow) this.onShow(isFirst, param);
    }

    public triggerOnHideHandler(param: any): void {
        if (this.onHide) this.onHide(param);
    }

    public triggerOnExitHandler(actionType: ActionType): void {
        if (this.onExit) {
            this.onExit(actionType, this.exitCallbackReturnFunctionsObject);
        } else {
            this.continueExit(new Result(actionType, true));
        }
    }

    public triggerOnReceiveMessage(command: string, message?: any): void {
        if (this.onReceiveMessage) {
            this.onReceiveMessage(command, this.returnMessageResponse.bind(this), message);
        } else {

        }
    }

    private continueExit(result: Result): void {
        this.htmlComponent.continueExitProcess(result);
    }

    private cancelExit(): void {
        this.htmlComponent.cancelExitProcess();
    }

    private returnMessageResponse(response: any): void {
        this.htmlComponent.returnMessageResponse(response);
    }




    private startExitProcess(actionType: ActionType) {
        this.htmlComponent.exit(actionType);
    }

    private async showWindow(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        const overlayManager = OvarlayManager.getInstance();
        return await overlayManager.show(overlayName, parcel, options);
    }

    private async showWindowAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        const overlayManager = OvarlayManager.getInstance();
        return await overlayManager.showAsModal(overlayName, parcel, options);
    }

    private async sendMessage(destination: string, command: string, message?: any): Promise<any> {
        return this.moduleManager.dispatchMessage(destination, command, message);
    }
}


class Navigator {
    private adapter: HTMLComponentAdapter;
    private moduleRouter: ModuleRouter = ModuleRouter.getInstance();
    private moduleManager: ModuleManager = ModuleManager.getInstance();
    private overlayManager: OvarlayManager = OvarlayManager.getInstance();

    constructor(adapter: HTMLComponentAdapter) {
        this.adapter = adapter;
    }

    public async localForward(moduleName: string, parcel?: Parcel): Promise<Result> {
        const targetIdentifier = 
                this.adapter.getHtmlComponent().
                getParentContainer().getId() + "::" + moduleName;
        return this.moduleRouter.forward(targetIdentifier, parcel);
    }

    public async forward(targetIdentifier: string, parcel?: Parcel): Promise<Result> {
        return this.moduleRouter.forward(targetIdentifier, parcel);
    }

    public startExitProcess(actionType: ActionType) {
        this.adapter.getHtmlComponent().exit(actionType);
    }

    public async showWindow(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return await this.overlayManager.show(overlayName, parcel, options);
    }

    public async showWindowAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        return await this.overlayManager.showAsModal(overlayName, parcel, options);
    }

    public async sendMessage(destination: string, command: string, message?: any): Promise<any> {
        return this.moduleManager.dispatchMessage(destination, command, message);
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
__global.__HTMLComponentAdapter = HTMLComponentAdapter;

__global.__registerHTMLComponentAdapter = function(moduleIndex: number, componentClass: HTMLComponentAdapter) {
    htmlComponentAdapters.set(moduleIndex, componentClass);
}