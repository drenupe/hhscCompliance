"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let CardComponent = class CardComponent {
    constructor() {
        /**
         * Controls border color and contextual styling.
         * Can be: 'ok' | 'warning' | 'critical'
         */
        this.status = 'ok';
    }
};
exports.CardComponent = CardComponent;
tslib_1.__decorate([
    (0, core_1.Input)(),
    tslib_1.__metadata("design:type", String)
], CardComponent.prototype, "status", void 0);
exports.CardComponent = CardComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-card',
        templateUrl: './card.component.html',
        styleUrls: ['./card.component.scss']
    })
], CardComponent);
//# sourceMappingURL=card.component.js.map