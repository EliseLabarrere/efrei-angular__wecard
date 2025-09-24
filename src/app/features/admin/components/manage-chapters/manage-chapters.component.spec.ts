import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageChaptersComponent } from './manage-chapters.component';
import { AdminChapterService } from '../../../chapter/services/admin-chapter.service';
import { ChapterService } from '../../../chapter/services/chapter.service';
import { Chapter } from '../../../chapter/models/chapter.model';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('ManageChaptersComponent', () => {
  let component: ManageChaptersComponent;
  let fixture: ComponentFixture<ManageChaptersComponent>;
  let chapterServiceMock: jasmine.SpyObj<ChapterService>;
  let adminChapterServiceMock: jasmine.SpyObj<AdminChapterService>;

  const mockChapters: Chapter[] = [
    { id: 1, en: 'Chapter EN', fr: 'Chapitre FR', isVintage: false, isEphemeral: false },
    { id: 2, en: 'Second EN', fr: 'Second FR', isVintage: true, isEphemeral: false },
  ];

  beforeEach(async () => {
    chapterServiceMock = jasmine.createSpyObj('ChapterService', ['getAllChapters']);
    adminChapterServiceMock = jasmine.createSpyObj('AdminChapterService', [
      'addChapter',
      'updateChapter',
    ]);

    await TestBed.configureTestingModule({
      imports: [ManageChaptersComponent, CommonModule, FormsModule],
      providers: [
        { provide: ChapterService, useValue: chapterServiceMock },
        { provide: AdminChapterService, useValue: adminChapterServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageChaptersComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch chapters on init', () => {
    chapterServiceMock.getAllChapters.and.returnValue(of(mockChapters));

    component.ngOnInit();

    expect(component.chapters()).toEqual(mockChapters);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('should set error on fetch failure', () => {
    chapterServiceMock.getAllChapters.and.returnValue(throwError(() => new Error('Network error')));

    component.fetchChapters();

    expect(component.chapters()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Impossible de récupérer les chapitres');
  });

  it('should add a new chapter', () => {
    const newChapter: Chapter = {
      id: 3,
      en: 'New EN',
      fr: 'Nouveau FR',
      isVintage: false,
      isEphemeral: true,
    };
    component.newChapter.set({
      en: 'New EN',
      fr: 'Nouveau FR',
      isVintage: false,
      isEphemeral: true,
    });

    adminChapterServiceMock.addChapter.and.returnValue(of(newChapter));
    component.chapters.set([...mockChapters]);

    component.addChapter();

    expect(component.chapters()).toContain(newChapter);
    expect(component.newChapter()).toEqual({
      en: '',
      fr: '',
      isVintage: false,
      isEphemeral: false,
    });
  });

  it('should update a chapter', () => {
    const updatedChapter: Chapter = { ...mockChapters[0], fr: 'Updated FR' };
    component.chapters.set([...mockChapters]);

    adminChapterServiceMock.updateChapter.and.returnValue(of(updatedChapter));

    component.updateChapter(updatedChapter);

    expect(component.chapters()[0].fr).toBe('Updated FR');
  });

  it('should handle addChapter error gracefully', () => {
    const newChapter: Partial<Chapter> = { en: 'Fail', fr: 'Fail' };
    component.newChapter.set(newChapter);
    adminChapterServiceMock.addChapter.and.returnValue(throwError(() => new Error('Add failed')));

    spyOn(console, 'error');

    component.addChapter();
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });

  it('should handle updateChapter error gracefully', () => {
    const chapterToUpdate: Chapter = mockChapters[0];
    adminChapterServiceMock.updateChapter.and.returnValue(
      throwError(() => new Error('Update failed'))
    );

    spyOn(console, 'error');

    component.updateChapter(chapterToUpdate);
    expect(console.error).toHaveBeenCalledWith(jasmine.any(Error));
  });
});
