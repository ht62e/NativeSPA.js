import RuntimeError from "../common/runtime_error";
import PageContainer from "./page_container";
import FlatContainer from "./flat_container";
var ContainerManager = /** @class */ (function () {
    function ContainerManager() {
        this.containers = new Map();
        this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
    }
    ContainerManager.getInstance = function () {
        return ContainerManager.instance;
    };
    ContainerManager.prototype.setRootElement = function (element) {
        this.rootContainer = this.createContainer("root", "", element, null);
        window.addEventListener("resize", this.windowResizeEventHandlerBindThis);
    };
    ContainerManager.prototype.windowResizeEventHandler = function (event) {
        this.rootContainer.onResize();
    };
    ContainerManager.prototype.createContainer = function (id, type, bindDomElement, owner) {
        if (this.containers.has(id)) {
            throw new RuntimeError("コンテナID '" + id + "' は既に登録されています。");
        }
        var newContainer = null;
        if (!type || type === "separated") {
            //newContainer = new PageContainer(id, bindDomElement);
            newContainer = new PageContainer(id, bindDomElement, owner, {
                enableCssTransition: true
            });
        }
        else if ("continuous") {
            newContainer = new FlatContainer(id, bindDomElement, owner);
        }
        this.containers.set(id, newContainer);
        return newContainer;
    };
    ContainerManager.prototype.initializeRootContainer = function () {
        console.log("ContainerManager.initializeRootContainer");
        this.rootContainer.initialize();
    };
    ContainerManager.prototype.getContainer = function (id) {
        return this.containers.get(id);
    };
    ContainerManager.instance = new ContainerManager();
    return ContainerManager;
}());
export default ContainerManager;
//# sourceMappingURL=container_manager.js.map