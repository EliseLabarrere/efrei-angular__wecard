import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageUsersComponent } from './manage-users.component';
import { AdminUserService } from '../../../user/services/admin-user.service';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/models/user.model';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ManageUsersComponent', () => {
  let component: ManageUsersComponent;
  let fixture: ComponentFixture<ManageUsersComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let adminUserServiceMock: jasmine.SpyObj<AdminUserService>;

  const mockUsers: User[] = [
    {
      id: 1,
      firstname: 'Alice',
      lastname: 'Smith',
      email: 'alice@test.com',
      isAdmin: false,
      secretQuestion: 'Question 1',
      secretAnswer: 'Answer 1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      firstname: 'Bob',
      lastname: 'Jones',
      email: 'bob@test.com',
      isAdmin: true,
      secretQuestion: 'Question 2',
      secretAnswer: 'Answer 2',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getUsers']);
    adminUserServiceMock = jasmine.createSpyObj('AdminUserService', ['setAdmin', 'deleteUser']);

    await TestBed.configureTestingModule({
      imports: [ManageUsersComponent, CommonModule, FormsModule, FontAwesomeModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: AdminUserService, useValue: adminUserServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageUsersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    userServiceMock.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(component.users()).toEqual(mockUsers);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('should set error if fetching users fails', () => {
    userServiceMock.getUsers.and.returnValue(throwError(() => new Error('Network error')));
    spyOn(console, 'error');

    component.fetchUsers();

    expect(component.users()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Impossible de récupérer les utilisateurs');
    expect(console.error).toHaveBeenCalled();
  });

  it('should toggle admin status', () => {
    component.users.set([...mockUsers]);
    const user = component.users()[0];
    const updatedUser: User = { ...user, isAdmin: !user.isAdmin };

    adminUserServiceMock.setAdmin.and.returnValue(of(updatedUser));

    component.toggleAdmin(user);

    expect(component.users()[0].isAdmin).toBeTrue();
  });

  it('should rollback admin toggle on error', () => {
    component.users.set([...mockUsers]);
    const user = component.users()[0];
    const previousValue = user.isAdmin;
    adminUserServiceMock.setAdmin.and.returnValue(throwError(() => new Error('Fail')));
    spyOn(console, 'error');

    component.toggleAdmin(user);

    expect(user.isAdmin).toBe(previousValue);
    expect(console.error).toHaveBeenCalled();
  });

  it('should delete user after confirmation', () => {
    component.users.set([...mockUsers]);
    const user = component.users()[0];
    spyOn(window, 'confirm').and.returnValue(true);
    adminUserServiceMock.deleteUser.and.returnValue(of(undefined));

    component.deleteUser(user);

    expect(component.users().find(u => u.id === user.id)).toBeUndefined();
  });

  it('should not delete user if confirmation is cancelled', () => {
    component.users.set([...mockUsers]);
    const user = component.users()[0];
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteUser(user);

    expect(component.users().length).toBe(mockUsers.length);
  });

  it('should handle delete user error gracefully', () => {
    component.users.set([...mockUsers]);
    const user = component.users()[0];
    spyOn(window, 'confirm').and.returnValue(true);
    adminUserServiceMock.deleteUser.and.returnValue(throwError(() => new Error('Delete failed')));
    spyOn(console, 'error');

    component.deleteUser(user);

    expect(component.users().length).toBe(mockUsers.length);
    expect(console.error).toHaveBeenCalled();
  });
});
