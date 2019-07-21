import Container from "./container";
import ModuleDTO from "./module_dto";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: Container): Promise<boolean>;
    initialize(param: ModuleDTO): void;
    closeRequest(): Promise<boolean>;

    waitForClose(): Promise<ModuleDTO>;
    
    show(): void;
    hide(): void;
    

    onResize(containerWidth: number, containerHeight: number): void;

    getName(): string;
    getElement(): HTMLDivElement;
    getCurrentContainer(): Container;
    getSubContainerNames(): Array<string>;
    isClosed(): boolean;
}


export enum ModuleType {
    SSRP,
    Native,
    Vue,
    React
}


