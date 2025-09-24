import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../../auth/services/auth.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['currentUser']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should allow activation if user is admin', () => {
    authServiceMock.currentUser.and.returnValue({
      id: 1,
      firstname: 'Admin',
      lastname: 'User',
      email: 'admin@test.com',
      isAdmin: true,
      secretQuestion: '',
      secretAnswer: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(guard.canActivate()).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation if user is not admin', () => {
    authServiceMock.currentUser.and.returnValue({
      id: 2,
      firstname: 'Regular',
      lastname: 'User',
      email: 'user@test.com',
      isAdmin: false,
      secretQuestion: '',
      secretAnswer: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(guard.canActivate()).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should prevent activation if no user is logged in', () => {
    authServiceMock.currentUser.and.returnValue(null);

    expect(guard.canActivate()).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });
});
