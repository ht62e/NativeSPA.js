import { ModuleType } from "./module";

export default interface ModuleDescription {
    name: string;
    sourceUri: string;
    componentType: ModuleType;
    targetContainerId: string;
    lazyModuleLoading?: boolean;
    preloadSourceAtLazy?: boolean;
}