import { Collection } from './collection.model';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  isAdmin: boolean;
  secretQuestion: string;
  secretAnswer: string;
  accountWeward?: string;
  accountInstagram?: string;
  accountDiscord?: string;
  createdAt: Date;
  updatedAt: Date;
  collection?: Collection;
}
