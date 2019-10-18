import Container from "./container";
import FlatContainer from "./flat_container";

export default class FlickableFlatContainer extends FlatContainer {
    public async activateModule(module: import("core/module/module").default): Promise<boolean> {
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