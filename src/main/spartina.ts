import { ModuleType } from "./core/module";
import ModuleManager from "./core/module_manager";
import ContainerManager from "./core/container_manager";

console.log("******** start ********");

var moduleManager = ModuleManager.getInstance();
var containerManager = ContainerManager.getInstance();

window.addEventListener("load", (e) => {
    containerManager.createContainer("root", "", document.getElementById("app") as HTMLDivElement);
    
    
    moduleManager.registerDescription({
        name: "base",
        sourceUri: "src/module/base.html",
        componentType: ModuleType.Native,
        targetContainerId: "root"
    });

    moduleManager.registerDescription({
        name: "header",
        sourceUri: "src/module/header.html",
        componentType: ModuleType.Native,
        targetContainerId: "base.header"
    });
    
    moduleManager.initialize();
    
    console.log("******** end ********");
});

