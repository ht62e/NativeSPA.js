import { ModuleComponentType } from "./module";

export default class ModuleDescription {
    private instanceName: string;
    private sourceUri: string;
    private componentType: ModuleComponentType;
    private lazySourceLoading: boolean;
    private lazyModuleLoading: boolean;
}