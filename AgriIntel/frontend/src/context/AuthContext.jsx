import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { authAPI } from "../api/api";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        const token =
            localStorage.getItem(
                "agriintel_token"
            );


        if (!token) {

            setLoading(false);

            return;
        }


        const verifyUser = async () => {

            try {

                const response =
                    await authAPI.getMe();


                setUser(response.data);


                localStorage.setItem(
                    "agriintel_user",
                    JSON.stringify(
                        response.data
                    )
                );

            } catch (error) {

                console.error(
                    "Session expired."
                );


                localStorage.removeItem(
                    "agriintel_token"
                );

                localStorage.removeItem(
                    "agriintel_user"
                );


                setUser(null);

            } finally {

                setLoading(false);
            }
        };


        verifyUser();

    }, []);


    const login = (userData) => {

        setUser(userData);

        localStorage.setItem(
            "agriintel_user",
            JSON.stringify(userData)
        );
    };


    const logout = () => {

        localStorage.removeItem(
            "agriintel_token"
        );

        localStorage.removeItem(
            "agriintel_user"
        );

        setUser(null);
    };


    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    const context =
        useContext(AuthContext);


    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }


    return context;
}