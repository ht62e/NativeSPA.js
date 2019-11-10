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
            this.standyStateClass = "standy_state";
            this.enterTransitionClass = "enter_transition";
            this.leaveTransitionClass = "leave_transition";
            this.endStateClass = "end_state";
            this.showResolver = null;
            this.hideResolver = null;
            this.target = target;
            this.setCustomTransitionClasses(customClasses);
            this.target.addEventListener("transitionend", this.onTransitionEnd.bind(this));
        }
        CssTransitionDriver.prototype.onTransitionEnd = function (event) {
            if (this.hideResolver) {
                this.setStandbyStateClasses();
                this.hideResolver(true);
                this.hideResolver = null;
            }
            if (this.showResolver) {
                this.showResolver(true);
                this.showResolver = null;
            }
        };
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
        CssTransitionDriver.prototype.show = function (withoutTransition) {
            return __awaiter(this, void 0, void 0, function () {
                var transitionIsUsed;
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.hideResolver) {
                        //クローズアニメーション中に再表示した場合においても、hide呼び出し元は閉じたことを通知する
                        this.hideResolver(true);
                        this.hideResolver = null;
                    }
                    transitionIsUsed = this.toggleClasses(true, withoutTransition);
                    if (transitionIsUsed) {
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
        CssTransitionDriver.prototype.hide = function (withoutTransition) {
            return __awaiter(this, void 0, void 0, function () {
                var transitionIsUsed;
                var _this = this;
                return __generator(this, function (_a) {
                    if (this.target.style.display === "none" || this.target.style.visibility === "hidden")
                        return [2 /*return*/];
                    if (this.showResolver) {
                        this.showResolver(true);
                        this.showResolver = null;
                    }
                    transitionIsUsed = this.toggleClasses(false, withoutTransition);
                    if (transitionIsUsed) {
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.hideResolver = resolve;
                            })];
                    }
                    else {
                        this.setStandbyStateClasses();
                        return [2 /*return*/, Promise.resolve(true)];
                    }
                    return [2 /*return*/];
                });
            });
        };
        CssTransitionDriver.prototype.toggleClasses = function (visible, withoutTransition) {
            var _this = this;
            var transitionIsUsed = true;
            if (visible) {
                this.target.style.display = "";
                this.target.style.visibility = ""; //初回表示まではvisibility:hiddenで非表示状態になっている
                window.setTimeout(function () {
                    _this.target.style.pointerEvents = "";
                    if (_this.enterTransitionClass && !withoutTransition) {
                        _this.target.classList.add(_this.enterTransitionClass);
                    }
                    else {
                        transitionIsUsed = false;
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
                if (this.leaveTransitionClass && !withoutTransition) {
                    this.target.classList.add(this.leaveTransitionClass);
                }
                else {
                    this.target.style.display = "none";
                    transitionIsUsed = false;
                }
                if (this.endStateClass) {
                    this.target.classList.add(this.endStateClass);
                }
            }
            return transitionIsUsed;
        };
        CssTransitionDriver.prototype.setStandbyStateClasses = function () {
            this.target.style.display = "none";
            if (this.standyStateClass) {
                this.target.classList.add(this.standyStateClass);
            }
            if (this.leaveTransitionClass) {
                this.target.classList.remove(this.leaveTransitionClass);
            }
            if (this.endStateClass) {
                this.target.classList.remove(this.endStateClass);
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
        function Container(id, bindDomElement, owner, cssTransitionOptions) {
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
                this.owner.getOwnerContainer().subContainerNavigationEventHandler(this, this.currentModule);
            }
        };
        Container.prototype.getId = function () {
            return this.id;
        };
        Container.prototype.getOwner = function () {
            return this.owner;
        };
        Container.prototype.getCurrentModule = function () {
            return this.currentModule;
        };
        Container.prototype.setDefaultModule = function (moduleName) {
            this.defaultModuleName = moduleName;
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
            // this.mountedModules.forEach((module: Module) => {
            //     module.dispatchResizeEvent();
            // });
            // this.mountedModules.forEach((moduleInstances: Array<Module>) => {
            //     moduleInstances.forEach((module: Module) => {
            //         module.dispatchResizeEvent();
            //     })
            // });
        };
        Container.prototype.subContainerNavigationEventHandler = function (container, module) {
            if (!this.currentModule)
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
            var allowBubbling = this.currentModule.subContainerNavigationEventHandler(container.getId(), info, histories);
            if (allowBubbling !== false) {
                this.triggerSubContainerNavigationEvent();
            }
        };
        return Container;
    }());
    exports.default = Container;
});
define("core/container/container_holder", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/module/app_module", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AppModule = /** @class */ (function () {
        function AppModule() {
            this.caption = "";
            this.isFetched = false;
            this.isMounted = false;
            this.isInitialized = false;
        }
        AppModule.prototype.getModuleLoader = function () {
            return this.moduleLoader;
        };
        AppModule.prototype.getName = function () {
            return this.name;
        };
        AppModule.prototype.getCaption = function () {
            return this.caption;
        };
        AppModule.prototype.getOwnerContainer = function () {
            return this.currentContainer;
        };
        AppModule.prototype.setCaption = function (caption) {
            this.caption = caption;
        };
        return AppModule;
    }());
    exports.default = AppModule;
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
define("core/container/page_container", ["require", "exports", "core/container/container", "core/common/runtime_error", "core/common/dto"], function (require, exports, container_1, runtime_error_1, dto_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageContainer = /** @class */ (function (_super) {
        __extends(PageContainer, _super);
        function PageContainer(id, bindDomElement, owner, cssTransitionOptions) {
            var _this = _super.call(this, id, bindDomElement, owner, cssTransitionOptions) || this;
            _this.mountedModules = new Map();
            bindDomElement.classList.add("itm_page_container");
            return _this;
        }
        PageContainer.prototype.addModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                var moduleName;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            moduleName = module.getName();
                            if (!this.mountedModules.has(moduleName)) {
                                this.mountedModules.set(moduleName, new Array());
                            }
                            this.mountedModules.get(moduleName).push(module);
                            return [4 /*yield*/, module.mount(function (element, option) {
                                    _this.bindDomElement.appendChild(element);
                                    return _this;
                                }, this.cssTransitionOptions)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        PageContainer.prototype.initialize = function (parcel) {
            this.moduleChangeHistory = new Array();
            this.hideAllModules();
            if (this.defaultModuleName) {
                this.switch(this.defaultModuleName, parcel, true);
            }
        };
        PageContainer.prototype.switch = function (moduleName, parcel, withoutTransition) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.moduleChangeHistory.length = 0;
                            return [4 /*yield*/, this.navigate(moduleName, parcel, withoutTransition)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        PageContainer.prototype.forward = function (moduleName, parcel, withoutTransition) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.navigate(moduleName, parcel, withoutTransition)];
                        case 1: 
                        //if (this.moduleChangeHistory.indexOf(moduleName) !== -1) return;
                        return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        PageContainer.prototype.navigate = function (moduleName, parcel, withoutTransition) {
            return __awaiter(this, void 0, void 0, function () {
                var module, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prepareModule(moduleName)];
                        case 1:
                            module = _a.sent();
                            module.initialize(parcel);
                            this.activateModule(module, withoutTransition);
                            this.moduleChangeHistory.push(module);
                            return [4 /*yield*/, module.waitForExit()];
                        case 2:
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
            this.currentModule.exit(dto_1.ActionType.BACK).then(function (exited) {
                if (exited) {
                    _this.showPreviousModule();
                }
                else {
                    _this.inBackProcess = false;
                }
            });
        };
        PageContainer.prototype.prepareModule = function (moduleName) {
            return __awaiter(this, void 0, void 0, function () {
                var availableModule, moduleInstances, i, moduleLoader;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            availableModule = null;
                            moduleInstances = this.mountedModules.get(moduleName);
                            if (moduleInstances) {
                                for (i in moduleInstances) {
                                    if (this.moduleChangeHistory.indexOf(moduleInstances[i]) === -1) {
                                        availableModule = moduleInstances[i];
                                        break;
                                    }
                                }
                            }
                            if (!!availableModule) return [3 /*break*/, 2];
                            moduleLoader = this.owner.getModuleLoader();
                            return [4 /*yield*/, moduleLoader.loadModuleRecursively(moduleName, this.owner)];
                        case 1:
                            availableModule = _a.sent();
                            if (availableModule.getOwnerContainer() !== this) {
                                throw new runtime_error_1.default("指定されたモジュールはコンテナに登録されていません。");
                            }
                            console.log(availableModule.getName() + " is lazy loaded.");
                            _a.label = 2;
                        case 2: return [2 /*return*/, availableModule];
                    }
                });
            });
        };
        PageContainer.prototype.activateModule = function (module, withoutTransition) {
            if (this.currentModule) {
                this.currentModule.hide();
            }
            this.currentModule = module;
            module.show(withoutTransition);
            this.triggerSubContainerNavigationEvent();
        };
        PageContainer.prototype.showPreviousModule = function () {
            if (this.moduleChangeHistory.length > 0) {
                this.moduleChangeHistory.pop();
            }
            if (this.moduleChangeHistory.length > 0) {
                this.activateModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
            }
            else {
                //if (this.activeModule && this.activeModule !== this.defaultModule) {
                if (this.currentModule) {
                    this.currentModule.hide();
                }
            }
        };
        PageContainer.prototype.hideAllModules = function () {
            this.mountedModules.forEach(function (moduleInstances) {
                moduleInstances.forEach(function (module) {
                    module.hide();
                });
            });
        };
        PageContainer.prototype.getActiveModuleInstance = function (moduleName) {
            var lastInstance = null;
            this.moduleChangeHistory.forEach(function (module) {
                if (module.getName() === moduleName) {
                    lastInstance = module;
                }
            });
            return lastInstance;
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
        function FlatContainer(id, bindDomElement, owner, cssTransitionOptions) {
            var _this = _super.call(this, id, bindDomElement, owner, cssTransitionOptions) || this;
            _this.mountedModules = new Map();
            _this.moduleOrders = new Map();
            _this.specifiedOrderModules = new Map();
            _this.notSpecifiedOrderModules = new Array();
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
                            return [4 /*yield*/, module.mount(function (element, option) {
                                    _this.scrollBoxElement.appendChild(element);
                                    if (option && !isNaN(option.order)) {
                                        _this.specifiedOrderModules.set(module.getName(), option.order);
                                    }
                                    else {
                                        _this.notSpecifiedOrderModules.push(module.getName());
                                    }
                                    return _this;
                                })];
                        case 1:
                            _a.sent();
                            this.updateAllModulePositionAndSize();
                            return [2 /*return*/];
                    }
                });
            });
        };
        FlatContainer.prototype.initialize = function (parcel) {
            this.initialParcel = parcel;
            this.mountedModules.forEach(function (m) {
                m.initialize(parcel);
                m.show(true);
            });
            if (this.defaultModuleName) {
                this.switch(this.defaultModuleName, parcel);
            }
        };
        FlatContainer.prototype.activateModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                var leftIndex, transX;
                return __generator(this, function (_a) {
                    if (!this.mountedModules.has(module.getName())) {
                        throw new runtime_error_2.default("マウントされていないモジュールです。");
                    }
                    leftIndex = this.moduleOrders.get(module.getName());
                    transX = Math.round(10000 / this.mountedModules.size * leftIndex) / 100;
                    this.scrollBoxElement.style.transform = "translate(-" + String(transX) + "%)";
                    this.currentModule = module;
                    this.triggerSubContainerNavigationEvent();
                    return [2 /*return*/, true];
                });
            });
        };
        FlatContainer.prototype.switch = function (moduleName, parcel, withoutTransition) {
            return __awaiter(this, void 0, void 0, function () {
                var module;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prepareModule(moduleName)];
                        case 1:
                            module = _a.sent();
                            if (parcel) {
                                module.initialize(parcel);
                            }
                            this.activateModule(module);
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        FlatContainer.prototype.prepareModule = function (moduleName) {
            return __awaiter(this, void 0, void 0, function () {
                var availableModule, moduleLoader;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            availableModule = this.mountedModules.get(moduleName);
                            if (!!availableModule) return [3 /*break*/, 2];
                            moduleLoader = this.owner.getModuleLoader();
                            return [4 /*yield*/, moduleLoader.loadModuleRecursively(moduleName, this.owner)];
                        case 1:
                            availableModule = _a.sent();
                            if (availableModule.getOwnerContainer() !== this) {
                                throw new runtime_error_2.default("指定されたモジュールはコンテナに登録されていません。");
                            }
                            availableModule.initialize(this.initialParcel);
                            availableModule.show(true);
                            console.log(availableModule.getName() + " is lazy loaded.");
                            _a.label = 2;
                        case 2: return [2 /*return*/, availableModule];
                    }
                });
            });
        };
        FlatContainer.prototype.getActiveModuleInstance = function (moduleName) {
            return this.mountedModules.get(moduleName);
        };
        FlatContainer.prototype.calcModuleOrders = function () {
            var _this = this;
            var tempOrders = this.notSpecifiedOrderModules.slice();
            this.specifiedOrderModules.forEach(function (order, moduleName) {
                tempOrders.splice(order, 0, moduleName);
            });
            this.moduleOrders.clear();
            tempOrders.forEach(function (moduleName, index) {
                _this.moduleOrders.set(moduleName, index);
            });
        };
        FlatContainer.prototype.updateAllModulePositionAndSize = function () {
            var _this = this;
            this.calcModuleOrders();
            this.scrollBoxElement.style.width = "calc(100% * " + this.mountedModules.size + ")";
            var leftValueCommon = "calc(100% / " + this.mountedModules.size + " * ";
            var widthValue = String(Math.round(1.0 / this.mountedModules.size * 10000) / 100) + "%";
            this.mountedModules.forEach(function (m) {
                var order = _this.moduleOrders.get(m.getName());
                var leftValue = leftValueCommon + order + ")";
                m.changeModuleCssPosition(leftValue, "0px");
                m.changeModuleCssSize(widthValue, "100%");
            });
        };
        return FlatContainer;
    }(container_2.default));
    exports.default = FlatContainer;
});
define("core/container/container_factory", ["require", "exports", "core/container/page_container", "core/container/flat_container"], function (require, exports, page_container_1, flat_container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContainerFactory = /** @class */ (function () {
        function ContainerFactory() {
        }
        ContainerFactory.createContainer = function (id, type, bindDomElement, owner) {
            var newContainer = null;
            if (!type || type === "separated") {
                newContainer = new page_container_1.default(id, bindDomElement, owner, {
                    enableCssTransition: true
                });
            }
            else if ("continuous") {
                newContainer = new flat_container_1.default(id, bindDomElement, owner);
            }
            return newContainer;
        };
        ContainerFactory.ROOT_CONTAINER_ID = "$root.viewport";
        return ContainerFactory;
    }());
    exports.default = ContainerFactory;
});
define("core/overlay/overlay", ["require", "exports", "core/common/types", "core/common/css_transition_driver", "core/container/container_factory"], function (require, exports, types_1, css_transition_driver_1, container_factory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Overlay = /** @class */ (function () {
        function Overlay(name, size, moduleLoader) {
            this.lastFocusIsDetector = false;
            this.isMounted = false;
            this.active = false;
            this.inactiveModalMode = false;
            this.moduleLoader = moduleLoader;
            this.name = name;
            var cssWidth = size ? size.cssWidth : Overlay.DEFAULT_OVERLAY_SIZE_WIDTH;
            var cssHeight = size ? size.cssHeight : Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT;
            this.originalSize = new types_1.CssSize(cssWidth, cssHeight);
            this.containerId = "overlay#" + this.name + "." + this.name;
        }
        Overlay.prototype.mount = function (overlayManager) {
            this.overlayManager = overlayManager;
            this.viewPortEl = overlayManager.getViewPortElement();
            this.frameEl = document.createElement("div");
            this.frameEl.style.position = "absolute";
            this.frameEl.style.backgroundColor = "transparent";
            //正しいスタイル計算のため初回表示まではdisplay:hiddenにはしない
            this.frameEl.style.visibility = "hidden";
            this.frameEl.addEventListener("selectstart", this.onSelectStart.bind(this));
            this.frameEl.addEventListener("mousedown", this.onOuterMouseDown.bind(this));
            //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
            //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
            var _s;
            _s = this.tabFocusMoveHeadStopper = document.createElement("div");
            _s.className = "itm_tabfocus_move_stopper";
            _s.style.height = "0px";
            _s.tabIndex = 0;
            _s.addEventListener("focusin", this.onTabFocusMoveHeadStopperFocusIn.bind(this));
            _s = this.tabFocusMoveHeadDetector = document.createElement("div");
            _s.className = "itm_tabfocus_move_detector";
            _s.style.height = "0px";
            _s.tabIndex = 0;
            _s.addEventListener("focusin", this.onTabFocusMoveHeadDetectorFocusIn.bind(this));
            //コンテンツ領域生成
            _s = this.contentEl = this.outerContentEl = document.createElement("div");
            _s.style.position = "absolute";
            _s.style.overflow = "hidden";
            _s.style.width = "100%";
            _s.style.height = "100%";
            //overlayのモーダル表示によって非アクティブ化したときに表示するレイヤー
            _s = this.modalInactiveLayer = document.createElement("div");
            _s.className = "itm_modal_background_layer";
            _s.style.position = "absolute";
            _s.style.overflow = "hidden";
            _s.style.display = "none";
            _s.style.width = "100%";
            _s.style.height = "100%";
            this.modalInactiveLayerTransitionDriver = new css_transition_driver_1.default(this.modalInactiveLayer);
            this.resize(this.originalSize.cssWidth, this.originalSize.cssHeight);
            //非表示エレメントの作成（Tabキー対策）
            _s = this.tabFocusMoveTailDetector = document.createElement("div");
            _s.className = "itm_tabfocus_move_detector";
            _s.style.height = "0px";
            _s.tabIndex = 0;
            _s.addEventListener("focusin", this.onTabFocusMoveTailDetectorFocusIn.bind(this));
            _s = this.tabFocusMoveTailStopper = document.createElement("div");
            _s.className = "itm_tabfocus_move_stopper";
            _s.style.height = "0px";
            _s.tabIndex = 0;
            _s.addEventListener("focusin", this.onTabFocusMoveTailStopperFocusIn.bind(this));
            this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
            this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));
            this.frameEl.appendChild(this.tabFocusMoveHeadStopper);
            this.frameEl.appendChild(this.tabFocusMoveHeadDetector);
            this.frameEl.appendChild(this.contentEl);
            this.frameEl.appendChild(this.tabFocusMoveTailDetector);
            this.frameEl.appendChild(this.tabFocusMoveTailStopper);
            this.frameEl.appendChild(this.modalInactiveLayer);
            this.viewPortEl.appendChild(this.frameEl);
            this.outerFrameTransitionDriver = new css_transition_driver_1.default(this.frameEl);
            this.cacheCurrentOffsetSize();
            this.isMounted = true;
        };
        Overlay.prototype.loadModule = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.moduleLoader.loadModuleRecursively(this.name, this)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Overlay.prototype.getIsMounted = function () {
            return this.isMounted;
        };
        Overlay.prototype.getContainerId = function () {
            return this.containerId;
        };
        Overlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
        };
        Overlay.prototype.__dispachMouseUpEvent = function (x, y) {
        };
        Overlay.prototype.registerAsContainer = function (className, targetEl) {
            var seq = Overlay.instanceSequenceTable.get(className);
            if (seq === undefined)
                seq = 0;
            this.container = container_factory_1.default.createContainer(this.containerId, "", targetEl, null);
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
            this.overlayManager.overlayMouseDownEventHandler(this.name);
        };
        Overlay.prototype.onFocusIn = function (event) {
            this.lastFocusIsDetector = false;
            this.overlayManager.overlayLastFocusedElement = null;
        };
        Overlay.prototype.onFocusOut = function (event) {
            this.lastFocusIsDetector = false;
            this.lastFocusedEl = event.target;
            this.overlayManager.overlayLastFocusedElement = event.target;
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
        Overlay.prototype.getFrameElement = function () {
            return this.frameEl;
        };
        Overlay.DEFAULT_OVERLAY_SIZE_WIDTH = "50%";
        Overlay.DEFAULT_OVERLAY_SIZE_HEIGHT = "50%";
        Overlay.instanceSequenceTable = new Map();
        return Overlay;
    }());
    exports.default = Overlay;
});
define("core/overlay/overlay_manager", ["require", "exports", "core/common/dto", "core/common/css_transition_driver", "core/common/runtime_error"], function (require, exports, dto_2, css_transition_driver_2, runtime_error_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OverlayManager = /** @class */ (function () {
        function OverlayManager(viewPortElement) {
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
            this.statusTable = new Map();
            this.configTable = new Map();
            var _s = this.modalBackgroundLayer = document.createElement("div");
            _s.className = "itm_modal_background_layer";
            _s.style.position = "absolute";
            _s.style.overflow = "hidden";
            _s.style.width = "100%";
            _s.style.height = "100%";
            _s.style.display = "none";
            _s.style.zIndex = String(this.MODAL_START_Z_INDEX);
            this.modalBackgroundLayerTransitionDriver = new css_transition_driver_2.default(this.modalBackgroundLayer);
            this.onFocusInBindedThis = this.onFocusIn.bind(this);
            this.onMouseDownBindedThis = this.onMouseDown.bind(this);
            this.onMouseMoveBindedThis = this.onMouseMove.bind(this);
            this.onMouseUpBindedThis = this.onMouseUp.bind(this);
            this.onSelectStartBindedThis = this.onSelectStart.bind(this);
            this.windowResizeEventHandlerBindThis = this.windowResizeEventHandler.bind(this);
            this.setViewPortElement(viewPortElement);
        }
        OverlayManager.prototype.findOverlayByContainer = function (searchContainer) {
            //TODO: IE11ではforEachしかつかえない。他ブラウザ用に見つかったらbreakするようなコードに変更したい。
            var res = null;
            this.overlays.forEach(function (overlay) {
                if (overlay.getChildContainer() === searchContainer) {
                    res = overlay;
                }
            });
            return res;
        };
        OverlayManager.prototype.onMouseDown = function (event) {
            var _this = this;
            if (!this.requestedAutoCloseCancelOnlyOnce) {
                this.statusTable.forEach(function (omd, key) {
                    if (omd.isVisible && omd.isAutoCloseableWhenOutfocus) {
                        var overlay_1 = _this.overlays.get(key);
                        var module = overlay_1.getChildContainer().getCurrentModule();
                        module.exit(dto_2.ActionType.CANCEL).then(function (exited) {
                            if (exited)
                                overlay_1.close();
                        });
                    }
                });
            }
            this.requestedAutoCloseCancelOnlyOnce = false;
        };
        OverlayManager.prototype.onMouseMove = function (event) {
            var deltaX = event.screenX - this.previousMouseX;
            var deltaY = event.screenY - this.previousMouseY;
            this.previousMouseX = event.screenX;
            this.previousMouseY = event.screenY;
            this.overlays.forEach(function (overlay) {
                overlay.__dispachMouseMoveEvent(event.screenX, event.screenY, deltaX, deltaY);
            });
        };
        OverlayManager.prototype.onMouseUp = function (event) {
            this.overlays.forEach(function (overlay) {
                overlay.__dispachMouseUpEvent(event.screenX, event.screenY);
            });
            this.changeContentsSelectable(true);
        };
        OverlayManager.prototype.windowResizeEventHandler = function (event) {
        };
        OverlayManager.prototype.onSelectStart = function (event) {
            if (!this.contentsSelectable) {
                event.preventDefault();
            }
        };
        OverlayManager.prototype.onFocusIn = function (event) {
            this.overlayLastFocusedElement = null;
        };
        OverlayManager.prototype.getViewPortElement = function () {
            return this.viewPortEl;
        };
        OverlayManager.prototype.setViewPortElement = function (element) {
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
        OverlayManager.prototype.register = function (overlay, overlayConfig) {
            this.overlays.set(overlay.getName(), overlay);
            this.statusTable.set(overlay.getName(), new OverlayStatus());
            this.configTable.set(overlay.getName(), overlayConfig);
        };
        OverlayManager.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var names, _a, _b, _i, i, overlayName, overlay;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            names = new Array();
                            this.overlays.forEach(function (value, key) {
                                names.push(key);
                            });
                            _a = [];
                            for (_b in names)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            i = _a[_i];
                            overlayName = names[i];
                            if (!!this.configTable.get(overlayName).lazyLoading) return [3 /*break*/, 3];
                            overlay = this.overlays.get(overlayName);
                            overlay.mount(this);
                            return [4 /*yield*/, overlay.loadModule()];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        OverlayManager.prototype.changeContentsSelectable = function (selectable) {
            this.contentsSelectable = selectable;
        };
        OverlayManager.prototype.beginModalMode = function () {
            this.modalBackgroundLayerTransitionDriver.show();
        };
        OverlayManager.prototype.endModalMode = function () {
            var existModalOverlay = false;
            this.statusTable.forEach(function (value, key) {
                if (value.isVisible && value.isModal)
                    existModalOverlay = true;
            });
            if (!existModalOverlay) {
                this.modalBackgroundLayerTransitionDriver.hide();
            }
        };
        OverlayManager.prototype.show = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var overlay, omd, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkAndLoadLazyModule(overlayName)];
                        case 1:
                            _a.sent();
                            overlay = this.overlays.get(overlayName);
                            omd = this.statusTable.get(overlayName);
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
        OverlayManager.prototype.showAsModal = function (overlayName, parcel, options) {
            return __awaiter(this, void 0, void 0, function () {
                var omd, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkAndLoadLazyModule(overlayName)];
                        case 1:
                            _a.sent();
                            omd = this.statusTable.get(overlayName);
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
        OverlayManager.prototype.checkAndLoadLazyModule = function (overlayName) {
            return __awaiter(this, void 0, void 0, function () {
                var overlay;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.overlays.has(overlayName)) return [3 /*break*/, 3];
                            overlay = this.overlays.get(overlayName);
                            if (!!overlay.getIsMounted()) return [3 /*break*/, 2];
                            overlay.mount(this);
                            return [4 /*yield*/, overlay.loadModule()];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [3 /*break*/, 4];
                        case 3: throw new runtime_error_3.default("指定されたモジュールは登録されていません。");
                        case 4: return [2 /*return*/, true];
                    }
                });
            });
        };
        OverlayManager.prototype.overlayMouseDownEventHandler = function (overlayName) {
            //TODO 要モーダル状態チェック
            this.activateSpecificOverlay(overlayName);
        };
        OverlayManager.prototype.activateSpecificOverlay = function (overlayName) {
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
            this.statusTable.forEach(function (value, key) {
                if (value.isVisible)
                    ++visibleCount;
            });
            var visibleOverlayCounter = 0;
            var previousOmd = null;
            var previousOverlay = null;
            overlayList.forEach(function (overlay) {
                var omd = _this.statusTable.get(overlay.getName());
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
        OverlayManager.prototype.activateTopOverlay = function () {
            var _this = this;
            //zindexが一番大きいoverlayを有効化する
            var maxZIndex = -1;
            var targetOverlayName;
            this.overlays.forEach(function (overlay, name) {
                if (_this.statusTable.get(name).isVisible) {
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
        OverlayManager.prototype.cancelAutoClosingOnlyOnce = function () {
            this.requestedAutoCloseCancelOnlyOnce = true;
        };
        OverlayManager.prototype.getOverlay = function (overlayName) {
            return this.overlays.get(overlayName);
        };
        return OverlayManager;
    }());
    exports.default = OverlayManager;
    var OverlayStatus = /** @class */ (function () {
        function OverlayStatus() {
            this.isVisible = false;
            this.isModal = false;
            this.isAutoCloseableWhenOutfocus = false;
            this.parentOverlay = null;
        }
        OverlayStatus.prototype.reset = function () {
            this.isVisible = false;
            this.isModal = false;
            this.isAutoCloseableWhenOutfocus = false;
            this.parentOverlay = null;
            return this;
        };
        return OverlayStatus;
    }());
});
define("core/adapter/navigation", ["require", "exports", "core/common/runtime_error", "core/container/page_container"], function (require, exports, runtime_error_4, page_container_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Navigation = /** @class */ (function () {
        function Navigation(moduleLoader, adapter) {
            this.moduleLoader = moduleLoader;
            this.overlayManager = moduleLoader.getViewPort().getOverlayManager();
            this.adapter = adapter;
        }
        Navigation.prototype.getCurrentOverlay = function () {
            //呼び出し元モジュールのコンテナの最上位コンテナを取得
            var i = 0; //循環時の無限ループ防止用カウンタ
            var container = this.adapter.getHtmlModule().getOwnerContainer();
            while (container.getOwner()) {
                container = container.getOwner().getOwnerContainer();
                if (i++ > 100) {
                    throw new runtime_error_4.default("コンテナの親子関係に循環が発生しています。");
                }
            }
            //最上位コンテナを保持しているオーバーレイを取得
            return this.overlayManager.findOverlayByContainer(container);
        };
        Navigation.prototype.switch = function (targetIdentifier, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var targetContainerId, moduleName, tiParts, parts, targetModuleName, targetContainerName, baseModuleInstance, activeModuleInstance, target;
                return __generator(this, function (_a) {
                    tiParts = targetIdentifier.split("::");
                    if (tiParts.length > 1) {
                        targetContainerId = tiParts[0];
                        moduleName = tiParts[1];
                    }
                    else {
                        targetContainerId = this.adapter.getHtmlModule().getOwnerContainer().getId();
                        moduleName = targetIdentifier;
                    }
                    parts = targetContainerId.split(".");
                    targetModuleName = parts[0];
                    targetContainerName = parts[1];
                    baseModuleInstance = this.moduleLoader.getModule(targetModuleName);
                    activeModuleInstance = baseModuleInstance.getOwnerContainer().getActiveModuleInstance(targetModuleName);
                    target = activeModuleInstance.getChildContainer(targetContainerName);
                    return [2 /*return*/, target.switch(moduleName, parcel)];
                });
            });
        };
        Navigation.prototype.forward = function (targetIdentifier, parcel) {
            return __awaiter(this, void 0, void 0, function () {
                var targetContainerId, moduleName, tiParts, parts, targetModuleName, targetContainerName, baseModuleInstance, activeModuleInstance, target;
                return __generator(this, function (_a) {
                    tiParts = targetIdentifier.split("::");
                    if (tiParts.length > 1) {
                        targetContainerId = tiParts[0];
                        moduleName = tiParts[1];
                    }
                    else {
                        targetContainerId = this.adapter.getHtmlModule().getOwnerContainer().getId();
                        moduleName = targetIdentifier;
                    }
                    parts = targetContainerId.split(".");
                    targetModuleName = parts[0];
                    targetContainerName = parts[1];
                    baseModuleInstance = this.moduleLoader.getModule(targetModuleName);
                    activeModuleInstance = baseModuleInstance.getOwnerContainer().getActiveModuleInstance(targetModuleName);
                    target = activeModuleInstance.getChildContainer(targetContainerName);
                    if (target instanceof page_container_2.default) {
                        return [2 /*return*/, target.forward(moduleName, parcel)];
                    }
                    else {
                        throw new runtime_error_4.default("Container [" + target.getId + "] is not PageContainer.");
                    }
                    return [2 /*return*/];
                });
            });
        };
        Navigation.prototype.back = function (targetContainerId) {
            var containerId;
            if (targetContainerId) {
                containerId = targetContainerId;
            }
            else {
                containerId = this.adapter.getHtmlModule().getOwnerContainer().getId();
            }
            var parts = containerId.split(".");
            var targetModuleName = parts[0];
            var targetContainerName = parts[1];
            var baseModuleInstance = this.moduleLoader.getModule(targetModuleName);
            var activeModuleInstance = baseModuleInstance.getOwnerContainer().getActiveModuleInstance(targetModuleName);
            var target = activeModuleInstance.getChildContainer(targetContainerName);
            if (target instanceof page_container_2.default) {
                return target.back();
            }
            else {
                throw new runtime_error_4.default("Container [" + target.getId + "] is not PageContainer.");
            }
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
        return Navigation;
    }());
    exports.default = Navigation;
});
define("core/adapter/html_module_adapter", ["require", "exports", "core/common/dto", "core/adapter/navigation"], function (require, exports, dto_3, navigation_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.htmlModuleAdapters = new Map();
    var HtmlModuleAdapter = /** @class */ (function () {
        function HtmlModuleAdapter() {
            this.isModified = false;
            this.exitCallbackReturnFunctionsObject = {
                cancelExit: this.cancelExit.bind(this),
                continueExit: this.continueExit.bind(this)
            };
        }
        HtmlModuleAdapter.prototype.setHtmlComponent = function (htmlModule) {
            this.htmlModule = htmlModule;
            this.navigation = new navigation_1.default(this.htmlModule.getModuleLoader(), this);
        };
        HtmlModuleAdapter.prototype.getHtmlModule = function () {
            return this.htmlModule;
        };
        HtmlModuleAdapter.prototype.setCaption = function (caption) {
            this.htmlModule.setCaption(caption);
        };
        HtmlModuleAdapter.prototype.exit = function (actionType) {
            this.htmlModule.exit(actionType);
        };
        HtmlModuleAdapter.prototype.sendMessage = function (destination, command, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.htmlModule.getModuleLoader().dispatchMessage(destination, command, message)];
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
                this.continueExit(new dto_3.Result(actionType, true));
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
    exports.default = HtmlModuleAdapter;
    var __global = window;
    __global.__HtmlModuleAdapter = HtmlModuleAdapter;
    __global.__registerHtmlModuleAdapter = function (moduleIndex, componentClass) {
        exports.htmlModuleAdapters.set(moduleIndex, componentClass);
    };
});
define("core/module/html_module", ["require", "exports", "core/module/app_module", "core/source_repository"], function (require, exports, app_module_1, source_repository_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var HtmlModule = /** @class */ (function (_super) {
        __extends(HtmlModule, _super);
        function HtmlModule(moduleDefinition, loader) {
            var _this = _super.call(this) || this;
            _this.subContainerInfos = new Map();
            _this.htmlAdapter = null;
            _this.moduleLoader = loader;
            _this.moduleDefinition = moduleDefinition;
            _this.moduleIndex = loader.getNextModuleInstanceSequence();
            _this.name = moduleDefinition.moduleName;
            _this.sourceUri = moduleDefinition.sourceUri;
            _this.onCreate();
            return _this;
        }
        HtmlModule.prototype.subContainerNavigationEventHandler = function (subContainerId, currentInfo, histories) {
            return this.htmlAdapter.triggerOnSubContainerNavigated(subContainerId, currentInfo, histories);
        };
        HtmlModule.prototype.dispatchResizeEvent = function () {
            if (!this.wrapperElement)
                return;
            this.subContainerInfos.forEach(function (containerInfo) {
                containerInfo.container.onResize();
            });
        };
        HtmlModule.prototype.fetch = function () {
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
                            return [2 /*return*/];
                    }
                });
            });
        };
        HtmlModule.prototype.initialize = function (parcel) {
            this.subContainerInfos.forEach(function (containerInfo) {
                containerInfo.container.initialize(parcel);
            });
            this.htmlAdapter.triggerOnInitialize(parcel);
        };
        HtmlModule.prototype.show = function (withoutTransition) {
            if (this.cssTransitionDriver) {
                this.cssTransitionDriver.show(withoutTransition);
            }
            else {
                this.wrapperElement.style.display = "";
                this.wrapperElement.style.visibility = "";
            }
            this.htmlAdapter.triggerOnShow(false, null);
            this.subContainerInfos.forEach(function (containerInfo) {
                containerInfo.container.onShow();
            });
        };
        HtmlModule.prototype.hide = function (withoutTransition) {
            if (this.cssTransitionDriver) {
                this.cssTransitionDriver.hide(withoutTransition);
            }
            else {
                if (this.wrapperElement.style.visibility !== "hidden") {
                    this.wrapperElement.style.display = "none";
                }
            }
            this.htmlAdapter.triggerOnHide(null);
        };
        HtmlModule.prototype.waitForExit = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.exitForWaitResolver = resolve;
            });
        };
        HtmlModule.prototype.exit = function (actionType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.exitResolver = resolve;
                            _this.htmlAdapter.triggerOnExit(actionType);
                        })];
                });
            });
        };
        HtmlModule.prototype.continueExitProcess = function (result) {
            if (this.exitResolver) {
                this.exitResolver(true);
                this.exitResolver = null;
            }
            if (this.exitForWaitResolver) {
                this.exitForWaitResolver(result);
                this.exitForWaitResolver = null;
            }
        };
        HtmlModule.prototype.cancelExitProcess = function () {
            if (this.exitResolver) {
                this.exitResolver(false);
                this.exitResolver = null;
            }
        };
        HtmlModule.prototype.passMessage = function (command, message) {
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
        HtmlModule.prototype.returnMessageResponse = function (messageResponse) {
            if (this.passMessage) {
                this.passMessageResolver(messageResponse);
                this.passMessageResolver = null;
            }
        };
        HtmlModule.prototype.getChildContainer = function (containerName) {
            var target;
            this.subContainerInfos.forEach(function (c) {
                if (c.name === containerName)
                    target = c.container;
            });
            return target;
        };
        return HtmlModule;
    }(app_module_1.default));
    exports.default = HtmlModule;
});
define("core/module/plain_html_module", ["require", "exports", "core/module/html_module", "core/container/container_factory", "core/adapter/html_module_adapter", "core/common/css_transition_driver", "core/source_repository"], function (require, exports, html_module_1, container_factory_2, html_module_adapter_1, css_transition_driver_3, source_repository_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PlainHtmlModule = /** @class */ (function (_super) {
        __extends(PlainHtmlModule, _super);
        function PlainHtmlModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        PlainHtmlModule.prototype.onCreate = function () {
            this.prototypeTemplateBegin =
                "(function() {\n            var Com = function(moduleIndex) {\n                this.super = __HtmlModuleAdapter.prototype;\n                __HtmlModuleAdapter.call(this, moduleIndex);\n        ";
            this.prototypeTemplateEnd =
                "   }\n            Object.setPrototypeOf(Com.prototype, __HtmlModuleAdapter.prototype);\n            __registerHtmlModuleAdapter(" + this.moduleIndex + ", new Com(" + this.moduleIndex + "));\n         })();\n        ";
        };
        PlainHtmlModule.prototype.loadSubContainerInfos = function () {
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
        PlainHtmlModule.prototype.mount = function (elementAttachHandler, cssTransitionOptions) {
            return __awaiter(this, void 0, void 0, function () {
                var localPrefix, localizeRegExp, mountOption;
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
                            if (cssTransitionOptions && cssTransitionOptions.enableCssTransition) {
                                this.cssTransitionDriver = new css_transition_driver_3.default(this.wrapperElement);
                                this.cssTransitionDriver.setCustomTransitionClasses(cssTransitionOptions.cssTransitionDriverClasses);
                            }
                            mountOption = {
                                order: this.moduleDefinition.orderOnFlatContainer
                            };
                            this.currentContainer = elementAttachHandler(this.wrapperElement, mountOption);
                            return [4 /*yield*/, this.evalScripts()];
                        case 3:
                            _a.sent();
                            //サブコンテナの生成・登録
                            this.subContainerInfos.forEach(function (containerInfo, domId) {
                                var localElementId = domId.replace(localizeRegExp, localPrefix);
                                var containerEl = document.getElementById(localElementId);
                                var containerId = _this.name + "." + containerInfo.name;
                                containerInfo.container = container_factory_2.default.createContainer(containerId, containerInfo.type, containerEl, _this);
                            });
                            this.isMounted = true;
                            this.htmlAdapter = html_module_adapter_1.htmlModuleAdapters.get(this.moduleIndex);
                            this.htmlAdapter.setHtmlComponent(this);
                            this.htmlAdapter.triggerOnLoad("name is " + this.name);
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlainHtmlModule.prototype.evalScripts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var jsSource, nativeScript, prototypeScript, classScript, initialScriptElements, nodeList, i, scriptElement, scopeMode, sourceUri, repository, nativeScriptElement, classScriptElement, prototypeScriptElement, _i, initialScriptElements_1, element;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            jsSource = "";
                            nativeScript = "";
                            prototypeScript = "";
                            classScript = "";
                            initialScriptElements = new Array();
                            nodeList = this.wrapperElement.querySelectorAll("script");
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < nodeList.length)) return [3 /*break*/, 6];
                            scriptElement = nodeList[i];
                            scopeMode = scriptElement.dataset["scopeMode"];
                            sourceUri = scriptElement.dataset["source"];
                            if (!sourceUri) return [3 /*break*/, 3];
                            repository = source_repository_2.default.getInstance();
                            return [4 /*yield*/, repository.fetch(sourceUri)];
                        case 2:
                            jsSource = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            jsSource = scriptElement.textContent;
                            _a.label = 4;
                        case 4:
                            if (scopeMode === "native") {
                                nativeScript += jsSource;
                            }
                            else if (!scopeMode || scopeMode === "prototype") { //default
                                prototypeScript += jsSource;
                            }
                            else if (scopeMode === "class") {
                                classScript += jsSource;
                            }
                            initialScriptElements.push(scriptElement);
                            _a.label = 5;
                        case 5:
                            i++;
                            return [3 /*break*/, 1];
                        case 6:
                            nativeScriptElement = document.createElement("script");
                            nativeScriptElement.textContent = nativeScript;
                            this.wrapperElement.appendChild(nativeScriptElement);
                            //prototypeScriptとclassScriptは1つのHTMLファイルにつき1種類だけ
                            if (classScript) {
                                classScriptElement = document.createElement("script");
                                classScriptElement.textContent = classScript;
                                this.wrapperElement.appendChild(classScriptElement);
                            }
                            else {
                                prototypeScriptElement = document.createElement("script");
                                prototypeScript = this.prototypeTemplateBegin +
                                    prototypeScript +
                                    this.prototypeTemplateEnd;
                                prototypeScriptElement.textContent = prototypeScript;
                                this.wrapperElement.appendChild(prototypeScriptElement);
                            }
                            for (_i = 0, initialScriptElements_1 = initialScriptElements; _i < initialScriptElements_1.length; _i++) {
                                element = initialScriptElements_1[_i];
                                this.wrapperElement.removeChild(element);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        PlainHtmlModule.prototype.changeModuleCssPosition = function (left, top) {
            this.wrapperElement.style.left = left;
            this.wrapperElement.style.top = top;
        };
        PlainHtmlModule.prototype.changeModuleCssSize = function (width, height) {
            this.wrapperElement.style.width = width;
            this.wrapperElement.style.height = height;
        };
        return PlainHtmlModule;
    }(html_module_1.default));
    exports.default = PlainHtmlModule;
});
define("core/common/viewport", ["require", "exports", "core/container/container_factory"], function (require, exports, container_factory_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewPort = /** @class */ (function () {
        function ViewPort(element, overlayManager) {
            this.element = element;
            this.overlayManager = overlayManager;
            this.container = container_factory_3.default.createContainer(container_factory_3.default.ROOT_CONTAINER_ID, "", element, null);
        }
        ViewPort.prototype.getChildContainer = function (containerName) {
            return this.container;
        };
        ViewPort.prototype.getViewPortContainer = function () {
            return this.container;
        };
        ViewPort.prototype.getOverlayManager = function () {
            return this.overlayManager;
        };
        return ViewPort;
    }());
    exports.default = ViewPort;
});
define("core/module/module_loader", ["require", "exports", "core/module/plain_html_module", "core/common/runtime_error"], function (require, exports, plain_html_module_1, runtime_error_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleType;
    (function (ModuleType) {
        ModuleType[ModuleType["Native"] = 0] = "Native";
        ModuleType[ModuleType["Vue"] = 1] = "Vue";
        ModuleType[ModuleType["React"] = 2] = "React";
        ModuleType[ModuleType["SSRP"] = 3] = "SSRP";
    })(ModuleType = exports.ModuleType || (exports.ModuleType = {}));
    var ModuleLoader = /** @class */ (function () {
        function ModuleLoader() {
            this.instanceSequence = 0;
            this.descriptions = new Map();
            this.loadedModules = new Map();
            this.prefetchedModules = new Map();
            this.subModuleList = new Map();
        }
        ModuleLoader.prototype.setViewPort = function (viewPort) {
            this.viewPort = viewPort;
        };
        ModuleLoader.prototype.getViewPort = function () {
            return this.viewPort;
        };
        ModuleLoader.prototype.register = function (name, sourceUri, targetContainerId, isContainerDefault, options) {
            this.registerDescription(name, sourceUri, targetContainerId, isContainerDefault, options);
        };
        ModuleLoader.prototype.registerDescription = function (moduleName, sourceUri, targetContainerId, isContainerDefault, options) {
            var op = options || {};
            var ds = {
                moduleName: moduleName,
                sourceUri: sourceUri,
                targetContainerId: targetContainerId,
                moduleType: op.moduleType !== undefined ? op.moduleType : ModuleType.Native,
                isContainerDefault: isContainerDefault,
                lazyLoading: op.lazyLoading !== undefined ? op.lazyLoading : false,
                forcePrefetch: op.forcePrefetch !== undefined ? op.forcePrefetch : true,
                orderOnFlatContainer: op.orderOnFlatContainer
            };
            this.descriptions.set(moduleName, ds);
            return ds;
        };
        ModuleLoader.prototype.getModule = function (name) {
            if (!this.loadedModules.has(name))
                throw new runtime_error_5.default("指定されたモジュールが見つかりません。");
            return this.loadedModules.get(name);
        };
        ModuleLoader.prototype.getNextModuleInstanceSequence = function () {
            return this.instanceSequence++;
        };
        ModuleLoader.prototype.run = function () {
            var _this = this;
            window.addEventListener("resize", function () {
                _this.viewPort.getViewPortContainer().onResize();
            });
            this.viewPort.getViewPortContainer().initialize();
        };
        ModuleLoader.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var descriptionModuleNames, _a, _b, _i, i, description, module, targetModuleName, subModules, _c, subModules_1, subModuleName, subModuleDescription;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            descriptionModuleNames = new Array();
                            this.descriptions.forEach(function (value, key) {
                                descriptionModuleNames.push(key);
                            });
                            _a = [];
                            for (_b in descriptionModuleNames)
                                _a.push(_b);
                            _i = 0;
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            i = _a[_i];
                            description = this.descriptions.get(descriptionModuleNames[i]);
                            if (!description.forcePrefetch) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.fetchModule(description.moduleName)];
                        case 2:
                            module = _d.sent();
                            this.prefetchedModules.set(description.moduleName, module);
                            _d.label = 3;
                        case 3:
                            targetModuleName = description.targetContainerId.split(".")[0];
                            if (!this.subModuleList.has(targetModuleName)) {
                                this.subModuleList.set(targetModuleName, new Array());
                            }
                            this.subModuleList.get(targetModuleName).push(description.moduleName);
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5:
                            subModules = this.subModuleList.get("$root");
                            _c = 0, subModules_1 = subModules;
                            _d.label = 6;
                        case 6:
                            if (!(_c < subModules_1.length)) return [3 /*break*/, 10];
                            subModuleName = subModules_1[_c];
                            subModuleDescription = this.descriptions.get(subModuleName);
                            if (!!subModuleDescription.lazyLoading) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.loadModuleRecursively(subModuleName, this.viewPort)];
                        case 7:
                            _d.sent();
                            return [3 /*break*/, 9];
                        case 8:
                            console.log(subModuleName + " is lazy load mode.");
                            _d.label = 9;
                        case 9:
                            _c++;
                            return [3 /*break*/, 6];
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        ModuleLoader.prototype.fetchModule = function (moduleName) {
            return __awaiter(this, void 0, void 0, function () {
                var module, definition;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.prefetchedModules.has(moduleName)) return [3 /*break*/, 1];
                            module = this.prefetchedModules.get(moduleName);
                            this.prefetchedModules.delete(moduleName);
                            return [3 /*break*/, 3];
                        case 1:
                            definition = this.descriptions.get(moduleName);
                            if (!definition) {
                                throw new runtime_error_5.default("指定されたモジュール " + moduleName + " は定義されていません。");
                            }
                            if (definition.moduleType === ModuleType.Native || !definition.moduleType) {
                                module = new plain_html_module_1.default(definition, this);
                            }
                            else {
                                throw new runtime_error_5.default("不明な種類のコンポーネントが指定されました。");
                            }
                            return [4 /*yield*/, module.fetch()];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, module];
                    }
                });
            });
        };
        ModuleLoader.prototype.loadModuleRecursively = function (moduleName, owner) {
            return __awaiter(this, void 0, void 0, function () {
                var module, moduleDefinition, parts, targetContainerName, mountTargetContainer, subModules, _i, subModules_2, subModuleName, subModuleDescription;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.fetchModule(moduleName)];
                        case 1:
                            module = _a.sent();
                            moduleDefinition = this.descriptions.get(moduleName);
                            parts = moduleDefinition.targetContainerId.split(".");
                            targetContainerName = parts[1];
                            mountTargetContainer = owner.getChildContainer(targetContainerName);
                            if (!mountTargetContainer)
                                throw new runtime_error_5.default("ターゲットコンテナは存在しないか、ロードされていません。");
                            return [4 /*yield*/, mountTargetContainer.addModule(module)];
                        case 2:
                            _a.sent();
                            if (moduleDefinition.isContainerDefault) {
                                mountTargetContainer.setDefaultModule(moduleName);
                            }
                            if (!this.loadedModules.has(moduleName)) {
                                this.loadedModules.set(moduleName, module);
                            }
                            subModules = this.subModuleList.get(moduleName) || [];
                            _i = 0, subModules_2 = subModules;
                            _a.label = 3;
                        case 3:
                            if (!(_i < subModules_2.length)) return [3 /*break*/, 7];
                            subModuleName = subModules_2[_i];
                            subModuleDescription = this.descriptions.get(subModuleName);
                            if (!!subModuleDescription.lazyLoading) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.loadModuleRecursively(subModuleName, module)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            console.log(subModuleName + " is lazy load mode.");
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 3];
                        case 7: return [2 /*return*/, module];
                    }
                });
            });
        };
        ModuleLoader.prototype.dispatchMessage = function (destination, command, message) {
            //TODO 仮
            return this.getModule(destination).passMessage(command, message);
        };
        return ModuleLoader;
    }());
    exports.default = ModuleLoader;
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
define("core/overlay/resizable_overlay", ["require", "exports", "core/common/types", "core/overlay/overlay"], function (require, exports, types_2, overlay_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResizableOverlay = /** @class */ (function (_super) {
        __extends(ResizableOverlay, _super);
        function ResizableOverlay(name, size, moduleLoader) {
            var _this = _super.call(this, name, size, moduleLoader) || this;
            _this.resizable = true;
            _this.isResizing = false;
            _this.resizeHandleEl = new Array();
            return _this;
        }
        ResizableOverlay.prototype.mount = function (overlayManager) {
            _super.prototype.mount.call(this, overlayManager);
            var maxPctWithoutFrame = "calc(100% - " + (ResizableOverlay.resizeHandleThicknessPx * 2) + "px)";
            var _cs = this.contentEl.style;
            _cs.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _cs.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _cs.width = maxPctWithoutFrame;
            _cs.height = maxPctWithoutFrame;
            var _ls = this.modalInactiveLayer.style;
            _ls.left = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _ls.top = String(ResizableOverlay.resizeHandleThicknessPx) + "px";
            _ls.width = maxPctWithoutFrame;
            _ls.height = maxPctWithoutFrame;
            //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
            this.createResizeHandleElements();
            this.resize(this.size.cssWidth, this.size.cssHeight);
        };
        ResizableOverlay.prototype.createResizeHandleElements = function () {
            var _this = this;
            var _rh = this.resizeHandleEl;
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
                _rh.push(el);
            }
            //左上
            _rh[0].style.cursor = "nwse-resize";
            //上
            _rh[1].style.left = String(size) + "px";
            _rh[1].style.width = "calc(100% - " + String(size * 2) + "px)";
            _rh[1].style.cursor = "ns-resize";
            //右上
            _rh[2].style.right = "0px";
            _rh[2].style.cursor = "nesw-resize";
            //左中
            _rh[3].style.top = String(size) + "px";
            _rh[3].style.height = "calc(100% - " + String(size * 2) + "px)";
            _rh[3].style.cursor = "ew-resize";
            //右中
            _rh[4].style.right = "0px";
            _rh[4].style.top = String(size) + "px";
            _rh[4].style.height = "calc(100% - " + String(size * 2) + "px)";
            _rh[4].style.cursor = "ew-resize";
            //左下
            _rh[5].style.bottom = "0px";
            _rh[5].style.cursor = "nesw-resize";
            //下
            _rh[6].style.left = String(size) + "px";
            _rh[6].style.bottom = "0px";
            _rh[6].style.width = "calc(100% - " + String(size * 2) + "px)";
            _rh[6].style.cursor = "ns-resize";
            //右下
            _rh[7].style.right = "0px";
            _rh[7].style.bottom = "0px";
            _rh[7].style.cursor = "nwse-resize";
            _rh.forEach(function (element) {
                _this.frameEl.appendChild(element);
            });
        };
        ResizableOverlay.prototype.__dispachMouseMoveEvent = function (x, y, deltaX, deltaY) {
            _super.prototype.__dispachMouseMoveEvent.call(this, x, y, deltaX, deltaY);
            var frameWidth, frameHeight;
            if (this.isResizing && this.resizable) {
                var _ssw = this.resizeStartSizePx.width;
                var _ssh = this.resizeStartSizePx.height;
                var _smx = this.resizeStartMousePos.x;
                var _smy = this.resizeStartMousePos.y;
                //※リサイズした場合は単位はピクセルに強制的に変更するものとする
                switch (this.resizePositionIndex) {
                    case 0: //左上
                        this.changePosition(this.resizeStartPos.x + (x - _smx), this.resizeStartPos.y + (y - _smy));
                        frameWidth = _ssw - (x - _smx);
                        frameHeight = _ssh - (y - _smy);
                        break;
                    case 1: //上
                        this.changePosition(this.position.x, this.resizeStartPos.y + (y - _smy));
                        frameWidth = _ssw;
                        frameHeight = _ssh - (y - _smy);
                        break;
                    case 2: //右上
                        this.changePosition(this.position.x, this.resizeStartPos.y + (y - _smy));
                        frameWidth = _ssw + (x - _smx);
                        frameHeight = _ssh - (y - _smy);
                        break;
                    case 3: //左
                        this.changePosition(this.resizeStartPos.x + (x - _smx), this.position.y);
                        frameWidth = _ssw - (x - _smx);
                        frameHeight = _ssh;
                        break;
                    case 4: //右
                        this.changePosition(this.position.x, this.position.y);
                        frameWidth = _ssw + (x - _smx);
                        frameHeight = _ssh;
                        break;
                    case 5: //左下
                        this.changePosition(this.resizeStartPos.x + (x - _smx), this.position.y);
                        frameWidth = _ssw - (x - _smx);
                        frameHeight = _ssh + (y - _smy);
                        break;
                    case 6: //下
                        this.changePosition(this.position.x, this.position.y);
                        frameWidth = _ssw;
                        frameHeight = _ssh + (y - _smy);
                        break;
                    case 7: //右下
                        this.changePosition(this.position.x, this.position.y);
                        frameWidth = _ssw + (x - _smx);
                        frameHeight = _ssh + (y - _smy);
                        break;
                }
                frameWidth -= (ResizableOverlay.resizeHandleThicknessPx * 2);
                frameHeight -= (ResizableOverlay.resizeHandleThicknessPx * 2);
                this.resize(frameWidth + "px", frameHeight + "px");
            }
        };
        ResizableOverlay.prototype.__dispachMouseUpEvent = function (x, y) {
            if (!this.isMounted)
                return;
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
            this.overlayManager.changeContentsSelectable(false);
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
    }(overlay_2.default));
    exports.default = ResizableOverlay;
});
define("core/overlay/dialog_window", ["require", "exports", "core/common/dto", "core/overlay/resizable_overlay"], function (require, exports, dto_4, resizable_overlay_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogWindow = /** @class */ (function (_super) {
        __extends(DialogWindow, _super);
        function DialogWindow(name, moduleLoader, options) {
            var _this = _super.call(this, name, options ? options.size : null, moduleLoader) || this;
            _this.isDragging = false;
            _this.windowOptions = options;
            if (options && options.resizable === false) {
                _this.setResizable(false);
            }
            return _this;
        }
        DialogWindow.prototype.mount = function (overlayManager) {
            _super.prototype.mount.call(this, overlayManager);
            var _wop = this.windowOptions;
            this.wrapperEl = document.createElement("div");
            this.wrapperEl.style.position = "absolute";
            this.wrapperEl.style.display = "flex";
            this.wrapperEl.style.flexDirection = "column";
            this.wrapperEl.style.width = "100%";
            this.wrapperEl.style.height = "100%";
            this.headerEl = document.createElement("div");
            this.headerEl.className = "itm_dialog_window_header";
            this.headerEl.style.position = "relative";
            this.headerEl.style.display = "flex";
            this.headerEl.style.width = "100%";
            if (_wop && _wop.hideHeader) {
                this.headerEl.style.display = "none";
            }
            this.headerTitleEl = document.createElement("div");
            this.headerTitleEl.className = "caption";
            this.headerTitleEl.textContent = _wop && _wop.defaultCaption ? _wop.defaultCaption : "";
            this.headerCloseButtonEl = document.createElement("div");
            this.headerCloseButtonEl.className = "close_button";
            this.headerCloseButtonEl.textContent = "×";
            this.headerCloseButtonEl.addEventListener("click", this.onHeaderCloseButtonClick.bind(this));
            this.headerEl.appendChild(this.headerTitleEl);
            this.headerEl.appendChild(this.headerCloseButtonEl);
            this.headerEl.addEventListener("mousedown", this.onHeaderMouseDown.bind(this));
            this.headerEl.addEventListener("dragstart", this.onHeaderDragStart.bind(this));
            this.containerEl = document.createElement("div");
            this.containerEl.className = "itm_dialog_window_body";
            this.containerEl.style.position = "relative";
            this.containerEl.style.flexGrow = "1";
            this.containerEl.style.flexShrink = "1";
            this.containerEl.style.width = "100%";
            this.registerAsContainer("window", this.containerEl);
            this.footerEl = document.createElement("div");
            this.footerEl.className = "itm_dialog_window_footer";
            this.footerEl.style.position = "relative";
            this.footerEl.style.width = "100%";
            if (_wop && _wop.hideFooter) {
                this.footerEl.style.display = "none";
            }
            this.okButtonEl = document.createElement("input");
            this.okButtonEl.type = "button";
            this.okButtonEl.classList.add("itm_dialog_window_footer_button", "ok");
            this.okButtonEl.value = "OK";
            this.okButtonEl.addEventListener("click", this.onOkButtonClick.bind(this));
            this.cancelButtonEl = document.createElement("input");
            this.cancelButtonEl.type = "button";
            this.cancelButtonEl.classList.add("itm_dialog_window_footer_button", "cancel");
            this.cancelButtonEl.value = "キャンセル";
            this.cancelButtonEl.addEventListener("click", this.onCancelButtonClick.bind(this));
            this.applyButtonEl = document.createElement("input");
            this.applyButtonEl.type = "button";
            this.applyButtonEl.classList.add("itm_dialog_window_footer_button", "apply");
            this.applyButtonEl.value = "適用";
            this.footerEl.appendChild(this.okButtonEl);
            this.footerEl.appendChild(this.cancelButtonEl);
            this.wrapperEl.appendChild(this.headerEl);
            this.wrapperEl.appendChild(this.containerEl);
            this.wrapperEl.appendChild(this.footerEl);
            this.contentEl.className = "itm_dialog_window_container";
            this.contentEl.appendChild(this.wrapperEl);
            this.outerFrameTransitionDriver.setCustomTransitionClasses({
                standyStateClass: "itm_dialog_window_standy_state",
                enterTransitionClass: "itm_dialog_window_enter_transition",
                leaveTransitionClass: "itm_dialog_window_leave_transition",
                endStateClass: "itm_dialog_window_end_state"
            });
        };
        DialogWindow.prototype.onHeaderMouseDown = function (event) {
            this.isDragging = true;
            this.overlayManager.changeContentsSelectable(false);
        };
        DialogWindow.prototype.onHeaderDragStart = function (event) {
            event.preventDefault();
        };
        DialogWindow.prototype.onHeaderCloseButtonClick = function (event) {
            var _this = this;
            this.container.getCurrentModule().exit(dto_4.ActionType.CANCEL).then(function (exited) {
                if (exited)
                    _this.close();
            });
        };
        DialogWindow.prototype.onOkButtonClick = function (event) {
            var _this = this;
            this.container.getCurrentModule().exit(dto_4.ActionType.OK).then(function (exited) {
                if (exited)
                    _this.close(_this.container.getContainerResult());
            });
        };
        DialogWindow.prototype.onCancelButtonClick = function (event) {
            var _this = this;
            this.container.getCurrentModule().exit(dto_4.ActionType.CANCEL).then(function (exited) {
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
        DialogWindow.prototype.getChildContainer = function () {
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
define("core/overlay/context_menu", ["require", "exports", "core/overlay/overlay", "core/common/common"], function (require, exports, overlay_3, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContextMenu = /** @class */ (function (_super) {
        __extends(ContextMenu, _super);
        function ContextMenu(name, moduleLoader, options) {
            return _super.call(this, name, options ? options.size : null, moduleLoader) || this;
        }
        ContextMenu.prototype.mount = function (overlayManager) {
            _super.prototype.mount.call(this, overlayManager);
            this.containerEl = document.createElement("div");
            this.containerEl.className = "";
            this.containerEl.style.position = "relative";
            this.containerEl.style.width = "100%";
            this.containerEl.style.height = "100%";
            this.registerAsContainer("contextmenu", this.containerEl);
            this.contentEl.className = "itm_context_menu_container";
            this.contentEl.appendChild(this.containerEl);
            this.contentEl.addEventListener("mousedown", this.onContentMouseDown.bind(this));
            this.outerFrameTransitionDriver.setCustomTransitionClasses({
                standyStateClass: "itm_context_menu_standy_state",
                enterTransitionClass: "itm_context_menu_enter_transition",
                leaveTransitionClass: "itm_context_menu_leave_transition",
                endStateClass: "itm_context_menu_end_state"
            });
        };
        ContextMenu.prototype.getChildContainer = function () {
            return this.container;
        };
        ContextMenu.prototype.show = function (parcel, options) {
            var x, y;
            x = common_1.default.currentMouseClientX;
            y = common_1.default.currentMouseClientY;
            var widthPx = this.offsetSizeCache.width;
            var heightPx = this.offsetSizeCache.height;
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
            this.overlayManager.cancelAutoClosingOnlyOnce();
        };
        return ContextMenu;
    }(overlay_3.default));
    exports.default = ContextMenu;
});
define("core/overlay/drawer", ["require", "exports", "core/overlay/overlay"], function (require, exports, overlay_4) {
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
        function Drawer(name, moduleLoader, options) {
            var _this = _super.call(this, name, null, moduleLoader) || this;
            _this.dockType = options.dockType !== undefined ? options.dockType : DockType.Left;
            _this.dockSize = options.dockSize !== undefined ? options.dockSize : "33%";
            return _this;
        }
        Drawer.prototype.mount = function (overlayManager) {
            _super.prototype.mount.call(this, overlayManager);
            this.changeDockType(this.dockType);
            this.containerEl = document.createElement("div");
            this.containerEl.className = "";
            this.containerEl.style.position = "relative";
            this.containerEl.style.width = "100%";
            this.containerEl.style.height = "100%";
            this.registerAsContainer("drawer", this.containerEl);
            this.contentEl.className = "itm_drawer_container";
            this.contentEl.appendChild(this.containerEl);
            this.contentEl.addEventListener("mousedown", this.onContentMouseDown.bind(this));
        };
        Drawer.prototype.getChildContainer = function () {
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
            this.overlayManager.cancelAutoClosingOnlyOnce();
        };
        return Drawer;
    }(overlay_4.default));
    exports.default = Drawer;
});
define("intraframe", ["require", "exports", "core/module/module_loader", "core/common/common", "core/overlay/overlay_manager", "core/common/shared_css_script_loader", "core/container/container_factory", "core/overlay/dialog_window", "core/overlay/context_menu", "core/overlay/drawer", "core/source_repository", "core/common/runtime_error", "core/common/viewport"], function (require, exports, module_loader_1, common_2, overlay_manager_1, shared_css_script_loader_1, container_factory_4, dialog_window_1, context_menu_1, drawer_1, source_repository_3, runtime_error_6, viewport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var IntraFrame = /** @class */ (function () {
        function IntraFrame() {
            IntraFrame.instances.push(this);
            this.moduleLoader = new module_loader_1.default();
        }
        IntraFrame.prototype.getModuleLoader = function () {
            return this.moduleLoader;
        };
        IntraFrame.prototype.getOverlayManager = function () {
            return this.overlayManager;
        };
        IntraFrame.prototype.setAppElementId = function (viewPortId) {
            this.appElement = document.querySelector("#" + viewPortId);
            if (!this.appElement) {
                throw new runtime_error_6.default("有効なルートコンテナが設定されていません。");
            }
            this.overlayManager = new overlay_manager_1.default(this.appElement);
            this.moduleLoader.setViewPort(new viewport_1.default(this.appElement, this.overlayManager));
        };
        IntraFrame.prototype.setSourceVersion = function (version) {
            source_repository_3.default.getInstance().setSourceVersion(version);
        };
        IntraFrame.prototype.addModule = function (moduleName, sourceUri, targetContainerId, isContainerDefault, options) {
            this.moduleLoader.register(moduleName, sourceUri, targetContainerId, isContainerDefault, options);
        };
        IntraFrame.prototype.setRootModule = function (moduleName, sourceUri) {
            this.moduleLoader.register(moduleName, sourceUri, container_factory_4.default.ROOT_CONTAINER_ID, true, null);
        };
        IntraFrame.prototype.registerWindow = function (moduleName, sourceUri, windowOptions, options) {
            var overlay = new dialog_window_1.default(moduleName, this.moduleLoader, windowOptions);
            var config = {
                lazyLoading: options && options.lazyLoading ? options.lazyLoading : false,
                autoCloseWhenOutfocus: false
            };
            this.overlayManager.register(overlay, config);
            this.moduleLoader.register(moduleName, sourceUri, overlay.getContainerId(), true, options);
        };
        IntraFrame.prototype.registerContextMenu = function (moduleName, sourceUri, contextMenuOptions, options) {
            var overlay = new context_menu_1.default(moduleName, this.moduleLoader, contextMenuOptions);
            var config = {
                lazyLoading: options && options.lazyLoading ? options.lazyLoading : false,
                autoCloseWhenOutfocus: true
            };
            this.overlayManager.register(overlay, config);
            this.moduleLoader.register(moduleName, sourceUri, overlay.getContainerId(), true, options);
        };
        IntraFrame.prototype.registerDrawer = function (moduleName, sourceUri, drawerOptions, options) {
            var overlay = new drawer_1.default(moduleName, this.moduleLoader, drawerOptions);
            var config = {
                lazyLoading: options && options.lazyLoading ? options.lazyLoading : false,
                autoCloseWhenOutfocus: true
            };
            this.overlayManager.register(overlay, config);
            this.moduleLoader.register(moduleName, sourceUri, overlay.getContainerId(), true, options);
        };
        IntraFrame.instances = new Array();
        return IntraFrame;
    }());
    if (document["documentMode"]) {
        common_2.default.isMsIE = true;
    }
    window.addEventListener("mousemove", function (e) {
        common_2.default.currentMouseClientX = e.clientX;
        common_2.default.currentMouseClientY = e.clientY;
    });
    var __bootloader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var defaultApp, cssUris, scriptUris, __global, scsLoader, _a, _b, _i, i, moduleLoader, overlayManager;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.log("bootloader is called.");
                        defaultApp = new IntraFrame();
                        cssUris = new Array();
                        scriptUris = new Array();
                        __global = window;
                        if (!__global.onIntraframeReady) return [3 /*break*/, 7];
                        __global.onIntraframeReady(defaultApp, cssUris, scriptUris);
                        scsLoader = new shared_css_script_loader_1.default(cssUris, scriptUris);
                        return [4 /*yield*/, scsLoader.load()];
                    case 1:
                        _c.sent();
                        _a = [];
                        for (_b in IntraFrame.instances)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        i = _a[_i];
                        moduleLoader = IntraFrame.instances[i].getModuleLoader();
                        return [4 /*yield*/, moduleLoader.initialize()];
                    case 3:
                        _c.sent();
                        overlayManager = IntraFrame.instances[i].getOverlayManager();
                        return [4 /*yield*/, overlayManager.initialize()];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6:
                        __startApplications();
                        return [3 /*break*/, 8];
                    case 7:
                        console.log("function 'onIntraframeReady' is not defined.");
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    var __startApplications = function () {
        IntraFrame.instances.forEach(function (intraFrame) {
            intraFrame.getModuleLoader().run();
        });
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