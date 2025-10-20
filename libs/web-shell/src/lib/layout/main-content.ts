import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'lib-main-content',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './main-content.html',
  styleUrls: ['./main-content.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContent {}
