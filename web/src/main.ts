import 'zone.js';
import './styles.scss';

import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';

console.log('MAIN.TS LOADED');

bootstrapApplication(App, appConfig).catch(console.error);