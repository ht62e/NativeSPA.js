import Container from "./container";
import ForwardDto from "./forward_dto";
import ResultDto from "./result_dto";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: Container): Promise<boolean>;
    initialize(param: ForwardDto): void;
    closeRequest(): Promise<boolean>;

    waitForClose(): Promise<ResultDto>;
    
    show(): void;
    hide(): void;
    

    onResize(containerWidth: number, containerHeight: number): void;

    getName(): string;
    getCaption(): string;
    getElement(): HTMLDivElement;
    getCurrentContainer(): Container;
    getSubContainerNames(): Array<string>;
    isClosed(): boolean;
}



