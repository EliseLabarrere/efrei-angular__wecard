import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminChapterService } from '../../../chapter/services/admin-chapter.service';
import { ChapterService } from '../../../chapter/services/chapter.service';
import { Chapter } from '../../../chapter/models/chapter.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-chapters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-chapters.component.html',
})
export class ManageChaptersComponent implements OnInit {
  private adminChapterService = inject(AdminChapterService);
  private chapterService = inject(ChapterService);

  chapters = signal<Chapter[]>([]);
  loading = signal(true);
  error = signal<string>('');

  newChapter = signal<Partial<Chapter>>({ en: '', fr: '', isVintage: false, isEphemeral: false });

  ngOnInit() {
    this.fetchChapters();
  }

  fetchChapters() {
    this.loading.set(true);
    this.chapterService.getAllChapters().subscribe({
      next: chapters => {
        this.chapters.set(chapters);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Impossible de récupérer les chapitres');
        this.loading.set(false);
      },
    });
  }

  addChapter() {
    this.adminChapterService.addChapter(this.newChapter()).subscribe({
      next: chapter => {
        this.chapters.set([...this.chapters(), chapter]);
        this.newChapter.set({ en: '', fr: '', isVintage: false, isEphemeral: false });
      },
      error: err => console.error(err),
    });
  }

  updateChapter(chapter: Chapter) {
    this.adminChapterService.updateChapter(chapter.id, chapter).subscribe({
      next: updated => {
        const updatedChapters = this.chapters().map(c => (c.id === updated.id ? updated : c));
        this.chapters.set(updatedChapters);
      },
      error: err => console.error(err),
    });
  }
}
