import { bootstrapApplication } from '@angular/platform-browser';
import { WebShellComponent, appConfig } from '@hhsc-compliance/web-shell';

bootstrapApplication(WebShellComponent, appConfig).catch(console.error);
