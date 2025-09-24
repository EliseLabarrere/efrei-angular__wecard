import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { ApiService } from '../../../shared/services/api.service';
import { User } from '../models/user.model';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let apiServiceMock: { get: jasmine.Spy; put: jasmine.Spy };

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

  const mockUsers: User[] = [
    mockUser,
    { ...mockUser, id: 2, firstname: 'Bob', email: 'bob@test.com' },
  ];

  beforeEach(() => {
    apiServiceMock = {
      get: jasmine.createSpy('get'),
      put: jasmine.createSpy('put'),
    };

    TestBed.configureTestingModule({
      providers: [UserService, { provide: ApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', done => {
    apiServiceMock.get.and.returnValue(of(mockUsers));

    service.getUsers().subscribe((users: User[]) => {
      expect(users).toEqual(mockUsers);
      expect(apiServiceMock.get).toHaveBeenCalledWith('user/all');
      done();
    });
  });

  it('should update a user', done => {
    const updatedUser: User = { ...mockUser, firstname: 'Updated Alice' };
    apiServiceMock.put.and.returnValue(of(updatedUser));

    service.updateUser(updatedUser).subscribe((user: User) => {
      expect(user).toEqual(updatedUser);
      expect(apiServiceMock.put).toHaveBeenCalledWith('user/', updatedUser);
      done();
    });
  });

  it('should get my infos', done => {
    apiServiceMock.get.and.returnValue(of(mockUser));

    service.getMyInfos().subscribe((user: User) => {
      expect(user).toEqual(mockUser);
      expect(apiServiceMock.get).toHaveBeenCalledWith('user/me');
      done();
    });
  });
});
