import ModuleRouter from "./module_router";
import HTMLComponent from "./abstract_html_component";
import ModuleDTO from "./module_dto";

export const htmlComponentAdapters = new Map<number, HTMLComponentAdapter>();

export default abstract class HTMLComponentAdapter {
    protected htmlComponent: HTMLComponent;
    protected isModified: boolean = false;

    protected moduleRouter: ModuleRouter = ModuleRouter.getInstance();

    constructor() {

    }

    public setHtmlComponent(htmlComponent: HTMLComponent) {
        this.htmlComponent = htmlComponent;
    }

    protected abstract onLoad(param: any): void;
    protected abstract onInitialize(param: ModuleDTO): void;
    protected abstract onShow(isFirst: boolean, param: any): void;
    protected abstract onHide(param: any): void;
    protected abstract onCloseRequest(force: boolean): void;
    

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

    public triggerOnCloseRequestHandler(force: boolean): void {
        if (this.onCloseRequest) {
            this.onCloseRequest(force)
        } else {
            this.close(null);
        }
    }

    // public callOnCloseHandler(param: any): void {
    //     if (this.onLoad) this.onLoad(param);
    // }

    // public async callCloseEventRequest(): Promise<boolean> {
    //     if (this.onCloseRequest) {
    //         return this.onCloseRequest();
    //     } else {
    //         return Promise.resolve(true);
    //     }
    // }

    private close(result: ModuleDTO) {
        this.htmlComponent.notifyClose(result);
    }
}

const __global = window as any;
__global.__HTMLComponentAdapter = HTMLComponentAdapter;

__global.__registerHTMLComponentAdapter = function(moduleIndex: number, componentClass: HTMLComponentAdapter) {
    htmlComponentAdapters.set(moduleIndex, componentClass);
}