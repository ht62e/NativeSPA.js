import ModuleManager, { ModuleType } from "./core/module/module_manager";
import ContainerManager from "./core/container/container_manager";
import OvarlayManager from "./core/overlay/overlay_manager";

console.log("******** start ********");

var _fivestage_isMsIE: boolean = false;

if (document["documentMode"]) {
    _fivestage_isMsIE = true;
}

var moduleManager = ModuleManager.getInstance();
var containerManager = ContainerManager.getInstance();
var overlayManager = OvarlayManager.getInstance();

const rootElement: HTMLDivElement = document.getElementById("app") as HTMLDivElement;
containerManager.setRootElement(rootElement);
overlayManager.setViewPortElement(rootElement);

moduleManager.register("base", "src/module/base.html", "root", true);
moduleManager.register("header", "src/module/header.html", "base.header", true);
moduleManager.register("main", "src/module/main.html", "base.body", false);
moduleManager.register("main2", "src/module/main2.html", "base.body", false);
moduleManager.register("tab", "src/module/tab.html", "base.body", false);

moduleManager.register("tab1", "src/module/main.html", "tab.page", false);
moduleManager.register("tab2", "src/module/main2.html", "tab.page", false);
moduleManager.register("tab3", "src/module/header.html", "tab.page", false);

moduleManager.registerWindow("win1", "src/module/main.html", {});
moduleManager.registerWindow("win2", "src/module/main.html", {});
moduleManager.registerWindow("win3", "src/module/main.html", {});

moduleManager.initialize().then(() => {
    console.log("moduleManager is initialized.");
    containerManager.initializeRootContainer();

    let resizeEvent: Event;
    if(_fivestage_isMsIE){
        resizeEvent = document.createEvent("Event")
        resizeEvent.initEvent("resize", true, false);
    }else{
        resizeEvent = new Event("resize");
    }
    window.dispatchEvent(resizeEvent);
    
});



console.log("******** end ********");


