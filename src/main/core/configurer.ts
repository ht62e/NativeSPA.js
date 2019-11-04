import ModuleManager, { RegisterOptions } from "./module/module_manager";
import { WindowOptions } from "./overlay/dialog_window";
import { ContextMenuOptions } from "./overlay/context_menu";
import { DrawerOptions } from "./overlay/drawer";
import SourceRepository from "./source_repository";
import SharedCssScriptLoader from "./common/shared_css_script_loader";

export default class Configurer {
    private static instance = new Configurer();

    public static getInstance(): Configurer {
        return Configurer.instance;
    }

    private appRootId: string;
    private moduleManager: ModuleManager;
    private cssUris: Array<string>;
    private scriptUris: Array<string>;

    constructor() {
        this.moduleManager = ModuleManager.getInstance();
        this.cssUris = new Array<string>();
        this.scriptUris = new Array<string>();
    }

    public setAppRootId(appRootId: string) {
        this.appRootId = appRootId;
    }

    public setSourceVersion(version: string) {
        SourceRepository.getInstance().setSourceVersion(version);
    }

    public getAppRootId(): string {
        return this.appRootId;
    }

    public getSharedCssScriptLoader(): SharedCssScriptLoader {
        return new SharedCssScriptLoader(this.cssUris, this.scriptUris);
    }

    public register(moduleName: string , sourceUri: string, targetContainerId: string, 
                    isContainerDefault: boolean, options?: RegisterOptions): void {
        this.moduleManager.register(moduleName, sourceUri, targetContainerId, isContainerDefault, options);
    }

    public registerRootModule(moduleName: string, sourceUri: string) {
        this.moduleManager.register(moduleName, sourceUri, ModuleManager.ROOT_CONTAINER_ID, true, null);
    }

    public registerWindow(moduleName: string, sourceUri: string, windowOptions: WindowOptions, options?: RegisterOptions) {
        this.moduleManager.registerWindow(moduleName, sourceUri, windowOptions, options);
    }

    public registerContextMenu(moduleName: string, sourceUri: string, contextMenuOptions: ContextMenuOptions, options?: RegisterOptions) {
        this.moduleManager.registerContextMenu(moduleName, sourceUri, contextMenuOptions, options);
    }

    public registerDrawer(moduleName: string, sourceUri: string, drawerOptions: DrawerOptions, options?: RegisterOptions) {
        this.moduleManager.registerDrawer(moduleName, sourceUri, drawerOptions, options);
    }

    public loadSharedCss(uri: string): void {
        this.cssUris.push(uri);
    }

    public loadSharedScript(uri: string): void {
        this.scriptUris.push(uri);
    }
}
