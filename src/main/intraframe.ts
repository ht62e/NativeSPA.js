/*

    intraframe.js

    Copyright (c) 2019 Ryota Takaki

    This software is released under the MIT License.
    http://opensource.org/licenses/mit-license.php

*/

import ModuleLoader, { RegisterOptions } from "./core/module/module_loader";
import Common from "./core/common/common";
import OverlayManager, { OverlayConfig } from "./core/overlay/overlay_manager";
import SharedCssScriptLoader from "./core/common/shared_css_script_loader";
import ContainerFactory from "./core/container/container_factory";
import DialogWindow, { WindowOptions } from "./core/overlay/dialog_window";
import ContextMenu, { ContextMenuOptions } from "./core/overlay/context_menu";
import Drawer, { DrawerOptions } from "./core/overlay/drawer";
import SourceRepository from "./core/source_repository";
import RuntimeError from "./core/common/runtime_error";
import ViewPort from "./core/common/viewport";

export default class IntraFrame {
    public static instances = new Array<IntraFrame>();

    private appElement: HTMLDivElement;
    private moduleLoader: ModuleLoader;
    private overlayManager: OverlayManager;

    constructor() {
        IntraFrame.instances.push(this);
        this.moduleLoader = new ModuleLoader();
    }

    public getModuleLoader(): ModuleLoader {
        return this.moduleLoader;
    }

    public getOverlayManager(): OverlayManager {
        return this.overlayManager;
    }

    public setAppElementId(viewPortId: string) {
        this.appElement = document.querySelector("#" + viewPortId);
        if (!this.appElement) {
            throw new RuntimeError("有効なルートコンテナが設定されていません。");
        }
        this.overlayManager = new OverlayManager(this.appElement);
        this.moduleLoader.setViewPort(new ViewPort(this.appElement, this.overlayManager));
    }

    public setSourceVersion(version: string) {
        SourceRepository.getInstance().setSourceVersion(version);
    }

    public register(moduleName: string , sourceUri: string, targetContainerId: string, 
        isContainerDefault: boolean, options?: RegisterOptions): void {
        this.moduleLoader.register(moduleName, sourceUri, targetContainerId, isContainerDefault, options);
    }

    public setRootModule(moduleName: string, sourceUri: string) {
        this.moduleLoader.register(moduleName, sourceUri, ContainerFactory.ROOT_CONTAINER_ID, true, null);
    }

    public registerWindow(moduleName: string, sourceUri: string, windowOptions: WindowOptions, options?: RegisterOptions) {
        const overlay = new DialogWindow(moduleName, this.moduleLoader, windowOptions);
        const config: OverlayConfig = {
            lazyLoading: options && options.lazyLoading ? options.lazyLoading : false,
            autoCloseWhenOutfocus: false
        };
        this.overlayManager.register(overlay, config);
        this.moduleLoader.register(moduleName, sourceUri, overlay.getContainerId(), true, options);
    }

    public registerContextMenu(moduleName: string, sourceUri: string, contextMenuOptions: ContextMenuOptions, options?: RegisterOptions) {
        const overlay = new ContextMenu(moduleName, this.moduleLoader, contextMenuOptions);
        const config: OverlayConfig = {
            lazyLoading: options && options.lazyLoading ? options.lazyLoading : false,
            autoCloseWhenOutfocus: true
        };
        this.overlayManager.register(overlay, config);
        this.moduleLoader.register(moduleName, sourceUri, overlay.getContainerId(), true, options);
    }

    public registerDrawer(moduleName: string, sourceUri: string, drawerOptions: DrawerOptions, options?: RegisterOptions) {
        const overlay = new Drawer(moduleName, this.moduleLoader, drawerOptions);
        const config: OverlayConfig = {
            lazyLoading: options && options.lazyLoading ? options.lazyLoading : false,
            autoCloseWhenOutfocus: true
        };
        this.overlayManager.register(overlay, config);
        this.moduleLoader.register(moduleName, sourceUri, overlay.getContainerId(), true, options);
    }
}

if (document["documentMode"]) {
    Common.isMsIE = true;
}

window.addEventListener("mousemove", (e: MouseEvent) => {
    Common.currentMouseClientX = e.clientX;
    Common.currentMouseClientY = e.clientY;
});

var __bootloader = async function() {
    console.log("bootloader is called.");
    const defaultApp = new IntraFrame();
    const cssUris = new Array<string>();
    const scriptUris = new Array<string>();

    document.documentElement.style.height = "100%";
    document.documentElement.style.overflow = "hidden";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";

    const __global = window as any;
    if (__global.intraframeConfig) {

        __global.intraframeConfig(defaultApp, cssUris, scriptUris);

        const scsLoader = new SharedCssScriptLoader(cssUris, scriptUris);

        await scsLoader.load();

        for (let i in IntraFrame.instances) {
            const moduleLoader: ModuleLoader = IntraFrame.instances[i].getModuleLoader();
            await moduleLoader.initialize();

            const overlayManager: OverlayManager = IntraFrame.instances[i].getOverlayManager();
            await overlayManager.initialize();
        }

        __startApplications();

    } else {
        console.log("function 'intraframeConfig' is not defined.");
    }
}

;(window as any).IntraFrame = IntraFrame;

var __startApplications = function() {
    IntraFrame.instances.forEach((intraFrame) => {
        intraFrame.getModuleLoader().run();
    });
        
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


