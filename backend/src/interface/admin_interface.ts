export interface ILoginAdmin {
    email: string;
    password: string;
  }

  export interface ISpecialization extends Document {
    name: string;
    description: string;
    createdAt: Date;
    isListed: boolean;
  }