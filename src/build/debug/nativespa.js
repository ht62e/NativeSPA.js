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
define("core/runtime_error", ["require", "exports"], function (require, exports) {
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
define("core/result_dto", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResultDto = /** @class */ (function () {
        function ResultDto(actionType, dataIsChanged, result) {
            this.actionType = actionType;
            this.dataIsChanged = dataIsChanged;
            this.result = result;
        }
        return ResultDto;
    }());
    exports.default = ResultDto;
    var ActionType;
    (function (ActionType) {
        ActionType[ActionType["BACK_CANCEL"] = 0] = "BACK_CANCEL";
        ActionType[ActionType["OK"] = 1] = "OK";
    })(ActionType = exports.ActionType || (exports.ActionType = {}));
});
define("core/forward_dto", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ForwardDto = /** @class */ (function () {
        function ForwardDto(forwardMode, params) {
            this.forwardMode = forwardMode;
            this.params = params;
        }
        return ForwardDto;
    }());
    exports.default = ForwardDto;
    var ForwardMode;
    (function (ForwardMode) {
        ForwardMode[ForwardMode["READONLY"] = 0] = "READONLY";
        ForwardMode[ForwardMode["NEW"] = 1] = "NEW";
        ForwardMode[ForwardMode["NEW_EDIT"] = 2] = "NEW_EDIT";
        ForwardMode[ForwardMode["EDIT"] = 3] = "EDIT";
    })(ForwardMode = exports.ForwardMode || (exports.ForwardMode = {}));
});
define("core/container", ["require", "exports", "core/runtime_error"], function (require, exports, runtime_error_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Container = /** @class */ (function () {
        function Container(id, bindDomElement) {
            this.id = id;
            this.bindDomElement = bindDomElement;
            this.mountedModules = new Map();
            this.moduleChangeHistory = new Array();
        }
        Container.prototype.getId = function () {
            return this.id;
        };
        Container.prototype.addModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, module.mount(this)];
                        case 1:
                            _a.sent();
                            this.mountedModules.set(module.getName(), module);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Container.prototype.addModuleElement = function (element) {
            this.bindDomElement.appendChild(element);
        };
        Container.prototype.getElement = function () {
            return this.bindDomElement;
        };
        Container.prototype.changeActiveModule = function (module) {
            var _this = this;
            if (!this.mountedModules.has(module.getName()))
                throw new runtime_error_1.default("指定されたモジュールはマウントされていません。");
            this.mountedModules.forEach(function (eachModule) {
                if (eachModule === module) {
                    eachModule.show();
                    _this.activeModule = eachModule;
                }
                else {
                    eachModule.hide();
                }
            });
        };
        Container.prototype.hideModule = function () {
            this.activeModule.hide();
        };
        Container.prototype.onResize = function () {
            var containerWidth = this.bindDomElement.clientWidth;
            var containerHeight = this.bindDomElement.clientHeight;
            this.mountedModules.forEach(function (module) {
                module.onResize(containerWidth, containerHeight);
            });
        };
        Container.prototype.forward = function (module, params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            module.initialize(null);
                            this.changeActiveModule(module);
                            this.moduleChangeHistory.push(module);
                            return [4 /*yield*/, module.waitForClose()];
                        case 1:
                            result = _a.sent();
                            if (callback) {
                                //for ES5
                                callback(result);
                            }
                            else {
                                return [2 /*return*/, result];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Container.prototype.back = function () {
            var _this = this;
            this.activeModule.closeRequest().then(function (closed) {
                if (_this.moduleChangeHistory.length > 0) {
                    _this.moduleChangeHistory.pop();
                }
                if (_this.moduleChangeHistory.length > 0) {
                    _this.changeActiveModule(_this.moduleChangeHistory[_this.moduleChangeHistory.length - 1]);
                }
                else {
                    _this.hideModule();
                }
            });
        };
        Container.prototype.backWithoutConfirmation = function () {
            if (this.moduleChangeHistory.length > 0) {
                this.moduleChangeHistory.pop();
            }
            if (this.moduleChangeHistory.length > 0) {
                this.changeActiveModule(this.moduleChangeHistory[this.moduleChangeHistory.length - 1]);
            }
            else {
                this.hideModule();
            }
        };
        return Container;
    }());
    exports.default = Container;
});
define("core/module", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleType;
    (function (ModuleType) {
        ModuleType[ModuleType["SSRP"] = 0] = "SSRP";
        ModuleType[ModuleType["Native"] = 1] = "Native";
        ModuleType[ModuleType["Vue"] = 2] = "Vue";
        ModuleType[ModuleType["React"] = 3] = "React";
    })(ModuleType = exports.ModuleType || (exports.ModuleType = {}));
});
define("core/module_description", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/source_repository", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SourceRepository = /** @class */ (function () {
        function SourceRepository() {
            this.cache = new Map();
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
                                        var isLocalAccessSuccess = (httpRequest.responseURL.indexOf("file:///") > -1) && httpRequest.responseText !== null;
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
                                httpRequest.open("POST", sourceUri + "?ver=" + Date.now().toString(), true);
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
define("core/container_manager", ["require", "exports", "core/runtime_error", "core/container"], function (require, exports, runtime_error_2, container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ContainerManager = /** @class */ (function () {
        function ContainerManager() {
            this.containers = new Map();
        }
        ContainerManager.getInstance = function () {
            return ContainerManager.instance;
        };
        ContainerManager.prototype.createContainer = function (id, type, bindDomElement) {
            if (this.containers.has(id)) {
                throw new runtime_error_2.default("コンテナID重複");
            }
            var newContainer = new container_1.default(id, bindDomElement);
            this.containers.set(id, newContainer);
            return newContainer;
        };
        ContainerManager.prototype.getContainer = function (id) {
            return this.containers.get(id);
        };
        ContainerManager.instance = new ContainerManager();
        return ContainerManager;
    }());
    exports.default = ContainerManager;
});
define("core/module_router", ["require", "exports", "core/container_manager", "core/module_manager"], function (require, exports, container_manager_1, module_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleRouter = /** @class */ (function () {
        function ModuleRouter() {
        }
        ModuleRouter.getInstance = function () {
            return ModuleRouter.instance;
        };
        ModuleRouter.prototype.forward = function (targetIdentifier, params, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var s, targetContainerId, moduleName, target, module;
                return __generator(this, function (_a) {
                    s = targetIdentifier.split("::");
                    targetContainerId = s[0];
                    moduleName = s[1];
                    target = container_manager_1.default.getInstance().getContainer(targetContainerId);
                    module = module_manager_1.default.getInstance().getModule(moduleName);
                    return [2 /*return*/, target.forward(module, params, callback)];
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
define("core/html_component_adapter", ["require", "exports", "core/module_router"], function (require, exports, module_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.htmlComponentAdapters = new Map();
    var HTMLComponentAdapter = /** @class */ (function () {
        function HTMLComponentAdapter() {
            this.isModified = false;
            this.moduleRouter = module_router_1.default.getInstance();
        }
        HTMLComponentAdapter.prototype.setHtmlComponent = function (htmlComponent) {
            this.htmlComponent = htmlComponent;
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
        HTMLComponentAdapter.prototype.triggerOnCloseRequestHandler = function (force) {
            if (this.onCloseRequest) {
                this.onCloseRequest(force);
            }
            else {
                this.close(null);
            }
        };
        HTMLComponentAdapter.prototype.close = function (result) {
            this.htmlComponent.close(result);
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
define("core/abstract_html_component", ["require", "exports", "core/source_repository"], function (require, exports, source_repository_1) {
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
        HTMLComponent.prototype.onResize = function (containerWidth, containerHeight) {
            if (!this.wrapperElement)
                return;
            this.wrapperElement.style.width = containerWidth.toString() + "px";
            this.wrapperElement.style.height = containerHeight.toString() + "px";
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
        HTMLComponent.prototype.initialize = function (param) {
            this.htmlAdapter.triggerOnInitializeHandler(param);
        };
        HTMLComponent.prototype.show = function () {
            this.wrapperElement.style.display = "";
            this.wrapperElement.style.visibility = "";
            this.htmlAdapter.triggerOnShowHandler(false, null);
        };
        HTMLComponent.prototype.hide = function () {
            if (this.wrapperElement.style.visibility !== "hidden") {
                this.wrapperElement.style.display = "none";
            }
            this.htmlAdapter.triggerOnHideHandler(null);
        };
        HTMLComponent.prototype.waitForClose = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.closeForWaitResolver = resolve;
            });
        };
        HTMLComponent.prototype.closeRequest = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.closeRequestResolver = resolve;
                            _this.htmlAdapter.triggerOnCloseRequestHandler(false);
                        })];
                });
            });
        };
        HTMLComponent.prototype.close = function (result) {
            if (this.closeRequestResolver) {
                this.closeRequestResolver(true);
                this.closeRequestResolver = null;
            }
            else {
                //backナビゲーションではなく自身で閉じたとき
                this.currentContainer.backWithoutConfirmation();
            }
            if (this.closeForWaitResolver) {
                this.closeForWaitResolver(result);
                this.closeForWaitResolver = null;
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
        HTMLComponent.prototype.isClosed = function () {
            return !this.isInitialized;
        };
        return HTMLComponent;
    }());
    exports.default = HTMLComponent;
});
define("core/native_component", ["require", "exports", "core/abstract_html_component", "core/container_manager", "core/html_component_adapter"], function (require, exports, abstract_html_component_1, container_manager_2, html_component_adapter_1) {
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
            var regExp = /<div *id *= *["'](.+)["'] *.*data-container-name *= *["'](.+)["'].*>/g;
            var match;
            while (match = regExp.exec(this.source)) {
                this.subContainerInfos.set(match[1], {
                    name: match[2],
                    container: null
                });
            }
        };
        NativeComponent.prototype.mount = function (container) {
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
                            this.currentContainer = container;
                            localizeRegExp = /\\:/g;
                            this.source = this.source.replace(localizeRegExp, localPrefix);
                            //引数で与えられたコンテナDOMに対して自身をロード
                            this.wrapperElement = document.createElement("div");
                            this.wrapperElement.id = localPrefix + "module";
                            this.wrapperElement.style.position = "absolute";
                            this.wrapperElement.style.visibility = "hidden";
                            this.wrapperElement.innerHTML = this.source;
                            container.addModuleElement(this.wrapperElement);
                            //scriptタグを実行
                            this.evalScripts();
                            containerManager = container_manager_2.default.getInstance();
                            this.subContainerInfos.forEach(function (containerInfo, domId) {
                                var localElementId = domId.replace(localizeRegExp, localPrefix);
                                var containerEl = document.getElementById(localElementId);
                                var containerId = _this.name + "." + containerInfo.name;
                                containerInfo.container = containerManager.createContainer(containerId, "", containerEl);
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
            this.wrapperElement.querySelectorAll("script").forEach(function (element) {
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
            });
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
        return NativeComponent;
    }(abstract_html_component_1.default));
    exports.default = NativeComponent;
});
define("core/module_manager", ["require", "exports", "core/module", "core/native_component", "core/runtime_error", "core/container_manager"], function (require, exports, module_1, native_component_1, runtime_error_3, container_manager_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleManager = /** @class */ (function () {
        function ModuleManager() {
            this.descriptions = [];
            this.modules = new Map();
        }
        ModuleManager.getInstance = function () {
            return ModuleManager.instance;
        };
        ModuleManager.prototype.registerDescription = function (description) {
            this.descriptions.push(description);
        };
        ModuleManager.prototype.getModule = function (name) {
            if (!this.modules.has(name))
                throw new runtime_error_3.default("指定されたモジュールが見つかりません。");
            return this.modules.get(name);
        };
        ModuleManager.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                var mcLinkInfoMap, _i, _a, description, newModule, rootMclInfo, containerManager, loadModule;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            mcLinkInfoMap = new Map();
                            _i = 0, _a = this.descriptions;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            description = _a[_i];
                            newModule = null;
                            if (description.componentType === module_1.ModuleType.Native || !description.componentType) {
                                newModule = new native_component_1.default(description.name, description.sourceUri, ModuleManager.moduleIndexCounter++);
                            }
                            else {
                                throw new runtime_error_3.default("不明な種類のコンポーネント");
                            }
                            this.modules.set(description.name, newModule);
                            return [4 /*yield*/, newModule.fetch()];
                        case 2:
                            _b.sent();
                            mcLinkInfoMap.set(description.name, new ModuleContainerLinkInfo(description, newModule.getSubContainerNames()));
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            rootMclInfo = new ModuleContainerLinkInfo(null, [ModuleManager.ROOT_NAME]);
                            mcLinkInfoMap.set(ModuleManager.ROOT_NAME, rootMclInfo);
                            //モジュールとコンテナの依存関係を解決するためのツリーを生成する
                            mcLinkInfoMap.forEach(function (mclInfo, moduleName) {
                                if (mclInfo === rootMclInfo)
                                    return;
                                var targetModuleName = ModuleManager.ROOT_NAME;
                                var targetContainerName = ModuleManager.ROOT_NAME;
                                //
                                if (mclInfo.moduleDescription.targetContainerId) {
                                    var parts = mclInfo.moduleDescription.targetContainerId.split(".");
                                    if (parts.length === 2) {
                                        targetModuleName = parts[0];
                                        targetContainerName = parts[1];
                                    }
                                }
                                var targetMcLinkInfo = mcLinkInfoMap.get(targetModuleName);
                                if (targetMcLinkInfo && targetMcLinkInfo.subContainerNames.has(targetContainerName)) {
                                    targetMcLinkInfo.addSubModule(moduleName, targetContainerName);
                                }
                                else {
                                    throw new runtime_error_3.default("未定義のコンテナが指定された");
                                }
                            });
                            containerManager = container_manager_3.default.getInstance();
                            loadModule = function (mclInfo) { return __awaiter(_this, void 0, void 0, function () {
                                var targetContainer, module, _i, _a, subModuleName;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (mclInfo.isProcessed)
                                                throw new runtime_error_3.default("コンテナの循環参照発生");
                                            mclInfo.isProcessed = true;
                                            if (!(mclInfo !== rootMclInfo && !mclInfo.moduleDescription.lazyModuleLoading)) return [3 /*break*/, 3];
                                            targetContainer = containerManager.getContainer(mclInfo.moduleDescription.targetContainerId);
                                            if (!targetContainer) return [3 /*break*/, 2];
                                            module = this.modules.get(mclInfo.moduleDescription.name);
                                            return [4 /*yield*/, targetContainer.addModule(module)];
                                        case 1:
                                            _b.sent();
                                            if (mclInfo.moduleDescription.isContainerDefault) {
                                                module.show();
                                            }
                                            return [3 /*break*/, 3];
                                        case 2: throw new runtime_error_3.default("ターゲットコンテナが存在しないか、未ロード");
                                        case 3:
                                            _i = 0, _a = mclInfo.subModuleNames;
                                            _b.label = 4;
                                        case 4:
                                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                                            subModuleName = _a[_i];
                                            return [4 /*yield*/, loadModule(mcLinkInfoMap.get(subModuleName))];
                                        case 5:
                                            _b.sent();
                                            _b.label = 6;
                                        case 6:
                                            _i++;
                                            return [3 /*break*/, 4];
                                        case 7: return [2 /*return*/];
                                    }
                                });
                            }); };
                            return [4 /*yield*/, loadModule(rootMclInfo)];
                        case 5:
                            _b.sent();
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ModuleManager.instance = new ModuleManager();
        ModuleManager.ROOT_NAME = "root";
        ModuleManager.moduleIndexCounter = 0;
        return ModuleManager;
    }());
    exports.default = ModuleManager;
    var ModuleContainerLinkInfo = /** @class */ (function () {
        function ModuleContainerLinkInfo(moduleDescription, subContainerNames) {
            this.subModuleNames = new Array();
            this.isProcessed = false;
            this.moduleDescription = moduleDescription;
            this.subContainerNames = new Set(subContainerNames);
        }
        ModuleContainerLinkInfo.prototype.addSubModule = function (subModuleName, targetContainerName) {
            if (this.subContainerNames.has(targetContainerName)) {
                this.subModuleNames.push(subModuleName);
            }
            else {
                throw new runtime_error_3.default("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
            }
        };
        return ModuleContainerLinkInfo;
    }());
});
define("nativespa", ["require", "exports", "core/module", "core/module_manager", "core/container_manager"], function (require, exports, module_2, module_manager_2, container_manager_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("******** start ********");
    var moduleManager = module_manager_2.default.getInstance();
    var containerManager = container_manager_4.default.getInstance();
    //window.addEventListener("load", (event) => {
    var rootContainer = containerManager.createContainer("root", "", document.getElementById("app"));
    window.addEventListener("resize", function (event) {
        rootContainer.getElement().style.width = window.innerWidth + "px";
        rootContainer.getElement().style.height = window.innerHeight + "px";
        rootContainer.onResize();
    });
    moduleManager.registerDescription({
        name: "base",
        sourceUri: "src/module/base.html",
        componentType: module_2.ModuleType.Native,
        targetContainerId: "root",
        isContainerDefault: true
    });
    moduleManager.registerDescription({
        name: "header",
        sourceUri: "src/module/header.html",
        componentType: module_2.ModuleType.Native,
        targetContainerId: "base.header",
        isContainerDefault: true
    });
    moduleManager.registerDescription({
        name: "main",
        sourceUri: "src/module/main.html",
        componentType: module_2.ModuleType.Native,
        targetContainerId: "base.body"
    });
    moduleManager.registerDescription({
        name: "main2",
        sourceUri: "src/module/main2.html",
        componentType: module_2.ModuleType.Native,
        targetContainerId: "base.body"
    });
    moduleManager.initialize().then(function () {
        window.dispatchEvent(new Event("resize"));
    });
    console.log("******** end ********");
});
//});
define("core/dialog_result", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogResult = /** @class */ (function () {
        function DialogResult() {
        }
        return DialogResult;
    }());
    exports.default = DialogResult;
    var DialogResultAction;
    (function (DialogResultAction) {
        DialogResultAction[DialogResultAction["OK"] = 0] = "OK";
        DialogResultAction[DialogResultAction["CANCEL"] = 1] = "CANCEL";
        DialogResultAction[DialogResultAction["YES"] = 2] = "YES";
        DialogResultAction[DialogResultAction["NO"] = 3] = "NO";
    })(DialogResultAction = exports.DialogResultAction || (exports.DialogResultAction = {}));
});
define("core/transition_effect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/window", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Window = /** @class */ (function () {
        function Window() {
        }
        return Window;
    }());
    exports.default = Window;
});
define("core/window_manager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowManager = /** @class */ (function () {
        function WindowManager() {
        }
        WindowManager.prototype.showModal = function (moduleName) {
            return null;
        };
        return WindowManager;
    }());
    exports.default = WindowManager;
});
//# sourceMappingURL=nativespa.js.map