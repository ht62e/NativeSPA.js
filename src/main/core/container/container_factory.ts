import RuntimeError from "../common/runtime_error";
import Container from "./container";
import PageContainer from "./page_container";
import FlatContainer from "./flat_container";
import AppModule from "../module/app_module";

export default class ContainerFactory {
    public static ROOT_CONTAINER_ID: string = "$root.viewport";

    constructor() {

    }
    public static createContainer(id: string, type: string, bindDomElement: HTMLElement, owner: AppModule): Container {
        let newContainer = null;

        if (!type || type === "stack") {
            newContainer = new PageContainer(id, bindDomElement, owner, {
                enableCssTransition: true
            });
        } else if ("flat") {
            newContainer = new FlatContainer(id, bindDomElement, owner);
        }

        return newContainer;
    }


}