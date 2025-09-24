import { TestBed } from '@angular/core/testing';
import { AdminUserService } from './admin-user.service';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../models/user.model';
import { of } from 'rxjs';

describe('AdminUserService', () => {
  let service: AdminUserService;
  let apiServiceMock: { put: jasmine.Spy; delete: jasmine.Spy };

  const mockUser: User = {
    id: 1,
    firstname: 'Alice',
    lastname: 'Smith',
    email: 'alice@test.com',
    isAdmin: false,
    secretQuestion: 'Question?',
    secretAnswer: 'Answer',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    apiServiceMock = {
      put: jasmine.createSpy('put'),
      delete: jasmine.createSpy('delete'),
    };

    TestBed.configureTestingModule({
      providers: [AdminUserService, { provide: ApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(AdminUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set admin status', done => {
    const updatedUser: User = { ...mockUser, isAdmin: true };
    apiServiceMock.put.and.returnValue(of({ success: true, data: updatedUser }));

    service.setAdmin(mockUser.id, true).subscribe({
      next: (user: User) => {
        expect(user).toEqual(updatedUser);
        expect(apiServiceMock.put).toHaveBeenCalledWith(`user/admin/${mockUser.id}`, {
          isAdmin: true,
        });
        done();
      },
    });
  });

  it('should delete user', done => {
    apiServiceMock.delete.and.returnValue(of(undefined));

    service.deleteUser(mockUser.id).subscribe({
      next: (res: void) => {
        expect(res).toBeUndefined();
        expect(apiServiceMock.delete).toHaveBeenCalledWith(`user/${mockUser.id}`);
        done();
      },
    });
  });
});
