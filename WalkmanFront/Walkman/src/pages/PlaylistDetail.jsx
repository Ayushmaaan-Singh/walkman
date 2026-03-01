import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronLeft,
    Play,
    Pause,
    Clock3,
    MoreVertical,
    Music2,
    Loader2,
    Shuffle,
    Heart
} from "lucide-react";
import api from "../api/axios";
import { usePlayer } from "../context/PlayerContext";

export default function PlaylistDetail() {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { currentSong, isPlaying, playPlaylist, playSong, pauseSong } = usePlayer();

    useEffect(() => {
        fetchPlaylist();
    }, [id]);

    const fetchPlaylist = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/playlists/${id}`);
            setPlaylist(data);
        } catch (err) {
            console.error("Failed to fetch playlist:", err);
            setError("Playlist not found or backend error.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlayAll = () => {
        if (playlist && playlist.songs && playlist.songs.length > 0) {
            playPlaylist(playlist.songs);
        }
    };

    const handleSongClick = (song, idx) => {
        const songId = typeof song.id === 'object' ? song.id.songId : song.id;
        const currentId = typeof currentSong?.id === 'object' ? currentSong.id.songId : currentSong?.id;

        if (currentId === songId) {
            isPlaying ? pauseSong() : resumeSong();
        } else {
            playPlaylist(playlist.songs, idx);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-950">
                <Loader2 size={40} className="text-[#FFD700] animate-spin" />
                <p className="text-zinc-500 font-medium">Opening your collection...</p>
            </div>
        );
    }

    if (error || !playlist) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-zinc-950 px-6 text-center">
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                    <Music2 size={40} />
                </div>
                <h1 className="text-2xl font-bold text-white">{error || "Something went wrong"}</h1>
                <Link to="/playlists" className="px-8 py-3 bg-zinc-800 rounded-full text-white font-bold hover:bg-zinc-700 transition-all">
                    Back to Playlists
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white pb-36 bg-zinc-950">
            {/* Hero / Header */}
            <div className="relative pt-10 pb-12 px-6 md:px-10 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at 50% 0%, ${playlist.mood === 'HAPPY' ? '#FFD700' : playlist.mood === 'SAD' ? '#3B82F6' : playlist.mood === 'PUMPED' ? '#EF4444' : '#10B981'}, transparent)`
                    }}
                />

                <Link
                    to="/playlists"
                    className="relative z-10 inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-semibold">Back to Playlists</span>
                </Link>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
                    {/* Cover Art */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-56 h-56 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-white/10"
                    >
                        {playlist.thumbnailUrl ? (
                            <img src={playlist.thumbnailUrl} alt={playlist.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                                <Music2 size={80} />
                            </div>
                        )}
                    </motion.div>

                    {/* Metadata */}
                    <div className="flex-1 text-center md:text-left">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black text-[#FFD700] uppercase tracking-[0.2em]">
                            Playlist • {playlist.mood}
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-4 mb-3">
                            {playlist.name}
                        </h1>
                        <p className="text-zinc-400 font-medium mb-6">
                            {playlist.songs?.length || 0} tracks curated for you
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePlayAll}
                                className="flex items-center gap-3 bg-[#FFD700] text-black px-8 py-3.5 rounded-full font-black shadow-lg shadow-[#FFD700]/20"
                            >
                                <Play fill="black" size={20} />
                                Play All
                            </motion.button>
                            <button className="p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
                                <Shuffle size={20} />
                            </button>
                            <button className="p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all">
                                <Heart size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Songs List */}
            <div className="px-6 md:px-10 mt-6">
                <div className="grid grid-cols-[40px_1fr_1fr_40px] px-4 py-2 text-xs font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-2">
                    <div className="text-center">#</div>
                    <div>Title</div>
                    <div className="hidden md:block">Artist</div>
                    <div className="text-center"><Clock3 size={14} /></div>
                </div>

                <div className="space-y-1">
                    {playlist.songs && playlist.songs.length > 0 ? (
                        playlist.songs.map((song, idx) => {
                            const songId = typeof song.id === 'object' ? song.id.songId : song.id;
                            const currentId = typeof currentSong?.id === 'object' ? currentSong.id.songId : currentSong?.id;
                            const isCurrent = currentId === songId;

                            const uniqueKey = typeof song.id === 'object'
                                ? `ps-${song.id.playlistId}-${song.id.songId}`
                                : `song-${song.id}`;

                            return (
                                <motion.div
                                    key={uniqueKey}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => handleSongClick(song, idx)}
                                    className={`group grid grid-cols-[40px_1fr_1fr_40px] items-center px-4 py-3 rounded-2xl transition-all cursor-pointer ${isCurrent ? 'bg-[#FFD700]/10' : 'hover:bg-white/5'
                                        }`}
                                >
                                    <div className="text-center text-sm font-bold text-zinc-500">
                                        {isCurrent && isPlaying ? (
                                            <div className="flex items-center justify-center gap-0.5 h-4">
                                                <div className="w-0.5 h-2 bg-[#FFD700] animate-[soundBar_0.5s_infinite_alternate]" />
                                                <div className="w-0.5 h-4 bg-[#FFD700] animate-[soundBar_0.8s_infinite_alternate]" />
                                                <div className="w-0.5 h-3 bg-[#FFD700] animate-[soundBar_0.6s_infinite_alternate]" />
                                            </div>
                                        ) : (
                                            <span className={isCurrent ? 'text-[#FFD700]' : ''}>{idx + 1}</span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                                            <img src={song.thumbnailUrl} alt={song.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#FFD700]' : 'text-white'}`}>
                                                {song.title}
                                            </h4>
                                            <p className="text-xs text-zinc-500 truncate md:hidden">{song.artistName}</p>
                                        </div>
                                    </div>

                                    <div className="hidden md:block text-sm text-zinc-400 truncate">
                                        {song.artistName}
                                    </div>

                                    <div className="flex items-center justify-center">
                                        <button className="text-zinc-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center text-zinc-600 font-medium">
                            No songs in this playlist yet.
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes soundBar {
                    from { height: 20%; }
                    to { height: 100%; }
                }
            `}</style>
        </div>
    );
}
