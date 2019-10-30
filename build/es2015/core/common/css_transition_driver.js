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
export default CssTransitionDriver;
