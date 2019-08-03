import ModuleManager, { ModuleType } from "./core/module_manager";
import ContainerManager from "./core/container_manager";
import Container from "./core/container";
import OvarlayManager from "./core/overlay_manager";

console.log("******** start ********");

var moduleManager = ModuleManager.getInstance();
var containerManager = ContainerManager.getInstance();
var overlayManager = OvarlayManager.getInstance();

const rootElement: HTMLDivElement = document.getElementById("app") as HTMLDivElement;
const rootContainer: Container = containerManager.createRootContainer(rootElement);
overlayManager.setViewPortElement(rootElement);

window.addEventListener("resize", (event) => {
    rootElement.style.width = window.innerWidth + "px";
    rootElement.style.height = window.innerHeight + "px";

    rootContainer.onResize();
});

moduleManager.register("base", "src/module/base.html", "root", true);
moduleManager.register("header", "src/module/header.html", "base.header", true);
moduleManager.register("main", "src/module/main.html", "base.body", false);
moduleManager.register("main2", "src/module/main2.html", "base.body", false);

moduleManager.registerWindow("win1", "src/module/main.html", {});


moduleManager.initialize().then(() => {
    window.dispatchEvent(new Event("resize"));
});



console.log("******** end ********");


