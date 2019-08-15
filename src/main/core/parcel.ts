export default class Parcel {
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