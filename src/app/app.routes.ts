import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'user',
    loadChildren: () => import('./features/user/user.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'chapter',
    loadChildren: () => import('./features/chapter/chapter.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'collection',
    loadChildren: () => import('./features/collection/collection.routes').then(m => m.AUTH_ROUTES),
  },
];
