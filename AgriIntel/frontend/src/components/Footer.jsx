import React from "react";


export default function Footer() {

    return (

        <footer className="bg-slate-100 border-t border-slate-200 py-5 text-center">

            <p className="text-sm text-slate-600">

                © {new Date().getFullYear()}{" "}

                <span className="font-semibold text-emerald-700">
                    AgriIntel
                </span>

                {" "}— Smart Agriculture Decision Support System

            </p>

        </footer>
    );
}