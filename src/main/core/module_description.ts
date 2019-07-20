import { ModuleType } from "./module";

export default interface ModuleDescription {
    name: string;
    sourceUri: string;
    targetContainerId: string;
    isContainerDefault?: boolean;
    componentType?: ModuleType;
    lazyModuleLoading?: boolean;
    preloadSourceAtLazy?: boolean;
}