import Module from "./module";

export default abstract class AbstractContainer {
    public abstract getId(): string;
    public abstract getElement(): HTMLDivElement;
    public abstract addModule(module: Module): Promise<boolean>;
    public abstract addModuleElement(element: HTMLDivElement);
}