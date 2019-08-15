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
define("core/result", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Result = /** @class */ (function () {
        function Result(actionType, isChanged, result) {
            this.actionType = actionType;
            this.isChanged = isChanged;
            this.result = result;
        }
        return Result;
    }());
    exports.default = Result;
    var ActionType;
    (function (ActionType) {
        ActionType[ActionType["OK"] = 0] = "OK";
        ActionType[ActionType["CANCEL"] = 1] = "CANCEL";
        ActionType[ActionType["BACK"] = 2] = "BACK";
        ActionType[ActionType["YES"] = 3] = "YES";
        ActionType[ActionType["NO"] = 4] = "NO";
    })(ActionType = exports.ActionType || (exports.ActionType = {}));
});
define("core/parcel", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Parcel = /** @class */ (function () {
        function Parcel(requestMode, params) {
            this.requestMode = requestMode;
            this.params = params;
        }
        return Parcel;
    }());
    exports.default = Parcel;
    var RequestMode;
    (function (RequestMode) {
        RequestMode[RequestMode["READONLY"] = 0] = "READONLY";
        RequestMode[RequestMode["NEW"] = 1] = "NEW";
        RequestMode[RequestMode["NEW_EDIT"] = 2] = "NEW_EDIT";
        RequestMode[RequestMode["EDIT"] = 3] = "EDIT";
    })(RequestMode = exports.RequestMode || (exports.RequestMode = {}));
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
            this.bindDomElement.style.position = "relative";
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
        Container.prototype.getActiveModule = function () {
            return this.activeModule;
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
        Container.prototype.forward = function (module, parcel, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            module.initialize(null);
                            this.changeActiveModule(module);
                            this.moduleChangeHistory.push(module);
                            return [4 /*yield*/, module.waitForExit()];
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
            this.activeModule.exitRequest().then(function (exited) {
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
        ContainerManager.prototype.createRootContainer = function (domElement) {
            return this.createContainer("root", "", domElement);
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
define("core/types", ["require", "exports"], function (require, exports) {
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
define("core/overlay", ["require", "exports", "core/overlay_manager", "core/types"], function (require, exports, overlay_manager_1, types_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Overlay = /** @class */ (function () {
        function Overlay(viewPortElement, width, height) {
            this.lastFocusIsDetector = false;
            this.isResizing = false;
            this.resizeHandleEl = new Array();
            this.viewPortElement = viewPortElement;
            //リサイズ可能領域のためのフレームを作成
            this.outerFrameEl = document.createElement("div");
            this.outerFrameEl.style.position = "absolute";
            this.outerFrameEl.style.backgroundColor = "transparent";
            this.outerFrameEl.style.display = "none";
            this.outerFrameEl.addEventListener("selectstart", this.onSelectStart.bind(this));
            //キーボードタブキーナビゲーションによってダイアログの外にフォーカスが移ることを
            //防止（検知）するための非表示エレメントの作成（Shift+Tabキー対策）
            this.tabNaviFrontDetector = document.createElement("div");
            this.tabNaviFrontDetector.style.height = "0px";
            this.tabNaviFrontDetector.tabIndex = 0;
            this.tabNaviFrontDetector.addEventListener("focusin", this.onTabNaviFrontDetectorFocusIn.bind(this));
            //コンテンツメインコンテナ生成
            this.contentEl = document.createElement("div");
            this.contentEl.className = "spa_overlay_container";
            this.contentEl.style.position = "absolute";
            this.contentEl.style.left = String(Overlay.resizeHandleThicknessPx) + "px";
            this.contentEl.style.top = String(Overlay.resizeHandleThicknessPx) + "px";
            this.resize(width, height);
            //非表示エレメントの作成（Tabキー対策）
            this.tabNaviRearDetector = document.createElement("div");
            this.tabNaviRearDetector.style.height = "0px";
            this.tabNaviRearDetector.tabIndex = 0;
            this.tabNaviRearDetector.addEventListener("focusin", this.onTabNaviRearDetectorFocusIn.bind(this));
            this.contentEl.addEventListener("focusin", this.onFocusIn.bind(this));
            this.contentEl.addEventListener("focusout", this.onFocusOut.bind(this));
            //outerFrameElの周囲にリサイズイベント検知用のエレメントを生成・配置
            this.createResizeHandleElements();
            this.outerFrameEl.appendChild(this.tabNaviFrontDetector);
            this.outerFrameEl.appendChild(this.contentEl);
            this.outerFrameEl.appendChild(this.tabNaviRearDetector);
            viewPortElement.appendChild(this.outerFrameEl);
        }
        Overlay.prototype.createResizeHandleElements = function () {
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
            for (var i = 0; i < 8; i++) {
                this.outerFrameEl.appendChild(this.resizeHandleEl[i]);
            }
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
            this.resizeStartMousePos = new types_1.Point(event.x, event.y);
            this.resizeStartPos = new types_1.Point(this.position.x, this.position.y);
            this.resizeStartSize = new types_1.Size(this.size.width, this.size.height);
            overlay_manager_1.default.getInstance().changeContentsSelectable(false);
        };
        Overlay.prototype.onSelectStart = function (event) {
            //console.log(event);
            //event.stopPropagation();
            //event.preventDefault();
        };
        Overlay.prototype.onTabNaviFrontDetectorFocusIn = function (event) {
            if (!this.lastFocusIsDetector) {
                this.lastFocusIsDetector = true;
                this.tabNaviRearDetector.focus();
            }
            event.stopPropagation();
        };
        Overlay.prototype.onTabNaviRearDetectorFocusIn = function (event) {
            if (!this.lastFocusIsDetector) {
                this.lastFocusIsDetector = true;
                this.tabNaviFrontDetector.focus();
            }
            event.stopPropagation();
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
            this.contentEl.style.zIndex = String(zIndex);
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
        };
        Overlay.resizeHandleThicknessPx = 7;
        return Overlay;
    }());
    exports.default = Overlay;
});
define("core/dialog_window", ["require", "exports", "core/overlay", "core/container_manager"], function (require, exports, overlay_1, container_manager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DialogWindow = /** @class */ (function (_super) {
        __extends(DialogWindow, _super);
        function DialogWindow(viewPortElement, caption, options) {
            var _this = _super.call(this, viewPortElement, 640, 480) || this;
            _this.isDragging = false;
            var containerManager = container_manager_2.default.getInstance();
            _this.wrapperEl = document.createElement("div");
            _this.wrapperEl.style.position = "absolute";
            _this.wrapperEl.style.display = "flex";
            _this.wrapperEl.style.flexDirection = "column";
            _this.wrapperEl.style.width = "100%";
            _this.wrapperEl.style.height = "100%";
            _this.headerEl = document.createElement("div");
            _this.headerEl.className = "spa_dialog_window_header";
            _this.headerEl.style.position = "relative";
            _this.headerEl.style.width = "100%";
            _this.headerEl.textContent = caption;
            _this.headerEl.addEventListener("mousedown", _this.onHeaderMouseDown.bind(_this));
            _this.headerEl.addEventListener("dragstart", _this.onHeaderDragStart.bind(_this));
            _this.bodyEl = document.createElement("div");
            _this.bodyEl.className = "spa_dialog_window_body";
            _this.bodyEl.style.position = "relative";
            _this.bodyEl.style.flexGrow = "1";
            _this.bodyEl.style.flexShrink = "1";
            _this.bodyEl.style.width = "100%";
            _this.container = containerManager.createContainer("__window" + String(DialogWindow.instanceSequence++), "", _this.bodyEl);
            _this.footerEl = document.createElement("div");
            _this.footerEl.className = "spa_dialog_window_footer";
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
            return _this;
        }
        DialogWindow.prototype.onHeaderMouseDown = function (event) {
            this.isDragging = true;
        };
        DialogWindow.prototype.onHeaderDragStart = function (event) {
            event.preventDefault();
        };
        // private onMouseUp(event: MouseEvent) {
        //     this.isDragging = false;
        // }
        DialogWindow.prototype.onOkButtonClick = function (event) {
            this.close();
        };
        DialogWindow.prototype.onCancelButtonClick = function (event) {
            this.close();
        };
        DialogWindow.prototype.onApplyButtonClick = function (event) {
        };
        DialogWindow.prototype.waitForOverlayClose = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.closeForWaitResolver = resolve;
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
                var px, py;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (options && options.x !== undefined && options.y !== undefined) {
                                px = options.x;
                                py = options.y;
                            }
                            else {
                                //デフォルト表示位置は表示領域（ビューポート）の中央
                                px = Math.round((this.viewPortElement.offsetWidth - this.size.width) / 2);
                                py = Math.round((this.viewPortElement.offsetHeight - this.size.height) / 2);
                            }
                            this.changePosition(px, py);
                            this.outerFrameEl.style.display = "block";
                            return [4 /*yield*/, this.waitForOverlayClose()];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        DialogWindow.prototype.close = function () {
            if (this.closeForWaitResolver) {
                this.closeForWaitResolver(null);
            }
            this.outerFrameEl.style.display = "none";
        };
        DialogWindow.instanceSequence = 0;
        return DialogWindow;
    }(overlay_1.default));
    exports.default = DialogWindow;
});
define("core/overlay_manager", ["require", "exports", "core/dialog_window"], function (require, exports, dialog_window_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OvarlayManager = /** @class */ (function () {
        function OvarlayManager() {
            this.viewPortEl = null;
            this.overlayLastFocusedElement = null;
            this.previousMouseX = 0;
            this.previousMouseY = 0;
            this.contentsSelectable = true;
            this.overlays = new Map();
        }
        OvarlayManager.getInstance = function () {
            return OvarlayManager.instance;
        };
        OvarlayManager.prototype.onMouseMove = function (event) {
            var deltaX = event.x - this.previousMouseX;
            var deltaY = event.y - this.previousMouseY;
            this.previousMouseX = event.x;
            this.previousMouseY = event.y;
            this.overlays.forEach(function (overlay) {
                overlay.__dispachMouseMoveEvent(event.x, event.y, deltaX, deltaY);
            });
        };
        OvarlayManager.prototype.onMouseUp = function (event) {
            this.overlays.forEach(function (overlay) {
                overlay.__dispachMouseUpEvent(event.x, event.y);
            });
            this.changeContentsSelectable(true);
        };
        OvarlayManager.prototype.onSelectStart = function (event) {
            if (!this.contentsSelectable) {
                event.preventDefault();
            }
        };
        OvarlayManager.prototype.onFocusIn = function (event) {
            if (this.overlayLastFocusedElement) {
                //TODO 仮実装
                //this.overlayLastFocusedElement.focus();
            }
            this.overlayLastFocusedElement = null;
        };
        OvarlayManager.prototype.setViewPortElement = function (element) {
            if (this.viewPortEl !== null) {
                this.viewPortEl.removeEventListener("focusin", this.onFocusIn);
            }
            this.viewPortEl = element;
            this.viewPortEl.addEventListener("focusin", this.onFocusIn.bind(this));
            this.viewPortEl.addEventListener("mousemove", this.onMouseMove.bind(this));
            this.viewPortEl.addEventListener("mouseup", this.onMouseUp.bind(this));
            this.viewPortEl.addEventListener("selectstart", this.onSelectStart.bind(this));
        };
        OvarlayManager.prototype.createWindow = function (overlayName, caption, options) {
            var overlay = new dialog_window_1.default(this.viewPortEl, caption, options);
            overlay.changeZIndex(1000);
            this.overlays.set(overlayName, overlay);
            return overlay;
        };
        OvarlayManager.prototype.changeContentsSelectable = function (selectable) {
            this.contentsSelectable = selectable;
        };
        OvarlayManager.prototype.showPopupMenu = function (overlayName) {
            return null;
        };
        OvarlayManager.prototype.showWindow = function (overlayName, parcel, options, callback) {
            var overlay = this.overlays.get(overlayName);
            overlay.show(parcel, options).then(function (r) {
                //結果受け取りのためのcallback（Containerとは異なり、ES5互換専用ではない）
                if (callback)
                    callback(r);
            });
        };
        OvarlayManager.prototype.showWindowAsModal = function (overlayName, parcel, options, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var overlay, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            overlay = this.overlays.get(overlayName);
                            return [4 /*yield*/, overlay.show(parcel, options)];
                        case 1:
                            result = _a.sent();
                            if (callback) {
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
        OvarlayManager.instance = new OvarlayManager();
        return OvarlayManager;
    }());
    exports.default = OvarlayManager;
});
define("core/html_component_adapter", ["require", "exports", "core/module_router", "core/overlay_manager"], function (require, exports, module_router_1, overlay_manager_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.htmlComponentAdapters = new Map();
    var HTMLComponentAdapter = /** @class */ (function () {
        function HTMLComponentAdapter() {
            this.isModified = false;
            this.moduleRouter = module_router_1.default.getInstance();
            this.overlayManager = overlay_manager_2.default.getInstance();
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
        HTMLComponentAdapter.prototype.triggerOnExitRequestHandler = function (force) {
            if (this.onExitRequest) {
                this.onExitRequest(force);
            }
            else {
                this.exit(null);
            }
        };
        HTMLComponentAdapter.prototype.exit = function (result) {
            this.htmlComponent.exit(result);
        };
        HTMLComponentAdapter.prototype.showWindow = function (overlayName, parcel, options, callback) {
            var overlayManager = overlay_manager_2.default.getInstance();
            overlayManager.showWindow(overlayName, parcel, options, callback);
        };
        HTMLComponentAdapter.prototype.showWindowAsModal = function (overlayName, parcel, options, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var overlayManager;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            overlayManager = overlay_manager_2.default.getInstance();
                            return [4 /*yield*/, overlayManager.showWindowAsModal(overlayName, parcel, options, callback)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
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
            //this.wrapperElement.style.width = containerWidth.toString() + "px";
            //this.wrapperElement.style.height = containerHeight.toString() + "px";
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
        HTMLComponent.prototype.waitForExit = function () {
            var _this = this;
            return new Promise(function (resolve) {
                _this.exitForWaitResolver = resolve;
            });
        };
        HTMLComponent.prototype.exitRequest = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    //通常、backナビゲーション時にcontainerオブジェクト経由でコールされる
                    return [2 /*return*/, new Promise(function (resolve) {
                            _this.exitRequestResolver = resolve;
                            _this.htmlAdapter.triggerOnExitRequestHandler(false);
                        })];
                });
            });
        };
        HTMLComponent.prototype.exit = function (result) {
            //backナビゲーション時にコールされるexitRequest内でexitRequestResolverがセットされる
            if (this.exitRequestResolver) {
                this.exitRequestResolver(true);
                this.exitRequestResolver = null;
            }
            else {
                //backナビゲーションではなく自身で閉じたとき(exitRequestResolverがnull)
                this.currentContainer.backWithoutConfirmation();
            }
            if (this.exitForWaitResolver) {
                this.exitForWaitResolver(result);
                this.exitForWaitResolver = null;
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
define("core/native_component", ["require", "exports", "core/abstract_html_component", "core/container_manager", "core/html_component_adapter"], function (require, exports, abstract_html_component_1, container_manager_3, html_component_adapter_1) {
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
                            this.wrapperElement.style.overflow = "auto";
                            this.wrapperElement.style.width = "100%";
                            this.wrapperElement.style.height = "100%";
                            this.wrapperElement.style.visibility = "hidden";
                            this.wrapperElement.innerHTML = this.source;
                            container.addModuleElement(this.wrapperElement);
                            //scriptタグを実行
                            this.evalScripts();
                            containerManager = container_manager_3.default.getInstance();
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
define("core/module_manager", ["require", "exports", "core/native_component", "core/runtime_error", "core/container_manager", "core/overlay_manager"], function (require, exports, native_component_1, runtime_error_3, container_manager_4, overlay_manager_3) {
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
                throw new runtime_error_3.default("指定されたモジュールが見つかりません。");
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
                                throw new runtime_error_3.default("不明な種類のコンポーネント");
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
                                    throw new runtime_error_3.default("未定義のコンテナが指定された");
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
                            overlayManager = overlay_manager_3.default.getInstance();
                            if (dependencyInfo.isProcessed)
                                throw new runtime_error_3.default("コンテナの循環参照発生");
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
                                module.show();
                            }
                            return [3 /*break*/, 3];
                        case 2: throw new runtime_error_3.default("ターゲットコンテナが存在しないか、未ロード");
                        case 3: return [3 /*break*/, 6];
                        case 4:
                            if (!(displayMode === DisplayMode.Window)) return [3 /*break*/, 6];
                            dWindow = overlayManager.createWindow(module.getName(), "test");
                            return [4 /*yield*/, dWindow.getContainer().addModule(module)];
                        case 5:
                            _b.sent();
                            module.show();
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
        ModuleManager.instance = new ModuleManager();
        ModuleManager.ROOT_NAME = "root";
        ModuleManager.instanceSequence = 0;
        return ModuleManager;
    }());
    exports.default = ModuleManager;
    var ModuleDependencyInfo = /** @class */ (function () {
        function ModuleDependencyInfo(moduleDescription, subContainerNames) {
            this.subModuleNames = new Array();
            this.isProcessed = false;
            this.moduleDescription = moduleDescription;
            this.subContainerNames = new Set(subContainerNames);
            this.isRoot = moduleDescription === null;
        }
        ModuleDependencyInfo.prototype.addSubModule = function (subModuleName, targetContainerName) {
            if (this.subContainerNames.has(targetContainerName)) {
                this.subModuleNames.push(subModuleName);
            }
            else {
                throw new runtime_error_3.default("モジュール [ " + this.moduleDescription.name + " ] 内に指定されたサブコンテナが存在しない。");
            }
        };
        return ModuleDependencyInfo;
    }());
});
define("nativespa", ["require", "exports", "core/module_manager", "core/container_manager", "core/overlay_manager"], function (require, exports, module_manager_2, container_manager_5, overlay_manager_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    console.log("******** start ********");
    var moduleManager = module_manager_2.default.getInstance();
    var containerManager = container_manager_5.default.getInstance();
    var overlayManager = overlay_manager_4.default.getInstance();
    var rootElement = document.getElementById("app");
    var rootContainer = containerManager.createRootContainer(rootElement);
    overlayManager.setViewPortElement(rootElement);
    window.addEventListener("resize", function (event) {
        rootElement.style.width = window.innerWidth + "px";
        rootElement.style.height = window.innerHeight + "px";
        rootContainer.onResize();
    });
    moduleManager.register("base", "src/module/base.html", "root", true);
    moduleManager.register("header", "src/module/header.html", "base.header", true);
    moduleManager.register("main", "src/module/main.html", "base.body", false);
    moduleManager.register("main2", "src/module/main2.html", "base.body", false);
    moduleManager.registerWindow("win1", "src/module/main.html", {});
    moduleManager.initialize().then(function () {
        window.dispatchEvent(new Event("resize"));
    });
    console.log("******** end ********");
});
define("core/transition_effect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=nativespa.js.map