var Container = /** @class */ (function () {
    function Container(id, bindDomElement, owner, cssTransitionOptions) {
        this.mountedModules = new Map();
        this.moduleChangeHistory = new Array();
        this.inBackProcess = false;
        this.containerParcel = null;
        this.containerResult = null;
        this.id = id;
        this.bindDomElement = bindDomElement;
        this.owner = owner;
        this.cssTransitionOptions = cssTransitionOptions;
        this.bindDomElement.style.position = "relative";
        this.bindDomElement.classList.add("itm_container");
    }
    Container.prototype.triggerSubContainerNavigationEvent = function () {
        if (this.owner) {
            this.owner.getOwnerContainer().subContainerNavigationEventHandler(this, this.activeModule);
        }
    };
    Container.prototype.getId = function () {
        return this.id;
    };
    Container.prototype.getElement = function () {
        return this.bindDomElement;
    };
    // public getParent(): Container {
    //     return this.parent;
    // }
    Container.prototype.getOwner = function () {
        return this.owner;
    };
    Container.prototype.getActiveModule = function () {
        return this.activeModule;
    };
    Container.prototype.setDefaultModule = function (module) {
        this.defaultModule = module;
    };
    Container.prototype.getContainerResult = function () {
        return this.containerResult;
    };
    Container.prototype.setContainerResult = function (result) {
        this.containerResult = result;
    };
    Container.prototype.getModuleChangeHistory = function () {
        return this.moduleChangeHistory;
    };
    Container.prototype.onShow = function () {
    };
    Container.prototype.onResize = function () {
        this.mountedModules.forEach(function (module) {
            module.dispatchResizeEvent();
        });
    };
    Container.prototype.subContainerNavigationEventHandler = function (container, module) {
        if (!this.activeModule)
            return;
        var info = {
            moduleName: module.getName(),
            caption: module.getCaption()
        };
        var histories = new Array();
        var moduleHistories = container.getModuleChangeHistory();
        moduleHistories.forEach(function (m) {
            histories.push({
                moduleName: m.getName(),
                caption: m.getCaption()
            });
        });
        var allowBubbling = this.activeModule.subContainerNavigationEventHandler(container.getId(), info, histories);
        if (allowBubbling !== false) {
            this.triggerSubContainerNavigationEvent();
        }
    };
    return Container;
}());
export default Container;
//# sourceMappingURL=container.js.map