import { Routes } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from '../../core/guards/auth.guard';

export const USER_ROUTES: Routes = [
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '',
    redirectTo: 'user-profile',
    pathMatch: 'full',
  },
];
