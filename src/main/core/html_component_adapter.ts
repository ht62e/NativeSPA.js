import ModuleRouter from "./module_router";
import HTMLComponent from "./abstract_html_component";
import Parcel from "./parcel";
import Result from "./result";
import OvarlayManager from "./overlay_manager";
import { ShowOptions } from "./overlay";

export const htmlComponentAdapters = new Map<number, HTMLComponentAdapter>();

export default abstract class HTMLComponentAdapter {
    protected htmlComponent: HTMLComponent;
    protected isModified: boolean = false;

    protected moduleRouter: ModuleRouter = ModuleRouter.getInstance();
    protected overlayManager: OvarlayManager = OvarlayManager.getInstance();

    constructor() {

    }

    public setHtmlComponent(htmlComponent: HTMLComponent) {
        this.htmlComponent = htmlComponent;
    }

    protected abstract onLoad(param: any): void;
    protected abstract onInitialize(param: Parcel): void;
    protected abstract onShow(isFirst: boolean, param: any): void;
    protected abstract onHide(param: any): void;
    protected abstract onExitRequest(force: boolean): void;
    

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

    public triggerOnExitRequestHandler(force: boolean): void {
        if (this.onExitRequest) {
            this.onExitRequest(force);
        } else {
            this.exit(null);
        }
    }

    private exit(result: Result) {
        this.htmlComponent.exit(result);
    }

    private showWindow(overlayName: string, parcel?: Parcel, options?: ShowOptions, callback?: (r: Result) => void): void {
        const overlayManager = OvarlayManager.getInstance();
        overlayManager.showWindow(overlayName, parcel, options, callback);
    }

    private async showWindowAsModal(overlayName: string, parcel?: Parcel, options?: ShowOptions, callback?: (r: Result) => void): Promise<Result> {
        const overlayManager = OvarlayManager.getInstance();
        return await overlayManager.showWindowAsModal(overlayName, parcel, options, callback);
    }
}

const __global = window as any;
__global.__HTMLComponentAdapter = HTMLComponentAdapter;

__global.__registerHTMLComponentAdapter = function(moduleIndex: number, componentClass: HTMLComponentAdapter) {
    htmlComponentAdapters.set(moduleIndex, componentClass);
}