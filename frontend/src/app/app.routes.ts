import { Route } from '@angular/router';
import { TokensDemoComponent } from './features/theme-demo/tokens-demo.component';

export const appRoutes: Route[] = [
    { path: 'theme-demo', component: TokensDemoComponent },
  { path: '', pathMatch: 'full', redirectTo: 'theme-demo' },
];
