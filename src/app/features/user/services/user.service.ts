import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('user/all');
  }

  updateUser(user: User): Observable<User> {
    return this.api.put<User>('user/', user);
  }

  getMyInfos(): Observable<User> {
    return this.api.get<User>('user/me');
  }
}
