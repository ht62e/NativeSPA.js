var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
import Container from "./container";
import RuntimeError from "../common/runtime_error";
var FlatContainer = /** @class */ (function (_super) {
    __extends(FlatContainer, _super);
    function FlatContainer(id, bindDomElement, owner, cssTransitionOptions) {
        var _this = _super.call(this, id, bindDomElement, owner, cssTransitionOptions) || this;
        _this.moduleOrders = new Map();
        _this.scrollBoxElement = document.createElement("div");
        _this.scrollBoxElement.style.position = "absolute";
        _this.scrollBoxElement.style.overflow = "hidden";
        _this.scrollBoxElement.style.width = "100%";
        _this.scrollBoxElement.style.height = "100%";
        _this.scrollBoxElement.className = "itm_flat_container_transition";
        bindDomElement.classList.add("itm_flat_container");
        bindDomElement.appendChild(_this.scrollBoxElement);
        return _this;
    }
    //Override
    FlatContainer.prototype.onShow = function () {
    };
    FlatContainer.prototype.addModule = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.mountedModules.set(module.getName(), module);
                        this.moduleOrders.set(module.getName(), this.mountedModules.size - 1);
                        return [4 /*yield*/, module.mount(function (element) {
                                _this.scrollBoxElement.appendChild(element);
                                _this.scrollBoxElement.style.width = "calc(100% * " + _this.mountedModules.size + ")";
                                return _this;
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    FlatContainer.prototype.initialize = function (parcel) {
        this.updateAllModulePositionAndSize();
        this.mountedModules.forEach(function (m) {
            m.initialize(parcel);
            m.show();
        });
        if (this.defaultModule) {
            this.forward(this.defaultModule, parcel);
        }
    };
    FlatContainer.prototype.activateModule = function (module, parcel) {
        return __awaiter(this, void 0, void 0, function () {
            var leftIndex, transX;
            return __generator(this, function (_a) {
                if (!this.mountedModules.has(module.getName())) {
                    throw new RuntimeError("マウントされていないモジュールです。");
                }
                leftIndex = this.moduleOrders.get(module.getName());
                transX = Math.round(10000 / this.mountedModules.size * leftIndex) / 100;
                this.scrollBoxElement.style.transform = "translate(-" + String(transX) + "%)";
                this.activeModule = module;
                this.triggerSubContainerNavigationEvent();
                return [2 /*return*/, true];
            });
        });
    };
    FlatContainer.prototype.forward = function (module, parcel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.activateModule(module, parcel);
                return [2 /*return*/, null];
            });
        });
    };
    FlatContainer.prototype.back = function () {
        //無効な操作
    };
    FlatContainer.prototype.updateAllModulePositionAndSize = function () {
        var _this = this;
        var leftValueCommon = "calc(100% / " + this.mountedModules.size + " * "; //+ leftIndex + ")";
        var widthValue = String(Math.round(1.0 / this.mountedModules.size * 10000) / 100) + "%";
        this.mountedModules.forEach(function (m) {
            var order = _this.moduleOrders.get(m.getName());
            var leftValue = leftValueCommon + order + ")";
            m.changeModuleCssPosition(leftValue, "0px");
            m.changeModuleCssSize(widthValue, "100%");
        });
    };
    FlatContainer.prototype.showPreviousModule = function () {
        throw new Error("Method not implemented.");
    };
    return FlatContainer;
}(Container));
export default FlatContainer;
