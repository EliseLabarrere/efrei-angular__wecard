import { Card, CardRarity } from '../models/card.model';

export function cardFromRank(rank: number, chapterId: number): Card {
  let rarity: CardRarity;
  let stars: number;
  let color: string;

  if (rank >= 1 && rank <= 3) {
    rarity = 'COMMON';
    stars = 1;
    color = '#f39359';
  } else if (rank >= 4 && rank <= 6) {
    rarity = 'RARE';
    stars = 2;
    color = '#53b2aa';
  } else if (rank === 7 || rank === 8) {
    rarity = 'SUPER_RARE';
    stars = 3;
    color = '#655fe5';
  } else {
    rarity = 'LEGENDARY';
    stars = 4;
    color = 'gradient';
  }

  return {
    id: rank,
    chapterId,
    rank,
    rarity,
    stars,
    color,
    count: 0,
  };
}
