import Module from "./module";

export default abstract class AbstractContainer {
    public abstract getId(): string;
    public abstract addModule(module: Module): Promise<boolean>;
}