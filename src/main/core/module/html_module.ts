import Container, { ContainerInfo, ContainerNavigationInfo, CssTransitionOptions } from "../container/container";
import AppModule, { ModuleDefinition } from "./app_module";
import SourceRepository from "../source_repository";
import HtmlModuleAdapter from "../adapter/html_module_adapter";
import { Result, ActionType, Parcel } from "../common/dto";
import CssTransitionDriver from "../common/css_transition_driver";
import ModuleLoader from "./module_loader";

export default abstract class HtmlModule extends AppModule {
    protected source: string;
    protected wrapperEl: HTMLDivElement;
    protected subContainerInfos = new Map<string, ContainerInfo>();

    protected cssTransitionDriver: CssTransitionDriver;

    protected htmlAdapter: HtmlModuleAdapter = null;

    protected localDomIdPrefix: string;

    private exitResolver: (value?: boolean | PromiseLike<boolean>) => void;
    private exitForWaitResolver: (value?: Result | PromiseLike<Result>) => void;
    private messageHandleResolver: (value?: any | PromiseLike<any>) => void;

    protected abstract onCreate(): void;
    protected abstract loadSubContainerInfos(): void;

    constructor(moduleDefinition: ModuleDefinition, loader: ModuleLoader) {
        super();
        this.moduleLoader = loader;
        
        this.moduleDefinition = moduleDefinition;
        this.moduleIndex = loader.getNextModuleInstanceSequence();
        this.name = moduleDefinition.moduleName;
        this.sourceUri = moduleDefinition.sourceUri;
        this.sourceDirectory = /.*\//.exec(this.sourceUri)[0];
        this.localDomIdPrefix = "_itm_" + this.moduleIndex.toString() + "_";
        
        this.onCreate();
    }

    public getLocalDomIdPrefix(): string {
        return this.localDomIdPrefix;
    }

    public subContainerNavigationEventHandler(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean {
        return this.htmlAdapter._internal.triggerOnSubContainerNavigated(subContainerId, currentInfo, histories);
    }

    public dispatchResizeEvent(): void {
        if (!this.wrapperEl) return;

        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.onResize();
        });
    }

    public async fetch(): Promise<void> {
        const repository = SourceRepository.getInstance();
        this.source = await repository.fetch(this.sourceUri);
        
        this.loadSubContainerInfos();

        this.isFetched = true;
    }

    public initialize(parcel: Parcel): void {
        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.initialize(parcel);
        });

        this.htmlAdapter._internal.triggerOnInitialize(parcel);
    }

    public show(withoutTransition?: boolean): void {
        if (this.cssTransitionDriver) {
            this.cssTransitionDriver.show(withoutTransition);
        } else {
            this.wrapperEl.style.display = "";
            this.wrapperEl.style.visibility = "";
        }

        this.htmlAdapter._internal.triggerOnShow(false, null);

        this.subContainerInfos.forEach((containerInfo: ContainerInfo) => {
            containerInfo.container.onShow();
        });
    }

    public hide(withoutTransition?: boolean): void {
        if (this.cssTransitionDriver) {
            this.cssTransitionDriver.hide(withoutTransition);
        } else {
            if (this.wrapperEl.style.visibility !== "hidden") {
                this.wrapperEl.style.display = "none";
            }
        }
        this.htmlAdapter._internal.triggerOnHide(null);
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
            this.htmlAdapter._internal.triggerOnExit(actionType);
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

    public async messageHandler(command: string, params?: any): Promise<any> {
        return new Promise(resolve => {
            this.messageHandleResolver = resolve;
            this.htmlAdapter._internal.triggerOnReceiveMessage(command, params);
        });
    }

    public multicastMessageHandler(command: string, params?: any): void {
        this.messageHandler(command, params);
        this.subContainerInfos.forEach((c: ContainerInfo) => {
            c.container.getCurrentModule().messageHandler(command, params);
        });
    }

    public returnMessageResponse(messageResponse: any) {
        if (this.messageHandler) {
            this.messageHandleResolver(messageResponse);
            this.messageHandleResolver = null;
        }
    }

    public getChildContainer(containerName: string): Container {
        let target: Container;
        this.subContainerInfos.forEach((c: ContainerInfo) => {
            if (c.name === containerName) target = c.container;
        });
        return target; 
    }

    public changeModuleCssPosition(left: string, top: string) {
        this.wrapperEl.style.left = left;
        this.wrapperEl.style.top = top;
    }

    public changeModuleCssSize(width: string, height: string) {
        this.wrapperEl.style.width = width;
        this.wrapperEl.style.height = height;
    }
}



