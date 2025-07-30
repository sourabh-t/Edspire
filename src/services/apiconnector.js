import axios from "axios"

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_BACKEND_URL,
    withCredentials: true,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}