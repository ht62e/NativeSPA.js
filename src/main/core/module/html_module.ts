import Container, { ContainerInfo, ContainerNavigationInfo } from "../container/container";
import Module from "./module";
import SourceRepository from "../source_repository";
import HtmlModuleAdapter from "../adapter/html_module_adapter";
import { Result, ActionType, Parcel } from "../common/dto";
import CssTransitionDriver from "../common/css_transition_driver";

export default abstract class HtmlModule implements Module {
    protected isFetched: boolean = false;
    protected isMounted: boolean = false;
    protected isInitialized: boolean = false;
    protected source: string;
    protected wrapperElement: HTMLDivElement;
    protected currentContainer: Container;
    protected subContainerInfos = new Map<string, ContainerInfo>();

    protected caption: string = "";
    protected cssTransitionDriver: CssTransitionDriver;

    protected htmlAdapter: HtmlModuleAdapter = null;

    private exitResolver: (value?: boolean | PromiseLike<boolean>) => void;
    private exitForWaitResolver: (value?: Result | PromiseLike<Result>) => void;
    private passMessageResolver: (value?: any | PromiseLike<any>) => void;

    protected abstract onCreate(): void;
    protected abstract loadSubContainerInfos(): void;
    public abstract async mount(elementAttachHandler: (element: HTMLDivElement, ownerModuleName: string) => Container): Promise<boolean>;
    public abstract changeModuleCssPosition(left: string, top: string): void;
    public abstract changeModuleCssSize(width: string, height: string): void;

    constructor(protected name: string, protected sourceUri: string, protected moduleIndex: number) {
        this.onCreate();
    }

    public setCaption(caption: string) {
        this.caption = caption;
    }

    public subContainerNavigationEventHandler(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean {
        return this.htmlAdapter.triggerOnSubContainerNavigated(subContainerId, currentInfo, histories);
    }

    public dispatchResizeEvent(): void {
        if (!this.wrapperElement) return;

        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.onResize();
        });
    }

    public async fetch(): Promise<boolean> {
        const repository = SourceRepository.getInstance();
        this.source = await repository.fetch(this.sourceUri);
        
        this.loadSubContainerInfos();

        this.isFetched = true;
        return null;
    }

    public initialize(parcel: Parcel): void {
        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.initialize(parcel);
        });

        this.htmlAdapter.triggerOnInitialize(parcel);
    }

    public show(withoutTransition?: boolean): void {
        if (this.cssTransitionDriver) {
            this.cssTransitionDriver.show(withoutTransition);
        } else {
            this.wrapperElement.style.display = "";
            this.wrapperElement.style.visibility = "";
        }

        this.htmlAdapter.triggerOnShow(false, null);

        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.onShow();
        });
    }

    public hide(withoutTransition?: boolean): void {
        if (this.cssTransitionDriver) {
            this.cssTransitionDriver.hide(withoutTransition);
        } else {
            if (this.wrapperElement.style.visibility !== "hidden") {
                this.wrapperElement.style.display = "none";
            }
        }
        this.htmlAdapter.triggerOnHide(null);
    }

    

    public waitForExit(): Promise<Result> {
        return new Promise(resolve => {
            this.exitForWaitResolver = resolve;
        });
    }

    async exit(actionType: ActionType): Promise<boolean> {
        //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
        return new Promise(resolve => {
            this.exitResolver = resolve;
            this.htmlAdapter.triggerOnExit(actionType);
        });
    }

    public continueExitProcess(result: Result) {
        if (this.exitResolver) {
            this.exitResolver(true);
            this.exitResolver = null;
        }
        if (this.exitForWaitResolver) {
            this.exitForWaitResolver(result);
            this.exitForWaitResolver = null;
        }
    }

    public cancelExitProcess() {
        if (this.exitResolver) {
            this.exitResolver(false);
            this.exitResolver = null;
        }        
    }

    public async passMessage(command: string, message?: any): Promise<any> {
        return new Promise(resolve => {
            this.passMessageResolver = resolve;
            this.htmlAdapter.triggerOnReceiveMessage(command, message);
        });
    }

    public returnMessageResponse(messageResponse: any) {
        if (this.passMessage) {
            this.passMessageResolver(messageResponse);
            this.passMessageResolver = null;
        }
    }

    public getElement(): HTMLDivElement {
        throw this.wrapperElement;
    }

    public getOwnerContainer(): Container {
        return this.currentContainer;
    }

    public getSubContainerByName(containerName: string): Container {
        let target: Container;
        this.subContainerInfos.forEach((c: ContainerInfo) => {
            if (c.name === containerName) target = c.container;
        });
        return target; 
    }

    public getSubContainerNames(): Array<string> {
        let ary = new Array<string>();
        this.subContainerInfos.forEach((c: ContainerInfo) => {
            ary.push(c.name);
        });
        return ary;
    }

    public getName(): string {
        return this.name;
    }

    public getCaption(): string {
        return this.caption;
    }
    
    protected extractTemplateContent(source: string): string {
        
        return "";
    }
}



