import ModuleManager from "./module/module_manager";
import SourceRepository from "./source_repository";
import SharedCssScriptLoader from "./common/shared_css_script_loader";
var Configurer = /** @class */ (function () {
    function Configurer() {
        this.moduleManager = ModuleManager.getInstance();
        this.cssUris = new Array();
        this.scriptUris = new Array();
    }
    Configurer.getInstance = function () {
        return Configurer.instance;
    };
    Configurer.prototype.setAppRootId = function (appRootId) {
        this.appRootId = appRootId;
    };
    Configurer.prototype.setSourceVersion = function (version) {
        SourceRepository.getInstance().setSourceVersion(version);
    };
    Configurer.prototype.getAppRootId = function () {
        return this.appRootId;
    };
    Configurer.prototype.getSharedCssScriptLoader = function () {
        return new SharedCssScriptLoader(this.cssUris, this.scriptUris);
    };
    Configurer.prototype.register = function (moduleName, sourceUri, targetContainerId, isContainerDefault, options) {
        this.moduleManager.register(moduleName, sourceUri, targetContainerId, isContainerDefault, options);
    };
    Configurer.prototype.registerWindow = function (moduleName, sourceUri, windowOptions, options) {
        this.moduleManager.registerWindow(moduleName, sourceUri, windowOptions, options);
    };
    Configurer.prototype.registerContextMenu = function (moduleName, sourceUri, contextMenuOptions, options) {
        this.moduleManager.registerContextMenu(moduleName, sourceUri, contextMenuOptions, options);
    };
    Configurer.prototype.registerDrawer = function (moduleName, sourceUri, drawerOptions, options) {
        this.moduleManager.registerDrawer(moduleName, sourceUri, drawerOptions, options);
    };
    Configurer.prototype.loadSharedCss = function (uri) {
        this.cssUris.push(uri);
    };
    Configurer.prototype.loadSharedScript = function (uri) {
        this.scriptUris.push(uri);
    };
    Configurer.instance = new Configurer();
    return Configurer;
}());
export default Configurer;
