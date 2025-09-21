export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isAdmin: boolean;
  secretQuestion: string;
  secretAnswer: string;
  accountWeward?: string;
  accountInstagram?: string;
  accountDiscord?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  secretQuestion: string;
  secretAnswer: string;
  accountWeward?: string;
  accountInstagram?: string;
  accountDiscord?: string;
}
