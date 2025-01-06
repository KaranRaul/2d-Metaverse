import axios, { AxiosResponse } from 'axios';


const BASE_URL = 'http://localhost:3000/api/v1';

interface SignupPayload {
    username: string;
    password: string;
    type: 'admin' | 'user'
}

interface SignupResponse {
    userId: string;
    token?: string;
}

interface SigninPayload {
    username: string;
    password: string;
}

interface SigninResponse {
    token: string;
    userId: string;
}


export const signup = async (payload: SignupPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, payload);
        return response.data as SignupResponse;

    } catch (error: any) {
        return {
            message: error.response?.data?.message || 'Signup failed',
            statusCode: error.response?.status || 500,
        };
    }
};

export const signin = async (payload: SigninPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/signin`, payload);
        return response.data as SigninResponse;

    } catch (error: any) {
        return {
            message: error.response?.data?.message || 'Signin failed',
            statusCode: error.response?.status || 500,
        };
    }
};


