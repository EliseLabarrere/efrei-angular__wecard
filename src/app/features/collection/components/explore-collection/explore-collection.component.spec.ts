import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExploreCollectionComponent } from './explore-collection.component';
import { CollectionService } from '../../services/collection.service';
import { UserCollectionSummary } from '../../models/user-collection-summary.model';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ExploreCollectionComponent', () => {
  let component: ExploreCollectionComponent;
  let fixture: ComponentFixture<ExploreCollectionComponent>;
  let collectionServiceMock: jasmine.SpyObj<CollectionService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockCollections: UserCollectionSummary[] = [
    {
      idUser: 1,
      firstname: 'Alice',
      totalCards: 5,
      ownedCards: 3,
      totalChapter: 2,
      ownedCompletedChapter: 1,
    },
    {
      idUser: 2,
      firstname: 'Bob',
      totalCards: 9,
      ownedCards: 9,
      totalChapter: 3,
      ownedCompletedChapter: 3,
    },
  ];

  beforeEach(async () => {
    collectionServiceMock = jasmine.createSpyObj('CollectionService', ['getUsersCollection']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ExploreCollectionComponent, CommonModule, FontAwesomeModule],
      providers: [
        { provide: CollectionService, useValue: collectionServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreCollectionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load collections on init', () => {
    collectionServiceMock.getUsersCollection.and.returnValue(of(mockCollections));

    component.ngOnInit();

    expect(component.collections()).toEqual(mockCollections);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('');
  });

  it('should handle error on loading collections', () => {
    collectionServiceMock.getUsersCollection.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    component.ngOnInit();

    expect(component.collections()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBe('Impossible de charger les collections');
  });

  it('should filter collections by search term', () => {
    component.collections.set(mockCollections);
    component.search.set('bob');

    const filtered = component.filteredCollections();
    expect(filtered.length).toBe(1);
    expect(filtered[0].firstname).toBe('Bob');
  });

  it('should navigate to collection when goToCollection is called', () => {
    component.goToCollection(42);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/collection/user/42']);
  });

  it('should update search signal on input change', () => {
    const event = { target: { value: 'Charlie' } } as unknown as Event;
    component.onSearchChange(event);
    expect(component.search()).toBe('Charlie');
  });
});
