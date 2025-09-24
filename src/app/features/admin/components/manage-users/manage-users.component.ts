import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminUserService } from '../../../user/services/admin-user.service';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/models/user.model';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserLock, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent implements OnInit {
  private adminUserService = inject(AdminUserService);
  private userService = inject(UserService);

  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string>('');
  faUserLock = faUserLock;
  faTrash = faTrash;

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading.set(true);
    this.userService.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Impossible de récupérer les utilisateurs');
        this.loading.set(false);
      },
    });
  }

  toggleAdmin(user: User) {
    const previousValue = user.isAdmin;
    user.isAdmin = !user.isAdmin;

    this.adminUserService.setAdmin(user.id, user.isAdmin).subscribe({
      next: updatedUser => {
        const updated = this.users().map(u => (u.id === updatedUser.id ? updatedUser : u));
        this.users.set(updated);
      },
      error: err => {
        console.error(err);
        user.isAdmin = previousValue;
      },
    });
  }

  deleteUser(user: User) {
    if (!confirm(`Supprimer l'utilisateur ${user.firstname} ?`)) return;

    this.adminUserService.deleteUser(user.id).subscribe({
      next: () => {
        this.users.set(this.users().filter(u => u.id !== user.id));
      },
      error: err => console.error(err),
    });
  }
}
