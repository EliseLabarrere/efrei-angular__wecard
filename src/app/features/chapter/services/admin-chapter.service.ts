import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../shared/services/api.service';
import { Chapter } from '../models/chapter.model';

@Injectable({ providedIn: 'root' })
export class AdminChapterService {
  private api = inject(ApiService);

  addChapter(chapter: Partial<Chapter>): Observable<Chapter> {
    return this.api
      .post<{ success: boolean; data: Chapter }>('weward/add-chapter', chapter)
      .pipe(map(res => res.data));
  }

  updateChapter(id: number, chapter: Partial<Chapter>): Observable<Chapter> {
    return this.api
      .post<{ success: boolean; data: Chapter }>(`weward/update-chapter/${id}`, chapter)
      .pipe(map(res => res.data));
  }
}
