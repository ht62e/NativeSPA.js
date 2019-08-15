import Container, { ContainerInfo } from "./container";
import Module from "./module";
import SourceRepository from "./source_repository";
import Parcel from "./parcel";
import HTMLComponentAdapter from "./html_component_adapter";
import Result from "./result";

export default abstract class HTMLComponent implements Module {
    protected isFetched: boolean = false;
    protected isMounted: boolean = false;
    protected isInitialized: boolean = false;
    protected source: string;
    protected wrapperElement: HTMLDivElement;
    protected currentContainer: Container;
    protected subContainerInfos = new Map<string, ContainerInfo>();

    protected htmlAdapter: HTMLComponentAdapter = null;

    private exitRequestResolver: (value?: boolean | PromiseLike<boolean>) => void;
    private exitForWaitResolver: (value?: Result | PromiseLike<Result>) => void;

    protected abstract onCreate(): void;
    protected abstract loadSubContainerInfos(): void;
    public abstract async mount(container: Container): Promise<boolean>;

    constructor(protected name: string, protected sourceUri: string, protected moduleIndex: number) {
        this.onCreate();
    }

    onResize(containerWidth: number, containerHeight: number): void {
        if (!this.wrapperElement) return;
        //this.wrapperElement.style.width = containerWidth.toString() + "px";
        //this.wrapperElement.style.height = containerHeight.toString() + "px";

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

    apply(): Result {
        throw new Error("Method not implemented.");
    }

    waitForExit(): Promise<Result> {
        return new Promise(resolve => {
            this.exitForWaitResolver = resolve;
        });
    }

    async exitRequest(): Promise<boolean> {
        //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
        return new Promise(resolve => {
            this.exitRequestResolver = resolve;
            this.htmlAdapter.triggerOnExitRequestHandler(false);
        });
    }

    exit(result: Result) {
        //backナビゲーション時にコールされるexitRequest内でexitRequestResolverがセットされる
        if (this.exitRequestResolver) {
            this.exitRequestResolver(true);
            this.exitRequestResolver = null;
        } else {
            //backナビゲーションではなく自身で閉じたとき(exitRequestResolverがnull)
            this.currentContainer.backWithoutConfirmation();
        }
        if (this.exitForWaitResolver) {
            this.exitForWaitResolver(result);
            this.exitForWaitResolver = null;
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



