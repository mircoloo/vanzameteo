import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Vanzameteo · Meteo in tempo reale',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'info',
    title: 'Info · Vanzameteo',
    loadComponent: () => import('./features/about/about').then((m) => m.About),
  },
  { path: '**', redirectTo: '' },
];
