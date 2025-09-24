import { cardFromRank } from './card.util';
import { Card } from '../models/card.model';

describe('CardUtil', () => {
  it('should create a COMMON card for rank 1-3', () => {
    const card: Card = cardFromRank(2, 10);
    expect(card.rank).toBe(2);
    expect(card.chapterId).toBe(10);
    expect(card.rarity).toBe('COMMON');
    expect(card.stars).toBe(1);
    expect(card.color).toBe('#f39359');
    expect(card.count).toBe(0);
  });

  it('should create a RARE card for rank 4-6', () => {
    const card: Card = cardFromRank(5, 10);
    expect(card.rarity).toBe('RARE');
    expect(card.stars).toBe(2);
    expect(card.color).toBe('#53b2aa');
  });

  it('should create a SUPER_RARE card for rank 7 or 8', () => {
    const card7: Card = cardFromRank(7, 10);
    const card8: Card = cardFromRank(8, 10);

    [card7, card8].forEach(card => {
      expect(card.rarity).toBe('SUPER_RARE');
      expect(card.stars).toBe(3);
      expect(card.color).toBe('#655fe5');
    });
  });

  it('should create a LEGENDARY card for rank >= 9', () => {
    const card: Card = cardFromRank(9, 10);
    expect(card.rarity).toBe('LEGENDARY');
    expect(card.stars).toBe(4);
    expect(card.color).toBe('gradient');
  });
});
