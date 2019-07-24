export default class ResultDto {
    actionType: ActionType;
    dataIsChanged: boolean;
    result: any;

    constructor(actionType: ActionType, dataIsChanged: boolean, result?: any) {
        this.actionType = actionType;
        this.dataIsChanged = dataIsChanged;
        this.result = result;
    }
}

export enum ActionType {
    BACK_CANCEL,
    OK
}

