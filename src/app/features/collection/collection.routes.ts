import { Routes } from '@angular/router';
import { UserCollectionComponent } from '../collection/components/user-collection/user-collection.component';
import { ExploreCollectionComponent } from './components/explore-collection/explore-collection.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'user/:userId',
    component: UserCollectionComponent,
  },
  {
    path: 'explore',
    component: ExploreCollectionComponent,
  },
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full',
  },
];
