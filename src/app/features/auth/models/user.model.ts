export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  secretQuestion: string;
  secretAnswer: string;
  accounWeward: string;
  accounInstagram: string;
  accounDiscord: string;
  createdAt: Date;
  updatedAt: Date;
}
