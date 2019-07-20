import ContainerManager from "./container_manager";
import ModuleSwitcher from "./module_switcher";

export const htmlComponentAdapters = new Map<number, HTMLComponentAdapter>();

export default abstract class HTMLComponentAdapter {
    protected isModified: boolean = false;

    protected moduleSwitcher: ModuleSwitcher = ModuleSwitcher.getInstance();

    constructor(protected moduleIndex: number) {

    }

    public abstract onLoad(param: any): void;
    public abstract onInitialize(param: any): void;
    public abstract onShow(isFirst: boolean, param: any): void;
    public abstract async onCloseRequest(): Promise<boolean>;
    public abstract onClose(): void;
    

    public callOnLoadHandler(param: any): void {
        if (this.onLoad) this.onLoad(param);
    }

    public callOnInitializeHandler(param: any): void {
        if (this.onInitialize) this.onInitialize(param);
    }

    public callOnShowHandler(param: any): void {
        //if (this.onShow) this.onShow(param);
    }

    // public callOnCloseHandler(param: any): void {
    //     if (this.onLoad) this.onLoad(param);
    // }

    public async callOnCloseRequest(): Promise<boolean> {
        if (this.onCloseRequest) {
            return this.onCloseRequest();
        } else {
            return Promise.resolve(true);
        }
    }
}

const __global = window as any;
__global.__HTMLComponentAdapter = HTMLComponentAdapter;

__global.__registerHTMLComponentAdapter = function(moduleIndex: number, componentClass: HTMLComponentAdapter) {
    htmlComponentAdapters.set(moduleIndex, componentClass);
}