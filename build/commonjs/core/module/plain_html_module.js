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
import HtmlModule from "./html_module";
import ContainerManager from "../container/container_manager";
import { htmlModuleAdapters } from "../adapter/html_module_adapter";
import CssTransitionDriver from "../common/css_transition_driver";
import SourceRepository from "../source_repository";
var PlainHtmlModule = /** @class */ (function (_super) {
    __extends(PlainHtmlModule, _super);
    function PlainHtmlModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PlainHtmlModule.prototype.onCreate = function () {
        this.prototypeTemplateBegin =
            "(function() {\n            var Com = function(moduleIndex) {\n                this.super = __HtmlModuleAdapter.prototype;\n                __HtmlModuleAdapter.call(this, moduleIndex);\n        ";
        this.prototypeTemplateEnd =
            "   }\n            Object.setPrototypeOf(Com.prototype, __HtmlModuleAdapter.prototype);\n            __registerHTMLComponentAdapter(" + this.moduleIndex + ", new Com(" + this.moduleIndex + "));\n         })();\n        ";
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
                        if (cssTransitionOptions && cssTransitionOptions.enableCssTransition) {
                            this.cssTransitionDriver = new CssTransitionDriver(this.wrapperElement);
                            this.cssTransitionDriver.setCustomTransitionClasses(cssTransitionOptions.cssTransitionDriverClasses);
                        }
                        this.currentContainer = elementAttachHandler(this.wrapperElement, this.name);
                        return [4 /*yield*/, this.evalScripts()];
                    case 3:
                        _a.sent();
                        containerManager = ContainerManager.getInstance();
                        this.subContainerInfos.forEach(function (containerInfo, domId) {
                            var localElementId = domId.replace(localizeRegExp, localPrefix);
                            var containerEl = document.getElementById(localElementId);
                            var containerId = _this.name + "." + containerInfo.name;
                            containerInfo.container = containerManager.createContainer(containerId, containerInfo.type, containerEl, _this);
                        });
                        this.isMounted = true;
                        this.htmlAdapter = htmlModuleAdapters.get(this.moduleIndex);
                        this.htmlAdapter.setHtmlComponent(this);
                        this.htmlAdapter.triggerOnLoad("name is " + this.name);
                        return [2 /*return*/, true];
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
                        repository = SourceRepository.getInstance();
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
}(HtmlModule));
export default PlainHtmlModule;
//# sourceMappingURL=plain_html_module.js.map