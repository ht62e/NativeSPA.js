import Container from "../container/container";
import { Parcel, ActionType, Result } from "../common/dto";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(elementAttachHandler: (element: HTMLDivElement) => Container): Promise<boolean>;
    initialize(parcel: Parcel): void;
    exit(actionType: ActionType): Promise<boolean>;
    

    waitForExit(): Promise<Result>;
    
    show(): void;
    hide(): void;
    changeModuleCssPosition(left: string, top: string);
    changeModuleCssSize(width: string, height: string);

    //apply(): Result;
    
    passMessage(command: string, message?: any): Promise<any>;

    dispachResizeEvent(): void;

    getName(): string;
    getCaption(): string;
    getElement(): HTMLDivElement;
    getCurrentContainer(): Container;
    getSubContainerNames(): Array<string>;

}



