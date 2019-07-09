export default class DialogResult {
    action: DialogResultAction;
    data: any;
}

export enum DialogResultAction {
    OK,
    CANCEL,
    YES,
    NO
}