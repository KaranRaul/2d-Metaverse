import axios, { AxiosResponse } from 'axios';


const BASE_URL = 'http://localhost:3000/api/v1';

interface CreateElementPayload {
    imageUrl: string,
    width: number,
    height: number,
    static: boolean
}


interface CreateElementResponse {
    id: string;
}


interface CreateMapPayload {
    thumbnail: string,
    dimensions: string,
    name: string,
    defaultElements:
    {
        elementId: string,
        x: number,
        y: number
    }[]
}

interface MapResponse {
    id: string,
    name: string,
    thumbnail: string,
    height: number,
    width: number
}

interface CrateSpacePalyload {
    name: string,
    dimensions: string,
    mapId?: string
}


interface spaceResponse {
    id: string,
    name: string,
    thumbnail?: string,
    dimensions: string,
}

interface getSpaceBySpaceIdResponse {
    dimesions: string,
    elements: {
        id: string,
        element: {
            id: string,
            imageUrl: string,
            widht: number,
            height: number,
            static: boolean
        },
        x: number,
        y: number
    }[]
}




export const createElement = async (payload: CreateElementPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/element`, payload, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });

        return response
    } catch (error) {
        return { error };
    }
}


export const createMap = async (payload: CreateMapPayload) => {
    try {
        const response = await axios.post(`${BASE_URL}/admin/map`, payload, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('authToken')}`
            }

        });
        return response.data
    } catch (error) {
        return { error }
    }
}

export const createSpace = async (payload: CrateSpacePalyload) => {
    try {
        const response = await axios.post(`${BASE_URL}/space`, payload, {
            headers: {
                authorization: `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        return response.data
    } catch (error) {
        return { error }
    }
}

export const getAllSpaces = async () => {
    const response = await axios.get(`${BASE_URL}/space/all`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data.spaces as spaceResponse[];
}

export const getSpaceBySpaceId = async (spaceId: string) => {
    const response = await axios.get(`${BASE_URL}/space/${spaceId}`, {
        headers: {
            authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
    });
    return response.data as getSpaceBySpaceIdResponse;
}

export const getMaps = async () => {
    const response = await axios.get(`${BASE_URL}/maps`);
    return response.data.maps as MapResponse[];
}

export const getAllElements = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/elements`);
        return response.data.elements;
    } catch (error) {

    }
}

