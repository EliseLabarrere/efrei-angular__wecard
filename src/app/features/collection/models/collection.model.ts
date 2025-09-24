import { CollectionItem } from './collection-item.model';

export interface Collection {
  userId: number;
  cards: CollectionItem[];
}
