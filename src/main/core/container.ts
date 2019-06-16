import Module from "./module";

export default interface Container {
    changeModule(module: Module): void;
    getBindModule(): Module;
}