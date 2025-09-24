import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CollectionService } from '../../services/collection.service';
import { UserCollectionSummary } from '../../models/user-collection-summary.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-explore-collection',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './explore-collection.component.html',
})
export class ExploreCollectionComponent implements OnInit {
  private collectionService = inject(CollectionService);
  private router = inject(Router);

  collections = signal<UserCollectionSummary[]>([]);
  loading = signal(false);
  error = signal<string>('');
  search = signal('');
  faSearch = faSearch;

  ngOnInit(): void {
    this.loading.set(true);

    this.collectionService.getUsersCollection().subscribe({
      next: (res: UserCollectionSummary[]) => {
        this.collections.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les collections');
        this.loading.set(false);
      },
    });
  }

  goToCollection(userId: number) {
    this.router.navigate([`/collection/user/${userId}`]);
  }

  filteredCollections = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.collections();
    return this.collections().filter(c => c.firstname.toLowerCase().includes(term));
  });

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.search.set(value);
  }
}
