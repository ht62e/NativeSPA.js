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
define("core/module_switcher", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ModuleSwitcher = /** @class */ (function () {
        function ModuleSwitcher() {
        }
        ModuleSwitcher.prototype.switch = function (moduleName, targetContainerName, targetInstanceName) {
        };
        return ModuleSwitcher;
    }());
    exports.default = ModuleSwitcher;
});
define("core/abstract_container", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var AbstractContainer = /** @class */ (function () {
        function AbstractContainer() {
        }
        return AbstractContainer;
    }());
    exports.default = AbstractContainer;
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
define("core/container", ["require", "exports", "core/abstract_container"], function (require, exports, abstract_container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Container = /** @class */ (function (_super) {
        __extends(Container, _super);
        function Container(id, bindDomElement) {
            var _this = _super.call(this) || this;
            _this.id = id;
            _this.bindDomElement = bindDomElement;
            _this.mountedModules = new Map();
            return _this;
        }
        Container.prototype.getId = function () {
            return this.id;
        };
        Container.prototype.addModule = function (module) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, module.mount(this.bindDomElement)];
                        case 1:
                            _a.sent();
                            this.mountedModules.set(module.getName(), module);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        return Container;
    }(abstract_container_1.default));
    exports.default = Container;
});
define("core/container_manager", ["require", "exports", "core/runtime_error", "core/container"], function (require, exports, runtime_error_1, container_1) {
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
                throw new runtime_error_1.default("コンテナID重複");
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
define("core/abstract_component", ["require", "exports", "core/source_repository", "core/container_manager"], function (require, exports, source_repository_1, container_manager_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Component = /** @class */ (function () {
        function Component(name, sourceUri, moduleIndex) {
            this.name = name;
            this.sourceUri = sourceUri;
            this.moduleIndex = moduleIndex;
            this.isFetched = false;
            this.isMounted = false;
            this.subContainerInfos = new Map();
        }
        Component.prototype.fetch = function () {
            return __awaiter(this, void 0, void 0, function () {
                var repository, _a, regExp, match;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            repository = source_repository_1.default.getInstance();
                            _a = this;
                            return [4 /*yield*/, repository.fetch(this.sourceUri)];
                        case 1:
                            _a.source = _b.sent();
                            regExp = /<div *id *= *["'](.+)["'] *.*data-container-name *= *["'](.+)["'].*>/g;
                            while (match = regExp.exec(this.source)) {
                                this.subContainerInfos.set(match[1], {
                                    name: match[2],
                                    container: null
                                });
                            }
                            this.isFetched = true;
                            return [2 /*return*/, null];
                    }
                });
            });
        };
        Component.prototype.mount = function (containerElement) {
            return __awaiter(this, void 0, void 0, function () {
                var toLocalPrefix, localizeRegExp, containerManager, domId, currentContainerInfo, localElementId, containerEl, containerId;
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
                            toLocalPrefix = function (index) {
                                return "_" + _this.moduleIndex.toString() + "_";
                            };
                            localizeRegExp = /_LS_/g;
                            this.source = this.source.replace(localizeRegExp, toLocalPrefix(this.moduleIndex));
                            containerManager = container_manager_1.default.getInstance();
                            for (domId in this.subContainerInfos) {
                                currentContainerInfo = this.subContainerInfos.get(domId);
                                localElementId = domId.replace(localizeRegExp, toLocalPrefix(this.moduleIndex));
                                containerEl = document.getElementById(localElementId);
                                containerId = this.name + "." + currentContainerInfo.name;
                                currentContainerInfo.container = containerManager.createContainer(containerId, "", containerEl);
                            }
                            //引数で与えられたコンテナDOMに対して自身をロード
                            containerElement.innerHTML = this.source;
                            //TODO scriptタグをevalで実行
                            this.isMounted = true;
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        Component.prototype.initialize = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    throw new Error("Method not implemented.");
                });
            });
        };
        Component.prototype.show = function () {
            throw new Error("Method not implemented.");
        };
        Component.prototype.close = function () {
            throw new Error("Method not implemented.");
        };
        Component.prototype.getScopeId = function () {
            throw new Error("Method not implemented.");
        };
        Component.prototype.getContentHtml = function () {
            return this.contentHtml;
        };
        Component.prototype.getCurrentContainer = function () {
            return this.currentContainer;
        };
        Component.prototype.getSubContainerNames = function () {
            var ary = new Array();
            this.subContainerInfos.forEach(function (c) {
                ary.push(c.name);
            });
            return ary;
        };
        Component.prototype.getName = function () {
            return this.name;
        };
        return Component;
    }());
    exports.default = Component;
});
define("core/native_component", ["require", "exports", "core/abstract_component"], function (require, exports, abstract_component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var NativeComponent = /** @class */ (function (_super) {
        __extends(NativeComponent, _super);
        function NativeComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return NativeComponent;
    }(abstract_component_1.default));
    exports.default = NativeComponent;
});
define("core/module_manager", ["require", "exports", "core/module", "core/native_component", "core/runtime_error", "core/container_manager"], function (require, exports, module_1, native_component_1, runtime_error_2, container_manager_2) {
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
                            if (description.componentType === module_1.ModuleType.Native) {
                                newModule = new native_component_1.default(description.name, description.sourceUri, ModuleManager.moduleIndexCounter++);
                            }
                            else {
                                throw new runtime_error_2.default("不明な種類のコンポーネント");
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
                                    throw new runtime_error_2.default("未定義のコンテナが指定された");
                                }
                            });
                            containerManager = container_manager_2.default.getInstance();
                            loadModule = function (mclInfo) { return __awaiter(_this, void 0, void 0, function () {
                                var targetContainer, _i, _a, subModuleName;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (mclInfo.isProcessed)
                                                throw new runtime_error_2.default("コンテナの循環参照発生");
                                            mclInfo.isProcessed = true;
                                            if (!(mclInfo !== rootMclInfo && !mclInfo.moduleDescription.lazyModuleLoading)) return [3 /*break*/, 3];
                                            targetContainer = containerManager.getContainer(mclInfo.moduleDescription.targetContainerId);
                                            if (!targetContainer) return [3 /*break*/, 2];
                                            return [4 /*yield*/, targetContainer.addModule(this.modules.get(mclInfo.moduleDescription.name))];
                                        case 1:
                                            _b.sent();
                                            return [3 /*break*/, 3];
                                        case 2: throw new runtime_error_2.default("ターゲットコンテナが未ロード");
                                        case 3:
                                            for (_i = 0, _a = mclInfo.subModuleNames; _i < _a.length; _i++) {
                                                subModuleName = _a[_i];
                                                loadModule(mcLinkInfoMap.get(subModuleName));
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            loadModule(rootMclInfo);
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        ModuleManager.prototype.registerDescription = function (description) {
            this.descriptions.push(description);
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
                throw new runtime_error_2.default("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
            }
        };
        return ModuleContainerLinkInfo;
    }());
});
define("spartina", ["require", "exports", "core/module", "core/module_manager", "core/container_manager"], function (require, exports, module_2, module_manager_1, container_manager_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("******** start ********");
    var moduleManager = module_manager_1.default.getInstance();
    var containerManager = container_manager_3.default.getInstance();
    window.addEventListener("load", function (e) {
        containerManager.createContainer("root", "", document.getElementById("app"));
        moduleManager.registerDescription({
            name: "base",
            sourceUri: "src/module/base.html",
            componentType: module_2.ModuleType.Native,
            targetContainerId: "root"
        });
        moduleManager.initialize();
        console.log("******** end ********");
    });
});
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
//# sourceMappingURL=spartina.js.map