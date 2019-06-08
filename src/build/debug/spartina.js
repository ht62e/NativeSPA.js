define("part", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("viewport", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ViewPort = /** @class */ (function () {
        function ViewPort() {
        }
        ViewPort.prototype.load = function () {
            throw new Error("Method not implemented.");
        };
        ViewPort.prototype.initialize = function () {
            throw new Error("Method not implemented.");
        };
        ViewPort.prototype.onShow = function () {
            throw new Error("Method not implemented.");
        };
        ViewPort.prototype.close = function () {
            throw new Error("Method not implemented.");
        };
        return ViewPort;
    }());
    exports.default = ViewPort;
});
define("window", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Window = /** @class */ (function () {
        function Window() {
        }
        return Window;
    }());
    exports.default = Window;
});
define("windowmanager", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WindowManager = /** @class */ (function () {
        function WindowManager() {
        }
        return WindowManager;
    }());
    exports.default = WindowManager;
});
//# sourceMappingURL=spartina.js.map