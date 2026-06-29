import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label = '';

  @Input()
  variant: ButtonVariant = 'primary';

  @Input()
  disabled = false;

  @Output()
  pressed = new EventEmitter<void>();

  click(): void {
    if (!this.disabled) {
      this.pressed.emit();
    }
  }
}