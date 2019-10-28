var Parcel = /** @class */ (function () {
    function Parcel(requestMode, params) {
        this.requestMode = requestMode;
        this.params = params;
    }
    return Parcel;
}());
export { Parcel };
export var RequestMode;
(function (RequestMode) {
    RequestMode[RequestMode["READONLY"] = 0] = "READONLY";
    RequestMode[RequestMode["NEW"] = 1] = "NEW";
    RequestMode[RequestMode["NEW_EDIT"] = 2] = "NEW_EDIT";
    RequestMode[RequestMode["EDIT"] = 3] = "EDIT";
})(RequestMode || (RequestMode = {}));
var Result = /** @class */ (function () {
    function Result(actionType, isChanged, result) {
        this.actionType = actionType;
        this.isChanged = isChanged;
        this.result = result;
    }
    return Result;
}());
export { Result };
export var ActionType;
(function (ActionType) {
    ActionType[ActionType["OK"] = 0] = "OK";
    ActionType[ActionType["CANCEL"] = 1] = "CANCEL";
    ActionType[ActionType["BACK"] = 2] = "BACK";
    ActionType[ActionType["FORCE_CANCEL"] = 3] = "FORCE_CANCEL";
    ActionType[ActionType["YES"] = 4] = "YES";
    ActionType[ActionType["NO"] = 5] = "NO";
})(ActionType || (ActionType = {}));
//# sourceMappingURL=dto.js.map