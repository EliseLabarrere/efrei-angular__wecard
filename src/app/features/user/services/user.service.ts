import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../models/user.model';
import { Collection } from '../models/collection.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getUsers(): Observable<User[]> {
    return this.api.get<User[]>('users');
  }

  getUserById(id: number): Observable<User> {
    return this.api.get<User>(`users/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.api.put<User>('user/', user);
  }

  getUserCollection(userId: number): Observable<Collection> {
    return this.api.get<Collection>(`users/${userId}/collection`);
  }

  getMyInfos(): Observable<User> {
    return this.api.get<User>('user/me');
  }
}
