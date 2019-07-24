import Container, { ContainerInfo } from "./container";
import Module from "./module";
import SourceRepository from "./source_repository";
import ForwardDto from "./forward_dto";
import HTMLComponentAdapter from "./html_component_adapter";
import ResultDto from "./result_dto";

export default abstract class HTMLComponent implements Module {
    protected isFetched: boolean = false;
    protected isMounted: boolean = false;
    protected isInitialized: boolean = false;
    protected source: string;
    protected wrapperElement: HTMLDivElement;
    protected currentContainer: Container;
    protected subContainerInfos = new Map<string, ContainerInfo>();

    protected htmlAdapter: HTMLComponentAdapter = null;

    private closeRequestResolver: (value?: boolean | PromiseLike<boolean>) => void;
    private closeForWaitResolver: (value?: ResultDto | PromiseLike<ResultDto>) => void;

    protected abstract onCreate(): void;
    protected abstract loadSubContainerInfos(): void;
    public abstract async mount(container: Container): Promise<boolean>;

    constructor(protected name: string, protected sourceUri: string, protected moduleIndex: number) {
        this.onCreate();
    }

    onResize(containerWidth: number, containerHeight: number): void {
        if (!this.wrapperElement) return;
        this.wrapperElement.style.width = containerWidth.toString() + "px";
        this.wrapperElement.style.height = containerHeight.toString() + "px";

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

    initialize(param: ForwardDto): void {
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

    waitForClose(): Promise<ResultDto> {
        return new Promise(resolve => {
            this.closeForWaitResolver = resolve;
        });
    }

    async closeRequest(): Promise<boolean> {
        return new Promise(resolve => {
            this.closeRequestResolver = resolve;
            this.htmlAdapter.triggerOnCloseRequestHandler(false);
        });
    }

    close(result: ResultDto) {
        if (this.closeRequestResolver) {
            this.closeRequestResolver(true);
            this.closeRequestResolver = null;
        } else {
            //backナビゲーションではなく自身で閉じたとき
            this.currentContainer.backWithoutConfirmation();
        }
        if (this.closeForWaitResolver) {
            this.closeForWaitResolver(result);
            this.closeForWaitResolver = null;
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

    isClosed(): boolean {
        return !this.isInitialized;
    }

}



