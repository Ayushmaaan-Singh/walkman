import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music2, Loader2, Sparkles } from "lucide-react";
import api from "../api/axios";

const MOODS = [
    { id: "HAPPY", label: "Happy", emoji: "😄", color: "from-yellow-400 to-orange-500" },
    { id: "SAD", label: "Sad", emoji: "😢", color: "from-blue-400 to-indigo-600" },
    { id: "PUMPED", label: "Pumped", emoji: "⚡", color: "from-red-500 to-pink-600" },
    { id: "CHILL", label: "Chill", emoji: "🌿", color: "from-emerald-400 to-teal-600" },
];

export default function CreatePlaylistModal({ isOpen, onClose, onSuccess }) {
    const [name, setName] = useState("");
    const [selectedMood, setSelectedMood] = useState("CHILL");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);
        const storedId = localStorage.getItem("userId");
        const userId = (storedId && !isNaN(storedId)) ? Number(storedId) : (storedId || 1);

        try {
            const payload = {
                name: name.trim(),
                mood: selectedMood,
                userId: userId,
            };
            console.log("[DEBUG] CreatePlaylist: Sending POST /playlists with Payload:", JSON.stringify(payload, null, 2));
            const response = await api.post("/playlists", payload);
            console.log("[DEBUG] CreatePlaylist: Received Response:", JSON.stringify(response.data, null, 2));

            setSuccess(true);
            onSuccess();
            setTimeout(() => {
                onClose();
                setName("");
                setSelectedMood("CHILL");
                setSuccess(false);
            }, 1000);
        } catch (err) {
            console.error("Failed to create playlist:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Create Playlist</h3>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-400 mb-2">Playlist Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="My Awesome Mix"
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#FFD700]/50 outline-none rounded-2xl px-4 py-3 text-white placeholder-zinc-600 transition-all font-medium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-zinc-400 mb-3">Choose a Mood</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {MOODS.map((mood) => (
                                        <button
                                            key={mood.id}
                                            type="button"
                                            onClick={() => setSelectedMood(mood.id)}
                                            className={`flex items-center gap-2 p-3 rounded-2xl border transition-all ${selectedMood === mood.id
                                                ? `bg-gradient-to-r ${mood.color} border-transparent text-white shadow-lg`
                                                : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                                                }`}
                                        >
                                            <span>{mood.emoji}</span>
                                            <span className="text-sm font-bold">{mood.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="w-full bg-[#FFD700] hover:bg-[#FFD700]/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#FFD700]/20 transition-all active:scale-[0.98]"
                            >
                                {loading ? (
                                    <Loader2 size={20} className="animate-spin" />
                                ) : (
                                    <Sparkles size={20} />
                                )}
                                {loading ? "Creating..." : "Create Playlist"}
                            </button>
                        </form>

                        {/* Success Message */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    className="absolute inset-x-0 bottom-0 bg-emerald-500/90 backdrop-blur-md p-4 flex items-center justify-center gap-3 text-white font-bold"
                                >
                                    Playlist created!
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
