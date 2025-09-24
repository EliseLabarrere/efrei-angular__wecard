import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChapterService } from './chapter.service';
import { ApiService } from '../../../shared/services/api.service';
import { UserChapter } from '../models/user-chapter.model';
import { Chapter } from '../models/chapter.model';

describe('ChapterService', () => {
  let chapterService: ChapterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChapterService, ApiService],
    });

    chapterService = TestBed.inject(ChapterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(chapterService).toBeTruthy();
  });

  it('should update user chapter cards', () => {
    const mockResponse: UserChapter = {
      id: 1,
      idUser: 1,
      idWewardChapter: 1,
      card1: 1,
      card2: 2,
      card3: 3,
      card4: 4,
      card5: 5,
      card6: 6,
      card7: 7,
      card8: 8,
      card9: 9,
      WewardChapter: {
        id: 1,
        en: 'Chapter EN',
        fr: 'Chapter FR',
        isVintage: false,
        isEphemeral: false,
        cards: [],
      },
    };

    chapterService.updateUserChapterCards(1, { card1: 1 }).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/weward/my-chapters');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ idWewardChapter: 1, cards: { card1: 1 } });
    req.flush({ success: true, data: mockResponse });
  });

  it('should get user chapters', () => {
    const mockResponse: UserChapter[] = [
      {
        id: 1,
        idUser: 1,
        idWewardChapter: 1,
        card1: 1,
        card2: 2,
        card3: 3,
        card4: 4,
        card5: 5,
        card6: 6,
        card7: 7,
        card8: 8,
        card9: 9,
        WewardChapter: {
          id: 1,
          en: 'Chapter EN',
          fr: 'Chapter FR',
          isVintage: false,
          isEphemeral: false,
          cards: [],
        },
      },
    ];

    chapterService.getUserChapters(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/weward/user-chapters/1');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockResponse });
  });

  it('should get all chapters', () => {
    const mockResponse: Chapter[] = [
      {
        id: 1,
        en: 'Chapter EN',
        fr: 'Chapter FR',
        isVintage: false,
        isEphemeral: false,
        cards: [],
      },
      {
        id: 2,
        en: 'Chapter2 EN',
        fr: 'Chapter2 FR',
        isVintage: true,
        isEphemeral: true,
        cards: [],
      },
    ];

    chapterService.getAllChapters().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/weward/chapters');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockResponse });
  });
});
