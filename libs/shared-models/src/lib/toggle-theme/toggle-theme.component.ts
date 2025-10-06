// theme-toggle.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit {
  isDark = true;

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('hhsc-theme');
    this.isDark = savedTheme !== 'light';
    this.applyTheme();
  }

  toggleTheme(): void {
    this.applyTheme();
  }

  applyTheme(): void {
    const theme = this.isDark ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('hhsc-theme', theme);
  }
}
