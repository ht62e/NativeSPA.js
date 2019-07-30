import ModuleManager, { ModuleType } from "./core/module_manager";
import ContainerManager from "./core/container_manager";

console.log("******** start ********");

var moduleManager = ModuleManager.getInstance();
var containerManager = ContainerManager.getInstance();


const rootContainer = containerManager.createContainer("root", "", document.getElementById("app") as HTMLDivElement);

window.addEventListener("resize", (event) => {
    rootContainer.getElement().style.width = window.innerWidth + "px";
    rootContainer.getElement().style.height = window.innerHeight + "px";

    rootContainer.onResize();
});

moduleManager.register("base", "src/module/base.html", "root", true);
moduleManager.register("header", "src/module/header.html", "base.header", true);
moduleManager.register("main", "src/module/main.html", "base.body", false);
moduleManager.register("main2", "src/module/main2.html", "base.body", false);


moduleManager.initialize().then(() => {
    window.dispatchEvent(new Event("resize"));
});



console.log("******** end ********");


