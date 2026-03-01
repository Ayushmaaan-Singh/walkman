import React from "react";
import Navbar from "../components/Navbar";
import MusicPlayer from "../components/MusicPlayer";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
            <Navbar />
            <main className="md:pl-64 pb-24 min-h-screen">
                <div className="p-0">
                    <Outlet />
                </div>
            </main>
            <MusicPlayer />
        </div>
    );
}
