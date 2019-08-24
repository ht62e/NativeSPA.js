import ModuleRouter from "./module_router";
import HTMLComponent from "./abstract_html_component";
import Parcel from "./parcel";
import Result, { ActionType } from "./result";
import OvarlayManager from "./overlay_manager";
import { ShowOptions } from "./overlay";

export const htmlComponentAdapters = new Map<number, HTMLComponentAdapter>();

export default abstract class HTMLComponentAdapter {
    protected htmlComponent: HTMLComponent;
    protected isModified: boolean = false;

    protected moduleRouter: ModuleRouter = ModuleRouter.getInstance();
    protected overlayManager: OvarlayManager = OvarlayManager.getInstance();

    private exitCallbackReturnFunctionsObject: ReturnFunctions;

    constructor() {
        this.exitCallbackReturnFunctionsObject = {
            cancelExit: this.cancelExit.bind(this),
            continueExit: this.continueExit.bind(this)
        };
    }

    public setHtmlComponent(htmlComponent: HTMLComponent) {
        this.htmlComponent = htmlComponent;
    }

    protected abstract onLoad(param: any): void;
    protected abstract onInitialize(param: Parcel): void;
    protected abstract onShow(isFirst: boolean, param: any): void;
    protected abstract onHide(param: any): void;
    protected abstract onExit(actionType: ActionType, returnFunctions: ReturnFunctions): void;
    

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

    private continueExit(result: Result): void {
        this.htmlComponent.continueExitProcess(result);
    }

    private cancelExit(): void {
        this.htmlComponent.cancelExitProcess();
    }



    // private exit(result: Result) {
    //     this.htmlComponent.exit(result);
    // }

    private async showWindow(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        const overlayManager = OvarlayManager.getInstance();
        return await overlayManager.show(overlayName, parcel, options);
    }

    private async showWindowAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions): Promise<Result> {
        const overlayManager = OvarlayManager.getInstance();
        return await overlayManager.showAsModal(overlayName, parcel, options);
    }
}

interface ReturnFunctions {
    cancelExit: () => void;
    continueExit: (result: Result) => void;
}

const __global = window as any;
__global.__HTMLComponentAdapter = HTMLComponentAdapter;

__global.__registerHTMLComponentAdapter = function(moduleIndex: number, componentClass: HTMLComponentAdapter) {
    htmlComponentAdapters.set(moduleIndex, componentClass);
}