import Module from "./module";
import PlainHtmlModule from "./plain_html_module";
import RuntimeError from "../common/runtime_error";
import ContainerManager from "../container/container_manager";
import Container from "../container/container";
import OvarlayManager from "../overlay/overlay_manager";
import { WindowOptions } from "../overlay/dialog_window";
import { ContextMenuOptions } from "../overlay/context_menu";
import { DrawerOptions } from "../overlay/drawer";
import Overlay from "../overlay/overlay";

export interface ModuleDescription {
    name: string;
    sourceUri: string;
    moduleType?: ModuleType;
    displayMode?: DisplayMode;
    targetContainerId?: string;
    isContainerDefault?: boolean;
    lazyLoading?: boolean;
    preloadSourceAtLazy?: boolean;
    windowOptions?: WindowOptions;
    contextMenuOptions?: ContextMenuOptions;
    drawerOptions?: DrawerOptions;
}

export interface registerOptions {
    moduleType?: ModuleType;
    displayMode?: DisplayMode;
    isContainerDefault?: boolean;
    lazyLoading?: boolean;
    preloadSourceAtLazy?: boolean;
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
    public static ROOT_NAME: string = "root";
    private static instanceSequence = 0;

    private descriptions: Array<ModuleDescription>;
    private modules: Map<string, Module>;

    private dependencyInfoMap = new Map<String, ModuleDependencyInfo>();     

    constructor() {
        this.descriptions = [];
        this.modules = new Map<string, Module>();
    }

    public static getInstance(): ModuleManager {
        return ModuleManager.instance;
    }

    public register(name: string, sourceUri: string, targetContainerId: string, 
                    isContainerDefault: boolean, options?: registerOptions) {
        this.registerDescription(name, sourceUri, DisplayMode.Embedding, targetContainerId, isContainerDefault, options);
    }

    public registerWindow(name: string, sourceUri: string, windowOptions: WindowOptions, options?: registerOptions) {
        let md = this.registerDescription(name, sourceUri, DisplayMode.Window, null, null, options);
        md.windowOptions = windowOptions;
    }

    public registerContextMenu(name: string, sourceUri: string, contextMenuOptions: ContextMenuOptions, options?: registerOptions) {
        let md = this.registerDescription(name, sourceUri, DisplayMode.ContextMenu, null, null, options);
        md.contextMenuOptions = contextMenuOptions;
    }

    public registerDrawer(name: string, sourceUri: string, drawerOptions: DrawerOptions, options?: registerOptions) {
        let md = this.registerDescription(name, sourceUri, DisplayMode.Drawer, null, null, options);
        md.drawerOptions = drawerOptions;
    }

    private registerDescription(name: string, sourceUri: string, displayMode: DisplayMode, 
                                targetContainerId: string, isContainerDefault: boolean,
                                options?: registerOptions): ModuleDescription {
        const op: registerOptions = options || {};
        const ds: ModuleDescription = {
            name: name,
            sourceUri: sourceUri,
            targetContainerId: targetContainerId,
            displayMode: displayMode,
            moduleType: op.moduleType !== undefined ? op.moduleType : ModuleType.Native,
            isContainerDefault: isContainerDefault,
            lazyLoading: op.lazyLoading !== undefined ? op.lazyLoading : false,
            preloadSourceAtLazy: op.preloadSourceAtLazy !== undefined ? op.preloadSourceAtLazy : true,
        };
        this.descriptions.push(ds);
        return ds;
    }

    public getModule(name: string) {
        if (!this.modules.has(name)) throw new RuntimeError("指定されたモジュールが見つかりません。");
        return this.modules.get(name);
    }

    public async initialize(): Promise<boolean> {        
        //モジュール定義からモジュールインスタンスの生成と依存情報テーブルの生成（初期化）
        for (let description of this.descriptions) {
            let newModule: Module = null;
            
            //モジュールインスタンス生成
            if (description.moduleType === ModuleType.Native || !description.moduleType) {
                newModule = new PlainHtmlModule(description.name, description.sourceUri, 
                                                ModuleManager.instanceSequence++);
            } else {
                throw new RuntimeError("不明な種類のコンポーネントが指定されました。");
            }

            //モジュールプールへの登録
            this.modules.set(description.name, newModule);

            //モジュールソースのロード　※コンテナへのマウントや初期化は行われない
            if (!description.lazyLoading) {
                await newModule.fetch();
            }

            //依存情報テーブルの準備
            this.dependencyInfoMap.set(
                description.name, 
                new ModuleDependencyInfo(
                    description,
                    newModule.getSubContainerNames())
            );
        }

        //ルートとなる依存情報テーブルの生成
        const rootDependencyInfo = new ModuleDependencyInfo(null, [ModuleManager.ROOT_NAME]);
        this.dependencyInfoMap.set(ModuleManager.ROOT_NAME, rootDependencyInfo);

        //モジュール定義の情報を基に依存情報を互いにリンクする
        this.dependencyInfoMap.forEach((dependencyInfo: ModuleDependencyInfo, moduleName: string) => {
            if (dependencyInfo === rootDependencyInfo) return;

            let targetModuleName: string = ModuleManager.ROOT_NAME;
            let targetContainerName: string = ModuleManager.ROOT_NAME;

            if (dependencyInfo.moduleDescription.displayMode === DisplayMode.Embedding) {
                //コンテナに埋め込んで使用するモジュールの場合
                if (dependencyInfo.moduleDescription.targetContainerId) {
                    const parts: Array<string> = dependencyInfo.moduleDescription.targetContainerId.split(".");
                    if (parts.length === 2) {
                        targetModuleName = parts[0];
                        targetContainerName = parts[1];
                    }
                }
            } else {
                //それ以外（自身がwindowやcontextmenuのルートコンテナになる場合）
                //※依存情報テーブル上はルート上に含めるものとするため何もしない（root.root）
            }

            let targetDependencyInfo = this.dependencyInfoMap.get(targetModuleName);
            // if (targetDependencyInfo && targetDependencyInfo.subContainerNames.has(targetContainerName)) {
                targetDependencyInfo.addSubModule(moduleName, targetContainerName);
            // } else {
            //     throw new RuntimeError("未定義のコンテナが指定された");
            // }
        });

        //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
        await this.loadModuleRecursively(ModuleManager.ROOT_NAME);
 
        return true;
    }

    public async loadModuleRecursively(moduleName: string, forceLoading?: boolean) {
        const dependencyInfo: ModuleDependencyInfo = this.dependencyInfoMap.get(moduleName);
        const containerManager = ContainerManager.getInstance();
        const overlayManager = OvarlayManager.getInstance();
        const moduleDescription: ModuleDescription = dependencyInfo.moduleDescription;

        if (dependencyInfo.isProcessed) throw new RuntimeError("コンテナの循環参照を検出しました。");
        dependencyInfo.isProcessed = true;
        
        if (!dependencyInfo.isRoot && (!moduleDescription.lazyLoading || forceLoading)) {
            const displayMode = moduleDescription.displayMode;
            const module = this.modules.get(moduleDescription.name);

            if (displayMode === DisplayMode.Embedding) {
                //組み込み
                let targetContainer: Container = containerManager.getContainer(moduleDescription.targetContainerId);
                if (targetContainer) {
                    await targetContainer.addModule(module);
                    if (moduleDescription.isContainerDefault) {
                        targetContainer.setDefaultModule(module);
                    }
                } else {
                    throw new RuntimeError("ターゲットコンテナは存在しないか、ロードされていません。");
                }
            } else {
                //オーバーレイ
                let overlay: Overlay;
                switch (displayMode) {
                    case DisplayMode.Window:
                        overlay = overlayManager.createWindow(module.getName(), moduleDescription.windowOptions);
                        break;
                    case DisplayMode.ContextMenu:
                        overlay = overlayManager.createContextMenu(module.getName(), moduleDescription.contextMenuOptions);
                        break;
                    case DisplayMode.Drawer:
                        overlay = overlayManager.createDrawer(module.getName(), moduleDescription.drawerOptions);
                        break;
                }
                await overlay.getContainer().addModule(module);
                overlay.getContainer().setDefaultModule(module);
            }
        }

        //if (dependencyInfo.isRoot || !moduleDescription.lazyLoading) {
        for (let subModuleName of dependencyInfo.subModuleNames) {
            if (!this.dependencyInfoMap.get(subModuleName).moduleDescription.lazyLoading) {
                await this.loadModuleRecursively(subModuleName);
            } else {
                console.log(subModuleName + " is lazy load mode.");
            }
        }
        //}
    }

    public dispatchMessage(destination: string, command: string, message?: any): Promise<any> {
        return this.getModule(destination).passMessage(command, message);
    }
}

class ModuleDependencyInfo {
    moduleDescription: ModuleDescription;
    //subContainerNames: Set<string>;
    subModuleNames = new Array<string>();
    isProcessed: boolean = false;
    isRoot: boolean;

    constructor(moduleDescription: ModuleDescription, subContainerNames: Array<string>) {
        this.moduleDescription = moduleDescription;
        //this.subContainerNames = new Set(subContainerNames); //IE11非対応

        // this.subContainerNames = new Set();
        // subContainerNames.forEach(name => {
        //     this.subContainerNames.add(name);
        // });

        this.isRoot = moduleDescription === null;
    }

    public addSubModule(subModuleName: string, targetContainerName: string) {
        // if (this.subContainerNames.has(targetContainerName)) {
            this.subModuleNames.push(subModuleName);
        // } else {
        //     throw new RuntimeError("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
        // }
    }

}
