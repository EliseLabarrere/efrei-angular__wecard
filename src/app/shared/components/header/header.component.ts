import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faFilePen,
  faUserPen,
  faUser,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  faFilePen = faFilePen;
  faUserPen = faUserPen;
  faUser = faUser;
  faRightFromBracket = faRightFromBracket;

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
