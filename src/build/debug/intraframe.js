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
                    if (!!this.enterTransitionClass) {
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
                    if (!!this.leaveTransitionClass) {
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
                this.target.style.visibility = ""; //初回表示まではvisibility:hiddenで非表示状態になっている
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
        function Container(id, bindDomElement, parent, cssTransitionOptions) {
            this.mountedModules = new Map();
            this.moduleChangeHistory = new Array();
            this.inBackProcess = false;
            this.containerParcel = null;
            this.containerResult = null;
            this.id = id;
            this.bindDomElement = bindDomElement;
            this.parent = parent;
            this.cssTransitionOptions = cssTransitionOptions;
            this.bindDomElement.style.position = "relative";
            this.bindDomElement.classList.add("itm_container");
        }
        Container.prototype.getId = function () {
            return this.id;
        };
        Container.prototype.getElement = function () {
            return this.bindDomElement;
        };
        Container.prototype.getParent = function () {
            return this.parent;
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
                module.dispatchResizeEvent();
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
            this.version = "";
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
        SourceRepository.prototype.setSourceVersion = function (version) {
            this.version = version;
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
                                var versionQuery;
                                if (_this.version === "" || _this.version.toLocaleLowerCase() === "debug") {
                                    versionQuery = Date.now().toString();
                                }
                                else {
                                    versionQuery = _this.version;
                                }
                                httpRequest.open("GET", sourceUri + "?ver=" + versionQuery, true);
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
define("core/container/page_container", ["require", "exports", "core/container/container", "core/common/runtime_error", "core/common/dto", "core/common/css_transition_driver", "core/module/module_manager"], function (require, exports, container_1, runtime_error_1, dto_1, css_transition_driver_1, module_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageContainer = /** @class */ (function (_super) {
        __extends(PageContainer, _super);
        function PageContainer(id, bindDomElement, parent, cssTransitionOptions) {
            var _this = _super.call(this, id, bindDomElement, parent, cssTransitionOptions) || this;
            _this.cssTransitionDrivers = new Map();
            bindDomElement.classList.add("itm_page_container");
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
            return __awaiter(this, void 0, void 0, function () {
                var moduleManager, previousActiveModule;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.mountedModules.has(module.getName())) return [3 /*break*/, 2];
                            moduleManager = module_manager_1.default.getInstance();
                            return [4 /*yield*/, moduleManager.loadSubModules(module.getName(), true)];
                        case 1:
                            _a.sent();
                            if (!this.mountedModules.has(module.getName())) {
                                throw new runtime_error_1.default("指定されたモジュールはコンテナに登録されていません。");
                            }
                            console.log(module.getName() + " is lazy loaded.");
                            _a.label = 2;
                        case 2:
                            if (this.activeModule) {
                                this.hideModule(this.activeModule);
                            }
                            module.initialize(parcel);
                            this.showModule(module);
                            previousActiveModule = this.activeModule;
                            this.activeModule = module;
                            //その他モジュールの非表示化
                            this.mountedModules.forEach(function (m) {
                                if (m !== module && m !== previousActiveModule)
                                    _this.hideModule(m);
                            });
                            return [2 /*return*/, true];
                    }
                });
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
        function FlatContainer(id, bindDomElement, parent, cssTransitionOptions) {
            var _this = _super.call(this, id, bindDomElement, parent, cssTransitionOptions) || this;
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
        };
        FlatContainer.prototype.activateModule = function (module, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var leftIndex, transX;
                return __generator(this, function (_a) {
                    if (!this.mountedModules.has(module.getName())) {
                        throw new runtime_error_2.default("マウントされていないモジュールです。");
                    }
                    leftIndex = this.moduleOrders.get(module.getName());
                    transX = Math.round(10000 / this.mountedModules.size * leftIndex) / 100;
                    this.scrollBoxElement.style.transform = "translate(-" + String(transX) + "%)";
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
            this.rootContainer = this.createContainer("root", "", element, null);
            window.addEventListener("resize", this.windowResizeEventHandlerBindThis);
        };
        ContainerManager.prototype.windowResizeEventHandler = function (event) {
            this.rootContainer.onResize();
        };
        ContainerManager.prototype.createContainer = function (id, type, bindDomElement, parent) {
            if (this.containers.has(id)) {
                throw new runtime_error_3.default("コンテナID '" + id + "' は既に登録されています。");
            }
            var newContainer = null;
            if (!type || type === "separated") {
                //newContainer = new PageContainer(id, bindDomElement);
                newContainer = new page_container_1.default(id, bindDomElement, parent, {
                    enableCssTransition: true
                });
            }
            else if ("continuous") {
                newContainer = new flat_container_1.default(id, bindDomElement, parent);
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
define("core/module/module_router", ["require", "exports", "core/container/container_manager", "core/module/module_manager"], function (require, exports, container_manager_1, module_manager_2) {
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
                    module = module_manager_2.default.getInstance().getModule(moduleName);
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
    var CssSize = /** @class */ (function () {
        function CssSize(cssWidth, cssHeight) {
            this.cssWidth = cssWidth;
            this.cssHeight = cssHeight;
        }
        return CssSize;
    }());
    exports.CssSize = CssSize;
});
define("core/overlay/overlay", ["require", "exports", "core/overlay/overlay_manager", "core/common/types", "core/common/css_transition_driver", "core/container/container_manager"], function (require, exports, overlay_manager_1, types_1, css_transition_driver_2, container_manager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Overlay = /** @class */ (function () {
        function Overlay(viewPortElement, name, size) {
            this.lastFocusIsDetector = false;
            this.active = false;
            this.inactiveModalMode = false;
            this.viewPortEl = viewPortElement;
            this.name = name;
            var cssWidth = size ? size.cssWidth : Overlay.DEFAULT_OVERLAY_SIZE_WIDTH;
            var cssHeight = size ? size.cssHeight : Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT;
            this.originalSize = new types_1.CssSize(cssWidth, cssHeight);
            //リサイズ可能領域のためのフレームを作成
            this.frameEl = document.createElement("div");
            this.frameEl.style.position = "absolute";
            this.frameEl.style.backgroundColor = "transparent";
            //正しいスタイル計算のため初回表示まではdisplay:hiddenにはしない
            this.frameEl.style.visibility = "hidden";
            this.frameEl.addEventListener("selectstart", this.onSelectStart.bind(this));
            this.frameEl.addEventListener("mousedown", this.onOuterMouseDown.bind(this));
            //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
            //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
            this.tabFocusMoveHeadStopper = document.createElement("div");
            this.tabFocusMoveHeadStopper.className = "itm_tabfocus_move_stopper";
            this.tabFocusMoveHeadStopper.style.height = "0px";
            this.tabFocusMoveHeadStopper.tabIndex = 0;
            this.tabFocusMoveHeadStopper.addEventListener("focusin", this.onTabFocusMoveHeadStopperFocusIn.bind(this));
            this.tabFocusMoveHeadDetector = document.createElement("div");
            this.tabFocusMoveHeadDetector.className = "itm_tabfocus_move_detector";
            this.tabFocusMoveHeadDetector.style.height = "0px";
            this.tabFocusMoveHeadDetector.tabIndex = 0;
            this.tabFocusMoveHeadDetector.addEventListener("focusin", this.onTabFocusMoveHeadDetectorFocusIn.bind(this));
            //コンテンツ領域生成
            this.contentEl = this.outerContentEl = document.createElement("div");
            this.contentEl.style.position = "absolute";
            this.contentEl.style.overflow = "hidden";
            this.contentEl.style.width = "100%";
            this.contentEl.style.height = "100%";
            //overlayのモーダル表示によって非アクティブ化したときに表示するレイヤー
            this.modalInactiveLayer = document.createElement("div");
            this.modalInactiveLayer.className = "itm_modal_background_layer";
            this.modalInactiveLayer.style.position = "absolute";
            this.modalInactiveLayer.style.overflow = "hidden";
            this.modalInactiveLayer.style.display = "none";
            this.modalInactiveLayer.style.width = "100%";
            this.modalInactiveLayer.style.height = "100%";
            this.modalInactiveLayerTransitionDriver = new css_transition_driver_2.default(this.modalInactiveLayer);
            this.resize(cssWidth, cssHeight);
            //非表示エレメントの作成（Tabキー対策）
            this.tabFocusMoveTailDetector = document.createElement("div");
            this.tabFocusMoveTailDetector.className = "itm_tabfocus_move_detector";
            this.tabFocusMoveTailDetector.style.height = "0px";
            this.tabFocusMoveTailDetector.tabIndex = 0;
            this.tabFocusMoveTailDetector.addEventListener("focusin", this.onTabFocusMoveTailDetectorFocusIn.bind(this));
            this.tabFocusMoveTailStopper = document.createElement("div");
            this.tabFocusMoveTailStopper.className = "itm_tabfocus_move_stopper";
            this.tabFocusMoveTailStopper.style.height = "0px";
            this.tabFocusMoveTailStopper.tabIndex = 0;
            this.tabFocusMoveTailStopper.addEventListener("focusin", this.onTabFocusMoveTailStopperFocusIn.bind(this));
            this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
            this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));
            this.frameEl.appendChild(this.tabFocusMoveHeadStopper);
            this.frameEl.appendChild(this.tabFocusMoveHeadDetector);
            this.frameEl.appendChild(this.contentEl);
            this.frameEl.appendChild(this.tabFocusMoveTailDetector);
            this.frameEl.appendChild(this.tabFocusMoveTailStopper);
            this.frameEl.appendChild(this.modalInactiveLayer);
            viewPortElement.appendChild(this.frameEl);
            this.cacheCurrentOffsetSize();
            this.outerFrameTransitionDriver = new css_transition_driver_2.default(this.frameEl);
        }
        Overlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
        };
        Overlay.prototype.__dispachMouseUpEvent = function (x, y) {
        };
        Overlay.prototype.registerAsContainer = function (className, targetEl) {
            var containerManager = container_manager_2.default.getInstance();
            var seq = Overlay.instanceSequenceTable.get(className);
            if (seq === undefined)
                seq = 0;
            this.container = containerManager.createContainer("__" + className + "_" + String(seq), "", targetEl, null);
            Overlay.instanceSequenceTable.set(className, seq + 1);
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
        Overlay.prototype.cacheCurrentOffsetSize = function () {
            var w = this.frameEl.offsetWidth;
            var h = this.frameEl.offsetHeight;
            if (w > 0 && h > 0)
                this.offsetSizeCache = new types_1.Size(w, h);
        };
        Overlay.prototype.restoreOriginalSize = function () {
            this.resize(this.originalSize.cssWidth, this.originalSize.cssHeight);
        };
        Overlay.prototype.changeZIndex = function (zIndex) {
            this.zIndex = zIndex;
            this.frameEl.style.zIndex = String(zIndex);
        };
        Overlay.prototype.getName = function () {
            return this.name;
        };
        Overlay.prototype.getZIndex = function () {
            return this.zIndex;
        };
        Overlay.prototype.changePosition = function (x, y) {
            this.position = new types_1.Point(x, y);
            this.frameEl.style.left = String(x) + "px";
            this.frameEl.style.top = String(y) + "px";
        };
        Overlay.prototype.moveToViewPortCenter = function () {
            var x = Math.round((this.viewPortEl.offsetWidth - this.offsetSizeCache.width) / 2);
            var y = Math.round((this.viewPortEl.offsetHeight - this.offsetSizeCache.height) / 2);
            this.changePosition(x, y);
        };
        Overlay.prototype.resize = function (width, height) {
            this.size = new types_1.CssSize(width, height);
            this.frameEl.style.width = width;
            this.frameEl.style.height = height;
        };
        Overlay.prototype.activate = function () {
            this.active = true;
            this.inactiveModalMode = false;
            this.modalInactiveLayerTransitionDriver.hide();
        };
        Overlay.prototype.inactivate = function (withModal) {
            this.active = false;
            this.inactiveModalMode = withModal;
            if (withModal) {
                this.modalInactiveLayerTransitionDriver.show();
            }
        };
        Overlay.prototype.isActive = function () {
            return this.active;
        };
        Overlay.DEFAULT_OVERLAY_SIZE_WIDTH = "50%";
        Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT = "50%";
        Overlay.instanceSequenceTable = new Map();
        return Overlay;
    }());
    exports.default = Overlay;
});
define("core/overlay/resizable_overlay", ["require", "exports", "core/overlay/overlay_manager", "core/common/types", "core/overlay/overlay"], function (require, exports, overlay_manager_2, types_2, overlay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResizableOverlay = /** @class */ (function (_super) {
        __extends(ResizableOverlay, _super);
        function ResizableOverlay(viewPortElement, name, size) {
            var _this = _super.call(this, viewPortElement, name, size) || this;
            _this.resizable = true;
            _this.isResizing = false;
            _this.resizeHandleEl = new Array();
            var maxPctWithoutFrame = "calc(100% - " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
            _this.contentEl.style.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _this.contentEl.style.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _this.contentEl.style.width = maxPctWithoutFrame;
            _this.contentEl.style.height = maxPctWithoutFrame;
            _this.modalInactiveLayer.style.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _this.modalInactiveLayer.style.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _this.modalInactiveLayer.style.width = maxPctWithoutFrame;
            _this.modalInactiveLayer.style.height = maxPctWithoutFrame;
            //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
            _this.createResizeHandleElements();
            _this.resize(_this.size.cssWidth, _this.size.cssHeight);
            return _this;
        }
        ResizableOverlay.prototype.createResizeHandleElements = function () {
            var _this = this;
            var size = ResizableOverlay.resizeHandleThicknessPx * 2;
            //0:左上 1:上中 2:右上 3:左中...8:右下  計8箇所 ※中中は不要
            for (var i = 0; i < 8; i++) {
                var el = document.createElement("div");
                el.dataset["positionIndex"] = String(i);
                el.style.position = "absolute";
                el.style.width = size + "px";
                el.style.height = size + "px";
                el.style.zIndex = "-1";
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
                _this.frameEl.appendChild(element);
            });
        };
        ResizableOverlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
            _super.prototype.__dispachMouseMoveEvent.call(this, x, y, deltaX, deltaY);
            var frameWidth, frameHeight;
            if (this.isResizing && this.resizable) {
                //※リサイズした場合は単位はピクセルに強制的に変更するものとする
                switch (this.resizePositionIndex) {
                    case 0: //左上
                        this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                        frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                        frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                        break;
                    case 1: //上
                        this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                        frameWidth = this.resizeStartSizePx.width;
                        frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                        break;
                    case 2: //右上
                        this.changePosition(this.position.x, this.resizeStartPos.y + (y - this.resizeStartMousePos.y));
                        frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                        frameHeight = this.resizeStartSizePx.height - (y - this.resizeStartMousePos.y);
                        break;
                    case 3: //左
                        this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                        frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                        frameHeight = this.resizeStartSizePx.height;
                        break;
                    case 4: //右
                        this.changePosition(this.position.x, this.position.y);
                        frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                        frameHeight = this.resizeStartSizePx.height;
                        break;
                    case 5: //左下
                        this.changePosition(this.resizeStartPos.x + (x - this.resizeStartMousePos.x), this.position.y);
                        frameWidth = this.resizeStartSizePx.width - (x - this.resizeStartMousePos.x);
                        frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                        break;
                    case 6: //下
                        this.changePosition(this.position.x, this.position.y);
                        frameWidth = this.resizeStartSizePx.width;
                        frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                        break;
                    case 7: //右下
                        this.changePosition(this.position.x, this.position.y);
                        frameWidth = this.resizeStartSizePx.width + (x - this.resizeStartMousePos.x);
                        frameHeight = this.resizeStartSizePx.height + (y - this.resizeStartMousePos.y);
                        break;
                }
                frameWidth -= (ResizableOverlay.resizeHandleThicknessPx * 2);
                frameHeight -= (ResizableOverlay.resizeHandleThicknessPx * 2);
                this.resize(frameWidth + "px", frameHeight + "px");
            }
        };
        ResizableOverlay.prototype.__dispachMouseUpEvent = function (x, y) {
            _super.prototype.__dispachMouseUpEvent.call(this, x, y);
            this.isResizing = false;
            this.cacheCurrentOffsetSize();
        };
        ResizableOverlay.prototype.onResizeHandleMouseDown = function (event) {
            this.isResizing = true;
            this.resizePositionIndex = parseInt(event.target.dataset["positionIndex"]);
            this.resizeStartMousePos = new types_2.Point(event.screenX, event.screenY);
            this.resizeStartPos = new types_2.Point(this.position.x, this.position.y);
            this.resizeStartSizePx = new types_2.Size(this.frameEl.offsetWidth, this.frameEl.offsetHeight);
            overlay_manager_2.default.getInstance().changeContentsSelectable(false);
        };
        ResizableOverlay.prototype.resize = function (width, height) {
            this.size = new types_2.CssSize(width, height);
            this.frameEl.style.width = "calc(" + width + " + " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
            this.frameEl.style.height = "calc(" + height + " + " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
        };
        ResizableOverlay.prototype.setResizable = function (resizable) {
            this.resizable = resizable;
            this.refreshResizeHandleElementActivate();
        };
        ResizableOverlay.prototype.refreshResizeHandleElementActivate = function () {
            var canResize = this.resizable && !this.inactiveModalMode;
            this.resizeHandleEl.forEach(function (element) {
                if (canResize) {
                    element.style.display = "";
                }
                else {
                    element.style.display = "none";
                }
            });
        };
        ResizableOverlay.resizeHandleThicknessPx = 8;
        return ResizableOverlay;
    }(overlay_1.default));
    exports.default = ResizableOverlay;
});
define("core/overlay/dialog_window", ["require", "exports", "core/overlay/overlay_manager", "core/common/dto", "core/overlay/resizable_overlay"], function (require, exports, overlay_manager_3, dto_2, resizable_overlay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogWindow = /** @class */ (function (_super) {
        __extends(DialogWindow, _super);
        function DialogWindow(viewPortElement, name, options) {
            var _this = _super.call(this, viewPortElement, name, options ? options.size : null) || this;
            _this.isDragging = false;
            if (options && options.resizable === false) {
                _this.setResizable(false);
            }
            _this.wrapperEl = document.createElement("div");
            _this.wrapperEl.style.position = "absolute";
            _this.wrapperEl.style.display = "flex";
            _this.wrapperEl.style.flexDirection = "column";
            _this.wrapperEl.style.width = "100%";
            _this.wrapperEl.style.height = "100%";
            _this.headerEl = document.createElement("div");
            _this.headerEl.className = "itm_dialog_window_header";
            _this.headerEl.style.position = "relative";
            _this.headerEl.style.display = "flex";
            _this.headerEl.style.width = "100%";
            if (options && options.hideHeader) {
                _this.headerEl.style.display = "none";
            }
            _this.headerTitleEl = document.createElement("div");
            _this.headerTitleEl.className = "caption";
            _this.headerTitleEl.textContent = options && options.defaultCaption ? options.defaultCaption : "";
            _this.headerCloseButtonEl = document.createElement("div");
            _this.headerCloseButtonEl.className = "close_button";
            _this.headerCloseButtonEl.textContent = "×";
            _this.headerCloseButtonEl.addEventListener("click", _this.onHeaderCloseButtonClick.bind(_this));
            _this.headerEl.appendChild(_this.headerTitleEl);
            _this.headerEl.appendChild(_this.headerCloseButtonEl);
            _this.headerEl.addEventListener("mousedown", _this.onHeaderMouseDown.bind(_this));
            _this.headerEl.addEventListener("dragstart", _this.onHeaderDragStart.bind(_this));
            _this.containerEl = document.createElement("div");
            _this.containerEl.className = "itm_dialog_window_body";
            _this.containerEl.style.position = "relative";
            _this.containerEl.style.flexGrow = "1";
            _this.containerEl.style.flexShrink = "1";
            _this.containerEl.style.width = "100%";
            _this.registerAsContainer("window", _this.containerEl);
            _this.footerEl = document.createElement("div");
            _this.footerEl.className = "itm_dialog_window_footer";
            _this.footerEl.style.position = "relative";
            _this.footerEl.style.width = "100%";
            if (options && options.hideFooter) {
                _this.footerEl.style.display = "none";
            }
            _this.okButtonEl = document.createElement("input");
            _this.okButtonEl.type = "button";
            _this.okButtonEl.classList.add("itm_dialog_window_footer_button", "ok");
            _this.okButtonEl.value = "OK";
            _this.okButtonEl.addEventListener("click", _this.onOkButtonClick.bind(_this));
            _this.cancelButtonEl = document.createElement("input");
            _this.cancelButtonEl.type = "button";
            _this.cancelButtonEl.classList.add("itm_dialog_window_footer_button", "cancel");
            _this.cancelButtonEl.value = "キャンセル";
            _this.cancelButtonEl.addEventListener("click", _this.onCancelButtonClick.bind(_this));
            _this.applyButtonEl = document.createElement("input");
            _this.applyButtonEl.type = "button";
            _this.applyButtonEl.classList.add("itm_dialog_window_footer_button", "apply");
            _this.applyButtonEl.value = "適用";
            _this.footerEl.appendChild(_this.okButtonEl);
            _this.footerEl.appendChild(_this.cancelButtonEl);
            _this.wrapperEl.appendChild(_this.headerEl);
            _this.wrapperEl.appendChild(_this.containerEl);
            _this.wrapperEl.appendChild(_this.footerEl);
            _this.contentEl.className = "itm_dialog_window_container";
            _this.contentEl.appendChild(_this.wrapperEl);
            _this.outerFrameTransitionDriver.setCustomTransitionClasses({
                standyStateClass: "itm_dialog_window_standy_state",
                enterTransitionClass: "itm_dialog_window_enter_transition",
                leaveTransitionClass: "itm_dialog_window_leave_transition",
                endStateClass: "itm_dialog_window_end_state"
            });
            return _this;
        }
        DialogWindow.prototype.onHeaderMouseDown = function (event) {
            this.isDragging = true;
            overlay_manager_3.default.getInstance().changeContentsSelectable(false);
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
                    _this.close();
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
        DialogWindow.prototype.setWindowTitle = function (title) {
            this.headerTitleEl.textContent = title;
        };
        DialogWindow.prototype.show = function (parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (options && options.position) {
                        this.changePosition(options.position.x, options.position.y);
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
        //override
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
        return DialogWindow;
    }(resizable_overlay_1.default));
    exports.default = DialogWindow;
});
define("core/common/common", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Common = /** @class */ (function () {
        function Common() {
        }
        Common.isMsIE = false;
        Common.currentMouseClientX = 0;
        Common.currentMouseClientY = 0;
        return Common;
    }());
    exports.default = Common;
});
define("core/overlay/context_menu", ["require", "exports", "core/overlay/overlay", "core/common/common", "core/overlay/overlay_manager"], function (require, exports, overlay_2, common_1, overlay_manager_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContextMenu = /** @class */ (function (_super) {
        __extends(ContextMenu, _super);
        function ContextMenu(viewPortElement, name, options) {
            var _this = _super.call(this, viewPortElement, name, options ? options.size : null) || this;
            _this.containerEl = document.createElement("div");
            _this.containerEl.className = "";
            _this.containerEl.style.position = "relative";
            _this.containerEl.style.width = "100%";
            _this.containerEl.style.height = "100%";
            _this.registerAsContainer("contextmenu", _this.containerEl);
            _this.contentEl.className = "itm_context_menu_container";
            _this.contentEl.appendChild(_this.containerEl);
            _this.contentEl.addEventListener("mousedown", _this.onContentMouseDown.bind(_this));
            _this.outerFrameTransitionDriver.setCustomTransitionClasses({
                standyStateClass: "itm_context_menu_standy_state",
                enterTransitionClass: "itm_context_menu_enter_transition",
                leaveTransitionClass: "itm_context_menu_leave_transition",
                endStateClass: "itm_context_menu_end_state"
            });
            return _this;
        }
        ContextMenu.prototype.getContainer = function () {
            return this.container;
        };
        ContextMenu.prototype.show = function (parcel, options) {
            var x, y;
            x = common_1.default.currentMouseClientX;
            y = common_1.default.currentMouseClientY;
            var widthPx = this.frameEl.offsetWidth;
            var heightPx = this.frameEl.offsetHeight;
            var overlayRightSideX = x + widthPx;
            var overlayBottomSideY = y + heightPx;
            var visibleAreaWidth = window.document.documentElement.clientWidth;
            var visibleAreaHeight = window.document.documentElement.clientHeight;
            var xVisibleAreaIsLargerThanOverlay = widthPx < visibleAreaWidth;
            var yVisibleAreaIsLargerThanOverlay = heightPx < visibleAreaHeight;
            var xCanDisplayOnNormalPosition = overlayRightSideX <= visibleAreaWidth;
            var yCanDisplayOnNormalPosition = overlayBottomSideY <= visibleAreaHeight;
            var xCanDisplayOnReversePosition = x >= widthPx;
            var yCanDisplayOnReversePosition = y >= heightPx;
            this.restoreOriginalSize();
            //x方向
            if (xVisibleAreaIsLargerThanOverlay) {
                if (xCanDisplayOnNormalPosition) {
                    //指定された位置をそのまま左上座標にする
                }
                else if (xCanDisplayOnReversePosition) {
                    x -= widthPx;
                }
                else {
                    //右端に寄せる
                    x = visibleAreaWidth - widthPx;
                }
            }
            else {
                x = 0; //入りきらない場合でも横方向は縮小せずに左端に寄せるだけにする
            }
            //y方向
            if (yVisibleAreaIsLargerThanOverlay) {
                if (yCanDisplayOnNormalPosition) {
                    //指定された位置をそのまま左上座標にする
                }
                else if (yCanDisplayOnReversePosition) {
                    y -= heightPx;
                }
                else {
                    //下端に寄せる
                    y = visibleAreaHeight - heightPx;
                }
            }
            else {
                //入りきらない場合は上端に寄せたのち、入りきらない分を一時的に縮小する
                y = 0;
                this.resize(widthPx + "px", visibleAreaHeight + "px");
            }
            this.changePosition(x, y);
            this.container.initialize(parcel);
            this.outerFrameTransitionDriver.show();
            return this.waitForOverlayClose();
        };
        ContextMenu.prototype.showAsModal = function (parcel, options) {
            return this.show(parcel, options);
        };
        ContextMenu.prototype.close = function (result) {
            this.outerFrameTransitionDriver.hide();
            //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
            window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
        };
        ContextMenu.prototype.waitForOverlayClose = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.waitForOverlayCloseResolver = resolve;
            });
        };
        ContextMenu.prototype.onContentMouseDown = function (event) {
            var overlayManager = overlay_manager_4.default.getInstance();
            overlayManager.cancelAutoClosingOnlyOnce();
        };
        return ContextMenu;
    }(overlay_2.default));
    exports.default = ContextMenu;
});
define("core/overlay/drawer", ["require", "exports", "core/overlay/overlay", "core/overlay/overlay_manager"], function (require, exports, overlay_3, overlay_manager_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DockType;
    (function (DockType) {
        DockType[DockType["Top"] = 0] = "Top";
        DockType[DockType["Right"] = 1] = "Right";
        DockType[DockType["Bottom"] = 2] = "Bottom";
        DockType[DockType["Left"] = 3] = "Left";
    })(DockType = exports.DockType || (exports.DockType = {}));
    var Drawer = /** @class */ (function (_super) {
        __extends(Drawer, _super);
        function Drawer(viewPortElement, name, options) {
            var _this = _super.call(this, viewPortElement, name, null) || this;
            _this.dockType = options.dockType !== undefined ? options.dockType : DockType.Left;
            _this.dockSize = options.dockSize !== undefined ? options.dockSize : "33%";
            _this.changeDockType(_this.dockType);
            _this.containerEl = document.createElement("div");
            _this.containerEl.className = "";
            _this.containerEl.style.position = "relative";
            _this.containerEl.style.width = "100%";
            _this.containerEl.style.height = "100%";
            _this.registerAsContainer("drawer", _this.containerEl);
            _this.contentEl.className = "itm_drawer_container";
            _this.contentEl.appendChild(_this.containerEl);
            _this.contentEl.addEventListener("mousedown", _this.onContentMouseDown.bind(_this));
            return _this;
        }
        Drawer.prototype.getContainer = function () {
            return this.container;
        };
        Drawer.prototype.changeDockType = function (dockType) {
            //サイズ変更
            if (dockType === DockType.Left || dockType === DockType.Right) {
                this.frameEl.style.width = this.dockSize;
                this.frameEl.style.height = "100%";
            }
            else if (dockType === DockType.Top || dockType === DockType.Bottom) {
                this.frameEl.style.width = "100%";
                this.frameEl.style.height = this.dockSize;
            }
            //位置変更
            this.frameEl.style.left = "";
            this.frameEl.style.right = "";
            this.frameEl.style.top = "";
            this.frameEl.style.bottom = "";
            if (dockType === DockType.Left || dockType === DockType.Top || dockType === DockType.Bottom) {
                //left=0パターン
                this.frameEl.style.left = "0px";
            }
            else {
                //right=0パターン(DockType.Right)
                this.frameEl.style.right = "0px";
            }
            if (dockType === DockType.Left || dockType === DockType.Right || dockType === DockType.Top) {
                //top=0パターン
                this.frameEl.style.top = "0px";
            }
            else {
                //bottom=0パターン(DockType.Bottom)
                this.frameEl.style.bottom = "0px";
            }
            //TransitionDriverクラス変更
            var dockTypeName;
            switch (dockType) {
                case DockType.Left:
                    dockTypeName = "left";
                    break;
                case DockType.Right:
                    dockTypeName = "right";
                    break;
                case DockType.Top:
                    dockTypeName = "top";
                    break;
                case DockType.Bottom:
                    dockTypeName = "bottom";
                    break;
            }
            this.outerFrameTransitionDriver.setCustomTransitionClasses({
                standyStateClass: "itm_drawer_" + dockTypeName + "_dock_standy_state",
                enterTransitionClass: "itm_drawer_enter_transition",
                leaveTransitionClass: "itm_drawer_leave_transition",
                endStateClass: "itm_drawer_" + dockTypeName + "_dock_end_state"
            });
        };
        //Override
        Drawer.prototype.changePosition = function (x, y) {
            //何もしない
        };
        Drawer.prototype.show = function (parcel, options) {
            this.container.initialize(parcel);
            this.outerFrameTransitionDriver.show();
            return this.waitForOverlayClose();
        };
        Drawer.prototype.showAsModal = function (parcel, options) {
            return this.show(parcel, options);
        };
        Drawer.prototype.close = function (result) {
            this.outerFrameTransitionDriver.hide();
            //自身のdisplay:noneが反映した後にコールバックさせるためsetTimeoutを介して呼び出す
            window.setTimeout(this.waitForOverlayCloseResolver.bind(this), 0, result);
        };
        Drawer.prototype.waitForOverlayClose = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.waitForOverlayCloseResolver = resolve;
            });
        };
        Drawer.prototype.onContentMouseDown = function (event) {
            var overlayManager = overlay_manager_5.default.getInstance();
            overlayManager.cancelAutoClosingOnlyOnce();
        };
        return Drawer;
    }(overlay_3.default));
    exports.default = Drawer;
});
define("core/overlay/overlay_manager", ["require", "exports", "core/overlay/dialog_window", "core/common/dto", "core/common/css_transition_driver", "core/overlay/context_menu", "core/overlay/drawer", "core/module/module_manager", "core/common/runtime_error"], function (require, exports, dialog_window_1, dto_3, css_transition_driver_3, context_menu_1, drawer_1, module_manager_3, runtime_error_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OvarlayManager = /** @class */ (function () {
        function OvarlayManager() {
            this.viewPortEl = null;
            this.overlayLastFocusedElement = null;
            this.previousMouseX = 0;
            this.previousMouseY = 0;
            this.contentsSelectable = true;
            this.requestedAutoCloseCancelOnlyOnce = false;
            this.DEFAULT_OVERLAY_START_Z_INDEX = 10;
            this.MODAL_START_Z_INDEX = 1000;
            this.FOREGROUND_START_Z_INDEX = 2000;
            this.overlays = new Map();
            this.overlayManagementTable = new Map();
            this.modalBackgroundLayer = document.createElement("div");
            this.modalBackgroundLayer.className = "itm_modal_background_layer";
            this.modalBackgroundLayer.style.position = "absolute";
            this.modalBackgroundLayer.style.overflow = "hidden";
            this.modalBackgroundLayer.style.width = "100%";
            this.modalBackgroundLayer.style.height = "100%";
            this.modalBackgroundLayer.style.display = "none";
            this.modalBackgroundLayer.style.zIndex = String(this.MODAL_START_Z_INDEX);
            this.modalBackgroundLayerTransitionDriver = new css_transition_driver_3.default(this.modalBackgroundLayer);
            this.onFocusInBindedThis = this.onFocusIn.bind(this);
            this.onMouseDownBindedThis = this.onMouseDown.bind(this);
            this.onMouseMoveBindedThis = this.onMouseMove.bind(this);
            this.onMouseUpBindedThis = this.onMouseUp.bind(this);
            this.onSelectStartBindedThis = this.onSelectStart.bind(this);
            this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
        }
        OvarlayManager.getInstance = function () {
            return OvarlayManager.instance;
        };
        OvarlayManager.prototype.findOverlayByContainer = function (searchContainer) {
            //TODO: IE11ではforEachしかつかえない。他ブラウザ用に見つかったらbreakするようなコードに変更したい。
            var res = null;
            this.overlays.forEach(function (overlay) {
                if (overlay.getContainer() === searchContainer) {
                    res = overlay;
                }
            });
            return res;
        };
        OvarlayManager.prototype.onMouseDown = function (event) {
            var _this = this;
            if (!this.requestedAutoCloseCancelOnlyOnce) {
                this.overlayManagementTable.forEach(function (omd, key) {
                    if (omd.isVisible && omd.isAutoCloseableWhenOutfocus) {
                        var overlay_4 = _this.overlays.get(key);
                        var module = overlay_4.getContainer().getActiveModule();
                        module.exit(dto_3.ActionType.CANCEL).then(function (exited) {
                            if (exited)
                                overlay_4.close();
                        });
                    }
                });
            }
            this.requestedAutoCloseCancelOnlyOnce = false;
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
        OvarlayManager.prototype.windowResizeEventHandler = function (event) {
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
                this.viewPortEl.removeEventListener("mousedown", this.onMouseDownBindedThis);
                this.viewPortEl.removeEventListener("mousemove", this.onMouseMoveBindedThis);
                this.viewPortEl.removeEventListener("mouseup", this.onMouseUpBindedThis);
                this.viewPortEl.removeEventListener("selectstart", this.onSelectStartBindedThis);
            }
            this.viewPortEl = element;
            this.viewPortEl.addEventListener("focusin", this.onFocusInBindedThis);
            this.viewPortEl.addEventListener("mousedown", this.onMouseDownBindedThis);
            this.viewPortEl.addEventListener("mousemove", this.onMouseMoveBindedThis);
            this.viewPortEl.addEventListener("mouseup", this.onMouseUpBindedThis);
            this.viewPortEl.addEventListener("selectstart", this.onSelectStartBindedThis);
            this.viewPortEl.appendChild(this.modalBackgroundLayer);
        };
        OvarlayManager.prototype.createWindow = function (overlayName, options) {
            var overlay = new dialog_window_1.default(this.viewPortEl, overlayName, options);
            this.overlays.set(overlayName, overlay);
            this.overlayManagementTable.set(overlayName, new OverlayManagementData());
            return overlay;
        };
        OvarlayManager.prototype.createContextMenu = function (overlayName, options) {
            var overlay = new context_menu_1.default(this.viewPortEl, overlayName, options);
            this.overlays.set(overlayName, overlay);
            var omd = new OverlayManagementData();
            omd.isAutoCloseableWhenOutfocus = true;
            this.overlayManagementTable.set(overlayName, omd);
            return overlay;
        };
        OvarlayManager.prototype.createDrawer = function (overlayName, options) {
            var overlay = new drawer_1.default(this.viewPortEl, overlayName, options);
            this.overlays.set(overlayName, overlay);
            var omd = new OverlayManagementData();
            omd.isAutoCloseableWhenOutfocus = true;
            this.overlayManagementTable.set(overlayName, omd);
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
                var overlay, omd, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkAndLoadLazyModule(overlayName)];
                        case 1:
                            _a.sent();
                            overlay = this.overlays.get(overlayName);
                            omd = this.overlayManagementTable.get(overlayName);
                            omd.parentOverlay = options ? options.parent : null;
                            omd.isVisible = true;
                            this.activateSpecificOverlay(overlayName);
                            return [4 /*yield*/, overlay.show(parcel, options)];
                        case 2:
                            result = _a.sent();
                            omd.isVisible = false;
                            this.activateTopOverlay();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        OvarlayManager.prototype.showAsModal = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var omd, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkAndLoadLazyModule(overlayName)];
                        case 1:
                            _a.sent();
                            omd = this.overlayManagementTable.get(overlayName);
                            omd.isModal = true;
                            this.beginModalMode();
                            return [4 /*yield*/, this.show(overlayName, parcel, options)];
                        case 2:
                            result = _a.sent();
                            omd.isModal = false;
                            this.endModalMode();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        OvarlayManager.prototype.checkAndLoadLazyModule = function (overlayName) {
            return __awaiter(this, void 0, void 0, function () {
                var moduleManager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!this.overlayManagementTable.has(overlayName)) return [3 /*break*/, 2];
                            moduleManager = module_manager_3.default.getInstance();
                            return [4 /*yield*/, moduleManager.loadSubModules(overlayName, true)];
                        case 1:
                            _a.sent();
                            if (!this.overlayManagementTable.has(overlayName)) {
                                throw new runtime_error_4.default("指定されたモジュールはコンテナに登録されていません。");
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/, true];
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
            var visibleOverlayCounter = 0;
            var previousOmd = null;
            var previousOverlay = null;
            overlayList.forEach(function (overlay) {
                var omd = _this.overlayManagementTable.get(overlay.getName());
                if (omd.isVisible) {
                    if (omd.isAutoCloseableWhenOutfocus) {
                        overlay.changeZIndex(_this.FOREGROUND_START_Z_INDEX + visibleCount--);
                    }
                    else if (omd.isModal) {
                        overlay.changeZIndex(_this.MODAL_START_Z_INDEX + visibleCount--);
                    }
                    else {
                        overlay.changeZIndex(_this.DEFAULT_OVERLAY_START_Z_INDEX + visibleCount--);
                    }
                    if (visibleOverlayCounter === 0 ||
                        (previousOverlay.isActive() && overlay === previousOmd.parentOverlay)) {
                        overlay.activate();
                    }
                    else {
                        overlay.inactivate(omd.isModal);
                    }
                    previousOmd = omd;
                    previousOverlay = overlay;
                    ++visibleOverlayCounter;
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
        OvarlayManager.prototype.cancelAutoClosingOnlyOnce = function () {
            this.requestedAutoCloseCancelOnlyOnce = true;
        };
        OvarlayManager.instance = new OvarlayManager();
        return OvarlayManager;
    }());
    exports.default = OvarlayManager;
    var OverlayManagementData = /** @class */ (function () {
        function OverlayManagementData() {
            this.isVisible = false;
            this.isModal = false;
            this.isAutoCloseableWhenOutfocus = false;
            this.parentOverlay = null;
        }
        OverlayManagementData.prototype.reset = function () {
            this.isVisible = false;
            this.isModal = false;
            this.isAutoCloseableWhenOutfocus = false;
            this.parentOverlay = null;
            return this;
        };
        return OverlayManagementData;
    }());
});
define("core/adapter/navigation", ["require", "exports", "core/module/module_router", "core/module/module_manager", "core/overlay/overlay_manager", "core/common/runtime_error"], function (require, exports, module_router_1, module_manager_4, overlay_manager_6, runtime_error_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Navigation = /** @class */ (function () {
        function Navigation(adapter) {
            this.moduleRouter = module_router_1.default.getInstance();
            this.moduleManager = module_manager_4.default.getInstance();
            this.overlayManager = overlay_manager_6.default.getInstance();
            this.adapter = adapter;
        }
        Navigation.prototype.getCurrentOverlay = function () {
            //呼び出し元モジュールのコンテナの最上位コンテナを取得
            var i = 0; //循環時の無限ループ防止用カウンタ
            var container = this.adapter.getHtmlComponent().getCurrentContainer();
            while (container.getParent()) {
                container = container.getParent();
                if (i++ > 100) {
                    throw new runtime_error_5.default("コンテナの親子関係に循環が発生しています。");
                }
            }
            //最上位コンテナを保持しているオーバーレイを取得
            return this.overlayManager.findOverlayByContainer(container);
        };
        Navigation.prototype.forward = function (targetIdentifier, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var finalTargetId;
                return __generator(this, function (_a) {
                    if (targetIdentifier.split("::").length > 1) {
                        finalTargetId = targetIdentifier;
                    }
                    else {
                        finalTargetId =
                            this.adapter.getHtmlComponent().
                                getCurrentContainer().getId() + "::" + targetIdentifier;
                    }
                    return [2 /*return*/, this.moduleRouter.forward(finalTargetId, parcel)];
                });
            });
        };
        Navigation.prototype.startExitProcess = function (actionType) {
            this.adapter.getHtmlComponent().exit(actionType);
        };
        Navigation.prototype.showWindow = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Navigation.prototype.showWindowAsModal = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.overlayManager.showAsModal(overlayName, parcel, options)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Navigation.prototype.showContextMenu = function (overlayName, parcel, targetElement) {
            return __awaiter(this, void 0, void 0, function () {
                var showOptions, _a, left, bottom;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            showOptions = {
                                parent: this.getCurrentOverlay()
                            };
                            if (!targetElement) return [3 /*break*/, 2];
                            _a = targetElement.getBoundingClientRect(), left = _a.left, bottom = _a.bottom;
                            showOptions.position = { x: left, y: bottom };
                            return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, showOptions)];
                        case 1: return [2 /*return*/, _b.sent()];
                        case 2: return [4 /*yield*/, this.overlayManager.show(overlayName, parcel, showOptions)];
                        case 3: return [2 /*return*/, _b.sent()];
                    }
                });
            });
        };
        Navigation.prototype.showDrawer = function (overlayName, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.overlayManager.showAsModal(overlayName, parcel)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        Navigation.prototype.sendMessage = function (destination, command, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.moduleManager.dispatchMessage(destination, command, message)];
                });
            });
        };
        return Navigation;
    }());
    exports.default = Navigation;
});
define("core/adapter/html_component_adapter", ["require", "exports", "core/module/module_router", "core/overlay/overlay_manager", "core/common/dto", "core/module/module_manager", "core/adapter/navigation"], function (require, exports, module_router_2, overlay_manager_7, dto_4, module_manager_5, navigation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.htmlComponentAdapters = new Map();
    var HTMLComponentAdapter = /** @class */ (function () {
        function HTMLComponentAdapter() {
            this.isModified = false;
            this.moduleRouter = module_router_2.default.getInstance();
            this.moduleManager = module_manager_5.default.getInstance();
            this.overlayManager = overlay_manager_7.default.getInstance();
            this.exitCallbackReturnFunctionsObject = {
                cancelExit: this.cancelExit.bind(this),
                continueExit: this.continueExit.bind(this)
            };
            this.navigation = new navigation_1.default(this);
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
                this.continueExit(new dto_4.Result(actionType, true));
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
        return HTMLComponentAdapter;
    }());
    exports.default = HTMLComponentAdapter;
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
        HTMLComponent.prototype.dispatchResizeEvent = function () {
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
        HTMLComponent.prototype.getCurrentContainer = function () {
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
                            this.wrapperElement.className = "itm_html_module";
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
                                containerInfo.container = containerManager.createContainer(containerId, containerInfo.type, containerEl, _this.currentContainer);
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
                var scriptElement = nodeList[i];
                var scopeMode = scriptElement.dataset["scopeMode"];
                if (scopeMode === "native") {
                    nativeScript += scriptElement.textContent;
                }
                else if (!scopeMode || scopeMode === "prototype") { //default
                    prototypeScript += scriptElement.textContent;
                }
                else if (scopeMode === "class") {
                    classScript += scriptElement.textContent;
                }
                initialScriptElements.push(scriptElement);
            }
            var nativeScriptElement = document.createElement("script");
            nativeScriptElement.textContent = nativeScript;
            this.wrapperElement.appendChild(nativeScriptElement);
            //prototypeScriptとclassScriptは1つのHTMLファイルにつき1種類だけ
            if (classScript) {
                var classScriptElement = document.createElement("script");
                classScriptElement.textContent = classScript;
                this.wrapperElement.appendChild(classScriptElement);
            }
            else {
                var prototypeScriptElement = document.createElement("script");
                prototypeScript = this.prototypeTemplateBegin +
                    prototypeScript +
                    this.prototypeTemplateEnd;
                prototypeScriptElement.textContent = prototypeScript;
                this.wrapperElement.appendChild(prototypeScriptElement);
            }
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
define("core/module/module_manager", ["require", "exports", "core/module/native_component", "core/common/runtime_error", "core/container/container_manager", "core/overlay/overlay_manager"], function (require, exports, native_component_1, runtime_error_6, container_manager_4, overlay_manager_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DisplayMode;
    (function (DisplayMode) {
        DisplayMode[DisplayMode["Embedding"] = 0] = "Embedding";
        DisplayMode[DisplayMode["Window"] = 1] = "Window";
        DisplayMode[DisplayMode["ContextMenu"] = 2] = "ContextMenu";
        DisplayMode[DisplayMode["Drawer"] = 3] = "Drawer";
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
        ModuleManager.prototype.registerWindow = function (name, sourceUri, windowOptions, options) {
            var md = this.registerDescription(name, sourceUri, DisplayMode.Window, null, null, options);
            md.windowOptions = windowOptions;
        };
        ModuleManager.prototype.registerContextMenu = function (name, sourceUri, contextMenuOptions, options) {
            var md = this.registerDescription(name, sourceUri, DisplayMode.ContextMenu, null, null, options);
            md.contextMenuOptions = contextMenuOptions;
        };
        ModuleManager.prototype.registerDrawer = function (name, sourceUri, drawerOptions, options) {
            var md = this.registerDescription(name, sourceUri, DisplayMode.Drawer, null, null, options);
            md.drawerOptions = drawerOptions;
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
                lazyLoading: op.lazyLoading !== undefined ? op.lazyLoading : false,
                preloadSourceAtLazy: op.preloadSourceAtLazy !== undefined ? op.preloadSourceAtLazy : true,
            };
            this.descriptions.push(ds);
            return ds;
        };
        ModuleManager.prototype.getModule = function (name) {
            if (!this.modules.has(name))
                throw new runtime_error_6.default("指定されたモジュールが見つかりません。");
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
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            description = _a[_i];
                            newModule = null;
                            //モジュールインスタンス生成
                            if (description.moduleType === ModuleType.Native || !description.moduleType) {
                                newModule = new native_component_1.default(description.name, description.sourceUri, ModuleManager.instanceSequence++);
                            }
                            else {
                                throw new runtime_error_6.default("不明な種類のコンポーネントが指定されました。");
                            }
                            //モジュールプールへの登録
                            this.modules.set(description.name, newModule);
                            if (!!description.lazyLoading) return [3 /*break*/, 3];
                            return [4 /*yield*/, newModule.fetch()];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            //依存情報テーブルの準備
                            this.dependencyInfoMap.set(description.name, new ModuleDependencyInfo(description, newModule.getSubContainerNames()));
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
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
                                    //それ以外（自身がwindowやcontextmenuのルートコンテナになる場合）
                                    //※依存情報テーブル上はルート上に含めるものとするため何もしない（root.root）
                                }
                                var targetDependencyInfo = _this.dependencyInfoMap.get(targetModuleName);
                                // if (targetDependencyInfo && targetDependencyInfo.subContainerNames.has(targetContainerName)) {
                                targetDependencyInfo.addSubModule(moduleName, targetContainerName);
                                // } else {
                                //     throw new RuntimeError("未定義のコンテナが指定された");
                                // }
                            });
                            //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
                            return [4 /*yield*/, this.loadSubModules(ModuleManager.ROOT_NAME)];
                        case 6:
                            //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
                            _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ModuleManager.prototype.loadSubModules = function (moduleName, forceLoading) {
            return __awaiter(this, void 0, void 0, function () {
                var dependencyInfo, containerManager, overlayManager, moduleDescription, displayMode, module, targetContainer, overlay, _i, _a, subModuleName;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            dependencyInfo = this.dependencyInfoMap.get(moduleName);
                            containerManager = container_manager_4.default.getInstance();
                            overlayManager = overlay_manager_8.default.getInstance();
                            moduleDescription = dependencyInfo.moduleDescription;
                            if (dependencyInfo.isProcessed)
                                throw new runtime_error_6.default("コンテナの循環参照を検出しました。");
                            dependencyInfo.isProcessed = true;
                            if (!(!dependencyInfo.isRoot && (!moduleDescription.lazyLoading || forceLoading))) return [3 /*break*/, 6];
                            displayMode = moduleDescription.displayMode;
                            module = this.modules.get(moduleDescription.name);
                            if (!(displayMode === DisplayMode.Embedding)) return [3 /*break*/, 4];
                            targetContainer = containerManager.getContainer(moduleDescription.targetContainerId);
                            if (!targetContainer) return [3 /*break*/, 2];
                            return [4 /*yield*/, targetContainer.addModule(module)];
                        case 1:
                            _b.sent();
                            if (moduleDescription.isContainerDefault) {
                                //targetContainer.activateModule(module);
                                targetContainer.setDefaultModule(module);
                            }
                            return [3 /*break*/, 3];
                        case 2: throw new runtime_error_6.default("ターゲットコンテナは存在しないか、ロードされていません。");
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            overlay = void 0;
                            switch (displayMode) {
                                case DisplayMode.Window:
                                    overlay = overlayManager.createWindow(module.getName(), moduleDescription.windowOptions);
                                    break;
                                case DisplayMode.ContextMenu:
                                    overlay = overlayManager.createContextMenu(module.getName(), moduleDescription.contextMenuOptions);
                                    break;
                                case DisplayMode.Drawer:
                                    overlay = overlayManager.createDrawer(module.getName(), moduleDescription.drawerOptions);
                                    break;
                            }
                            return [4 /*yield*/, overlay.getContainer().addModule(module)];
                        case 5:
                            _b.sent();
                            overlay.getContainer().activateModule(module);
                            _b.label = 6;
                        case 6:
                            _i = 0, _a = dependencyInfo.subModuleNames;
                            _b.label = 7;
                        case 7:
                            if (!(_i < _a.length)) return [3 /*break*/, 11];
                            subModuleName = _a[_i];
                            if (!!this.dependencyInfoMap.get(subModuleName).moduleDescription.lazyLoading) return [3 /*break*/, 9];
                            return [4 /*yield*/, this.loadSubModules(subModuleName)];
                        case 8:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            console.log(subModuleName + " is lazy load mode.");
                            _b.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 7];
                        case 11: return [2 /*return*/];
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
            //subContainerNames: Set<string>;
            this.subModuleNames = new Array();
            this.isProcessed = false;
            this.moduleDescription = moduleDescription;
            //this.subContainerNames = new Set(subContainerNames); //IE11非対応
            // this.subContainerNames = new Set();
            // subContainerNames.forEach(name => {
            //     this.subContainerNames.add(name);
            // });
            this.isRoot = moduleDescription === null;
        }
        ModuleDependencyInfo.prototype.addSubModule = function (subModuleName, targetContainerName) {
            // if (this.subContainerNames.has(targetContainerName)) {
            this.subModuleNames.push(subModuleName);
            // } else {
            //     throw new RuntimeError("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
            // }
        };
        return ModuleDependencyInfo;
    }());
});
define("core/common/shared_css_script_loader", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SharedCssScriptLoader = /** @class */ (function () {
        function SharedCssScriptLoader(cssUris, scriptUris) {
            this.cssUris = [];
            this.scriptUris = [];
            this.loadFinishResolver = null;
            this.currentCssLoadIndex = 0;
            this.currentScriptLoadIndex = 0;
            this.cssLoadIsComplete = false;
            this.scriptLoadIsComplete = false;
            this.loadedCss = new Set();
            this.loadedScript = new Set();
            this.cssUris = cssUris;
            this.scriptUris = scriptUris;
        }
        SharedCssScriptLoader.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.loadFinishResolver = resolve;
                            _this.loadCss();
                            _this.loadScript();
                        })];
                });
            });
        };
        SharedCssScriptLoader.prototype.onCompleteHandler = function () {
            if (this.cssLoadIsComplete && this.scriptLoadIsComplete) {
                this.loadFinishResolver();
            }
        };
        SharedCssScriptLoader.prototype.loadCss = function () {
            var _this = this;
            var targetUri = this.cssUris[this.currentCssLoadIndex];
            var skip = this.loadedCss.has(targetUri) || this.cssUris.length === 0;
            var element;
            if (!skip) {
                var head = document.getElementsByTagName('head')[0];
                element = document.createElement("link");
                element.rel = "stylesheet";
                element.type = "text/css";
                element.href = targetUri + "?ver=" + new Date().getTime();
                head.insertBefore(element, head.firstChild);
                this.loadedScript.add(targetUri);
            }
            if (++this.currentCssLoadIndex < this.cssUris.length) {
                if (!skip) {
                    element.onload = this.loadCss.bind(this);
                }
                else {
                    this.loadCss();
                }
            }
            else {
                if (!skip) {
                    element.onload = function () {
                        _this.cssLoadIsComplete = true;
                        _this.onCompleteHandler();
                    };
                }
                else {
                    this.cssLoadIsComplete = true;
                    this.onCompleteHandler();
                }
            }
        };
        SharedCssScriptLoader.prototype.loadScript = function () {
            var _this = this;
            var targetUri = this.scriptUris[this.currentScriptLoadIndex];
            var skip = this.loadedScript.has(targetUri) || this.scriptUris.length === 0;
            var element;
            if (!skip) {
                element = document.createElement("script");
                element.src = targetUri + "?ver=" + new Date().getTime();
                document.body.appendChild(element);
                this.loadedScript.add(targetUri);
            }
            if (++this.currentScriptLoadIndex < this.scriptUris.length) {
                if (!skip) {
                    element.onload = this.loadScript.bind(this);
                }
                else {
                    this.loadScript();
                }
            }
            else {
                if (!skip) {
                    element.onload = function () {
                        _this.scriptLoadIsComplete = true;
                        _this.onCompleteHandler();
                    };
                }
                else {
                    this.scriptLoadIsComplete = true;
                    this.onCompleteHandler();
                }
            }
        };
        return SharedCssScriptLoader;
    }());
    exports.default = SharedCssScriptLoader;
});
define("core/configurer", ["require", "exports", "core/module/module_manager", "core/source_repository", "core/common/shared_css_script_loader"], function (require, exports, module_manager_6, source_repository_2, shared_css_script_loader_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Configurer = /** @class */ (function () {
        function Configurer() {
            this.moduleManager = module_manager_6.default.getInstance();
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
            source_repository_2.default.getInstance().setSourceVersion(version);
        };
        Configurer.prototype.getAppRootId = function () {
            return this.appRootId;
        };
        Configurer.prototype.getSharedCssScriptLoader = function () {
            return new shared_css_script_loader_1.default(this.cssUris, this.scriptUris);
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
    exports.default = Configurer;
});
define("intraframe", ["require", "exports", "core/module/module_manager", "core/container/container_manager", "core/overlay/overlay_manager", "core/common/common", "core/configurer", "core/common/runtime_error"], function (require, exports, module_manager_7, container_manager_5, overlay_manager_9, common_2, configurer_1, runtime_error_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    if (document["documentMode"]) {
        common_2.default.isMsIE = true;
    }
    window.addEventListener("mousemove", function (e) {
        common_2.default.currentMouseClientX = e.clientX;
        common_2.default.currentMouseClientY = e.clientY;
    });
    var __sharedCssScriptIsLoaded = false;
    var __moduleManagerIsInitialized = false;
    var __bootloader = function () {
        console.log("bootloader is called.");
        var __global = window;
        if (__global.configurer) {
            var configurer = configurer_1.default.getInstance();
            __global.configurer(configurer);
            configurer.getSharedCssScriptLoader().load().then(function () {
                console.log("css and scripts is loaded.");
                __sharedCssScriptIsLoaded = true;
                __startApplications();
            });
            var appRootEl = document.querySelector("#" + configurer.getAppRootId());
            if (!appRootEl) {
                throw new runtime_error_7.default("有効なルートコンテナが設定されていません。");
            }
            container_manager_5.default.getInstance().setRootElement(appRootEl);
            overlay_manager_9.default.getInstance().setViewPortElement(appRootEl);
            module_manager_7.default.getInstance().initialize().then(function () {
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
        container_manager_5.default.getInstance().initializeRootContainer();
        var resizeEvent;
        if (common_2.default.isMsIE) {
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
});
define("core/container/flickable_flat_container", ["require", "exports", "core/container/flat_container"], function (require, exports, flat_container_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FlickableFlatContainer = /** @class */ (function (_super) {
        __extends(FlickableFlatContainer, _super);
        function FlickableFlatContainer() {
            return _super.call(this, "", null, null) || this;
        }
        FlickableFlatContainer.prototype.activateModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new Error("Method not implemented.");
                });
            });
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
//# sourceMappingURL=intraframe.js.map