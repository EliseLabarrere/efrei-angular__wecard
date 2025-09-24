import { Card } from './card.model';

export interface UserCard {
  userId: number;
  cardId: number;
  quantity: number;

  card?: Card;
}
