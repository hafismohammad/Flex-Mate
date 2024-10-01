import axios from 'axios';
import { User } from '../features/user/userTypes';

// Define the base URL for the API
const API_URL ='http://localhost:3000/user/api'



const register = async (userDetails: User) => {
    console.log('services axios', userDetails)
    const response = await axios.post(`${API_URL}/signup`, userDetails);


    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

const userService = {
    register,
}

export default userService;
