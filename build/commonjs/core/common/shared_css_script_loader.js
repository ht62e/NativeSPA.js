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
export default SharedCssScriptLoader;
//# sourceMappingURL=shared_css_script_loader.js.map