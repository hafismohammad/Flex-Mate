export interface ISessionSchedule {
    _id: string;
    isSingleSession: boolean;
    startDate: string; 
    endDate: string; 
    startTime: string;
    endTime: string;
    price: number;
    duration?: string; 
    isBooked: boolean,
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'InProgress'; 
    trainerId: string;
  }
  