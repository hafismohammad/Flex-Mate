
export interface IUser {
    id?: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    dob?: string;
    image?: string;
    gender?: string;
    address?: {
      street: string;
      city: string;
    };
    isBlocked: boolean;
  }