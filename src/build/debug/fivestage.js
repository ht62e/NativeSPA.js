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
define("core/common/dto", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parcel = /** @class */ (function () {
        function Parcel(requestMode, params) {
            this.requestMode = requestMode;
            this.params = params;
        }
        return Parcel;
    }());
    exports.Parcel = Parcel;
    var RequestMode;
    (function (RequestMode) {
        RequestMode[RequestMode["READONLY"] = 0] = "READONLY";
        RequestMode[RequestMode["NEW"] = 1] = "NEW";
        RequestMode[RequestMode["NEW_EDIT"] = 2] = "NEW_EDIT";
        RequestMode[RequestMode["EDIT"] = 3] = "EDIT";
    })(RequestMode = exports.RequestMode || (exports.RequestMode = {}));
    var Result = /** @class */ (function () {
        function Result(actionType, isChanged, result) {
            this.actionType = actionType;
            this.isChanged = isChanged;
            this.result = result;
        }
        return Result;
    }());
    exports.Result = Result;
    var ActionType;
    (function (ActionType) {
        ActionType[ActionType["OK"] = 0] = "OK";
        ActionType[ActionType["CANCEL"] = 1] = "CANCEL";
        ActionType[ActionType["BACK"] = 2] = "BACK";
        ActionType[ActionType["FORCE_CANCEL"] = 3] = "FORCE_CANCEL";
        ActionType[ActionType["YES"] = 4] = "YES";
        ActionType[ActionType["NO"] = 5] = "NO";
    })(ActionType = exports.ActionType || (exports.ActionType = {}));
});
define("core/common/css_transition_driver", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CssTransitionDriver = /** @class */ (function () {
        function CssTransitionDriver(target, customClasses) {
            var _this = this;
            this.standyStateClass = "standy_state";
            this.enterTransitionClass = "enter_transition";
            this.leaveTransitionClass = "leave_transition";
            this.endStateClass = "end_state";
            this.showResolver = null;
            this.hideResolver = null;
            this.target = target;
            this.setCustomTransitionClasses(customClasses);
            this.target.addEventListener("transitionend", function (event) {
                if (_this.hideResolver) {
                    _this.target.style.display = "none";
                    if (_this.standyStateClass) {
                        _this.target.classList.add(_this.standyStateClass);
                    }
                    if (_this.leaveTransitionClass) {
                        _this.target.classList.remove(_this.leaveTransitionClass);
                    }
                    if (_this.endStateClass) {
                        _this.target.classList.remove(_this.endStateClass);
                    }
                    _this.hideResolver(true);
                    _this.hideResolver = null;
                }
                if (_this.showResolver) {
                    _this.showResolver(true);
                    _this.showResolver = null;
                }
            });
        }
        CssTransitionDriver.prototype.setCustomTransitionClasses = function (classes) {
            if (classes) {
                if (classes.standyStateClass !== undefined)
                    this.standyStateClass = classes.standyStateClass;
                if (classes.enterTransitionClass !== undefined)
                    this.enterTransitionClass = classes.enterTransitionClass;
                if (classes.leaveTransitionClass !== undefined)
                    this.leaveTransitionClass = classes.leaveTransitionClass;
                if (classes.endStateClass !== undefined)
                    this.endStateClass = classes.endStateClass;
            }
            if (this.target.style.display === "none" || this.target.style.visibility === "hidden") {
                this.target.classList.add(this.standyStateClass);
            }
        };
        CssTransitionDriver.prototype.show = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.hideResolver) {
                        //クローズアニメーション中に再表示した場合においても、hide呼び出し元は閉じたことを通知する
                        this.hideResolver(true);
                        this.hideResolver = null;
                    }
                    this.toggleClasses(true);
                    if (this.enterTransitionClass) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.showResolver = resolve;
                            })];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(true)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        CssTransitionDriver.prototype.hide = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.showResolver) {
                        this.showResolver(true);
                        this.showResolver = null;
                    }
                    this.toggleClasses(false);
                    if (this.leaveTransitionClass) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.hideResolver = resolve;
                            })];
                    }
                    else {
                        return [2 /*return*/, Promise.resolve(true)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        CssTransitionDriver.prototype.toggleClasses = function (visible) {
            var _this = this;
            if (visible) {
                this.target.style.display = "";
                this.target.style.visibility = "";
                window.setTimeout(function () {
                    _this.target.style.pointerEvents = "";
                    if (_this.enterTransitionClass) {
                        _this.target.classList.add(_this.enterTransitionClass);
                    }
                    if (_this.standyStateClass) {
                        _this.target.classList.remove(_this.standyStateClass);
                    }
                    if (_this.leaveTransitionClass) {
                        _this.target.classList.remove(_this.leaveTransitionClass);
                    }
                    if (_this.endStateClass) {
                        _this.target.classList.remove(_this.endStateClass);
                    }
                }, 0);
            }
            else {
                this.target.style.pointerEvents = "none";
                if (this.standyStateClass) {
                    this.target.classList.remove(this.standyStateClass);
                }
                if (this.enterTransitionClass) {
                    this.target.classList.remove(this.enterTransitionClass);
                }
                if (this.leaveTransitionClass) {
                    this.target.classList.add(this.leaveTransitionClass);
                }
                else {
                    this.target.style.display = "none";
                }
                if (this.endStateClass) {
                    this.target.classList.add(this.endStateClass);
                }
            }
        };
        return CssTransitionDriver;
    }());
    exports.default = CssTransitionDriver;
});
define("core/container/container", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Container = /** @class */ (function () {
        function Container(id, bindDomElement, cssTransitionOptions) {
            this.mountedModules = new Map();
            this.moduleChangeHistory = new Array();
            this.inBackProcess = false;
            this.containerParcel = null;
            this.containerResult = null;
            this.id = id;
            this.bindDomElement = bindDomElement;
            this.cssTransitionOptions = cssTransitionOptions;
            this.bindDomElement.style.position = "relative";
            this.bindDomElement.classList.add("fvst_container");
        }
        Container.prototype.getId = function () {
            return this.id;
        };
        Container.prototype.getElement = function () {
            return this.bindDomElement;
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
        Container.prototype.onShow = function () {
        };
        Container.prototype.onResize = function () {
            this.mountedModules.forEach(function (module) {
                module.dispachResizeEvent();
            });
        };
        return Container;
    }());
    exports.default = Container;
});
define("core/module/module", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/source_repository", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SourceRepository = /** @class */ (function () {
        function SourceRepository() {
            this.msIeMode = false;
            this.cache = new Map();
            var userAgent = window.navigator.userAgent.toLowerCase();
            if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
                this.msIeMode = true;
            }
        }
        SourceRepository.getInstance = function () {
            return SourceRepository.instance;
        };
        SourceRepository.prototype.preload = function (sourceUri) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.fetch(sourceUri)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        SourceRepository.prototype.fetch = function (sourceUri, noCache) {
            if (noCache === void 0) { noCache = false; }
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!noCache && this.cache.has(sourceUri)) {
                        return [2 /*return*/, this.cache.get(sourceUri)];
                    }
                    else {
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var httpRequest = new XMLHttpRequest();
                                httpRequest.onreadystatechange = function () {
                                    if (httpRequest.readyState === 4) {
                                        var isLocalAccessSuccess = false;
                                        if (!_this.msIeMode) {
                                            isLocalAccessSuccess =
                                                (httpRequest.responseURL.indexOf("file:///") > -1) && httpRequest.responseText !== null;
                                        }
                                        if (httpRequest.status === 200 || isLocalAccessSuccess) {
                                            var res = httpRequest.responseText;
                                            _this.cache.set(sourceUri, res);
                                            resolve(res);
                                        }
                                        else {
                                            reject(httpRequest.statusText);
                                        }
                                    }
                                };
                                httpRequest.open("GET", sourceUri + "?ver=" + Date.now().toString(), true);
                                httpRequest.send(null);
                            })];
                    }
                    return [2 /*return*/];
                });
            });
        };
        SourceRepository.instance = new SourceRepository();
        return SourceRepository;
    }());
    exports.default = SourceRepository;
});
define("core/common/runtime_error", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var RuntimeError = /** @class */ (function (_super) {
        __extends(RuntimeError, _super);
        function RuntimeError(message) {
            var _this = _super.call(this) || this;
            _this.message = message;
            return _this;
        }
        return RuntimeError;
    }(Error));
    exports.default = RuntimeError;
});
define("core/container/page_container", ["require", "exports", "core/container/container", "core/common/runtime_error", "core/common/dto", "core/common/css_transition_driver"], function (require, exports, container_1, runtime_error_1, dto_1, css_transition_driver_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageContainer = /** @class */ (function (_super) {
        __extends(PageContainer, _super);
        function PageContainer(id, bindDomElement, cssTransitionOptions) {
            var _this = _super.call(this, id, bindDomElement, cssTransitionOptions) || this;
            _this.cssTransitionDrivers = new Map();
            bindDomElement.classList.add("fvst_page_container");
            return _this;
        }
        PageContainer.prototype.addModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.mountedModules.set(module.getName(), module);
                            return [4 /*yield*/, module.mount(function (element) {
                                    if (_this.cssTransitionOptions && _this.cssTransitionOptions.enableCssTransition) {
                                        var driver = new css_transition_driver_1.default(element);
                                        driver.setCustomTransitionClasses(_this.cssTransitionOptions.cssTransitionDriverClasses);
                                        _this.cssTransitionDrivers.set(module.getName(), driver);
                                    }
                                    _this.bindDomElement.appendChild(element);
                                    return _this;
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        PageContainer.prototype.initialize = function (parcel) {
            if (this.defaultModule) {
                this.forward(this.defaultModule, parcel);
            }
        };
        PageContainer.prototype.forward = function (module, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (this.moduleChangeHistory.indexOf(module) !== -1)
                                return [2 /*return*/];
                            this.moduleChangeHistory.push(module);
                            this.activateModule(module, parcel);
                            return [4 /*yield*/, module.waitForExit()];
                        case 1:
                            result = _a.sent();
                            if (!this.inBackProcess) {
                                //backメソッドではなく、モジュールの自主的な終了の場合はページを前に戻す
                                this.showPreviousModule();
                            }
                            this.inBackProcess = false;
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        PageContainer.prototype.back = function () {
            var _this = this;
            this.inBackProcess = true;
            this.activeModule.exit(dto_1.ActionType.BACK).then(function (exited) {
                if (exited) {
                    _this.showPreviousModule();
                }
                else {
                    _this.inBackProcess = false;
                }
            });
        };
        PageContainer.prototype.activateModule = function (module, parcel) {
            if (!this.mountedModules.has(module.getName()))
                throw new runtime_error_1.default("指定されたモジュールはマウントされていません。");
            if (this.activeModule) {
                this.hideModule(this.activeModule);
            }
            module.initialize(parcel);
            this.showModule(module);
            var previousActiveModule = this.activeModule;
            this.activeModule = module;
            //その他モジュールの非表示化
            this.mountedModules.forEach(function (m) {
                if (m !== module && m !== previousActiveModule)
                    m.hide();
            });
        };
        PageContainer.prototype.showModule = function (targetModule) {
            var driver;
            if (driver = this.cssTransitionDrivers.get(targetModule.getName())) {
                driver.show();
            }
            else {
                targetModule.show();
            }
        };
        PageContainer.prototype.hideModule = function (targetModule) {
            var driver;
            if (driver = this.cssTransitionDrivers.get(targetModule.getName())) {
                driver.hide();
            }
            else {
                targetModule.hide();
            }
        };
        PageContainer.prototype.showPreviousModule = function () {
            if (this.moduleChangeHistory.length > 0) {
                this.moduleChangeHistory.pop();
            }
            if (this.moduleChangeHistory.length > 0) {
                this.activateModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
            }
            else {
                if (this.activeModule) {
                    this.hideModule(this.activeModule);
                }
            }
        };
        return PageContainer;
    }(container_1.default));
    exports.default = PageContainer;
});
define("core/container/flat_container", ["require", "exports", "core/container/container", "core/common/runtime_error"], function (require, exports, container_2, runtime_error_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlatContainer = /** @class */ (function (_super) {
        __extends(FlatContainer, _super);
        function FlatContainer(id, bindDomElement, cssTransitionOptions) {
            var _this = _super.call(this, id, bindDomElement, cssTransitionOptions) || this;
            _this.moduleOrders = new Map();
            _this.scrollBoxElement = document.createElement("div");
            _this.scrollBoxElement.style.position = "absolute";
            _this.scrollBoxElement.style.overflow = "hidden";
            _this.scrollBoxElement.style.width = "100%";
            _this.scrollBoxElement.style.height = "100%";
            _this.scrollBoxElement.className = "fvst_flat_container_transition";
            bindDomElement.classList.add("fvst_flat_container");
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
        };
        FlatContainer.prototype.activateModule = function (module, parcel) {
            if (!this.mountedModules.has(module.getName())) {
                throw new runtime_error_2.default("マウントされていないモジュールです。");
            }
            var leftIndex = this.moduleOrders.get(module.getName());
            var transX = Math.round(10000 / this.mountedModules.size * leftIndex) / 100;
            this.scrollBoxElement.style.transform = "translate(-" + String(transX) + "%)";
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
    }(container_2.default));
    exports.default = FlatContainer;
});
define("core/container/container_manager", ["require", "exports", "core/common/runtime_error", "core/container/page_container", "core/container/flat_container"], function (require, exports, runtime_error_3, page_container_1, flat_container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContainerManager = /** @class */ (function () {
        function ContainerManager() {
            this.containers = new Map();
            this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
        }
        ContainerManager.getInstance = function () {
            return ContainerManager.instance;
        };
        ContainerManager.prototype.setRootElement = function (element) {
            this.rootContainer = this.createContainer("root", "", element);
            window.addEventListener("resize", this.windowResizeEventHandlerBindThis);
        };
        ContainerManager.prototype.windowResizeEventHandler = function (event) {
            this.rootContainer.onResize();
        };
        ContainerManager.prototype.createContainer = function (id, type, bindDomElement) {
            if (this.containers.has(id)) {
                throw new runtime_error_3.default("コンテナID '" + id + "' は既に登録されています。");
            }
            var newContainer = null;
            if (!type || type === "separated") {
                //newContainer = new PageContainer(id, bindDomElement);
                newContainer = new page_container_1.default(id, bindDomElement, {
                    enableCssTransition: true
                });
            }
            else if ("continuous") {
                newContainer = new flat_container_1.default(id, bindDomElement);
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
    exports.default = ContainerManager;
});
define("core/module/module_router", ["require", "exports", "core/container/container_manager", "core/module/module_manager"], function (require, exports, container_manager_1, module_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleRouter = /** @class */ (function () {
        function ModuleRouter() {
        }
        ModuleRouter.getInstance = function () {
            return ModuleRouter.instance;
        };
        ModuleRouter.prototype.forward = function (targetIdentifier, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var s, targetContainerId, moduleName, target, module;
                return __generator(this, function (_a) {
                    s = targetIdentifier.split("::");
                    targetContainerId = s[0];
                    moduleName = s[1];
                    target = container_manager_1.default.getInstance().getContainer(targetContainerId);
                    module = module_manager_1.default.getInstance().getModule(moduleName);
                    return [2 /*return*/, target.forward(module, parcel)];
                });
            });
        };
        ModuleRouter.prototype.back = function (targetContainerId) {
            var target = container_manager_1.default.getInstance().getContainer(targetContainerId);
            target.back();
        };
        ModuleRouter.instance = new ModuleRouter();
        return ModuleRouter;
    }());
    exports.default = ModuleRouter;
});
define("core/common/types", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Point = /** @class */ (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    exports.Point = Point;
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    }());
    exports.Size = Size;
});
define("core/overlay/overlay", ["require", "exports", "core/overlay/overlay_manager", "core/common/types", "core/common/css_transition_driver"], function (require, exports, overlay_manager_1, types_1, css_transition_driver_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Overlay = /** @class */ (function () {
        function Overlay(viewPortElement, name, size) {
            this.lastFocusIsDetector = false;
            this.inactiveModalMode = false;
            this.isResizing = false;
            this.resizeHandleEl = new Array();
            this.viewPortEl = viewPortElement;
            this.name = name;
            var width = size ? size.width : Overlay.DEFAULT_OVERLAY_SIZE_WIDTH;
            var height = size ? size.height : Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT;
            //リサイズ可能領域のためのフレームを作成
            this.outerFrameEl = document.createElement("div");
            this.outerFrameEl.style.position = "absolute";
            this.outerFrameEl.style.backgroundColor = "transparent";
            this.outerFrameEl.style.display = "none";
            this.outerFrameEl.addEventListener("selectstart", this.onSelectStart.bind(this));
            this.outerFrameEl.addEventListener("mousedown", this.onOuterMouseDown.bind(this));
            //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
            //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
            this.tabFocusMoveHeadStopper = document.createElement("div");
            this.tabFocusMoveHeadStopper.className = "fvst_tabfocus_move_stopper";
            this.tabFocusMoveHeadStopper.style.height = "0px";
            this.tabFocusMoveHeadStopper.tabIndex = 0;
            this.tabFocusMoveHeadStopper.addEventListener("focusin", this.onTabFocusMoveHeadStopperFocusIn.bind(this));
            this.tabFocusMoveHeadDetector = document.createElement("div");
            this.tabFocusMoveHeadDetector.className = "fvst_tabfocus_move_detector";
            this.tabFocusMoveHeadDetector.style.height = "0px";
            this.tabFocusMoveHeadDetector.tabIndex = 0;
            this.tabFocusMoveHeadDetector.addEventListener("focusin", this.onTabFocusMoveHeadDetectorFocusIn.bind(this));
            //コンテンツコンテナ生成
            this.contentEl = document.createElement("div");
            this.contentEl.className = "fvst_overlay_container";
            this.contentEl.style.position = "absolute";
            this.contentEl.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
            this.contentEl.style.top = String(Overlay.resizeHandleThicknessPx) + "px";
            //overlayのモーダル表示によって非アクティブ化したときに表示するレイヤー
            this.modalInactiveLayer = document.createElement("div");
            this.modalInactiveLayer.className = "fvst_modal_background_layer";
            this.modalInactiveLayer.style.position = "absolute";
            this.modalInactiveLayer.style.overflow = "hidden";
            this.modalInactiveLayer.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
            this.modalInactiveLayer.style.top = String(Overlay.resizeHandleThicknessPx) + "px";
            this.modalInactiveLayer.style.display = "none";
            this.modalInactiveLayerTransitionDriver = new css_transition_driver_2.default(this.modalInactiveLayer);
            this.resize(width, height);
            //非表示エレメントの作成（Tabキー対策）
            this.tabFocusMoveTailDetector = document.createElement("div");
            this.tabFocusMoveTailDetector.className = "fvst_tabfocus_move_detector";
            this.tabFocusMoveTailDetector.style.height = "0px";
            this.tabFocusMoveTailDetector.tabIndex = 0;
            this.tabFocusMoveTailDetector.addEventListener("focusin", this.onTabFocusMoveTailDetectorFocusIn.bind(this));
            this.tabFocusMoveTailStopper = document.createElement("div");
            this.tabFocusMoveTailStopper.className = "fvst_tabfocus_move_stopper";
            this.tabFocusMoveTailStopper.style.height = "0px";
            this.tabFocusMoveTailStopper.tabIndex = 0;
            this.tabFocusMoveTailStopper.addEventListener("focusin", this.onTabFocusMoveTailStopperFocusIn.bind(this));
            this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
            this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));
            //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
            this.createResizeHandleElements();
            this.outerFrameEl.appendChild(this.tabFocusMoveHeadStopper);
            this.outerFrameEl.appendChild(this.tabFocusMoveHeadDetector);
            this.outerFrameEl.appendChild(this.contentEl);
            this.outerFrameEl.appendChild(this.tabFocusMoveTailDetector);
            this.outerFrameEl.appendChild(this.tabFocusMoveTailStopper);
            this.outerFrameEl.appendChild(this.modalInactiveLayer);
            viewPortElement.appendChild(this.outerFrameEl);
            this.outerFrameTransitionDriver = new css_transition_driver_2.default(this.outerFrameEl);
        }
        Overlay.prototype.createResizeHandleElements = function () {
            var _this = this;
            var size = Overlay.resizeHandleThicknessPx * 2;
            //0:左上 1:上中 2:右上 3:左中...8:右下  計8箇所 ※中中は無し
            for (var i = 0; i < 8; i++) {
                var el = document.createElement("div");
                el.dataset["positionIndex"] = String(i);
                el.style.position = "absolute";
                el.style.width = size + "px";
                el.style.height = size + "px";
                el.addEventListener("mousedown", this.onResizeHandleMouseDown.bind(this));
                this.resizeHandleEl.push(el);
            }
            //左上
            this.resizeHandleEl[0].style.cursor = "nwse-resize";
            //上
            this.resizeHandleEl[1].style.left = String(size) + "px";
            this.resizeHandleEl[1].style.width = "calc(100% - " + String(size * 2) + "px)";
            this.resizeHandleEl[1].style.cursor = "ns-resize";
            //右上
            this.resizeHandleEl[2].style.right = "0px";
            this.resizeHandleEl[2].style.cursor = "nesw-resize";
            //左中
            this.resizeHandleEl[3].style.top = String(size) + "px";
            this.resizeHandleEl[3].style.height = "calc(100% - " + String(size * 2) + "px)";
            this.resizeHandleEl[3].style.cursor = "ew-resize";
            //右中
            this.resizeHandleEl[4].style.right = "0px";
            this.resizeHandleEl[4].style.top = String(size) + "px";
            this.resizeHandleEl[4].style.height = "calc(100% - " + String(size * 2) + "px)";
            this.resizeHandleEl[4].style.cursor = "ew-resize";
            //左下
            this.resizeHandleEl[5].style.bottom = "0px";
            this.resizeHandleEl[5].style.cursor = "nesw-resize";
            //下
            this.resizeHandleEl[6].style.left = String(size) + "px";
            this.resizeHandleEl[6].style.bottom = "0px";
            this.resizeHandleEl[6].style.width = "calc(100% - " + String(size * 2) + "px)";
            this.resizeHandleEl[6].style.cursor = "ns-resize";
            //右下
            this.resizeHandleEl[7].style.right = "0px";
            this.resizeHandleEl[7].style.bottom = "0px";
            this.resizeHandleEl[7].style.cursor = "nwse-resize";
            this.resizeHandleEl.forEach(function (element) {
                _this.outerFrameEl.appendChild(element);
            });
        };
        Overlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
            if (this.isResizing) {
                switch (this.resizePositionIndex) {
                    case 0: //左上
                        this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                        this.resize(this.resizeStartSize.width - (x - this.resizeStartMousePos.x), this.resizeStartSize.height - (y - this.resizeStartMousePos.y));
                        break;
                    case 1: //上
                        this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                        this.resize(this.size.width, this.resizeStartSize.height - (y - this.resizeStartMousePos.y));
                        break;
                    case 2: //右上
                        this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                        this.resize(this.resizeStartSize.width + (x - this.resizeStartMousePos.x), this.resizeStartSize.height - (y - this.resizeStartMousePos.y));
                        break;
                    case 3: //左
                        this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                        this.resize(this.resizeStartSize.width - (x - this.resizeStartMousePos.x), this.size.height);
                        break;
                    case 4: //右
                        this.changePosition(this.position.x, this.position.y);
                        this.resize(this.resizeStartSize.width + (x - this.resizeStartMousePos.x), this.size.height);
                        break;
                    case 5: //左下
                        this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                        this.resize(this.resizeStartSize.width - (x - this.resizeStartMousePos.x), this.resizeStartSize.height + (y - this.resizeStartMousePos.y));
                        break;
                    case 6: //下
                        this.changePosition(this.position.x, this.position.y);
                        this.resize(this.size.width, this.resizeStartSize.height + (y - this.resizeStartMousePos.y));
                        break;
                    case 7: //右下
                        this.changePosition(this.position.x, this.position.y);
                        this.resize(this.resizeStartSize.width + (x - this.resizeStartMousePos.x), this.resizeStartSize.height + (y - this.resizeStartMousePos.y));
                        break;
                }
            }
        };
        Overlay.prototype.__dispachMouseUpEvent = function (x, y) {
            this.isResizing = false;
        };
        Overlay.prototype.onResizeHandleMouseDown = function (event) {
            this.isResizing = true;
            this.resizePositionIndex = parseInt(event.target.dataset["positionIndex"]);
            this.resizeStartMousePos = new types_1.Point(event.screenX, event.screenY);
            this.resizeStartPos = new types_1.Point(this.position.x, this.position.y);
            this.resizeStartSize = new types_1.Size(this.size.width, this.size.height);
            overlay_manager_1.default.getInstance().changeContentsSelectable(false);
        };
        Overlay.prototype.onSelectStart = function (event) {
        };
        Overlay.prototype.onTabFocusMoveHeadStopperFocusIn = function (event) {
            if (this.lastFocusedEl) {
                this.lastFocusedEl.focus();
            }
            else {
                this.tabFocusMoveHeadDetector.focus();
            }
        };
        Overlay.prototype.onTabFocusMoveHeadDetectorFocusIn = function (event) {
            if (!this.lastFocusIsDetector) {
                this.lastFocusIsDetector = true;
                this.tabFocusMoveTailDetector.focus();
            }
            event.stopPropagation();
        };
        Overlay.prototype.onTabFocusMoveTailDetectorFocusIn = function (event) {
            if (!this.lastFocusIsDetector) {
                this.lastFocusIsDetector = true;
                this.tabFocusMoveHeadDetector.focus();
            }
            event.stopPropagation();
        };
        Overlay.prototype.onTabFocusMoveTailStopperFocusIn = function (event) {
            if (this.lastFocusedEl) {
                this.lastFocusedEl.focus();
            }
            else {
                this.tabFocusMoveTailDetector.focus();
            }
        };
        Overlay.prototype.onOuterMouseDown = function (event) {
            if (this.inactiveModalMode)
                return;
            overlay_manager_1.default.getInstance().overlayMouseDownEventHandler(this.name);
        };
        Overlay.prototype.onFocusIn = function (event) {
            this.lastFocusIsDetector = false;
            overlay_manager_1.default.getInstance().overlayLastFocusedElement = null;
        };
        Overlay.prototype.onFocusOut = function (event) {
            this.lastFocusIsDetector = false;
            this.lastFocusedEl = event.target;
            overlay_manager_1.default.getInstance().overlayLastFocusedElement =
                event.target;
        };
        Overlay.prototype.changeZIndex = function (zIndex) {
            this.zIndex = zIndex;
            this.outerFrameEl.style.zIndex = String(zIndex);
        };
        Overlay.prototype.getName = function () {
            return this.name;
        };
        Overlay.prototype.getZIndex = function () {
            return this.zIndex;
        };
        Overlay.prototype.changePosition = function (x, y) {
            this.position = new types_1.Point(x, y);
            this.outerFrameEl.style.left = String(this.position.x - Overlay.resizeHandleThicknessPx) + "px";
            this.outerFrameEl.style.top = String(this.position.y - Overlay.resizeHandleThicknessPx) + "px";
        };
        Overlay.prototype.resize = function (width, height) {
            this.size = new types_1.Size(width, height);
            this.outerFrameEl.style.width = String(width + Overlay.resizeHandleThicknessPx * 2) + "px";
            this.outerFrameEl.style.height = String(height + Overlay.resizeHandleThicknessPx * 2) + "px";
            this.contentEl.style.width = String(width) + "px";
            this.contentEl.style.height = String(height) + "px";
            this.modalInactiveLayer.style.width = String(width) + "px";
            this.modalInactiveLayer.style.height = String(height) + "px";
        };
        Overlay.prototype.activate = function () {
            this.inactiveModalMode = false;
            this.modalInactiveLayerTransitionDriver.hide();
            this.resizeHandleEl.forEach(function (element) {
                element.style.display = "";
            });
        };
        Overlay.prototype.inactivate = function (withModal) {
            this.inactiveModalMode = withModal;
            if (withModal) {
                this.modalInactiveLayerTransitionDriver.show();
                this.resizeHandleEl.forEach(function (element) {
                    element.style.display = "none";
                });
            }
        };
        Overlay.resizeHandleThicknessPx = 7;
        Overlay.DEFAULT_OVERLAY_SIZE_WIDTH = 640;
        Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT = 480;
        return Overlay;
    }());
    exports.default = Overlay;
});
define("core/overlay/dialog_window", ["require", "exports", "core/overlay/overlay", "core/overlay/overlay_manager", "core/container/container_manager", "core/common/dto"], function (require, exports, overlay_1, overlay_manager_2, container_manager_2, dto_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogWindow = /** @class */ (function (_super) {
        __extends(DialogWindow, _super);
        function DialogWindow(viewPortElement, name, caption, options) {
            var _this = _super.call(this, viewPortElement, name, options ? options.size : null) || this;
            _this.isDragging = false;
            var containerManager = container_manager_2.default.getInstance();
            _this.wrapperEl = document.createElement("div");
            _this.wrapperEl.style.position = "absolute";
            _this.wrapperEl.style.display = "flex";
            _this.wrapperEl.style.flexDirection = "column";
            _this.wrapperEl.style.width = "100%";
            _this.wrapperEl.style.height = "100%";
            _this.headerEl = document.createElement("div");
            _this.headerEl.className = "fvst_dialog_window_header";
            _this.headerEl.style.position = "relative";
            _this.headerEl.style.display = "flex";
            _this.headerEl.style.width = "100%";
            _this.headerTitleEl = document.createElement("div");
            _this.headerTitleEl.className = "caption";
            _this.headerTitleEl.textContent = caption;
            _this.headerCloseButtonEl = document.createElement("div");
            _this.headerCloseButtonEl.className = "close_button";
            _this.headerCloseButtonEl.textContent = "×";
            _this.headerCloseButtonEl.addEventListener("click", _this.onHeaderCloseButtonClick.bind(_this));
            _this.headerEl.appendChild(_this.headerTitleEl);
            _this.headerEl.appendChild(_this.headerCloseButtonEl);
            _this.headerEl.addEventListener("mousedown", _this.onHeaderMouseDown.bind(_this));
            _this.headerEl.addEventListener("dragstart", _this.onHeaderDragStart.bind(_this));
            _this.bodyEl = document.createElement("div");
            _this.bodyEl.className = "fvst_dialog_window_body";
            _this.bodyEl.style.position = "relative";
            _this.bodyEl.style.flexGrow = "1";
            _this.bodyEl.style.flexShrink = "1";
            _this.bodyEl.style.width = "100%";
            _this.container = containerManager.createContainer("__window" + String(DialogWindow.instanceSequence++), "", _this.bodyEl);
            _this.footerEl = document.createElement("div");
            _this.footerEl.className = "fvst_dialog_window_footer";
            _this.footerEl.style.position = "relative";
            _this.footerEl.style.width = "100%";
            _this.okButtonEl = document.createElement("input");
            _this.okButtonEl.type = "button";
            _this.okButtonEl.value = "OK";
            _this.okButtonEl.addEventListener("click", _this.onOkButtonClick.bind(_this));
            _this.cancelButtonEl = document.createElement("input");
            _this.cancelButtonEl.type = "button";
            _this.cancelButtonEl.value = "キャンセル";
            _this.cancelButtonEl.addEventListener("click", _this.onCancelButtonClick.bind(_this));
            _this.applyButtonEl = document.createElement("input");
            _this.applyButtonEl.type = "button";
            _this.applyButtonEl.value = "適用";
            _this.footerEl.appendChild(_this.okButtonEl);
            _this.footerEl.appendChild(_this.cancelButtonEl);
            _this.wrapperEl.appendChild(_this.headerEl);
            _this.wrapperEl.appendChild(_this.bodyEl);
            _this.wrapperEl.appendChild(_this.footerEl);
            _this.contentEl.appendChild(_this.wrapperEl);
            _this.outerFrameTransitionDriver.setCustomTransitionClasses({
                standyStateClass: "fvst_dialog_window_standy_state",
                enterTransitionClass: "fvst_dialog_window_enter_transition",
                leaveTransitionClass: "fvst_dialog_window_leave_transition",
                endStateClass: "fvst_dialog_window_end_state"
            });
            return _this;
        }
        DialogWindow.prototype.onHeaderMouseDown = function (event) {
            this.isDragging = true;
            overlay_manager_2.default.getInstance().changeContentsSelectable(false);
        };
        DialogWindow.prototype.onHeaderDragStart = function (event) {
            event.preventDefault();
        };
        DialogWindow.prototype.onHeaderCloseButtonClick = function (event) {
            var _this = this;
            this.container.getActiveModule().exit(dto_2.ActionType.CANCEL).then(function (exited) {
                if (exited)
                    _this.close();
            });
        };
        DialogWindow.prototype.onOkButtonClick = function (event) {
            var _this = this;
            this.container.getActiveModule().exit(dto_2.ActionType.OK).then(function (exited) {
                if (exited)
                    _this.close(_this.container.getContainerResult());
            });
        };
        DialogWindow.prototype.onCancelButtonClick = function (event) {
            var _this = this;
            this.container.getActiveModule().exit(dto_2.ActionType.CANCEL).then(function (exited) {
                if (exited)
                    _this.close(null);
            });
        };
        DialogWindow.prototype.onApplyButtonClick = function (event) {
        };
        DialogWindow.prototype.waitForOverlayClose = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.waitForOverlayCloseResolver = resolve;
            });
        };
        //override
        DialogWindow.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
            _super.prototype.__dispachMouseMoveEvent.call(this, x, y, deltaX, deltaY);
            if (!this.isDragging)
                return;
            this.changePosition(this.position.x + deltaX, this.position.y + deltaY);
        };
        //override
        DialogWindow.prototype.__dispachMouseUpEvent = function (x, y) {
            _super.prototype.__dispachMouseUpEvent.call(this, x, y);
            this.isDragging = false;
        };
        DialogWindow.prototype.getContainer = function () {
            return this.container;
        };
        DialogWindow.prototype.show = function (parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (options && options.x !== undefined && options.y !== undefined) {
                        this.changePosition(options.x, options.y);
                    }
                    else {
                        //デフォルト表示位置は表示領域（ビューポート）の中央
                        this.moveToViewPortCenter();
                    }
                    this.container.initialize(parcel);
                    this.outerFrameTransitionDriver.show();
                    return [2 /*return*/, this.waitForOverlayClose()];
                });
            });
        };
        DialogWindow.prototype.showAsModal = function (parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.show(parcel, options)];
                });
            });
        };
        DialogWindow.prototype.moveToViewPortCenter = function () {
            var x = Math.round((this.viewPortEl.offsetWidth - this.size.width) / 2);
            var y = Math.round((this.viewPortEl.offsetHeight - this.size.height) / 2);
            this.changePosition(x, y);
        };
        DialogWindow.prototype.close = function (result) {
            this.outerFrameTransitionDriver.hide();
            //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
            window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
        };
        //override
        DialogWindow.prototype.activate = function () {
            _super.prototype.activate.call(this);
            this.headerEl.classList.remove("inactive");
        };
        //override
        DialogWindow.prototype.inactivate = function (withModal) {
            _super.prototype.inactivate.call(this, withModal);
            this.headerEl.classList.add("inactive");
        };
        DialogWindow.instanceSequence = 0;
        return DialogWindow;
    }(overlay_1.default));
    exports.default = DialogWindow;
});
define("core/overlay/overlay_manager", ["require", "exports", "core/overlay/dialog_window", "core/common/css_transition_driver"], function (require, exports, dialog_window_1, css_transition_driver_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OvarlayManager = /** @class */ (function () {
        function OvarlayManager() {
            this.viewPortEl = null;
            this.overlayLastFocusedElement = null;
            this.previousMouseX = 0;
            this.previousMouseY = 0;
            this.contentsSelectable = true;
            this.OVERLAY_START_Z_INDEX = 10;
            this.MODAL_START_Z_INDEX = 1000;
            this.overlays = new Map();
            this.overlayManagementTable = new Map();
            this.modalBackgroundLayer = document.createElement("div");
            this.modalBackgroundLayer.className = "fvst_modal_background_layer";
            this.modalBackgroundLayer.style.position = "absolute";
            this.modalBackgroundLayer.style.overflow = "hidden";
            this.modalBackgroundLayer.style.width = "100%";
            this.modalBackgroundLayer.style.height = "100%";
            this.modalBackgroundLayer.style.display = "none";
            this.modalBackgroundLayer.style.zIndex = String(this.MODAL_START_Z_INDEX);
            this.modalBackgroundLayerTransitionDriver = new css_transition_driver_3.default(this.modalBackgroundLayer);
            this.onFocusInBindedThis = this.onFocusIn.bind(this);
            this.onMouseMoveBindedThis = this.onMouseMove.bind(this);
            this.onMouseUpBindedThis = this.onMouseUp.bind(this);
            this.onSelectStartBindedThis = this.onSelectStart.bind(this);
        }
        OvarlayManager.getInstance = function () {
            return OvarlayManager.instance;
        };
        OvarlayManager.prototype.onMouseMove = function (event) {
            var deltaX = event.screenX - this.previousMouseX;
            var deltaY = event.screenY - this.previousMouseY;
            this.previousMouseX = event.screenX;
            this.previousMouseY = event.screenY;
            this.overlays.forEach(function (overlay) {
                overlay.__dispachMouseMoveEvent(event.screenX, event.screenY, deltaX, deltaY);
            });
        };
        OvarlayManager.prototype.onMouseUp = function (event) {
            this.overlays.forEach(function (overlay) {
                overlay.__dispachMouseUpEvent(event.screenX, event.screenY);
            });
            this.changeContentsSelectable(true);
        };
        OvarlayManager.prototype.onSelectStart = function (event) {
            if (!this.contentsSelectable) {
                event.preventDefault();
            }
        };
        OvarlayManager.prototype.onFocusIn = function (event) {
            this.overlayLastFocusedElement = null;
        };
        OvarlayManager.prototype.setViewPortElement = function (element) {
            if (this.viewPortEl !== null) {
                this.viewPortEl.removeEventListener("focusin", this.onFocusInBindedThis);
                this.viewPortEl.removeEventListener("mousemove", this.onMouseMoveBindedThis);
                this.viewPortEl.removeEventListener("mouseup", this.onMouseUpBindedThis);
                this.viewPortEl.removeEventListener("selectstart", this.onSelectStartBindedThis);
            }
            this.viewPortEl = element;
            this.viewPortEl.addEventListener("focusin", this.onFocusInBindedThis);
            this.viewPortEl.addEventListener("mousemove", this.onMouseMoveBindedThis);
            this.viewPortEl.addEventListener("mouseup", this.onMouseUpBindedThis);
            this.viewPortEl.addEventListener("selectstart", this.onSelectStartBindedThis);
            this.viewPortEl.appendChild(this.modalBackgroundLayer);
        };
        OvarlayManager.prototype.createWindow = function (overlayName, caption, options) {
            var overlay = new dialog_window_1.default(this.viewPortEl, overlayName, caption, options);
            this.overlays.set(overlayName, overlay);
            this.overlayManagementTable.set(overlayName, new OverlayManagementData());
            return overlay;
        };
        OvarlayManager.prototype.changeContentsSelectable = function (selectable) {
            this.contentsSelectable = selectable;
        };
        OvarlayManager.prototype.beginModalMode = function () {
            this.modalBackgroundLayerTransitionDriver.show();
        };
        OvarlayManager.prototype.endModalMode = function () {
            var existModalOverlay = false;
            this.overlayManagementTable.forEach(function (value, key) {
                if (value.isVisible && value.isModal)
                    existModalOverlay = true;
            });
            if (!existModalOverlay) {
                this.modalBackgroundLayerTransitionDriver.hide();
            }
        };
        OvarlayManager.prototype.show = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var overlay, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            overlay = this.overlays.get(overlayName);
                            this.overlayManagementTable.get(overlayName).isVisible = true;
                            this.activateSpecificOverlay(overlayName);
                            return [4 /*yield*/, overlay.show(parcel, options)];
                        case 1:
                            result = _a.sent();
                            this.overlayManagementTable.get(overlayName).reset();
                            this.activateTopOverlay();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        OvarlayManager.prototype.showAsModal = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.overlayManagementTable.get(overlayName).isModal = true;
                            this.beginModalMode();
                            return [4 /*yield*/, this.show(overlayName, parcel, options)];
                        case 1:
                            result = _a.sent();
                            this.endModalMode();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        OvarlayManager.prototype.overlayMouseDownEventHandler = function (overlayName) {
            //TODO 要モーダル状態チェック
            this.activateSpecificOverlay(overlayName);
        };
        OvarlayManager.prototype.activateSpecificOverlay = function (overlayName) {
            var _this = this;
            var overlayList = new Array();
            var targetOverlay = this.overlays.get(overlayName);
            this.overlays.forEach(function (value, key) {
                if (key !== overlayName)
                    overlayList.push(value);
            });
            overlayList.sort(function (a, b) {
                return b.getZIndex() - a.getZIndex();
            });
            overlayList.unshift(targetOverlay);
            var visibleCount = 0;
            this.overlayManagementTable.forEach(function (value, key) {
                if (value.isVisible)
                    ++visibleCount;
            });
            var i = 0;
            overlayList.forEach(function (overlay) {
                var mgrData = _this.overlayManagementTable.get(overlay.getName());
                if (mgrData.isVisible) {
                    if (mgrData.isModal) {
                        overlay.changeZIndex(_this.MODAL_START_Z_INDEX + visibleCount--);
                    }
                    else {
                        overlay.changeZIndex(_this.OVERLAY_START_Z_INDEX + visibleCount--);
                    }
                    if (i === 0) {
                        overlay.activate();
                    }
                    else {
                        overlay.inactivate(mgrData.isModal);
                    }
                    ++i;
                }
            });
        };
        OvarlayManager.prototype.activateTopOverlay = function () {
            var _this = this;
            //zindexが一番大きいoverlayを有効化する
            var maxZIndex = -1;
            var targetOverlayName;
            this.overlays.forEach(function (overlay, name) {
                if (_this.overlayManagementTable.get(name).isVisible) {
                    if (overlay.getZIndex() > maxZIndex) {
                        maxZIndex = overlay.getZIndex();
                        targetOverlayName = name;
                    }
                }
            });
            if (maxZIndex > -1) {
                this.activateSpecificOverlay(targetOverlayName);
            }
        };
        OvarlayManager.instance = new OvarlayManager();
        return OvarlayManager;
    }());
    exports.default = OvarlayManager;
    var OverlayManagementData = /** @class */ (function () {
        function OverlayManagementData(isVisible, isModal) {
            this.isVisible = false;
            this.isModal = false;
            if (isVisible)
                this.isVisible = isVisible;
            if (isModal)
                this.isModal = isModal;
        }
        OverlayManagementData.prototype.reset = function () {
            this.isVisible = false;
            this.isModal = false;
        };
        return OverlayManagementData;
    }());
});
define("core/adapter/html_component_adapter", ["require", "exports", "core/module/module_router", "core/overlay/overlay_manager", "core/common/dto", "core/module/module_manager"], function (require, exports, module_router_1, overlay_manager_3, dto_3, module_manager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.htmlComponentAdapters = new Map();
    var HTMLComponentAdapter = /** @class */ (function () {
        function HTMLComponentAdapter() {
            this.isModified = false;
            this.moduleRouter = module_router_1.default.getInstance();
            this.moduleManager = module_manager_2.default.getInstance();
            this.overlayManager = overlay_manager_3.default.getInstance();
            this.exitCallbackReturnFunctionsObject = {
                cancelExit: this.cancelExit.bind(this),
                continueExit: this.continueExit.bind(this)
            };
            this.navigator = new Navigator(this);
        }
        HTMLComponentAdapter.prototype.setHtmlComponent = function (htmlComponent) {
            this.htmlComponent = htmlComponent;
        };
        HTMLComponentAdapter.prototype.getHtmlComponent = function () {
            return this.htmlComponent;
        };
        HTMLComponentAdapter.prototype.triggerOnLoadHandler = function (param) {
            if (this.onLoad)
                this.onLoad(param);
        };
        HTMLComponentAdapter.prototype.triggerOnInitializeHandler = function (param) {
            if (this.onInitialize)
                this.onInitialize(param);
        };
        HTMLComponentAdapter.prototype.triggerOnShowHandler = function (isFirst, param) {
            if (this.onShow)
                this.onShow(isFirst, param);
        };
        HTMLComponentAdapter.prototype.triggerOnHideHandler = function (param) {
            if (this.onHide)
                this.onHide(param);
        };
        HTMLComponentAdapter.prototype.triggerOnExitHandler = function (actionType) {
            if (this.onExit) {
                this.onExit(actionType, this.exitCallbackReturnFunctionsObject);
            }
            else {
                this.continueExit(new dto_3.Result(actionType, true));
            }
        };
        HTMLComponentAdapter.prototype.triggerOnReceiveMessage = function (command, message) {
            if (this.onReceiveMessage) {
                this.onReceiveMessage(command, this.returnMessageResponse.bind(this), message);
            }
            else {
            }
        };
        HTMLComponentAdapter.prototype.continueExit = function (result) {
            this.htmlComponent.continueExitProcess(result);
        };
        HTMLComponentAdapter.prototype.cancelExit = function () {
            this.htmlComponent.cancelExitProcess();
        };
        HTMLComponentAdapter.prototype.returnMessageResponse = function (response) {
            this.htmlComponent.returnMessageResponse(response);
        };
        HTMLComponentAdapter.prototype.startExitProcess = function (actionType) {
            this.htmlComponent.exit(actionType);
        };
        HTMLComponentAdapter.prototype.showWindow = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var overlayManager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            overlayManager = overlay_manager_3.default.getInstance();
                            return [4 /*yield*/, overlayManager.show(overlayName, parcel, options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        HTMLComponentAdapter.prototype.showWindowAsModal = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var overlayManager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            overlayManager = overlay_manager_3.default.getInstance();
                            return [4 /*yield*/, overlayManager.showAsModal(overlayName, parcel, options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        HTMLComponentAdapter.prototype.sendMessage = function (destination, command, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.moduleManager.dispatchMessage(destination, command, message)];
                });
            });
        };
        return HTMLComponentAdapter;
    }());
    exports.default = HTMLComponentAdapter;
    var Navigator = /** @class */ (function () {
        function Navigator(adapter) {
            this.moduleRouter = module_router_1.default.getInstance();
            this.moduleManager = module_manager_2.default.getInstance();
            this.overlayManager = overlay_manager_3.default.getInstance();
            this.adapter = adapter;
        }
        Navigator.prototype.localForward = function (moduleName, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var targetIdentifier;
                return __generator(this, function (_a) {
                    targetIdentifier = this.adapter.getHtmlComponent().
                        getParentContainer().getId() + "::" + moduleName;
                    return [2 /*return*/, this.moduleRouter.forward(targetIdentifier, parcel)];
                });
            });
        };
        Navigator.prototype.forward = function (targetIdentifier, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.moduleRouter.forward(targetIdentifier, parcel)];
                });
            });
        };
        Navigator.prototype.startExitProcess = function (actionType) {
            this.adapter.getHtmlComponent().exit(actionType);
        };
        Navigator.prototype.showWindow = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Navigator.prototype.showWindowAsModal = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.overlayManager.showAsModal(overlayName, parcel, options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Navigator.prototype.sendMessage = function (destination, command, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.moduleManager.dispatchMessage(destination, command, message)];
                });
            });
        };
        return Navigator;
    }());
    var __global = window;
    __global.__HTMLComponentAdapter = HTMLComponentAdapter;
    __global.__registerHTMLComponentAdapter = function (moduleIndex, componentClass) {
        exports.htmlComponentAdapters.set(moduleIndex, componentClass);
    };
});
define("core/module/html_component", ["require", "exports", "core/source_repository"], function (require, exports, source_repository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HTMLComponent = /** @class */ (function () {
        function HTMLComponent(name, sourceUri, moduleIndex) {
            this.name = name;
            this.sourceUri = sourceUri;
            this.moduleIndex = moduleIndex;
            this.isFetched = false;
            this.isMounted = false;
            this.isInitialized = false;
            this.subContainerInfos = new Map();
            this.htmlAdapter = null;
            this.onCreate();
        }
        HTMLComponent.prototype.dispachResizeEvent = function () {
            if (!this.wrapperElement)
                return;
            this.subContainerInfos.forEach(function (containerInfo) {
                containerInfo.container.onResize();
            });
        };
        HTMLComponent.prototype.fetch = function () {
            return __awaiter(this, void 0, void 0, function () {
                var repository, _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            repository = source_repository_1.default.getInstance();
                            _a = this;
                            return [4 /*yield*/, repository.fetch(this.sourceUri)];
                        case 1:
                            _a.source = _b.sent();
                            this.loadSubContainerInfos();
                            this.isFetched = true;
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        HTMLComponent.prototype.initialize = function (parcel) {
            this.subContainerInfos.forEach(function (containerInfo) {
                containerInfo.container.initialize(parcel);
            });
            this.htmlAdapter.triggerOnInitializeHandler(parcel);
        };
        HTMLComponent.prototype.show = function () {
            this.wrapperElement.style.display = "";
            this.wrapperElement.style.visibility = "";
            this.htmlAdapter.triggerOnShowHandler(false, null);
            this.subContainerInfos.forEach(function (containerInfo) {
                containerInfo.container.onShow();
            });
        };
        HTMLComponent.prototype.hide = function () {
            if (this.wrapperElement.style.visibility !== "hidden") {
                this.wrapperElement.style.display = "none";
            }
            this.htmlAdapter.triggerOnHideHandler(null);
        };
        HTMLComponent.prototype.waitForExit = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.exitForWaitResolver = resolve;
            });
        };
        HTMLComponent.prototype.exit = function (actionType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.exitResolver = resolve;
                            _this.htmlAdapter.triggerOnExitHandler(actionType);
                        })];
                });
            });
        };
        HTMLComponent.prototype.continueExitProcess = function (result) {
            if (this.exitResolver) {
                this.exitResolver(true);
                this.exitResolver = null;
            }
            if (this.exitForWaitResolver) {
                this.exitForWaitResolver(result);
                this.exitForWaitResolver = null;
            }
        };
        HTMLComponent.prototype.cancelExitProcess = function () {
            if (this.exitResolver) {
                this.exitResolver(false);
                this.exitResolver = null;
            }
        };
        HTMLComponent.prototype.passMessage = function (command, message) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.passMessageResolver = resolve;
                            _this.htmlAdapter.triggerOnReceiveMessage(command, message);
                        })];
                });
            });
        };
        HTMLComponent.prototype.returnMessageResponse = function (messageResponse) {
            if (this.passMessage) {
                this.passMessageResolver(messageResponse);
                this.passMessageResolver = null;
            }
        };
        HTMLComponent.prototype.getElement = function () {
            throw this.wrapperElement;
        };
        HTMLComponent.prototype.getParentContainer = function () {
            return this.currentContainer;
        };
        HTMLComponent.prototype.getSubContainerNames = function () {
            var ary = new Array();
            this.subContainerInfos.forEach(function (c) {
                ary.push(c.name);
            });
            return ary;
        };
        HTMLComponent.prototype.getName = function () {
            return this.name;
        };
        HTMLComponent.prototype.getCaption = function () {
            return this.name;
        };
        return HTMLComponent;
    }());
    exports.default = HTMLComponent;
});
define("core/module/native_component", ["require", "exports", "core/module/html_component", "core/container/container_manager", "core/adapter/html_component_adapter"], function (require, exports, html_component_1, container_manager_3, html_component_adapter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NativeComponent = /** @class */ (function (_super) {
        __extends(NativeComponent, _super);
        function NativeComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        NativeComponent.prototype.onCreate = function () {
            this.prototypeTemplateBegin =
                "(function() {\n            var Com = function(moduleIndex) {\n                this.super = __HTMLComponentAdapter.prototype;\n                __HTMLComponentAdapter.call(this, moduleIndex);\n        ";
            this.prototypeTemplateEnd =
                "   }\n            Object.setPrototypeOf(Com.prototype, __HTMLComponentAdapter.prototype);\n            __registerHTMLComponentAdapter(" + this.moduleIndex + ", new Com(" + this.moduleIndex + "));\n         })();\n        ";
        };
        NativeComponent.prototype.loadSubContainerInfos = function () {
            var match;
            //高速化のためタグ全体を個別に抽出してから各属性を抽出する
            var tagExtractRegExp = /<div .*?data-container-name[ =].*?>/g;
            while (match = tagExtractRegExp.exec(this.source)) {
                //DomIDの抽出
                var matchDomId = /id *= *["'](.+?)["']/.exec(match[0]);
                //コンテナ名の抽出
                var matchName = /data-container-name *= *["'](.*?)["']/.exec(match[0]);
                //コンテナ種別の抽出
                var matchType = /data-container-type *= *["'](.*?)["']/.exec(match[0]);
                this.subContainerInfos.set(matchDomId[1], {
                    name: matchName[1],
                    type: matchType ? matchType[1] : "",
                    container: null
                });
            }
        };
        NativeComponent.prototype.mount = function (elementAttachHandler) {
            return __awaiter(this, void 0, void 0, function () {
                var localPrefix, localizeRegExp, containerManager;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.isFetched) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.fetch()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2:
                            localPrefix = "_" + this.moduleIndex.toString() + "_";
                            localizeRegExp = /\\:/g;
                            this.source = this.source.replace(localizeRegExp, localPrefix);
                            //引数で与えられたコンテナDOMに対して自身をロード
                            this.wrapperElement = document.createElement("div");
                            this.wrapperElement.id = localPrefix + "module";
                            this.wrapperElement.className = "fvst_html_module";
                            this.wrapperElement.style.position = "absolute";
                            this.wrapperElement.style.overflow = "auto";
                            this.wrapperElement.style.width = "100%";
                            this.wrapperElement.style.height = "100%";
                            this.wrapperElement.style.visibility = "hidden";
                            this.wrapperElement.innerHTML = this.source;
                            this.currentContainer = elementAttachHandler(this.wrapperElement, this.name);
                            //scriptタグを実行
                            this.evalScripts();
                            containerManager = container_manager_3.default.getInstance();
                            this.subContainerInfos.forEach(function (containerInfo, domId) {
                                var localElementId = domId.replace(localizeRegExp, localPrefix);
                                var containerEl = document.getElementById(localElementId);
                                var containerId = _this.name + "." + containerInfo.name;
                                containerInfo.container = containerManager.createContainer(containerId, containerInfo.type, containerEl);
                            });
                            this.isMounted = true;
                            this.htmlAdapter = html_component_adapter_1.htmlComponentAdapters.get(this.moduleIndex);
                            this.htmlAdapter.setHtmlComponent(this);
                            this.htmlAdapter.triggerOnLoadHandler("name is " + this.name);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        NativeComponent.prototype.evalScripts = function () {
            var nativeScript = "";
            var prototypeScript = "";
            var classScript = "";
            var initialScriptElements = new Array();
            var nodeList = this.wrapperElement.querySelectorAll("script");
            for (var i = 0; i < nodeList.length; i++) {
                var element = nodeList[i];
                var scopeMode = element.dataset["scopeMode"];
                if (!scopeMode || scopeMode === "native") {
                    nativeScript += element.textContent;
                }
                else if (scopeMode === "prototype") {
                    prototypeScript += element.textContent;
                }
                else if (scopeMode === "class") {
                    classScript += element.textContent;
                }
                initialScriptElements.push(element);
            }
            // this.wrapperElement.querySelectorAll("script").forEach((element: HTMLScriptElement) => {
            //     const scopeMode: string = element.dataset["scopeMode"];
            //     if (!scopeMode || scopeMode === "native") {
            //         nativeScript += element.textContent;
            //     } else if (scopeMode === "prototype")  {
            //         prototypeScript += element.textContent;
            //     } else if (scopeMode === "class") {
            //         classScript += element.textContent;
            //     }
            //     initialScriptElements.push(element);
            // })
            var nativeScriptElement = document.createElement("script");
            nativeScriptElement.textContent = nativeScript;
            this.wrapperElement.appendChild(nativeScriptElement);
            var prototypeScriptElement = document.createElement("script");
            prototypeScript = this.prototypeTemplateBegin +
                prototypeScript +
                this.prototypeTemplateEnd;
            prototypeScriptElement.textContent = prototypeScript;
            this.wrapperElement.appendChild(prototypeScriptElement);
            var classScriptElement = document.createElement("script");
            classScriptElement.textContent = classScript;
            this.wrapperElement.appendChild(classScriptElement);
            for (var _i = 0, initialScriptElements_1 = initialScriptElements; _i < initialScriptElements_1.length; _i++) {
                var element = initialScriptElements_1[_i];
                this.wrapperElement.removeChild(element);
            }
        };
        NativeComponent.prototype.changeModuleCssPosition = function (left, top) {
            this.wrapperElement.style.left = left;
            this.wrapperElement.style.top = top;
        };
        NativeComponent.prototype.changeModuleCssSize = function (width, height) {
            this.wrapperElement.style.width = width;
            this.wrapperElement.style.height = height;
        };
        return NativeComponent;
    }(html_component_1.default));
    exports.default = NativeComponent;
});
define("core/module/module_manager", ["require", "exports", "core/module/native_component", "core/common/runtime_error", "core/container/container_manager", "core/overlay/overlay_manager"], function (require, exports, native_component_1, runtime_error_4, container_manager_4, overlay_manager_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayMode;
    (function (DisplayMode) {
        DisplayMode[DisplayMode["Embedding"] = 0] = "Embedding";
        DisplayMode[DisplayMode["Window"] = 1] = "Window";
        DisplayMode[DisplayMode["PopupMenu"] = 2] = "PopupMenu";
    })(DisplayMode = exports.DisplayMode || (exports.DisplayMode = {}));
    var ModuleType;
    (function (ModuleType) {
        ModuleType[ModuleType["Native"] = 0] = "Native";
        ModuleType[ModuleType["Vue"] = 1] = "Vue";
        ModuleType[ModuleType["React"] = 2] = "React";
        ModuleType[ModuleType["SSRP"] = 3] = "SSRP";
    })(ModuleType = exports.ModuleType || (exports.ModuleType = {}));
    var ModuleManager = /** @class */ (function () {
        function ModuleManager() {
            this.dependencyInfoMap = new Map();
            this.descriptions = [];
            this.modules = new Map();
        }
        ModuleManager.getInstance = function () {
            return ModuleManager.instance;
        };
        ModuleManager.prototype.register = function (name, sourceUri, targetContainerId, isContainerDefault, options) {
            this.registerDescription(name, sourceUri, DisplayMode.Embedding, targetContainerId, isContainerDefault, options);
        };
        ModuleManager.prototype.registerWindow = function (name, sourceUri, options) {
            this.registerDescription(name, sourceUri, DisplayMode.Window, null, null, options);
        };
        ModuleManager.prototype.registerPopup = function (name, sourceUri, options) {
            this.registerDescription(name, sourceUri, DisplayMode.PopupMenu, null, null, options);
        };
        ModuleManager.prototype.registerDescription = function (name, sourceUri, displayMode, targetContainerId, isContainerDefault, options) {
            var op = options || {};
            var ds = {
                name: name,
                sourceUri: sourceUri,
                targetContainerId: targetContainerId,
                displayMode: displayMode,
                moduleType: op.moduleType !== undefined ? op.moduleType : ModuleType.Native,
                isContainerDefault: isContainerDefault,
                lazyModuleLoading: op.lazyModuleLoading !== undefined ? op.lazyModuleLoading : false,
                preloadSourceAtLazy: op.preloadSourceAtLazy !== undefined ? op.preloadSourceAtLazy : true,
            };
            this.descriptions.push(ds);
        };
        ModuleManager.prototype.getModule = function (name) {
            if (!this.modules.has(name))
                throw new runtime_error_4.default("指定されたモジュールが見つかりません。");
            return this.modules.get(name);
        };
        ModuleManager.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, description, newModule, rootDependencyInfo;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, _a = this.descriptions;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            description = _a[_i];
                            newModule = null;
                            //モジュールインスタンス生成
                            if (description.moduleType === ModuleType.Native || !description.moduleType) {
                                newModule = new native_component_1.default(description.name, description.sourceUri, ModuleManager.instanceSequence++);
                            }
                            else {
                                throw new runtime_error_4.default("不明な種類のコンポーネント");
                            }
                            //モジュールプールへの登録
                            this.modules.set(description.name, newModule);
                            //モジュールソースのロード　※コンテナへのマウントや初期化は行われない
                            return [4 /*yield*/, newModule.fetch()];
                        case 2:
                            //モジュールソースのロード　※コンテナへのマウントや初期化は行われない
                            _b.sent();
                            //依存情報テーブルの準備
                            this.dependencyInfoMap.set(description.name, new ModuleDependencyInfo(description, newModule.getSubContainerNames()));
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            rootDependencyInfo = new ModuleDependencyInfo(null, [ModuleManager.ROOT_NAME]);
                            this.dependencyInfoMap.set(ModuleManager.ROOT_NAME, rootDependencyInfo);
                            //モジュール定義の情報を基に依存情報を互いにリンクする
                            this.dependencyInfoMap.forEach(function (dependencyInfo, moduleName) {
                                if (dependencyInfo === rootDependencyInfo)
                                    return;
                                var targetModuleName = ModuleManager.ROOT_NAME;
                                var targetContainerName = ModuleManager.ROOT_NAME;
                                if (dependencyInfo.moduleDescription.displayMode === DisplayMode.Embedding) {
                                    //コンテナに埋め込んで使用するモジュールの場合
                                    if (dependencyInfo.moduleDescription.targetContainerId) {
                                        var parts = dependencyInfo.moduleDescription.targetContainerId.split(".");
                                        if (parts.length === 2) {
                                            targetModuleName = parts[0];
                                            targetContainerName = parts[1];
                                        }
                                    }
                                }
                                else {
                                    //それ以外（自身がwindowやpopupのルートコンテナになる場合）
                                    //※依存情報テーブル上はルート上に含めるものとするため何もしない（root.root）
                                }
                                var targetDependencyInfo = _this.dependencyInfoMap.get(targetModuleName);
                                if (targetDependencyInfo && targetDependencyInfo.subContainerNames.has(targetContainerName)) {
                                    targetDependencyInfo.addSubModule(moduleName, targetContainerName);
                                }
                                else {
                                    throw new runtime_error_4.default("未定義のコンテナが指定された");
                                }
                            });
                            //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
                            return [4 /*yield*/, this.loadSubModules(rootDependencyInfo)];
                        case 5:
                            //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
                            _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ModuleManager.prototype.loadSubModules = function (dependencyInfo) {
            return __awaiter(this, void 0, void 0, function () {
                var containerManager, overlayManager, displayMode, module, targetContainer, dWindow, _i, _a, subModuleName;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            containerManager = container_manager_4.default.getInstance();
                            overlayManager = overlay_manager_4.default.getInstance();
                            if (dependencyInfo.isProcessed)
                                throw new runtime_error_4.default("コンテナの循環参照発生");
                            dependencyInfo.isProcessed = true;
                            if (!(!dependencyInfo.isRoot && !dependencyInfo.moduleDescription.lazyModuleLoading)) return [3 /*break*/, 6];
                            displayMode = dependencyInfo.moduleDescription.displayMode;
                            module = this.modules.get(dependencyInfo.moduleDescription.name);
                            if (!(displayMode === DisplayMode.Embedding)) return [3 /*break*/, 4];
                            targetContainer = containerManager.getContainer(dependencyInfo.moduleDescription.targetContainerId);
                            if (!targetContainer) return [3 /*break*/, 2];
                            return [4 /*yield*/, targetContainer.addModule(module)];
                        case 1:
                            _b.sent();
                            if (dependencyInfo.moduleDescription.isContainerDefault) {
                                //targetContainer.activateModule(module);
                                targetContainer.setDefaultModule(module);
                            }
                            return [3 /*break*/, 3];
                        case 2: throw new runtime_error_4.default("ターゲットコンテナが存在しないか、未ロード");
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            if (!(displayMode === DisplayMode.Window)) return [3 /*break*/, 6];
                            dWindow = overlayManager.createWindow(module.getName(), "test");
                            return [4 /*yield*/, dWindow.getContainer().addModule(module)];
                        case 5:
                            _b.sent();
                            dWindow.getContainer().activateModule(module);
                            _b.label = 6;
                        case 6:
                            _i = 0, _a = dependencyInfo.subModuleNames;
                            _b.label = 7;
                        case 7:
                            if (!(_i < _a.length)) return [3 /*break*/, 10];
                            subModuleName = _a[_i];
                            return [4 /*yield*/, this.loadSubModules(this.dependencyInfoMap.get(subModuleName))];
                        case 8:
                            _b.sent();
                            _b.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 7];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ModuleManager.prototype.dispatchMessage = function (destination, command, message) {
            return this.getModule(destination).passMessage(command, message);
        };
        ModuleManager.instance = new ModuleManager();
        ModuleManager.ROOT_NAME = "root";
        ModuleManager.instanceSequence = 0;
        return ModuleManager;
    }());
    exports.default = ModuleManager;
    var ModuleDependencyInfo = /** @class */ (function () {
        function ModuleDependencyInfo(moduleDescription, subContainerNames) {
            var _this = this;
            this.subModuleNames = new Array();
            this.isProcessed = false;
            this.moduleDescription = moduleDescription;
            //this.subContainerNames = new Set(subContainerNames); //IE11非対応
            this.subContainerNames = new Set();
            subContainerNames.forEach(function (name) {
                _this.subContainerNames.add(name);
            });
            this.isRoot = moduleDescription === null;
        }
        ModuleDependencyInfo.prototype.addSubModule = function (subModuleName, targetContainerName) {
            if (this.subContainerNames.has(targetContainerName)) {
                this.subModuleNames.push(subModuleName);
            }
            else {
                throw new runtime_error_4.default("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
            }
        };
        return ModuleDependencyInfo;
    }());
});
define("fivestage", ["require", "exports", "core/module/module_manager", "core/container/container_manager", "core/overlay/overlay_manager"], function (require, exports, module_manager_3, container_manager_5, overlay_manager_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("******** start ********");
    var _fivestage_isMsIE = false;
    if (document["documentMode"]) {
        _fivestage_isMsIE = true;
    }
    var moduleManager = module_manager_3.default.getInstance();
    var containerManager = container_manager_5.default.getInstance();
    var overlayManager = overlay_manager_5.default.getInstance();
    var rootElement = document.getElementById("app");
    containerManager.setRootElement(rootElement);
    overlayManager.setViewPortElement(rootElement);
    moduleManager.register("base", "src/module/base.html", "root", true);
    moduleManager.register("header", "src/module/header.html", "base.header", true);
    moduleManager.register("main", "src/module/main.html", "base.body", false);
    moduleManager.register("main2", "src/module/main2.html", "base.body", false);
    moduleManager.register("tab", "src/module/tab.html", "base.body", false);
    moduleManager.register("tab1", "src/module/main.html", "tab.page", false);
    moduleManager.register("tab2", "src/module/main2.html", "tab.page", false);
    moduleManager.register("tab3", "src/module/header.html", "tab.page", false);
    moduleManager.registerWindow("win1", "src/module/main.html", {});
    moduleManager.registerWindow("win2", "src/module/main.html", {});
    moduleManager.registerWindow("win3", "src/module/main.html", {});
    moduleManager.initialize().then(function () {
        console.log("moduleManager is initialized.");
        containerManager.initializeRootContainer();
        var resizeEvent;
        if (_fivestage_isMsIE) {
            resizeEvent = document.createEvent("Event");
            resizeEvent.initEvent("resize", true, false);
        }
        else {
            resizeEvent = new Event("resize");
        }
        window.dispatchEvent(resizeEvent);
    });
    console.log("******** end ********");
});
define("core/transition_effect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/container/flickable_flat_container", ["require", "exports", "core/container/flat_container"], function (require, exports, flat_container_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlickableFlatContainer = /** @class */ (function (_super) {
        __extends(FlickableFlatContainer, _super);
        function FlickableFlatContainer() {
            return _super.call(this, "", null) || this;
        }
        FlickableFlatContainer.prototype.activateModule = function (module) {
            throw new Error("Method not implemented.");
        };
        FlickableFlatContainer.prototype.elementAttachHandler = function (element) {
            throw new Error("Method not implemented.");
        };
        FlickableFlatContainer.prototype.showPreviousModule = function () {
            throw new Error("Method not implemented.");
        };
        return FlickableFlatContainer;
    }(flat_container_2.default));
    exports.default = FlickableFlatContainer;
});
//# sourceMappingURL=fivestage.js.map