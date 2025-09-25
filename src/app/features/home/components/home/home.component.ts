import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faSearch, faRightLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private router = inject(Router);

  faUserPlus = faUserPlus;
  faSearch = faSearch;
  faRightLeft = faRightLeft;
}
