import ModuleSwitcher from "./module_switcher";
import AbstractContainer from "./abstract_container";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(containerElement: HTMLDivElement): Promise<boolean>;
    initialize(): Promise<boolean>;
    show(): void;
    close(): void;

    getName(): string;
    getScopeId(): number;
    getContentHtml(): string;
    getCurrentContainer(): AbstractContainer;
    getSubContainerNames(): Array<string>;

}


export enum ModuleType {
    SSRP,
    Native,
    Vue,
    React
}