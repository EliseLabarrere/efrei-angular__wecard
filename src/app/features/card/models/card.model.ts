export type CardRarity = 'COMMON' | 'RARE' | 'SUPER_RARE' | 'LEGENDARY';

export interface Card {
  id: number;
  chapterId: number;
  rank: number;
  rarity: CardRarity;
  stars: number;
  color: string;
  label?: string;
  count: number;
}
