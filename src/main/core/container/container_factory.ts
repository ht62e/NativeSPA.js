import RuntimeError from "../common/runtime_error";
import Container from "./container";
import PageContainer from "./page_container";
import FlatContainer from "./flat_container";
import Module from "../module/module";

export default class ContainerFactory {
    public static ROOT_CONTAINER_ID: string = "root.root";

    constructor() {

    }
    public static createContainer(id: string, type: string, bindDomElement: HTMLDivElement, owner: Module): Container {
        let newContainer = null;

        if (!type || type === "separated") {
            newContainer = new PageContainer(id, bindDomElement, owner, {
                enableCssTransition: true
            });
        } else if ("continuous") {
            newContainer = new FlatContainer(id, bindDomElement, owner);
        }

        return newContainer;
    }


}