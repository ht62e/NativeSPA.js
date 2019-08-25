import Container from "./container";
import Parcel from "./parcel";
import Result, { ActionType } from "./result";
import MessageResponse from "./message_response";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(container: Container): Promise<boolean>;
    initialize(param: Parcel): void;
    exit(actionType: ActionType): Promise<boolean>;
    

    waitForExit(): Promise<Result>;
    
    show(): void;
    hide(): void;

    //apply(): Result;
    
    passMessage(command: string, message?: any): Promise<MessageResponse>;

    dispachResizeEvent(): void;

    getName(): string;
    getCaption(): string;
    getElement(): HTMLDivElement;
    getCurrentContainer(): Container;
    getSubContainerNames(): Array<string>;

}



