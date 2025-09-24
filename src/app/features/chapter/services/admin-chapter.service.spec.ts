import { TestBed } from '@angular/core/testing';
import { AdminChapterService } from './admin-chapter.service';
import { ApiService } from '../../../shared/services/api.service';
import { Chapter } from '../models/chapter.model';
import { of } from 'rxjs';

describe('AdminChapterService', () => {
  let service: AdminChapterService;
  let apiServiceMock: { post: jasmine.Spy };

  const mockChapter: Chapter = {
    id: 1,
    en: 'Chapter EN',
    fr: 'Chapter FR',
    isVintage: false,
    isEphemeral: false,
    cards: [],
  };

  beforeEach(() => {
    apiServiceMock = {
      post: jasmine.createSpy('post'),
    };

    TestBed.configureTestingModule({
      providers: [AdminChapterService, { provide: ApiService, useValue: apiServiceMock }],
    });

    service = TestBed.inject(AdminChapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a chapter', done => {
    apiServiceMock.post.and.returnValue(of({ success: true, data: mockChapter }));

    service.addChapter({ en: 'Chapter EN', fr: 'Chapter FR' }).subscribe({
      next: (chapter: Chapter) => {
        expect(chapter).toEqual(mockChapter);
        expect(apiServiceMock.post).toHaveBeenCalledWith('weward/add-chapter', {
          en: 'Chapter EN',
          fr: 'Chapter FR',
        });
        done();
      },
    });
  });

  it('should update a chapter', done => {
    const updatedChapter: Chapter = { ...mockChapter, fr: 'Updated FR' };
    apiServiceMock.post.and.returnValue(of({ success: true, data: updatedChapter }));

    service.updateChapter(1, { fr: 'Updated FR' }).subscribe({
      next: (chapter: Chapter) => {
        expect(chapter).toEqual(updatedChapter);
        expect(apiServiceMock.post).toHaveBeenCalledWith('weward/update-chapter/1', {
          fr: 'Updated FR',
        });
        done();
      },
    });
  });
});
