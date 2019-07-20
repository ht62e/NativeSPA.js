import Container, { ContainerInfo } from "./container";
import Module from "./module";
import SourceRepository from "./source_repository";



export default abstract class HTMLComponent implements Module {
    protected isFetched: boolean = false;
    protected isMounted: boolean = false;
    protected isInitialized: boolean = false;
    protected source: string;
    protected wrapperElement: HTMLDivElement;
    protected currentContainer: Container;
    protected subContainerInfos = new Map<string, ContainerInfo>();

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

    async initialize(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    show(): void {
        this.wrapperElement.style.display = "";
        this.wrapperElement.style.visibility = "";
    }

    hide(): void {
        if (this.wrapperElement.style.visibility !== "hidden") {
            this.wrapperElement.style.display = "none";
        }
    }

    close(): void {
        throw new Error("Method not implemented.");
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

    isClosed(): boolean {
        return !this.isInitialized;
    }

}



