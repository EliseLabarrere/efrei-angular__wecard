import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCollectionComponent } from './user-collection.component';
import { ChapterService } from '../../../chapter/services/chapter.service';
import { CollectionService } from '../../../collection/services/collection.service';
import { AuthService } from '../../../auth/services/auth.service';
import { of } from 'rxjs';
import { UserChapter } from '../../../chapter/models/user-chapter.model';
import { UserCollectionSummary } from '../../models/user-collection-summary.model';
import { ActivatedRoute } from '@angular/router';
import { CardCountDirective } from '../../../card/directives/card-count.directive';
import { CardRarityDirective } from '../../../card/directives/card-rarity.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Card } from '../../../card/models/card.model';

describe('UserCollectionComponent', () => {
  let component: UserCollectionComponent;
  let fixture: ComponentFixture<UserCollectionComponent>;
  let chapterServiceMock: jasmine.SpyObj<ChapterService>;
  let collectionServiceMock: jasmine.SpyObj<CollectionService>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  const mockChapters: UserChapter[] = [
    {
      id: 1,
      idUser: 1,
      idWewardChapter: 1,
      card1: 1,
      card2: 0,
      card3: 0,
      card4: 0,
      card5: 0,
      card6: 0,
      card7: 0,
      card8: 0,
      card9: 0,
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

  const mockCollection: UserCollectionSummary = {
    idUser: 1,
    firstname: 'Didier',
    totalCards: 5,
    ownedCards: 1,
    totalChapter: 1,
    ownedCompletedChapter: 0,
  };

  beforeEach(async () => {
    chapterServiceMock = jasmine.createSpyObj<ChapterService>([
      'getUserChapters',
      'updateUserChapterCards',
    ]);
    chapterServiceMock.getUserChapters.and.returnValue(of(mockChapters));
    chapterServiceMock.updateUserChapterCards.and.callFake(
      (idWewardChapter: number, cards: Record<string, number>) =>
        of({ ...mockChapters[0], ...cards } as UserChapter)
    );

    collectionServiceMock = jasmine.createSpyObj<CollectionService>(['getUserCollection']);
    collectionServiceMock.getUserCollection.and.returnValue(of(mockCollection));

    authServiceMock = jasmine.createSpyObj<AuthService>(['currentUser']);
    authServiceMock.currentUser.and.returnValue({
      id: 1,
      firstname: 'Didier',
      lastname: 'Dupont',
      email: 'didier@example.com',
    });

    await TestBed.configureTestingModule({
      imports: [
        UserCollectionComponent,
        CommonModule,
        FormsModule,
        CardCountDirective,
        CardRarityDirective,
        FontAwesomeModule,
      ],
      providers: [
        { provide: ChapterService, useValue: chapterServiceMock },
        { provide: CollectionService, useValue: collectionServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['userId', '1']]) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load chapters and collection on init', () => {
    expect(chapterServiceMock.getUserChapters).toHaveBeenCalledWith(1);
    expect(collectionServiceMock.getUserCollection).toHaveBeenCalledWith(1);
    expect(component.chapters()).toEqual(mockChapters);
    expect(component.collection()).toEqual(mockCollection);
  });

  it('should update chapter cards', () => {
    const chapter = component.chapters()[0];
    const card: Card = {
      id: 1,
      chapterId: chapter.idWewardChapter,
      rank: 1,
      rarity: 'COMMON',
      stars: 1,
      color: '#f39359',
      count: 1,
    };

    const inputEvent = { target: { value: '2' } } as unknown as Event & {
      target: HTMLInputElement;
    };
    component.onCardCountInput(chapter, inputEvent, card);

    const updatedChapter = component.chapters()[0];
    expect(updatedChapter.card1).toBe(2);
    expect(chapterServiceMock.updateUserChapterCards).toHaveBeenCalledWith(
      chapter.idWewardChapter,
      jasmine.objectContaining({ card1: 2 })
    );
  });
});
