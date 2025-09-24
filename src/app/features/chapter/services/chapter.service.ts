import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { UserChapter } from '../models/user-chapter.model';
import { UserCollectionSummary } from '../../collection/models/user-collection-summary.model';

@Injectable({ providedIn: 'root' })
export class ChapterService {
  private api = inject(ApiService);

  updateUserChapterCards(idWewardChapter: number, cards: Record<string, number>) {
    return this.api
      .post<{ success: boolean; data: UserChapter }>('weward/my-chapters', {
        idWewardChapter,
        cards,
      })
      .pipe(map(res => res.data));
  }

  getUserChapters(userId: number): Observable<UserChapter[]> {
    return this.api
      .get<{ success: boolean; data: UserChapter[] }>(`weward/user-chapters/${userId}`)
      .pipe(map(res => res.data));
  }

  getUserCollection(userId: number) {
    return this.api
      .get<{ success: boolean; data: UserCollectionSummary }>(`weward/user-collection/${userId}`)
      .pipe(map(res => res.data));
  }

  getRandomUserCollections() {
    return this.api
      .get<{ success: boolean; data: UserCollectionSummary[] }>('weward/random-user-collections')
      .pipe(map(res => res.data));
  }
}
