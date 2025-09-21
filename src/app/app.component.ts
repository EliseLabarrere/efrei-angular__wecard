import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  template: `
    <app-header />
    <main class="">
      <router-outlet />
    </main>
  `,
  styles: [],
})
export class AppComponent {}
