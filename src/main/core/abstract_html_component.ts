import Container, { ContainerInfo } from "./container";
import Module from "./module";
import SourceRepository from "./source_repository";
import HTMLComponentAdapter from "./html_component_adapter";
import { Result, ActionType, Parcel } from "./dto";

export default abstract class HTMLComponent implements Module {
    protected isFetched: boolean = false;
    protected isMounted: boolean = false;
    protected isInitialized: boolean = false;
    protected source: string;
    protected wrapperElement: HTMLDivElement;
    protected currentContainer: Container;
    protected subContainerInfos = new Map<string, ContainerInfo>();

    protected htmlAdapter: HTMLComponentAdapter = null;

    private exitResolver: (value?: boolean | PromiseLike<boolean>) => void;
    private exitForWaitResolver: (value?: Result | PromiseLike<Result>) => void;
    private passMessageResolver: (value?: any | PromiseLike<any>) => void;

    protected abstract onCreate(): void;
    protected abstract loadSubContainerInfos(): void;
    public abstract async mount(container: Container): Promise<boolean>;

    constructor(protected name: string, protected sourceUri: string, protected moduleIndex: number) {
        this.onCreate();
    }

    dispachResizeEvent(): void {
        if (!this.wrapperElement) return;

        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.onResize();
        })
    }

    async fetch(): Promise<boolean> {
        const repository = SourceRepository.getInstance();
        this.source = await repository.fetch(this.sourceUri);
        
        this.loadSubContainerInfos();

        this.isFetched = true;
        return null;
    }

    initialize(param: Parcel): void {
        this.htmlAdapter.triggerOnInitializeHandler(param);
    }

    show(): void {
        this.wrapperElement.style.display = "";
        this.wrapperElement.style.visibility = "";
        this.htmlAdapter.triggerOnShowHandler(false, null);
    }

    hide(): void {
        if (this.wrapperElement.style.visibility !== "hidden") {
            this.wrapperElement.style.display = "none";
        }
        this.htmlAdapter.triggerOnHideHandler(null);
    }

    waitForExit(): Promise<Result> {
        return new Promise(resolve => {
            this.exitForWaitResolver = resolve;
        });
    }

    async exit(actionType: ActionType): Promise<boolean> {
        //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
        return new Promise(resolve => {
            this.exitResolver = resolve;
            this.htmlAdapter.triggerOnExitHandler(actionType);
        });
    }

    continueExitProcess(result: Result) {
        if (this.exitResolver) {
            this.exitResolver(true);
            this.exitResolver = null;
        }
        if (this.exitForWaitResolver) {
            this.exitForWaitResolver(result);
            this.exitForWaitResolver = null;
        }
    }

    cancelExitProcess() {
        if (this.exitResolver) {
            this.exitResolver(false);
            this.exitResolver = null;
        }        
    }

    async passMessage(command: string, message?: any): Promise<any> {
        return new Promise(resolve => {
            this.passMessageResolver = resolve;
            this.htmlAdapter.triggerOnReceiveMessage(command, message);
        });
    }

    returnMessageResponse(messageResponse: any) {
        if (this.passMessage) {
            this.passMessageResolver(messageResponse);
            this.passMessageResolver = null;
        }
    }

    getElement(): HTMLDivElement {
        throw this.wrapperElement;
    }

    getCurrentContainer(): Container {
        return this.currentContainer;
    }

    getSubContainerNames(): Array<string> {
        let ary = new Array<string>();
        this.subContainerInfos.forEach((c: ContainerInfo) => {
            ary.push(c.name);
        });
        return ary;
    }

    getName(): string {
        return this.name;
    }

    getCaption(): string {
        return this.name;
    }
    
}



