import React from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import {
    Sprout,
    LayoutDashboard,
    Stethoscope,
    TrendingUp,
    User,
    LogOut
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


export default function Navbar() {

    const location =
        useLocation();

    const navigate =
        useNavigate();

    const {
        user,
        logout
    } = useAuth();


    const handleLogout = () => {

        logout();

        navigate("/login");
    };


    const activeClass = (path) => {

        return location.pathname === path
            ? "text-white underline underline-offset-4"
            : "text-emerald-100 hover:text-white";
    };


    // Landing page has its own navbar.
    if (
        location.pathname === "/" ||
        location.pathname === "/login" ||
        location.pathname === "/register"
    ) {

        return null;
    }


    return (

        <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-50">

            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">


                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 font-bold text-xl"
                >

                    <Sprout className="w-6 h-6" />

                    AgriIntel

                </Link>


                <nav className="flex items-center gap-5 text-sm font-medium">


                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-1.5 ${activeClass(
                            "/dashboard"
                        )}`}
                    >

                        <LayoutDashboard
                            className="w-4 h-4"
                        />

                        Dashboard

                    </Link>


                    <Link
                        to="/disease-detect"
                        className={`flex items-center gap-1.5 ${activeClass(
                            "/disease-detect"
                        )}`}
                    >

                        <Stethoscope
                            className="w-4 h-4"
                        />

                        Disease

                    </Link>


                    <Link
                        to="/price-forecast"
                        className={`flex items-center gap-1.5 ${activeClass(
                            "/price-forecast"
                        )}`}
                    >

                        <TrendingUp
                            className="w-4 h-4"
                        />

                        Price

                    </Link>


                    <Link
                        to="/profile"
                        className={`flex items-center gap-1.5 ${activeClass(
                            "/profile"
                        )}`}
                    >

                        <User
                            className="w-4 h-4"
                        />

                        {user?.full_name || "Profile"}

                    </Link>


                    {user?.role === "admin" && (

                        <Link
                            to="/admin"
                            className={activeClass(
                                "/admin"
                            )}
                        >

                            Admin

                        </Link>
                    )}


                    <button
                        onClick={handleLogout}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                    >

                        <LogOut
                            className="w-4 h-4"
                        />

                        Logout

                    </button>

                </nav>

            </div>

        </header>
    );
}