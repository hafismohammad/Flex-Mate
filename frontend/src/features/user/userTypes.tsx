

// Structure of the user object


export interface User {
   id: string;
    name: string;
    phone: string;
    email: string;
    password: string;
    dob?:string
    gender?: string,
    isBlocked?: boolean;
  }

  interface IncomingVideoCall {
    _id: string;
    profilePic: string;
    callType: string;
    roomId: string  | null;
  }
  // Initial state structure for the user slice
  export interface UserState {
    userInfo: User | null;  
    loading: boolean;       
    error: string | null;   
    token:string|null;
    showIncomingVideoCall: IncomingVideoCall | null; 
    videoCall: null | string;
    showVideoCallUser: boolean;
    roomIdUser: null | string;
  }

  
