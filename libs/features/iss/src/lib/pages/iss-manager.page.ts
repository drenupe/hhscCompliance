import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form8615PrintComponent } from '../ui/Form8615Print/form8615-print.component';

@Component({
  selector: 'iss-manager-page',
  standalone: true,
  imports: [CommonModule, Form8615PrintComponent],
  template: `
    <h2>ISS Manager View</h2>
    <iss-form8615-print
      [header]="header"
      [rows]="rows">
    </iss-form8615-print>
  `,
})
export class IssManagerPage {
  header = {
    individualName: 'Consumer A',
    date: new Date().toISOString().slice(0, 10),
    staffNameTitle: 'Manager — ISS',
    setting: 'on_site' as const,
    individualsCount: 4,
    staffCount: 1,
  };
  rows = [
    { date: this.header.date, initials: 'MG', comment: 'Reviewed ISS note.' },
  ];
}
