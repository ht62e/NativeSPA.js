import Module from "./module";
import PlainHtmlModule from "./plain_html_module";
import RuntimeError from "../common/runtime_error";
import Container from "../container/container";
import OvarlayManager from "../overlay/overlay_manager";
import { WindowOptions } from "../overlay/dialog_window";
import { ContextMenuOptions } from "../overlay/context_menu";
import { DrawerOptions } from "../overlay/drawer";
import Overlay from "../overlay/overlay";

export interface ModuleDescription {
    moduleName: string;
    sourceUri: string;
    moduleType?: ModuleType;
    displayMode?: DisplayMode;
    targetContainerId?: string;
    isContainerDefault?: boolean;
    lazyLoading?: boolean;
    forcePrefetch?: boolean;
    windowOptions?: WindowOptions;
    contextMenuOptions?: ContextMenuOptions;
    drawerOptions?: DrawerOptions;
}

export interface RegisterOptions {
    moduleType?: ModuleType;
    lazyLoading?: boolean;
    forcePrefetch?: boolean;
}


export enum DisplayMode {
    Embedding,
    Window,
    ContextMenu,
    Drawer
}

export enum ModuleType {
    Native,
    Vue,
    React,
    SSRP
}

export default class ModuleManager {

    private static instance = new ModuleManager();
    private static instanceSequence = 0;

    private rootContainer: Container;

    private descriptions: Object;
    private loadedModules: Map<string, Array<Module>>;
    private prefetchedModules: Map<string, Module>;

    private subModuleList: Map<string, Array<string>>;   

    constructor() {
        this.descriptions = {};
        this.loadedModules = new Map<string, Array<Module>>();
        this.prefetchedModules = new Map<string, Module>();
        this.subModuleList = new Map<string, Array<string>>();
    }

    public static getInstance(): ModuleManager {
        return ModuleManager.instance;
    }

    public setRootContainer(container: Container) {
        this.rootContainer = container;
    }

    public register(name: string, sourceUri: string, targetContainerId: string, 
                    isContainerDefault: boolean, options?: RegisterOptions) {
        this.registerDescription(name, sourceUri, DisplayMode.Embedding, targetContainerId, isContainerDefault, options);
    }

    public registerWindow(name: string, sourceUri: string, windowOptions: WindowOptions, options?: RegisterOptions) {
        let md = this.registerDescription(name, sourceUri, DisplayMode.Window, null, null, options);
        md.windowOptions = windowOptions;
    }

    public registerContextMenu(name: string, sourceUri: string, contextMenuOptions: ContextMenuOptions, options?: RegisterOptions) {
        let md = this.registerDescription(name, sourceUri, DisplayMode.ContextMenu, null, null, options);
        md.contextMenuOptions = contextMenuOptions;
    }

    public registerDrawer(name: string, sourceUri: string, drawerOptions: DrawerOptions, options?: RegisterOptions) {
        let md = this.registerDescription(name, sourceUri, DisplayMode.Drawer, null, null, options);
        md.drawerOptions = drawerOptions;
    }

    private registerDescription(moduleName: string, sourceUri: string, displayMode: DisplayMode, 
                                targetContainerId: string, isContainerDefault: boolean,
                                options?: RegisterOptions): ModuleDescription {
        const op: RegisterOptions = options || {};
        const ds: ModuleDescription = {
            moduleName: moduleName,
            sourceUri: sourceUri,
            targetContainerId: targetContainerId,
            displayMode: displayMode,
            moduleType: op.moduleType !== undefined ? op.moduleType : ModuleType.Native,
            isContainerDefault: isContainerDefault,
            lazyLoading: op.lazyLoading !== undefined ? op.lazyLoading : false,
            forcePrefetch: op.forcePrefetch !== undefined ? op.forcePrefetch : true,
        };
        this.descriptions[moduleName] = ds;
        return ds;
    }

    public getModule(name: string): Module {
        if (!this.loadedModules.has(name)) throw new RuntimeError("指定されたモジュールが見つかりません。");
        return this.loadedModules.get(name)[0]; //TODO
    }

    public run() {
        window.addEventListener("resize", () => {
            this.rootContainer.onResize();
        });

        this.rootContainer.initialize();
    }

    public async initialize(rootContainer: Container): Promise<boolean> {
        this.rootContainer = rootContainer;

        for (const key in this.descriptions) {
            const description = this.descriptions[key];
            //プリフェッチ
            if (description.forcePrefetch) {
                const module: Module = await this.fetchModule(description.moduleName);
                this.prefetchedModules.set(description.moduleName, module);
            }

            //サブモジュールリスト生成
            const targetModule: string = description.targetContainerId.split(".")[0];
            if (!this.subModuleList.has(targetModule)) {
                this.subModuleList.set(targetModule, new Array<string>());
            }
            this.subModuleList.get(targetModule).push(description.moduleName);

            //TODO descriptionsに存在しないmoduleNameのsubModuleListのリストがあったなら警告を出すか止める
        }
        // this.descriptions.forEach(async (description) => {
        //     //プリフェッチ
        //     if (description.forcePrefetch) {
        //         const module: Module = await this.fetchModule(description.moduleName);
        //         this.prefetchedModules.set(description.moduleName, module);
        //     }

        //     //サブモジュールリスト生成
        //     const targetModule: string = description.targetContainerId.split(".")[0];
        //     if (!this.subModuleList.has(targetModule)) {
        //         this.subModuleList.set(targetModule, new Array<string>());
        //     }
        //     this.subModuleList.get(targetModule).push(description.moduleName);

        //     //TODO descriptionsに存在しないmoduleNameのsubModuleListのリストがあったなら警告を出すか止める
        // });
        // for (let description of this.descriptions) {
        //     let newModule: Module = null;
            
        //     //モジュールインスタンス生成
        //     if (description.moduleType === ModuleType.Native || !description.moduleType) {
        //         newModule = new PlainHtmlModule(description.name, description.sourceUri, 
        //                                         ModuleManager.instanceSequence++);
        //     } else {
        //         throw new RuntimeError("不明な種類のコンポーネントが指定されました。");
        //     }

        //     //モジュールプールへの登録
        //     this.modules.set(description.name, newModule);

        //     //モジュールソースのロード　※コンテナへのマウントや初期化は行われない
        //     if (!description.lazyLoading) {
        //         await newModule.fetch();
        //     }

        //     //依存情報テーブルの準備
        //     this.dependencyInfoMap.set(
        //         description.name, 
        //         new ModuleDependencyInfo(
        //             description,
        //             newModule.getSubContainerNames())
        //     );
        // }

        // //ルートとなる依存情報テーブルの生成
        // const rootDependencyInfo = new ModuleDependencyInfo(null, [ModuleManager.ROOT_NAME]);
        // this.dependencyInfoMap.set(ModuleManager.ROOT_NAME, rootDependencyInfo);

        // //モジュール定義の情報を基に依存情報を互いにリンクする
        // this.dependencyInfoMap.forEach((dependencyInfo: ModuleDependencyInfo, moduleName: string) => {
        //     if (dependencyInfo === rootDependencyInfo) return;

        //     let targetModuleName: string = ModuleManager.ROOT_NAME;
        //     let targetContainerName: string = ModuleManager.ROOT_NAME;

        //     if (dependencyInfo.moduleDescription.displayMode === DisplayMode.Embedding) {
        //         //コンテナに埋め込んで使用するモジュールの場合
        //         if (dependencyInfo.moduleDescription.targetContainerId) {
        //             const parts: Array<string> = dependencyInfo.moduleDescription.targetContainerId.split(".");
        //             if (parts.length === 2) {
        //                 targetModuleName = parts[0];
        //                 targetContainerName = parts[1];
        //             }
        //         }
        //     } else {
        //         //それ以外（自身がwindowやcontextmenuのルートコンテナになる場合）
        //         //※依存情報テーブル上はルート上に含めるものとするため何もしない（root.root）
        //     }

        //     let targetDependencyInfo = this.dependencyInfoMap.get(targetModuleName);
        //     // if (targetDependencyInfo && targetDependencyInfo.subContainerNames.has(targetContainerName)) {
        //         targetDependencyInfo.addSubModule(moduleName, targetContainerName);
        //     // } else {
        //     //     throw new RuntimeError("未定義のコンテナが指定された");
        //     // }
        // });

        //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
        await this.loadModuleRecursively("root");
 
        return true;
    }

    protected async fetchModule(moduleName: string): Promise<Module> {
        let module: Module;

        if (this.prefetchedModules.has(moduleName)) {
            module = this.prefetchedModules.get(moduleName);
            this.prefetchedModules.delete(moduleName);
        } else {
            const description: ModuleDescription = this.descriptions[moduleName];
            if (!description) {
                throw new RuntimeError("指定されたモジュール " + moduleName + " は定義されていません。");
            }
            if (description.moduleType === ModuleType.Native || !description.moduleType) {
                module = new PlainHtmlModule(moduleName, description.sourceUri, ModuleManager.instanceSequence++);
            } else {
                throw new RuntimeError("不明な種類のコンポーネントが指定されました。");
            }

            await module.fetch();
        }

        return module;
    }

    public async loadModuleRecursively(moduleName: string): Promise<Module> {
        let module: Module;

        if (moduleName !== "root") {
            module = await this.fetchModule(moduleName);
            const moduleDescription: ModuleDescription = this.descriptions[moduleName];

            const parts = moduleDescription.targetContainerId.split(".");
            const targetModuleName: string = parts[0];
            const targetContainerName: string = parts[1];
         
            //const mountTargetContainer = containerManager.getContainer(moduleDescription.targetContainerId);


            //仮
            let mountTargetContainer: Container;
            if (targetModuleName === "root") {
                mountTargetContainer = this.rootContainer;
            } else {
                mountTargetContainer = this.loadedModules.get(targetModuleName)[0].getSubContainerByName(targetContainerName);
            }


            if (mountTargetContainer) {
                await mountTargetContainer.addModule(module);
                if (moduleDescription.isContainerDefault) {
                    mountTargetContainer.setDefaultModule(moduleName);
                }
                if (!this.loadedModules.has(moduleName)) {
                    this.loadedModules.set(moduleName, new Array<Module>());
                }
                this.loadedModules.get(moduleName).push(module);
            } else {
                throw new RuntimeError("ターゲットコンテナは存在しないか、ロードされていません。");
            }
        }

        const subModules: Array<string> = this.subModuleList.get(moduleName);
        if (subModules) {
            for (const subModuleName of subModules) {
                const subModuleDescription = this.descriptions[subModuleName];
                if (!subModuleDescription.lazyLoading) {
                    await this.loadModuleRecursively(subModuleName);
                } else {
                    console.log(subModuleName + " is lazy load mode.");
                } 
            }            
        }
        
        return module;
    }

    // public async loadModuleRecursively(moduleName: string, forceLoading?: boolean) {
    //     const dependencyInfo: ModuleDependencyInfo = this.dependencyInfoMap.get(moduleName);
    //     const containerManager = ContainerManager.getInstance();
    //     const overlayManager = OvarlayManager.getInstance();
    //     const moduleDescription: ModuleDescription = dependencyInfo.moduleDescription;

    //     if (dependencyInfo.isProcessed) throw new RuntimeError("コンテナの循環参照を検出しました。");
    //     dependencyInfo.isProcessed = true;
        
    //     if (!dependencyInfo.isRoot && (!moduleDescription.lazyLoading || forceLoading)) {
    //         const displayMode = moduleDescription.displayMode;
    //         const module: Module = this.modules.get(moduleDescription.moduleName);

    //         if (displayMode === DisplayMode.Embedding) {
    //             //組み込み
    //             let targetContainer: Container = containerManager.getContainer(moduleDescription.targetContainerId);
    //             if (targetContainer) {
    //                 await targetContainer.addModule(module);
    //                 if (moduleDescription.isContainerDefault) {
    //                     targetContainer.setDefaultModule(module);
    //                 }
    //             } else {
    //                 throw new RuntimeError("ターゲットコンテナは存在しないか、ロードされていません。");
    //             }
    //         } else {
    //             //オーバーレイ
    //             let overlay: Overlay;
    //             switch (displayMode) {
    //                 case DisplayMode.Window:
    //                     overlay = overlayManager.createWindow(module.getName(), moduleDescription.windowOptions);
    //                     break;
    //                 case DisplayMode.ContextMenu:
    //                     overlay = overlayManager.createContextMenu(module.getName(), moduleDescription.contextMenuOptions);
    //                     break;
    //                 case DisplayMode.Drawer:
    //                     overlay = overlayManager.createDrawer(module.getName(), moduleDescription.drawerOptions);
    //                     break;
    //             }
    //             await overlay.getContainer().addModule(module);
    //             overlay.getContainer().setDefaultModule(module);
    //         }
    //     }

    //     //if (dependencyInfo.isRoot || !moduleDescription.lazyLoading) {
    //     for (let subModuleName of dependencyInfo.subModuleNames) {
    //         if (!this.dependencyInfoMap.get(subModuleName).moduleDescription.lazyLoading) {
    //             await this.loadModuleRecursively(subModuleName);
    //         } else {
    //             console.log(subModuleName + " is lazy load mode.");
    //         }
    //     }
    //     //}
    // }

    public dispatchMessage(destination: string, command: string, message?: any): Promise<any> {
        //TODO 仮
        return this.getModule(destination).passMessage(command, message);
    }
}
