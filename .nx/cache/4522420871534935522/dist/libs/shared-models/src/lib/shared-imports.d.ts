import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeToggleComponent } from './toggle-theme/toggle-theme.component';
import { ReplaceUnderscorePipe } from './pipes/replaceUnderscore.pipe';
/**
 * Shared Angular + utility imports that are safe to use
 * from any feature or library without pulling in ui-kit.
 *
 * If a feature needs ui-kit primitives (Button, Input, Card, etc.),
 * import them directly from `@hhsc-compliance/ui-kit` in that
 * feature's module/component instead of through shared-models.
 */
export declare const SHARED_IMPORTS: readonly [typeof CommonModule, typeof FormsModule, typeof ReactiveFormsModule, import("@angular/core").ModuleWithProviders<LucideAngularModule>, typeof ThemeToggleComponent, typeof ReplaceUnderscorePipe];
