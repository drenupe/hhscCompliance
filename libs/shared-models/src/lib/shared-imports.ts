// libs/shared-models/src/lib/shared-imports.ts

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Moon, Sun, Home } from 'lucide-angular';

// your shared primitives: Toggle + Pipe
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
export const SHARED_IMPORTS = [
  // core Angular modules
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // global icon set (keep this subset light)
  LucideAngularModule.pick({ Moon, Sun, Home }),

  // your shared standalone bits
  ThemeToggleComponent,
  ReplaceUnderscorePipe,
] as const;
