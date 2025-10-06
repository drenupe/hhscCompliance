import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Moon, Sun, Home } from 'lucide-angular';

// ui-kit primitives (exported from libs/ui-kit/src/index.ts)
import {
  ButtonComponent,
  InputComponent,
  CardComponent,
} from '@hhsc-compliance/ui-kit';

// (optional) your shared primitives: Toggle + Pipe
import { ThemeToggleComponent } from './toggle-theme/toggle-theme.component';
import { ReplaceUnderscorePipe } from './pipes/replaceUnderscore.pipe';
export const SHARED_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // global icon set (add/remove to keep this light)
  LucideAngularModule.pick({ Moon, Sun, Home }),

  // ui-kit primitives used across most screens
  ButtonComponent,
  InputComponent,
  CardComponent,

  // your shared standalone bits
  ThemeToggleComponent,
  ReplaceUnderscorePipe,
] as const;
