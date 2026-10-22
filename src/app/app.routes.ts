import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    title: 'Home · Momentum',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'quote',
    title: 'Quotes · Momentum',
    data: { minimal: true },
    loadComponent: () => import('./features/quote/quote').then((m) => m.Quote),
  },
  {
    path: '**',
    title: 'Page not found · Momentum',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
