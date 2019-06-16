import { ModuleComponentType } from "./module";

export default class ModuleDefinition {
    private instanceName: string;
    private sourceUri: string;
    private componentType: ModuleComponentType;
    private lazySourceLoading: boolean;
    private lazyModuleLoading: boolean;
}