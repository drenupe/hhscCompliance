import { Component, ChangeDetectionStrategy,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/theme/themeservice';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {

  public theme = inject(ThemeService); 

  cycle() { this.theme.toggle(); }
  setLight() { this.theme.set('light'); }
  setDark() { this.theme.set('dark'); }
  setHc() { this.theme.set('hc'); }
}