import { UserCard as Card } from '../../card/models/user-card.model';

export interface Chapter {
  id: number;
  en: string;
  fr: string;
  isVintage: boolean;
  isEphemeral: boolean;

  cards?: Card[];
}
