import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Library, LogOut, Music } from "lucide-react";
import { cn } from "../lib/utils";
import logo from "../assets/image.png";

export default function Navbar() {
    const location = useLocation();

    const navItems = [
        { name: "Home", icon: Home, path: "/home" },
        { name: "Search", icon: Search, path: "/search" },
        { name: "Your Library", icon: Library, path: "/playlists" },
    ];

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-black text-white p-6 hidden md:flex flex-col z-50">
            <div className="flex items-center gap-2 mb-10 text-primary px-2">
                <img src={logo} alt="walkmanX" className="h-12 w-auto object-contain" />
            </div>

            <nav className="flex-1 space-y-4">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={cn(
                            "flex items-center gap-4 text-sm font-medium transition-colors hover:text-white",
                            location.pathname === item.path ? "text-white" : "text-gray-400"
                        )}
                    >
                        <item.icon size={24} />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="mt-auto">
                <Link to="/" className="flex items-center gap-4 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    <LogOut size={24} />
                    Sign Out
                </Link>
            </div>
        </div>
    );
}
