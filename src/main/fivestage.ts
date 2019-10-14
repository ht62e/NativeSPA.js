import ModuleManager from "./core/module/module_manager";
import ContainerManager from "./core/container/container_manager";
import OvarlayManager from "./core/overlay/overlay_manager";
import Common from "./core/common/common";
import Config from "./core/configurer";
import RuntimeError from "./core/common/runtime_error";

console.log("******** start ********");

if (document["documentMode"]) {
    Common.isMsIE = true;
}

window.addEventListener("mousemove", (e: MouseEvent) => {
    Common.currentMouseClientX = e.clientX;
    Common.currentMouseClientY = e.clientY;
});

let __bootloader = function() {
    const __global = window as any;
    if (__global.configurer) {
        const config = Config.getInstance();

        __global.configurer(config);

        const appRootEl: HTMLDivElement = document.querySelector(config.getAppRootId());

        if (!appRootEl) {
            throw new RuntimeError("有効なルートコンテナが設定されていません。");
        }

        ContainerManager.getInstance().setRootElement(appRootEl);
        OvarlayManager.getInstance().setViewPortElement(appRootEl);

        ModuleManager.getInstance().initialize().then(() => {
            console.log("moduleManager is initialized.");
            ContainerManager.getInstance().initializeRootContainer();
        
            let resizeEvent: Event;
            if(Common.isMsIE){
                resizeEvent = document.createEvent("Event")
                resizeEvent.initEvent("resize", true, false);
            }else{
                resizeEvent = new Event("resize");
            }
            window.dispatchEvent(resizeEvent);
            
        });    
    } else {
        console.log("configurerが未定義です。");
    }
}


if (document.readyState === "complete") {
    __bootloader();
} else {
    window.addEventListener("load", () => {
        __bootloader();
    });
}

console.log("******** end ********");


