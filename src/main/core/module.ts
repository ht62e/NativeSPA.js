import ModuleSwitcher from "./module_switcher";

export default interface Module {
    load(moduleContents: string): void;
    initialize(): void;
    show(swithcer: ModuleSwitcher): void;
    close(): void;
    getScopeId(): number;   
}


export enum ModuleComponentType {
    SSRP,
    Native,
    Vue,
    React
}