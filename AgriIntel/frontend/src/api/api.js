import axios from "axios";


const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api";


const api = axios.create({

    baseURL: API_BASE_URL,

    headers: {
        Accept: "application/json"
    }
});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "agriintel_token"
            );


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }


        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "agriintel_token"
            );

            localStorage.removeItem(
                "agriintel_user"
            );
        }


        return Promise.reject(error);
    }
);


// ==========================================
// AUTH
// ==========================================

export const authAPI = {

    register: (data) =>
        api.post(
            "/auth/register",
            data
        ),

    login: (data) =>
        api.post(
            "/auth/login",
            data
        ),

    getMe: () =>
        api.get(
            "/auth/me"
        )
};


// ==========================================
// DISEASE
// ==========================================

export const diseaseAPI = {

    predict: (formData) =>
        api.post(
            "/disease/predict",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        ),

    getHistory: () =>
        api.get(
            "/disease/history"
        )
};


// ==========================================
// PRICE
// ==========================================

export const priceAPI = {

    predict: (data) =>
        api.post(
            "/price/predict",
            data
        ),

    getHistory: () =>
        api.get(
            "/price/history"
        )
};


// ==========================================
// ADMIN
// ==========================================

export const adminAPI = {

    getStatistics: () =>
        api.get(
            "/admin/statistics"
        )
};


// ==========================================
// METADATA
// ==========================================

export const metadataAPI = {

    getCrops: () =>
        api.get(
            "/crops"
        ),

    getMarkets: () =>
        api.get(
            "/markets"
        )
};


export default api;