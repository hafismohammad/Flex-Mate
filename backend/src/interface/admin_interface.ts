export interface ILoginAdmin {
    email: string;
    password: string;
  }

  export interface ISpecialization extends Document {
    name: string;
    description: string;
    image: string
    createdAt: Date;
    isListed: boolean;
  }