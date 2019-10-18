import ModuleManager, { registerOptions } from "./module/module_manager";
import { WindowOptions } from "./overlay/dialog_window";
import { ContextMenuOptions } from "./overlay/context_menu";
import { DrawerOptions } from "./overlay/drawer";

export default class Config {
    private static instance = new Config();

    public static getInstance(): Config {
        return Config.instance;
    }

    private appRootId: string;
    private moduleManager: ModuleManager;

    constructor() {
        this.moduleManager = ModuleManager.getInstance();
    }

    public setAppRootId(appRootId: string) {
        this.appRootId = appRootId;
    }

    public getAppRootId(): string {
        return this.appRootId;
    } 

    public register(moduleName: string , sourceUri: string, targetContainerId: string, 
                    isContainerDefault: boolean, options?: registerOptions): void {
        this.moduleManager.register(moduleName, sourceUri, targetContainerId, isContainerDefault, options);
    }

    public registerWindow(moduleName: string, sourceUri: string, windowOptions: WindowOptions, options?: registerOptions) {
        this.moduleManager.registerWindow(moduleName, sourceUri, windowOptions, options);
    }

    public registerContextMenu(moduleName: string, sourceUri: string, contextMenuOptions: ContextMenuOptions, options?: registerOptions) {
        this.moduleManager.registerContextMenu(moduleName, sourceUri, contextMenuOptions, options);
    }

    public registerDrawer(moduleName: string, sourceUri: string, drawerOptions: DrawerOptions, options?: registerOptions) {
        this.moduleManager.registerDrawer(moduleName, sourceUri, drawerOptions, options);
    }
}
