import { Chapter } from './chapter.model';

export interface UserChapter {
  id: number;
  idUser: number;
  idWewardChapter: number;
  card1: number;
  card2: number;
  card3: number;
  card4: number;
  card5: number;
  card6: number;
  card7: number;
  card8: number;
  card9: number;
  WewardChapter: Chapter;
}
