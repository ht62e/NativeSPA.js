import ModuleSwitcher from "./module_switcher";
import AbstractContainer from "./abstract_container";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: AbstractContainer): Promise<boolean>;
    initialize(): Promise<boolean>;
    show(): void;
    close(): void;

    getName(): string;
    getScopeId(): number;
    getElement(): HTMLDivElement;
    getCurrentContainer(): AbstractContainer;
    getSubContainerNames(): Array<string>;

}


export enum ModuleType {
    SSRP,
    Native,
    Vue,
    React
}