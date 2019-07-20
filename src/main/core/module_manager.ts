import ModuleDescription from "./module_description";
import Module, { ModuleType } from "./module";
import NativeComponent from "./native_component";
import RuntimeError from "./runtime_error";
import ContainerManager from "./container_manager";
import Container from "./container";

export default class ModuleManager {
    private static instance = new ModuleManager();
    private static ROOT_NAME: string = "root";
    private static moduleIndexCounter = 0;

    private descriptions: Array<ModuleDescription>;
    private modules: Map<string, Module>;

    constructor() {
        this.descriptions = [];
        this.modules = new Map<string, Module>();
    }

    public static getInstance(): ModuleManager {
        return ModuleManager.instance;
    }
   
    public registerDescription(description: ModuleDescription) {
        this.descriptions.push(description);
    }

    public getModule(name: string) {
        if (!this.modules.has(name)) throw new RuntimeError("指定されたモジュールが見つかりません。");
        return this.modules.get(name);
    }

    public async initialize(): Promise<boolean> {
        const mcLinkInfoMap = new Map<String, ModuleContainerLinkInfo>();     
        
        //モジュールから配置先コンテナIDと子コンテナIDをすべて列挙する
        for (let description of this.descriptions) {
            let newModule: Module = null;
            
            if (description.componentType === ModuleType.Native || !description.componentType) {
                newModule = new NativeComponent(description.name, description.sourceUri, 
                                                ModuleManager.moduleIndexCounter++);
            } else {
                throw new RuntimeError("不明な種類のコンポーネント");
            }

            this.modules.set(description.name, newModule);

            await newModule.fetch();

            mcLinkInfoMap.set(
                description.name, 
                new ModuleContainerLinkInfo(
                    description,
                    newModule.getSubContainerNames())
            );
        }

        //ルートコネクタの準備
        const rootMclInfo = new ModuleContainerLinkInfo(null, [ModuleManager.ROOT_NAME]);
        mcLinkInfoMap.set(ModuleManager.ROOT_NAME, rootMclInfo);

        //モジュールとコンテナの依存関係を解決するためのツリーを生成する
        mcLinkInfoMap.forEach((mclInfo: ModuleContainerLinkInfo, moduleName: string) => {
            if (mclInfo === rootMclInfo) return;

            let targetModuleName: string = ModuleManager.ROOT_NAME;
            let targetContainerName: string = ModuleManager.ROOT_NAME;

            //
            if (mclInfo.moduleDescription.targetContainerId) {
                const parts: Array<string> = mclInfo.moduleDescription.targetContainerId.split(".");
                if (parts.length === 2) {
                    targetModuleName = parts[0];
                    targetContainerName = parts[1];
                }
            }

            let targetMcLinkInfo: ModuleContainerLinkInfo = mcLinkInfoMap.get(targetModuleName);
            if (targetMcLinkInfo && targetMcLinkInfo.subContainerNames.has(targetContainerName)) {
                targetMcLinkInfo.addSubModule(moduleName, targetContainerName);
            } else {
                throw new RuntimeError("未定義のコンテナが指定された");
            }
        });

        //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
        const containerManager = ContainerManager.getInstance();
        const loadModule = async (mclInfo: ModuleContainerLinkInfo) => {
            if (mclInfo.isProcessed) throw new RuntimeError("コンテナの循環参照発生");
            mclInfo.isProcessed = true;
            
            if (mclInfo !== rootMclInfo && !mclInfo.moduleDescription.lazyModuleLoading) {
                let targetContainer: Container = containerManager.getContainer(mclInfo.moduleDescription.targetContainerId);
                if (targetContainer) {
                    const module = this.modules.get(mclInfo.moduleDescription.name);
                    await targetContainer.addModule(module);
                    if (mclInfo.moduleDescription.isContainerDefault) {
                        module.show();
                    }
                } else {
                    throw new RuntimeError("ターゲットコンテナが存在しないか、未ロード");
                }
            }

            for (let subModuleName of mclInfo.subModuleNames) {
                await loadModule(mcLinkInfoMap.get(subModuleName));
            }
        }

        await loadModule(rootMclInfo);
 
        return true;
    }




}

class ModuleContainerLinkInfo {
    moduleDescription: ModuleDescription;
    subContainerNames: Set<string>;
    subModuleNames = new Array<string>();
    isProcessed: boolean = false;

    constructor(moduleDescription: ModuleDescription, subContainerNames: Array<string>) {
        this.moduleDescription = moduleDescription;
        this.subContainerNames = new Set(subContainerNames);
    }

    public addSubModule(subModuleName: string, targetContainerName: string) {
        if (this.subContainerNames.has(targetContainerName)) {
            this.subModuleNames.push(subModuleName);
        } else {
            throw new RuntimeError("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
        }
    }
}
