import Container from "./container";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: Container): Promise<boolean>;
    initialize(): Promise<boolean>;
    show(): void;
    hide(): void;
    close(): void;

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