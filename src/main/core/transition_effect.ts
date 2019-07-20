import Module from "./module";

export default interface TransitionEffect {
    start(currentModule: Module, nextModule: Module): void;
}