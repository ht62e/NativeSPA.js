import Module from "./module/module";

export default interface TransitionEffect {
    start(currentModule: Module, nextModule: Module): void;
}