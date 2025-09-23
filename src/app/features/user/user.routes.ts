import { Routes } from '@angular/router';
import { UserCardComponent } from './components/user-card/user-card.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'user-card',
    component: UserCardComponent,
  },
  {
    path: 'user-list',
    component: UserListComponent,
  },
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
