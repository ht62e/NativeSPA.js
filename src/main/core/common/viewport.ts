import ContainerHolder from "../container/container_holder";
import ContainerFactory from "../container/container_factory";
import Container from "../container/container";
import OverlayManager from "../overlay/overlay_manager";

export default class ViewPort implements ContainerHolder {
    private element: HTMLElement;
    private overlayManager: OverlayManager;
    private container: Container;
    
    constructor (element: HTMLElement, overlayManager: OverlayManager) {
        this.element = element;
        this.overlayManager = overlayManager;
        this.container = ContainerFactory.createContainer(ContainerFactory.ROOT_CONTAINER_ID, "", element, null);
    }

    public getChildContainer(containerName: string): Container {
        return this.container;
    }

    public getViewPortContainer(): Container {
        return this.container;
    }

    public getOverlayManager(): OverlayManager {
        return this.overlayManager;
    }
}