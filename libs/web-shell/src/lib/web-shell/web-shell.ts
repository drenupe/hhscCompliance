import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'lib-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './web-shell.html',
  styleUrls: ['./web-shell.scss'],
})
export class WebShellComponent {}
