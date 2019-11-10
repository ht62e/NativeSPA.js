import Container from "./container";
import FlatContainer from "./flat_container";
import AppModule from "../module/app_module";

export default class FlickableFlatContainer extends FlatContainer {
    public async activateModule(module: AppModule): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    protected elementAttachHandler(element: HTMLDivElement): Container {
        throw new Error("Method not implemented.");
    }
    protected showPreviousModule(): void {
        throw new Error("Method not implemented.");
    }
    constructor() {
        super("", null, null);
    }
}