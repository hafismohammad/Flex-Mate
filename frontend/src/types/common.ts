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


export interface IBookingDetails {
  _id: string
  userName: string
  userId?:string
  trainerName: string
  bookingDate: string;
  sessionDates: {
    startDate: string; 
    endDate?: string;  
  };
  sessionStartTime: string;
  sessionEndTime: string;
  sessionType: string;
  specialization: string
  amount: string
  status: string
}