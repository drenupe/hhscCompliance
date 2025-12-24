import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';
import { AppShellComponent, appConfig } from '@hhsc-compliance/web-shell';

bootstrapApplication(AppShellComponent, appConfig).catch(console.error);
