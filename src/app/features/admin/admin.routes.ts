import { Routes } from '@angular/router';
import { ManageChaptersComponent } from './components/manage-chapters/manage-chapters.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminGuard } from './guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'manage-chapters',
    component: ManageChaptersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'manage-users',
    component: ManageUsersComponent,
    canActivate: [AdminGuard],
  },
  {
    path: '',
    redirectTo: 'manage-users',
    pathMatch: 'full',
  },
];
