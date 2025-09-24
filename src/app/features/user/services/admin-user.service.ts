import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  private api = inject(ApiService);

  setAdmin(userId: number, isAdmin: boolean): Observable<User> {
    return this.api
      .put<{ success: boolean; data: User }>(`user/admin/${userId}`, { isAdmin })
      .pipe(map(res => res.data));
  }

  deleteUser(userId: number): Observable<void> {
    return this.api.delete<void>(`user/${userId}`);
  }
}
