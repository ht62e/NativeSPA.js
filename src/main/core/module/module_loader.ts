import AppModule, { ModuleDefinition } from "./app_module";
import PlainHtmlModule from "./plain_html_module";
import RuntimeError from "../common/runtime_error";
import Container from "../container/container";
import ContainerHolder from "../container/container_holder";
import ViewPort from "../common/viewport";
import MessageDispatcher from "./message_dispatcher";

export interface RegisterOptions {
    moduleType?: ModuleType;
    lazyLoading?: boolean;
    forcePrefetch?: boolean;
    orderOnFlatContainer?: number;
}

export enum ModuleType {
    Native,
    Vue,
    React,
    SSRP
}

export default class ModuleLoader {
    private instanceSequence = 0;

    private viewPort: ViewPort;
    private messageDispatcher: MessageDispatcher;
    private definitions: Map<string, ModuleDefinition>;

    //PageContainer内の自動生成された2番目以降のインスタンスは保持しない
    private loadedModules: Map<string, AppModule>;
    private prefetchedModules: Map<string, AppModule>;
    private subModuleList: Map<string, Array<string>>;   

    constructor() {
        this.definitions = new Map<string, ModuleDefinition>();
        this.loadedModules = new Map<string, AppModule>();
        this.prefetchedModules = new Map<string, AppModule>();
        this.subModuleList = new Map<string, Array<string>>();

        this.messageDispatcher = new MessageDispatcher(this);
    }

    public setViewPort(viewPort: ViewPort) {
        this.viewPort = viewPort;
    }

    public getViewPort(): ViewPort {
        return this.viewPort;
    }

    public getMessageDispatcher(): MessageDispatcher {
        return this.messageDispatcher;
    }

    public register(name: string, sourceUri: string, targetContainerId: string, 
                    isContainerDefault: boolean, options?: RegisterOptions) {
        this.addModuleDefinition(name, sourceUri, targetContainerId, isContainerDefault, options);
    }

    private addModuleDefinition(moduleName: string, sourceUri: string, 
                                targetContainerId: string, isContainerDefault: boolean,
                                options?: RegisterOptions): ModuleDefinition {
        const op: RegisterOptions = options || {};
        const ds: ModuleDefinition = {
            moduleName: moduleName,
            sourceUri: sourceUri,
            targetContainerId: targetContainerId,
            moduleType: op.moduleType !== undefined ? op.moduleType : ModuleType.Native,
            isContainerDefault: isContainerDefault,
            lazyLoading: op.lazyLoading !== undefined ? op.lazyLoading : false,
            forcePrefetch: op.forcePrefetch !== undefined ? op.forcePrefetch : true,
            orderOnFlatContainer: op.orderOnFlatContainer
        };
        this.definitions.set(moduleName, ds);

        const targetModuleName: string = targetContainerId.split(".")[0];
        if (!this.subModuleList.has(targetModuleName)) {
            this.subModuleList.set(targetModuleName, new Array<string>());
        }
        this.subModuleList.get(targetModuleName).push(moduleName);

        return ds;
    }

    public getModule(name: string): AppModule {
        if (!this.loadedModules.has(name)) throw new RuntimeError("指定されたモジュールが見つかりません。");
        return this.loadedModules.get(name);
    }

    public getNextModuleInstanceSequence(): number {
        return this.instanceSequence++
    }

    public run() {
        window.addEventListener("resize", () => {
            this.viewPort.getViewPortContainer().onResize();
        });

        this.viewPort.getViewPortContainer().initialize();
    }

    public async initialize(): Promise<void> {
        const definitionModuleNames = new Array<string>(); //IE11ではMapの繰り返し中でawaitを使う方法がないため配列に入れてループ
        this.definitions.forEach((value, key) => {
            definitionModuleNames.push(key);
        });

        //prefetching        
        for (const i in definitionModuleNames) {
            const definition = this.definitions.get(definitionModuleNames[i]);
            if (definition.forcePrefetch) {
                const module: AppModule = await this.fetchModule(definition.moduleName);
                this.prefetchedModules.set(definition.moduleName, module);
            }
            
            //TODO definitionsに存在しないmoduleNameのsubModuleListのリストがあったなら警告を出すか止める
        }

        //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
        const subModules: Array<string> = this.subModuleList.get("$root");

        for (const subModuleName of subModules) {
            const subModuleDefinition = this.definitions.get(subModuleName);
            if (!subModuleDefinition.lazyLoading) {
                await this.loadModuleRecursively(subModuleName, this.viewPort);
            } else {
                console.log(subModuleName + " is lazy load mode.");
            } 
        }            
 
    }

    protected async fetchModule(moduleName: string): Promise<AppModule> {
        let module: AppModule;

        if (this.prefetchedModules.has(moduleName)) {
            module = this.prefetchedModules.get(moduleName);
            this.prefetchedModules.delete(moduleName);
        } else {
            const definition: ModuleDefinition = this.definitions.get(moduleName);
            if (!definition) {
                throw new RuntimeError("指定されたモジュール " + moduleName + " は定義されていません。");
            }
            if (definition.moduleType === ModuleType.Native || !definition.moduleType) {
                module = new PlainHtmlModule(definition, this);
            } else {
                throw new RuntimeError("不明な種類のコンポーネントが指定されました。");
            }

            await module.fetch();
        }

        return module;
    }

    public async loadModuleRecursively(moduleName: string, owner: ContainerHolder): Promise<AppModule> {
        const module: AppModule = await this.fetchModule(moduleName);
        const moduleDefinition: ModuleDefinition = this.definitions.get(moduleName);

        const parts = moduleDefinition.targetContainerId.split(".");
        const targetContainerName: string = parts[1];

        const mountTargetContainer: Container = owner.getChildContainer(targetContainerName);
        if (!mountTargetContainer) throw new RuntimeError("ターゲットコンテナは存在しないか、ロードされていません。");

        await mountTargetContainer.addModule(module);

        if (moduleDefinition.isContainerDefault) {
            mountTargetContainer.setDefaultModule(moduleName);
        }
        if (!this.loadedModules.has(moduleName)) {
            this.loadedModules.set(moduleName, module);
        }

        const subModules: Array<string> = this.subModuleList.get(moduleName) || [];

        for (const subModuleName of subModules) {
            const subModuleDefinition = this.definitions.get(subModuleName);
            if (!subModuleDefinition.lazyLoading) {
                await this.loadModuleRecursively(subModuleName, module);
            } else {
                console.log(subModuleName + " is lazy load mode.");
            } 
        }            
        
        return module;
    }

}
