import RuntimeError from "../common/runtime_error";
import Container from "./container";
import HierarchicalContainer from "./hierarchical_container";
import FlatContainer from "./flat_container";

export default class ContainerManager {
    private static instance = new ContainerManager();

    private rootContainer: Container;
    private containers: Map<string, Container>;

    private windowResizeEventHandlerBindThis: (event: Event) => void;

    constructor() {
        this.containers = new Map<string, Container>();
        this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
    }

    public static getInstance(): ContainerManager {
        return ContainerManager.instance;
    }

    public setRootElement(element: HTMLDivElement): void {
        this.rootContainer = this.createContainer("root", "", element);
        window.addEventListener("resize", this.windowResizeEventHandlerBindThis);
    }

    private windowResizeEventHandler(event: Event): void {
        this.rootContainer.onResize();
    }

    public createContainer(id: string, type: string, bindDomElement: HTMLDivElement): Container {
        if (this.containers.has(id)) {
            throw new RuntimeError("コンテナID '" + id + "' は既に登録されています。");
        }

        let newContainer = null;

        if (!type || type === "separated") {
            //newContainer = new HierarchicalContainer(id, bindDomElement);
            newContainer = new HierarchicalContainer(id, bindDomElement, {
                enableCssTransition: true
            });
        } else if ("continuous") {
            newContainer = new FlatContainer(id, bindDomElement);
        }
        
        this.containers.set(id, newContainer);
        return newContainer;
    }

    public initializeRootContainer(): void {
        console.log("ContainerManager.initializeRootContainer");
        this.rootContainer.initialize();
    }

    public getContainer(id: string): Container {
        return this.containers.get(id);
    }
}