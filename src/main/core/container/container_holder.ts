import Container from "./container";

export default interface ContainerHolder {
    getChildContainer(containerName: string): Container;
}