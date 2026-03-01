import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Music } from "lucide-react";
import api from "../api/axios";
import logo from "../assets/image.png";

export default function Login() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const endpoint = isSignIn ? "/auth/login" : "/auth/signup";

        const payload = isSignIn
            ? { email, password }
            : { name, email, password };

        try {
            const response = await api.post(endpoint, payload);

            const data = response.data;
            console.log("Login: Success response data:", data);

            // 🔐 store token and userId if backend returns them
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // Try different common patterns for user ID
            const userId = data.userId || data.id || data.user?.id || data.user?.userId;
            if (userId) {
                console.log("Login: Storing userId:", userId);
                localStorage.setItem("userId", userId);
            }

            // redirect after login
            navigate("/mood");

        } catch (err) {
            console.error(err);

            if (err.response) {
                setError(err.response.data.message || "Authentication failed");
            } else {
                setError("Server not reachable");
            }
        }
    };


    return (
        <div className="relative min-h-screen w-full bg-black md:bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d2e?w=2000&auto=format&fit=crop')] bg-cover bg-center overflow-hidden">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 md:bg-black/80 z-0" />

            {/* Navbar */}
            <div className="relative z-10 px-8 py-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-2 text-primary">
                    <img src={logo} alt="walkmanX" className="h-16 w-auto object-contain" />
                </div>
            </div>

            {/* Auth Card */}
            <div className="relative z-10 flex justify-center items-center min-h-[80vh]">
                <div className="bg-black/75 p-16 rounded-lg max-w-md w-full text-white backdrop-blur-sm">
                    <h2 className="text-3xl font-bold mb-8">
                        {isSignIn ? "Sign In" : "Sign Up"}
                    </h2>

                    {/* Display error messages */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isSignIn && (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required={!isSignIn}
                                    className="w-full bg-[#333] rounded px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#444] transition"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-[#333] rounded px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#444] transition"
                            />
                        </div>
                        <div className="space-y-2">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-[#333] rounded px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-[#444] transition"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#edea2b] hover:bg-[#12120f] text-white font-bold py-3 rounded transition duration-200"
                        >
                            {isSignIn ? "Sign In" : "Sign Up"}
                        </button>

                        <div className="flex justify-between text-sm text-gray-400">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded bg-[#333] border-none" />
                                Remember me
                            </label>
                            <a href="#" className="hover:underline">Need help?</a>
                        </div>
                    </form>

                    <div className="mt-16 text-gray-400">
                        {isSignIn ? "New to Walkman? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsSignIn(!isSignIn);
                                setError(""); // Clear errors when switching modes
                            }}
                            className="text-white hover:underline font-medium"
                        >
                            {isSignIn ? "Sign up now." : "Sign in."}
                        </button>
                    </div>

                    <div className="mt-4 text-xs text-gray-500">
                        This page is protected by Google reCAPTCHA to ensure you're not a bot.
                    </div>
                </div>
            </div>
        </div>
    );
}