import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { TokenService } from '../../../shared/services/token.service';
import { User, UserWithToken, AuthResponse, RegisterPayload } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private tokenService = inject(TokenService);
  private userKey = 'auth_user';

  currentUser = signal<User | null>(this.getCurrentUser());

  register(payload: RegisterPayload): Observable<User> {
    return this.api
      .post<User>('auth/register', payload)
      .pipe(tap(user => this.setCurrentUser(user)));
  }

  login(credentials: { email: string; password: string }): Observable<UserWithToken> {
    return this.api.post<AuthResponse>('auth/login', credentials).pipe(
      tap(response => {
        this.tokenService.setToken(response.user.token);
      }),
      map(response => {
        this.setCurrentUser(response.user);
        return response.user;
      })
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    localStorage.removeItem(this.userKey);
    this.currentUser.set(null);
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUser.set(user);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.userKey);
    return user ? (JSON.parse(user) as User) : null;
  }

  isLoggedIn(): boolean {
    return !!this.tokenService.getToken();
  }
}
