import { Routes } from '@angular/router';
import { ManageChaptersComponent } from './components/manage-chapters/manage-chapters.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'manage-chapters',
    component: ManageChaptersComponent,
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
  },
  {
    path: '',
    redirectTo: 'manage-users',
    pathMatch: 'full',
  },
];
