export interface ISessionSchedule {
  _id: string;
  specializationId: Specialization; 
  isSingleSession: boolean;
  startDate: string; 
  endDate: string; 
  startTime: string;
  endTime: string;
  price: number;
  duration?: string; 
  isBooked: boolean;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'InProgress'; 
  trainerId: string;
}

export interface Specialization {
  _id: string;
  name: string;
  description: string;
  image: string;
  isListed: boolean;
}
