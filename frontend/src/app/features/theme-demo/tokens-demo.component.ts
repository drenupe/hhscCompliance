import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-tokens-demo',
  standalone: true,
  imports: [CommonModule, ThemeToggleComponent],
  templateUrl:'./tokens-demo.component.html',
  styleUrls: ['./tokens-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokensDemoComponent {}