import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Music2, Loader2, CheckCircle2 } from "lucide-react";
import api from "../api/axios";

export default function AddToPlaylistModal({ isOpen, onClose, song }) {
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingTo, setAddingTo] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchPlaylists();
        } else {
            setSuccess(false);
            setAddingTo(null);
        }
    }, [isOpen]);

    const fetchPlaylists = async () => {
        setLoading(true);
        const storedId = localStorage.getItem("userId") || 1;
        const userId = !isNaN(storedId) ? Number(storedId) : storedId;
        try {
            const { data } = await api.get(`/playlists/user/${userId}`);
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch playlists:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToPlaylist = async (playlistId) => {
        setAddingTo(playlistId);
        try {
            await api.post(`/playlists/${playlistId}/songs`, {
                songId: song.id,
                title: song.title,
                artistName: song.artistName,
                thumbnailUrl: song.thumbnailUrl,
                previewUrl: song.previewUrl,
            });
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Failed to add song to playlist:", err);
            setAddingTo(null);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
                                <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                                    {song?.title} • {song?.artistName}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-3">
                                    <Loader2 size={32} className="text-[#FFD700] animate-spin" />
                                    <p className="text-zinc-500 text-sm">Loading your playlists...</p>
                                </div>
                            ) : playlists.length > 0 ? (
                                <div className="space-y-1">
                                    {playlists.map((playlist) => (
                                        <button
                                            key={playlist.id}
                                            onClick={() => !success && handleAddToPlaylist(playlist.id)}
                                            disabled={success || addingTo === playlist.id}
                                            className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all text-left group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex-shrink-0 overflow-hidden border border-white/5">
                                                {playlist.thumbnailUrl ? (
                                                    <img
                                                        src={playlist.thumbnailUrl}
                                                        alt={playlist.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                                        <Music2 size={24} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-white truncate group-hover:text-[#FFD700] transition-colors">
                                                    {playlist.name}
                                                </h4>
                                                <p className="text-xs text-zinc-500">{playlist.mood}</p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                {addingTo === playlist.id ? (
                                                    success ? (
                                                        <CheckCircle2 size={20} className="text-emerald-500" />
                                                    ) : (
                                                        <Loader2 size={20} className="text-[#FFD700] animate-spin" />
                                                    )
                                                ) : (
                                                    <Plus size={20} className="text-zinc-600 group-hover:text-white transition-colors" />
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-16 text-center px-10">
                                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Plus size={32} className="text-zinc-600" />
                                    </div>
                                    <h4 className="text-white font-medium mb-1">No playlists yet</h4>
                                    <p className="text-zinc-500 text-sm">Create a playlist first to start adding songs.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer / Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute inset-x-0 bottom-0 bg-emerald-500/90 backdrop-blur-md p-4 flex items-center justify-center gap-3 text-white font-bold"
                                >
                                    <CheckCircle2 size={24} />
                                    Song added to playlist!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
