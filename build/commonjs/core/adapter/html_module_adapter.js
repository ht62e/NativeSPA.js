var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import ModuleRouter from "../module/module_router";
import OvarlayManager from "../overlay/overlay_manager";
import { Result } from "../common/dto";
import ModuleManager from "../module/module_manager";
import Navigation from "./navigation";
export var htmlModuleAdapters = new Map();
var HtmlModuleAdapter = /** @class */ (function () {
    function HtmlModuleAdapter() {
        this.isModified = false;
        this.moduleRouter = ModuleRouter.getInstance();
        this.moduleManager = ModuleManager.getInstance();
        this.overlayManager = OvarlayManager.getInstance();
        this.exitCallbackReturnFunctionsObject = {
            cancelExit: this.cancelExit.bind(this),
            continueExit: this.continueExit.bind(this)
        };
        this.navigation = new Navigation(this);
    }
    HtmlModuleAdapter.prototype.setHtmlComponent = function (htmlModule) {
        this.htmlModule = htmlModule;
    };
    HtmlModuleAdapter.prototype.getHtmlComponent = function () {
        return this.htmlModule;
    };
    HtmlModuleAdapter.prototype.setCaption = function (caption) {
        this.htmlModule.setCaption(caption);
    };
    HtmlModuleAdapter.prototype.sendMessage = function (destination, command, message) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.moduleManager.dispatchMessage(destination, command, message)];
            });
        });
    };
    HtmlModuleAdapter.prototype.triggerOnLoad = function (param) {
        if (this.onLoad)
            this.onLoad(param);
    };
    HtmlModuleAdapter.prototype.triggerOnInitialize = function (param) {
        if (this.onInitialize)
            this.onInitialize(param);
    };
    HtmlModuleAdapter.prototype.triggerOnShow = function (isFirst, param) {
        if (this.onShow)
            this.onShow(isFirst, param);
    };
    HtmlModuleAdapter.prototype.triggerOnHide = function (param) {
        if (this.onHide)
            this.onHide(param);
    };
    HtmlModuleAdapter.prototype.triggerOnExit = function (actionType) {
        if (this.onExit) {
            this.onExit(actionType, this.exitCallbackReturnFunctionsObject);
        }
        else {
            this.continueExit(new Result(actionType, true));
        }
    };
    HtmlModuleAdapter.prototype.triggerOnReceiveMessage = function (command, message) {
        if (this.onMessageReceived) {
            this.onMessageReceived(command, this.returnMessageResponse.bind(this), message);
        }
        else {
        }
    };
    HtmlModuleAdapter.prototype.triggerOnSubContainerNavigated = function (subContainerId, currentInfo, histories) {
        if (this.onSubContainerNavigated) {
            return this.onSubContainerNavigated(subContainerId, currentInfo, histories);
        }
        else {
            return null;
        }
    };
    HtmlModuleAdapter.prototype.continueExit = function (result) {
        this.htmlModule.continueExitProcess(result);
    };
    HtmlModuleAdapter.prototype.cancelExit = function () {
        this.htmlModule.cancelExitProcess();
    };
    HtmlModuleAdapter.prototype.returnMessageResponse = function (response) {
        this.htmlModule.returnMessageResponse(response);
    };
    return HtmlModuleAdapter;
}());
export default HtmlModuleAdapter;
var __global = window;
__global.__HtmlModuleAdapter = HtmlModuleAdapter;
__global.__registerHTMLComponentAdapter = function (moduleIndex, componentClass) {
    htmlModuleAdapters.set(moduleIndex, componentClass);
};
//# sourceMappingURL=html_module_adapter.js.map