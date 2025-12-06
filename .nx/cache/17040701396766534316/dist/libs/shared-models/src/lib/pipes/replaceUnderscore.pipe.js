"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceUnderscorePipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let ReplaceUnderscorePipe = class ReplaceUnderscorePipe {
    transform(value) {
        return value.replace(/_/g, ' ');
    }
};
exports.ReplaceUnderscorePipe = ReplaceUnderscorePipe;
exports.ReplaceUnderscorePipe = ReplaceUnderscorePipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'replaceUnderscore'
    })
], ReplaceUnderscorePipe);
//# sourceMappingURL=replaceUnderscore.pipe.js.map