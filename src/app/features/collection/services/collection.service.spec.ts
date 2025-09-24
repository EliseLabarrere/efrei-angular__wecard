import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CollectionService } from '../../collection/services/collection.service';
import { ApiService } from '../../../shared/services/api.service';
import { UserCollectionSummary } from '../../collection/models/user-collection-summary.model';

describe('ChapterService', () => {
  let collectionService: CollectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CollectionService, ApiService],
    });

    collectionService = TestBed.inject(CollectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get user collection', () => {
    const mockResponse: UserCollectionSummary = {
      idUser: 1,
      firstname: 'Didier',
      totalCards: 5,
      ownedCards: 5,
      totalChapter: 1,
      ownedCompletedChapter: 0,
    };

    collectionService.getUserCollection(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/weward/user-collection/1');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockResponse });
  });

  it('should get user collections', () => {
    const mockResponse: UserCollectionSummary[] = [
      {
        idUser: 1,
        firstname: 'Didier',
        totalCards: 5,
        ownedCards: 5,
        totalChapter: 1,
        ownedCompletedChapter: 0,
      },
      {
        idUser: 2,
        firstname: 'Alice',
        totalCards: 3,
        ownedCards: 3,
        totalChapter: 1,
        ownedCompletedChapter: 0,
      },
    ];

    collectionService.getUsersCollection().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/weward/users-collection');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockResponse });
  });
});
