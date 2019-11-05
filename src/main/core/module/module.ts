import Container, { ContainerNavigationInfo, CssTransitionOptions } from "../container/container";
import { Parcel, ActionType, Result } from "../common/dto";

export default interface Module {
    fetch(): Promise<boolean>;
    mount(elementAttachHandler: (element: HTMLDivElement) => Container,
            cssTransitionOptions?: CssTransitionOptions): Promise<boolean>;
    initialize(parcel: Parcel): void;
    exit(actionType: ActionType): Promise<boolean>;
    

    waitForExit(): Promise<Result>;
    
    show(nonTransition?: boolean): void;
    hide(): void;
    changeModuleCssPosition(left: string, top: string): void;
    changeModuleCssSize(width: string, height: string): void;

    //apply(): Result;
    subContainerNavigationEventHandler(subContainerId: string, currentInfo: ContainerNavigationInfo, histories: Array<ContainerNavigationInfo>): boolean;
    passMessage(command: string, message?: any): Promise<any>;

    dispatchResizeEvent(): void;

    getName(): string;
    getCaption(): string;
    getElement(): HTMLDivElement;
    getOwnerContainer(): Container;
    getSubContainerByName(containerName: string): Container;
    getSubContainerNames(): Array<string>;

    setCaption(caption: string);

}



