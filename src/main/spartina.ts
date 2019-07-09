import { ModuleType } from "./core/module";
import ModuleManager from "./core/module_manager";

console.log("******** start ********");

var moduleManager = ModuleManager.getInstance();

moduleManager.registerDescription({
    name: "Base",
    sourceUri: "src/module/base.html",
    componentType: ModuleType.Native,
    targetContainerId: ""
});

moduleManager.initialize();

console.log("******** end ********");