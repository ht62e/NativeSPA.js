import Container from "./container";
import Parcel from "./parcel";
import Result from "./result";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: Container): Promise<boolean>;
    initialize(param: Parcel): void;
    exitRequest(): Promise<boolean>;

    waitForExit(): Promise<Result>;
    
    show(): void;
    hide(): void;

    apply(): Result;
    

    onResize(containerWidth: number, containerHeight: number): void;

    getName(): string;
    getCaption(): string;
    getElement(): HTMLDivElement;
    getCurrentContainer(): Container;
    getSubContainerNames(): Array<string>;

}



