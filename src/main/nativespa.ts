import { ModuleType } from "./core/module";
import ModuleManager from "./core/module_manager";
import ContainerManager from "./core/container_manager";

console.log("******** start ********");

var moduleManager = ModuleManager.getInstance();
var containerManager = ContainerManager.getInstance();

//window.addEventListener("load", (event) => {
    const rootContainer = containerManager.createContainer("root", "", document.getElementById("app") as HTMLDivElement);
    
    window.addEventListener("resize", (event) => {
        rootContainer.getElement().style.width = window.innerWidth + "px";
        rootContainer.getElement().style.height = window.innerHeight + "px";

        rootContainer.onResize();
    });
    
    moduleManager.registerDescription({
        name: "base",
        sourceUri: "src/module/base.html",
        componentType: ModuleType.Native,
        targetContainerId: "root",
        isContainerDefault: true
    });

    moduleManager.registerDescription({
        name: "header",
        sourceUri: "src/module/header.html",
        componentType: ModuleType.Native,
        targetContainerId: "base.header",
        isContainerDefault: true
    });

    moduleManager.registerDescription({
        name: "main",
        sourceUri: "src/module/main.html",
        componentType: ModuleType.Native,
        targetContainerId: "base.body"
    });

    moduleManager.registerDescription({
        name: "main2",
        sourceUri: "src/module/main2.html",
        componentType: ModuleType.Native,
        targetContainerId: "base.body"
    });
    
    moduleManager.initialize().then(() => {
        window.dispatchEvent(new Event("resize"));
    });

    
    
    console.log("******** end ********");
//});

