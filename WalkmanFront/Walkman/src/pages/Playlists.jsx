import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Music2, Plus, Loader2 } from "lucide-react";
import api from "../api/axios";
import PlaylistCard from "../components/PlaylistCard";
import CreatePlaylistModal from "../components/CreatePlaylistModal";

export default function Playlists() {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchPlaylists();
    }, []);

    const fetchPlaylists = async (isRefresh = false) => {
        const storedId = localStorage.getItem("userId");
        const userId = storedId && !isNaN(storedId) ? Number(storedId) : (storedId || 1);

        console.log(`Playlists: Fetching GET /playlists/user/${userId}... (from localStorage: ${storedId})`);
        try {
            const response = await api.get(`/playlists/user/${userId}`);
            console.log("Playlists: API Response Status:", response.status);
            console.log("Playlists: API Response Data:", JSON.stringify(response.data));

            const data = response.data;
            setPlaylists(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch playlists:", err);
            setError("Could not load your playlists. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-white pb-36 bg-zinc-950">
            {/* Header */}
            <div className="relative overflow-hidden px-6 md:px-10 pt-10 pb-8 border-b border-white/5">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_-20%,_#FFD700,_transparent)]" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-[#FFD700] font-black uppercase tracking-[0.2em] mb-2"
                        >
                            Your Library
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-black tracking-tight"
                        >
                            My <span className="text-[#FFD700]">Playlists</span>
                        </motion.h1>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFD700]/50 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300"
                    >
                        <Plus size={18} className="text-[#FFD700]" />
                        New Playlist
                    </motion.button>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 md:px-10 mt-10">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center gap-4">
                        <Loader2 size={40} className="text-[#FFD700] animate-spin" />
                        <p className="text-zinc-500 font-medium">Curating your music...</p>
                    </div>
                ) : error ? (
                    <div className="py-24 text-center">
                        <p className="text-red-400 font-medium mb-4">{error}</p>
                        <button
                            onClick={fetchPlaylists}
                            className="px-6 py-2 bg-zinc-800 rounded-full text-sm font-bold hover:bg-zinc-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                ) : playlists.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {playlists.map((playlist, idx) => (
                            <PlaylistCard key={playlist.id} playlist={playlist} index={idx} />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 flex flex-col items-center justify-center text-center px-10"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                            <Music2 size={48} className="text-zinc-700" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">No playlists found</h2>
                        <p className="text-zinc-500 max-w-md mx-auto mb-8">
                            Looks like you haven't created any playlists yet. Start by creating one and adding your favorite tracks!
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#FFD700] text-black px-8 py-3 rounded-full font-bold shadow-lg shadow-[#FFD700]/20 hover:scale-105 transition-transform"
                        >
                            Create First Playlist
                        </button>
                    </motion.div>
                )}
            </div>

            <CreatePlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => fetchPlaylists(true)}
            />
        </div>
    );
}
