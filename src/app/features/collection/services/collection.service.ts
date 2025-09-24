import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { UserCollectionSummary } from '../models/user-collection-summary.model';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private api = inject(ApiService);

  getUserCollection(userId: number) {
    return this.api
      .get<{ success: boolean; data: UserCollectionSummary }>(`weward/user-collection/${userId}`)
      .pipe(map(res => res.data));
  }

  getUsersCollection() {
    return this.api
      .get<{ success: boolean; data: UserCollectionSummary[] }>('weward/users-collection')
      .pipe(map(res => res.data));
  }
}
