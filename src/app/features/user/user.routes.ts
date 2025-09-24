import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: '',
    redirectTo: 'user-profile',
    pathMatch: 'full',
  },
];
