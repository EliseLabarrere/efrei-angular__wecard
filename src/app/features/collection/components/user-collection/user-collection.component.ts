import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAngleDown, faSearch } from '@fortawesome/free-solid-svg-icons';

import { ChapterService } from '../../../chapter/services/chapter.service';
import { CollectionService } from '../../../collection/services/collection.service';
import { AuthService } from '../../../auth/services/auth.service';

import { UserChapter } from '../../../chapter/models/user-chapter.model';
import { Card } from '../../../card/models/card.model';
import { cardFromRank } from '../../../card/utils/card.util';
import { CardRarityDirective } from '../../../card/directives/card-rarity.directive';
import { CardCountDirective } from '../../../card/directives/card-count.directive';
import { UserCollectionSummary } from '../../models/user-collection-summary.model';

@Component({
  selector: 'app-user-collection',
  standalone: true,
  imports: [CommonModule, FormsModule, CardRarityDirective, CardCountDirective, FontAwesomeModule],
  templateUrl: './user-collection.component.html',
})
export class UserCollectionComponent implements OnInit {
  // Injections
  // -------------------------
  private route = inject(ActivatedRoute);
  private chapterService = inject(ChapterService);
  private collectionService = inject(CollectionService);
  private authService = inject(AuthService);

  // State
  // -------------------------
  chapters = signal<UserChapter[]>([]);
  collection = signal<UserCollectionSummary | null>(null);
  loading = signal(false);
  error = signal<string>('');
  search = signal('');

  faAngleDown = faAngleDown;
  faSearch = faSearch;

  loggedInUserId: number | null = null;

  // Lifecycle
  // -------------------------
  ngOnInit(): void {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    const userId = userIdParam ? +userIdParam : null;

    if (!userId) {
      this.error.set('Utilisateur introuvable');
      return;
    }

    const currentUser = this.authService.currentUser();
    this.loggedInUserId = currentUser?.id ?? null;

    this.loadChapters(userId);
    this.loadCollection(userId);
  }

  // Loaders
  // -------------------------
  private loadChapters(userId: number) {
    this.loading.set(true);
    this.chapterService.getUserChapters(userId).subscribe({
      next: res => this.chapters.set(res),
      error: () => this.error.set('Impossible de charger la collection'),
      complete: () => this.loading.set(false),
    });
  }

  private loadCollection(userId: number) {
    this.collectionService.getUserCollection(userId).subscribe({
      next: res => this.collection.set(res),
      error: () => this.error.set('Impossible de charger le résumé de la collection'),
    });
  }

  // Computed / Filters
  // -------------------------
  filteredChapters = computed(() => {
    const term = this.search().toLowerCase().trim();
    if (!term) return this.chapters();
    return this.chapters().filter(
      chap =>
        chap.WewardChapter.fr.toLowerCase().includes(term) ||
        chap.WewardChapter.en.toLowerCase().includes(term)
    );
  });

  ownedCardsCount = computed(() =>
    this.chapters().reduce((acc, chap) => acc + this.getOwnedCardsCount(chap), 0)
  );

  ownedCompletedChapterCount = computed(
    () => this.chapters().filter(chap => this.isChapterComplete(chap)).length
  );

  // Utilities
  // -------------------------
  isOwnCollection(): boolean {
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    return (
      this.loggedInUserId !== null && userIdParam !== null && +userIdParam === this.loggedInUserId
    );
  }

  getCards(chapter: UserChapter): Card[] {
    return Array.from({ length: 9 }, (_, i) => {
      const card = cardFromRank(i + 1, chapter.idWewardChapter);
      const key = `card${i + 1}` as keyof UserChapter;
      const count = chapter[key] as number;
      return { ...card, count };
    });
  }

  getStarsArray(stars: number): number[] {
    return [1, 2, 3, 4].map(n => (n <= stars ? 1 : 0));
  }

  getOwnedCardsCount(chapter: UserChapter): number {
    return this.getCards(chapter).filter(card => card.count > 0).length;
  }

  isChapterComplete(chapter: UserChapter): boolean {
    return this.getOwnedCardsCount(chapter) === 9;
  }

  // Event Handlers
  // -------------------------
  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.search.set(value);
  }

  onCardCountInput(chapter: UserChapter, event: Event, card: Card) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10) || 0;

    const updatedChapter: UserChapter = { ...chapter, [`card${card.rank}`]: value };
    const chaptersCopy = [...this.chapters()];
    const index = chaptersCopy.findIndex(c => c.idWewardChapter === chapter.idWewardChapter);
    chaptersCopy[index] = updatedChapter;
    this.chapters.set(chaptersCopy);

    this.updateChapter(updatedChapter);
  }

  // API Updates
  // -------------------------
  private updateChapter(chapter: UserChapter) {
    const cards: Record<string, number> = {};
    for (let i = 1; i <= 9; i++) {
      const key = `card${i}` as keyof UserChapter;
      cards[key] = chapter[key] as number;
    }

    this.chapterService.updateUserChapterCards(chapter.idWewardChapter, cards).subscribe({
      next: res => {
        const chapters = [...this.chapters()];
        const index = chapters.findIndex(c => c.idWewardChapter === chapter.idWewardChapter);
        if (index !== -1) {
          chapters[index] = res;
          this.chapters.set(chapters);
          // test : chapter filter
        }
      },
      error: () => this.error.set('Impossible de mettre à jour le chapitre'),
    });
  }
}
