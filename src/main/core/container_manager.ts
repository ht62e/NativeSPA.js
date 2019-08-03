import RuntimeError from "./runtime_error";
import Container from "./container";

export default class ContainerManager {
    private static instance = new ContainerManager();

    private containers: Map<string, Container>;

    constructor() {
        this.containers = new Map<string, Container>();
    }

    public static getInstance(): ContainerManager {
        return ContainerManager.instance;
    }

    public createRootContainer(domElement: HTMLDivElement): Container {
        return this.createContainer("root", "", domElement);
    }

    public createContainer(id: string, type: string, bindDomElement: HTMLDivElement): Container {
        if (this.containers.has(id)) {
            throw new RuntimeError("コンテナID重複");
        }
        let newContainer = new Container(id, bindDomElement);
        this.containers.set(id, newContainer);
        return newContainer;
    }

    public getContainer(id: string): Container {
        return this.containers.get(id);
    }
}