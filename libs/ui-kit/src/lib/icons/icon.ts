import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

export type IconName =
  | 'layout-dashboard'
  | 'home'
  | 'users'
  | 'stethoscope'
  | 'activity'
  | 'briefcase'
  | 'graduation-cap'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  // add more as you need
  | (string & {}); // allow any string if you don’t want to strictly type

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <lucide-icon
      [name]="name"
      [size]="size"
      [class]="class"
      [attr.title]="title || null"
      [attr.role]="title ? 'img' : null"
      [attr.aria-label]="title || null"
      [attr.aria-hidden]="title ? null : true"
    ></lucide-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() name!: IconName;
  /** 16, 18, 20, 24, etc. */
  @Input() size = 18;
  /** For a11y tooltip/title; omit to mark as decorative */
  @Input() title?: string;
  /** Pass through extra classes */
  @Input() class = '';
}
