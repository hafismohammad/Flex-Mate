import axios from 'axios';
import { User } from '../features/user/userTypes';

// Define the base URL for the API
const API_URL = '/api/user'



const register = async (userDetails: User) => {
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
