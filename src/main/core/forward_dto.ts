export default class ForwardDto {
    forwardMode: ForwardMode;
    params: any;

    constructor(forwardMode: ForwardMode, params: any) {
        this.forwardMode = forwardMode;
        this.params = params;
    }
}

export enum ForwardMode {
    READONLY,
    NEW,
    NEW_EDIT,
    EDIT
}