import AbstractContainer from "./abstract_container";
import RuntimeError from "./runtime_error";
import Container from "./container";

export default class ContainerManager {
    private static instance = new ContainerManager();

    private containers: Map<string, AbstractContainer>;

    constructor() {
        this.containers = new Map<string, AbstractContainer>();
    }

    public static getInstance(): ContainerManager {
        return ContainerManager.instance;
    }

    public createContainer(id: string, type: string, bindDomElement: HTMLDivElement): AbstractContainer {
        if (this.containers.has(id)) {
            throw new RuntimeError("コンテナID重複");
        }
        let newContainer = new Container(id, bindDomElement);
        this.containers.set(id, newContainer);
        return newContainer;
    }

    public getContainer(id: string): AbstractContainer {
        return this.containers.get(id);
    }
}