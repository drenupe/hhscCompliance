


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form8615PrintComponent } from '../ui/Form8615Print/form8615-print.component';

@Component({
  selector: 'lib-iss-daily-log-page',
  standalone: true,
  imports: [CommonModule, Form8615PrintComponent],
  template: `

  `,
})
export class IssDailyLogPage {
  header = {
    individualName: 'James Harris',
    date: new Date().toISOString().slice(0, 10),
    staffNameTitle: 'Andre McCaskill — IIS Direct Care Staff',
    startTime: '09:00',
    endTime: '15:00',
    totalMinutes: 360,
    setting: 'off_site' as const,
    individualsCount: 5,
    staffCount: 1,
  };
  rows = Array.from({ length: 5 }, () => ({
    date: this.header.date,
    initials: 'AM',
    comment: '',
  }));
}
