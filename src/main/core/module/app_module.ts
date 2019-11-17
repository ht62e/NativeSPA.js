import Container, { ContainerNavigationInfo, CssTransitionOptions } from "../container/container";
import { Parcel, ActionType, Result } from "../common/dto";
import ModuleLoader, { ModuleType } from "./module_loader";
import ContainerHolder from "../container/container_holder";

export default abstract class AppModule implements ContainerHolder {
    protected moduleLoader: ModuleLoader;

    protected moduleIndex: number;
    protected name: string;
    protected sourceUri: string;
    protected sourceDirectory: string;
    protected moduleDefinition: ModuleDefinition;
    protected caption: string = "";

    protected currentContainer: Container;

    protected isFetched: boolean = false;
    protected isMounted: boolean = false;
    protected isInitialized: boolean = false;

    public abstract fetch(): Promise<void>;
    public abstract mount(elementAttachHandler: (element: HTMLDivElement, option?: MountOption) => Container, cssTransitionOptions?: CssTransitionOptions): Promise<void>;
    public abstract getChildContainer(containerName: string): Container

    public abstract initialize(parcel: Parcel): void;
    public abstract exit(actionType: ActionType): Promise<boolean>;
    

    public abstract waitForExit(): Promise<Result>;
    
    public abstract show(withoutTransition?: boolean): void;
    public abstract hide(): void;
    public abstract changeModuleCssPosition(left: string, top: string): void;
    public abstract changeModuleCssSize(width: string, height: string): void;

    public abstract subContainerNavigationEventHandler(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean;
    public abstract messageHandler(command: string, params?: any): Promise<any>;
    public abstract multicastMessageHandler(command: string, params?: any): void;

    public abstract dispatchResizeEvent(): void;

    public getModuleLoader(): ModuleLoader {
        return this.moduleLoader;
    }

    public getName(): string {
        return this.name;
    }

    public getCaption(): string {
        return this.caption;
    }

    public getOwnerContainer(): Container {
        return this.currentContainer;
    }

    public setCaption(caption: string) {
        this.caption = caption;
    }
    

}

export interface ModuleDefinition {
    moduleName: string;
    sourceUri: string;
    moduleType?: ModuleType;
    targetContainerId?: string;
    isContainerDefault?: boolean;
    lazyLoading?: boolean;
    forcePrefetch?: boolean;
    orderOnFlatContainer?: number;
}

export interface MountOption {
    order?: number;
}


