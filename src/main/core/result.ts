export default class Result {
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

