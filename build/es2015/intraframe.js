import ModuleManager from "./core/module/module_manager";
import ContainerManager from "./core/container/container_manager";
import OvarlayManager from "./core/overlay/overlay_manager";
import Common from "./core/common/common";
import Configurer from "./core/configurer";
import RuntimeError from "./core/common/runtime_error";
if (document["documentMode"]) {
    Common.isMsIE = true;
}
window.addEventListener("mousemove", function (e) {
    Common.currentMouseClientX = e.clientX;
    Common.currentMouseClientY = e.clientY;
});
var __sharedCssScriptIsLoaded = false;
var __moduleManagerIsInitialized = false;
var __bootloader = function () {
    console.log("bootloader is called.");
    var __global = window;
    if (__global.configurer) {
        var configurer = Configurer.getInstance();
        __global.configurer(configurer);
        configurer.getSharedCssScriptLoader().load().then(function () {
            console.log("css and scripts is loaded.");
            __sharedCssScriptIsLoaded = true;
            __startApplications();
        });
        var appRootEl = document.querySelector("#" + configurer.getAppRootId());
        if (!appRootEl) {
            throw new RuntimeError("有効なルートコンテナが設定されていません。");
        }
        ContainerManager.getInstance().setRootElement(appRootEl);
        OvarlayManager.getInstance().setViewPortElement(appRootEl);
        ModuleManager.getInstance().initialize().then(function () {
            console.log("moduleManager is initialized.");
            __moduleManagerIsInitialized = true;
            __startApplications();
        });
    }
    else {
        console.log("configurerが未定義です。");
    }
};
var __startApplications = function () {
    if (!__sharedCssScriptIsLoaded || !__moduleManagerIsInitialized)
        return;
    ContainerManager.getInstance().initializeRootContainer();
    var resizeEvent;
    if (Common.isMsIE) {
        resizeEvent = document.createEvent("Event");
        resizeEvent.initEvent("resize", true, false);
    }
    else {
        resizeEvent = new Event("resize");
    }
    window.dispatchEvent(resizeEvent);
};
if (document.readyState === "complete") {
    __bootloader();
}
else {
    window.addEventListener("load", function () {
        __bootloader();
    });
}
