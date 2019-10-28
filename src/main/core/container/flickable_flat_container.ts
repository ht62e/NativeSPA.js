import Container from "./container";
import FlatContainer from "./flat_container";
import Module from "../module/module";

export default class FlickableFlatContainer extends FlatContainer {
    public async activateModule(module: Module): Promise<boolean> {
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