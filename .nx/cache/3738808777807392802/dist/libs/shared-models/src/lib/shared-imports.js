"use strict";
// libs/shared-models/src/lib/shared-imports.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHARED_IMPORTS = void 0;
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const lucide_angular_1 = require("lucide-angular");
// your shared primitives: Toggle + Pipe
const toggle_theme_component_1 = require("./toggle-theme/toggle-theme.component");
const replaceUnderscore_pipe_1 = require("./pipes/replaceUnderscore.pipe");
/**
 * Shared Angular + utility imports that are safe to use
 * from any feature or library without pulling in ui-kit.
 *
 * If a feature needs ui-kit primitives (Button, Input, Card, etc.),
 * import them directly from `@hhsc-compliance/ui-kit` in that
 * feature's module/component instead of through shared-models.
 */
exports.SHARED_IMPORTS = [
    // core Angular modules
    common_1.CommonModule,
    forms_1.FormsModule,
    forms_1.ReactiveFormsModule,
    // global icon set (keep this subset light)
    lucide_angular_1.LucideAngularModule.pick({ Moon: lucide_angular_1.Moon, Sun: lucide_angular_1.Sun, Home: lucide_angular_1.Home }),
    // your shared standalone bits
    toggle_theme_component_1.ThemeToggleComponent,
    replaceUnderscore_pipe_1.ReplaceUnderscorePipe,
];
//# sourceMappingURL=shared-imports.js.map