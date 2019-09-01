import Container from "./container";
import { Parcel, ActionType, Result } from "./dto";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: Container): Promise<boolean>;
    initialize(param: Parcel): void;
    exit(actionType: ActionType): Promise<boolean>;
    

    waitForExit(): Promise<Result>;
    
    show(): void;
    hide(): void;

    //apply(): Result;
    
    passMessage(command: string, message?: any): Promise<any>;

    dispachResizeEvent(): void;

    getName(): string;
    getCaption(): string;
    getElement(): HTMLDivElement;
    getCurrentContainer(): Container;
    getSubContainerNames(): Array<string>;

}



