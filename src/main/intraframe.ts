import ModuleManager from "./core/module/module_manager";
import ContainerFactory from "./core/container/container_factory";
import OvarlayManager from "./core/overlay/overlay_manager";
import Common from "./core/common/common";
import Configurer from "./core/configurer";
import RuntimeError from "./core/common/runtime_error";
import Container from "./core/container/container";

if (document["documentMode"]) {
    Common.isMsIE = true;
}

window.addEventListener("mousemove", (e: MouseEvent) => {
    Common.currentMouseClientX = e.clientX;
    Common.currentMouseClientY = e.clientY;
});

var __sharedCssScriptIsLoaded: boolean = false;
var __moduleManagerIsInitialized: boolean = false;

var __bootloader = function() {
    console.log("bootloader is called.");

    const __global = window as any;
    if (__global.configurer) {
        const configurer = Configurer.getInstance();

        __global.configurer(configurer);

        configurer.getSharedCssScriptLoader().load().then(() => {
            console.log("css and scripts is loaded.");
            __sharedCssScriptIsLoaded = true;
            __startApplications();
        });

        const appRootEl: HTMLDivElement = document.querySelector("#" + configurer.getAppRootId());

        if (!appRootEl) {
            throw new RuntimeError("有効なルートコンテナが設定されていません。");
        }

        const rootContainer: Container = ContainerFactory.createContainer(ContainerFactory.ROOT_CONTAINER_ID, "", appRootEl, null);

        //ContainerFactory.getInstance().setRootElement(appRootEl);
        OvarlayManager.getInstance().setViewPortElement(appRootEl);

        ModuleManager.getInstance().initialize(rootContainer).then(() => {
            console.log("moduleManager is initialized.");
            __moduleManagerIsInitialized = true;
            __startApplications();
        });    
    } else {
        console.log("configurerが未定義です。");
    }
}

var __startApplications = function() {
    if (!__sharedCssScriptIsLoaded || !__moduleManagerIsInitialized) return;

    ModuleManager.getInstance().run();
        
    let resizeEvent: Event;
    if(Common.isMsIE){
        resizeEvent = document.createEvent("Event")
        resizeEvent.initEvent("resize", true, false);
    }else{
        resizeEvent = new Event("resize");
    }
    window.dispatchEvent(resizeEvent);
}

if (document.readyState === "complete") {
    __bootloader();
} else {
    window.addEventListener("load", () => {
        __bootloader();
    });
}


