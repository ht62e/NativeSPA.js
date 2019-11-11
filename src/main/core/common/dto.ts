export class Parcel {
    requestMode: RequestMode;
    params: any;

    constructor(requestMode: RequestMode, params: any) {
        this.requestMode = requestMode;
        this.params = params;
    }
}

export enum RequestMode {
    READONLY,
    NEW,
    NEW_EDIT,
    EDIT
}




export class Result {
    actionType: ActionType;
    isChanged: boolean;
    result: any;

    constructor(actionType: ActionType, isChanged: boolean, result?: any) {
        this.actionType = actionType;
        this.isChanged = isChanged;
        this.result = result;
    }
}

export enum ActionType {
    OK,
    CANCEL,
    BACK,
    FORCE_CANCEL,
    YES,
    NO
}
