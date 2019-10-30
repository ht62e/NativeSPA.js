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
import PlainHtmlModule from "./plain_html_module";
import RuntimeError from "../common/runtime_error";
import ContainerManager from "../container/container_manager";
import OvarlayManager from "../overlay/overlay_manager";
export var DisplayMode;
(function (DisplayMode) {
    DisplayMode[DisplayMode["Embedding"] = 0] = "Embedding";
    DisplayMode[DisplayMode["Window"] = 1] = "Window";
    DisplayMode[DisplayMode["ContextMenu"] = 2] = "ContextMenu";
    DisplayMode[DisplayMode["Drawer"] = 3] = "Drawer";
})(DisplayMode || (DisplayMode = {}));
export var ModuleType;
(function (ModuleType) {
    ModuleType[ModuleType["Native"] = 0] = "Native";
    ModuleType[ModuleType["Vue"] = 1] = "Vue";
    ModuleType[ModuleType["React"] = 2] = "React";
    ModuleType[ModuleType["SSRP"] = 3] = "SSRP";
})(ModuleType || (ModuleType = {}));
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
            throw new RuntimeError("指定されたモジュールが見つかりません。");
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
                            newModule = new PlainHtmlModule(description.name, description.sourceUri, ModuleManager.instanceSequence++);
                        }
                        else {
                            throw new RuntimeError("不明な種類のコンポーネントが指定されました。");
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
                        return [4 /*yield*/, this.loadModuleRecursively(ModuleManager.ROOT_NAME)];
                    case 6:
                        //ツリールートから順番にモジュールのロードを実行（遅延ロードモジュールを除く
                        _b.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    ModuleManager.prototype.loadModuleRecursively = function (moduleName, forceLoading) {
        return __awaiter(this, void 0, void 0, function () {
            var dependencyInfo, containerManager, overlayManager, moduleDescription, displayMode, module, targetContainer, overlay, _i, _a, subModuleName;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        dependencyInfo = this.dependencyInfoMap.get(moduleName);
                        containerManager = ContainerManager.getInstance();
                        overlayManager = OvarlayManager.getInstance();
                        moduleDescription = dependencyInfo.moduleDescription;
                        if (dependencyInfo.isProcessed)
                            throw new RuntimeError("コンテナの循環参照を検出しました。");
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
                            targetContainer.setDefaultModule(module);
                        }
                        return [3 /*break*/, 3];
                    case 2: throw new RuntimeError("ターゲットコンテナは存在しないか、ロードされていません。");
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
                        overlay.getContainer().setDefaultModule(module);
                        _b.label = 6;
                    case 6:
                        _i = 0, _a = dependencyInfo.subModuleNames;
                        _b.label = 7;
                    case 7:
                        if (!(_i < _a.length)) return [3 /*break*/, 11];
                        subModuleName = _a[_i];
                        if (!!this.dependencyInfoMap.get(subModuleName).moduleDescription.lazyLoading) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.loadModuleRecursively(subModuleName)];
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
export default ModuleManager;
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
