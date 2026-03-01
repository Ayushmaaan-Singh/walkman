import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Play,
    Pause,
    ChevronDown,
    Loader2,
    Music2,
    Sparkles,
    TrendingUp,
    Volume2,
    Plus,
} from "lucide-react";
import api from "../api/axios";
import { usePlayer } from "../context/PlayerContext";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import LanguageModal from "../components/LanguageModal";

// ─── Constants ────────────────────────────────────────────────────────────────

const MOODS = [
    {
        id: "HAPPY",
        label: "Happy",
        emoji: "😄",
        gradient: "from-yellow-400 to-orange-500",
        glow: "shadow-orange-500/40",
        color: "#f97316",
    },
    {
        id: "SAD",
        label: "Sad",
        emoji: "😢",
        gradient: "from-blue-400 to-indigo-600",
        glow: "shadow-blue-500/40",
        color: "#6366f1",
    },
    {
        id: "PUMPED",
        label: "Pumped",
        emoji: "⚡",
        gradient: "from-red-500 to-pink-600",
        glow: "shadow-red-500/40",
        color: "#ef4444",
    },
    {
        id: "CHILL",
        label: "Chill",
        emoji: "🌿",
        gradient: "from-emerald-400 to-teal-600",
        glow: "shadow-teal-500/40",
        color: "#14b8a6",
    },
];

const LANGUAGES = [
    "Hindi",
    "English",
    "Spanish",
    "Korean",
    "Tamil",
    "Telugu",
];

// ─── Mood Button ──────────────────────────────────────────────────────────────

function MoodButton({ mood, isSelected, onClick }) {
    return (
        <motion.button
            onClick={() => onClick(mood.id)}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 overflow-hidden ${isSelected
                ? `bg-gradient-to-r ${mood.gradient} text-white shadow-lg ${mood.glow}`
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white"
                }`}
        >
            <span className="text-base">{mood.emoji}</span>
            <span>{mood.label}</span>
            {isSelected && (
                <motion.div
                    layoutId="moodGlow"
                    className={`absolute inset-0 bg-gradient-to-r ${mood.gradient} opacity-20 blur-md`}
                />
            )}
        </motion.button>
    );
}


// ─── Song Card ────────────────────────────────────────────────────────────────

function SongCard({ song, index, activeSongId, isPlaying, onCardClick, onAddToPlaylist }) {
    const getFlattenedId = (id) => typeof id === 'object' ? id.songId : id;
    const isActive = getFlattenedId(activeSongId) === getFlattenedId(song.id);
    const showPause = isActive && isPlaying;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
            className="group relative bg-white/4 hover:bg-white/8 border border-white/6 hover:border-white/15 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer"
            onClick={() => onCardClick(song)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={song.thumbnailUrl}
                    alt={song.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&background=1a1a1a&color=FFD700&size=256&bold=true&font-size=0.4`;
                    }}
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play / Pause button */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={false}
                >
                    <AnimatePresence mode="wait">
                        {showPause ? (
                            <motion.div
                                key="pause"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-14 h-14 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/40"
                            >
                                <Pause fill="black" size={22} color="black" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="play"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="w-14 h-14 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                                <Play fill="black" size={22} color="black" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Playing indicator bars */}
                {isActive && isPlaying && (
                    <div className="absolute top-3 right-3 flex items-end gap-0.5 h-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-1 bg-[#FFD700] rounded-full"
                                style={{
                                    height: `${40 + i * 20}%`,
                                    animation: `soundBar 0.8s ease-in-out infinite alternate`,
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3">
                <h4 className={`font-semibold text-sm truncate mb-0.5 transition-colors duration-200 ${isActive ? "text-[#FFD700]" : "text-white group-hover:text-[#FFD700]"}`}>
                    {song.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">{song.artistName}</p>
                {song.albumName && (
                    <p className="text-xs text-gray-600 truncate mt-0.5">
                        {song.albumName}
                    </p>
                )}
            </div>

            {/* Preview label */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="bg-black/70 backdrop-blur-sm text-[10px] text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Volume2 size={9} />
                    30s
                </span>
            </div>

            {/* Add to Playlist */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist(song);
                }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all duration-200 z-10"
            >
                <Plus size={16} />
            </button>
        </motion.div>
    );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, title, subtitle, accentColor }) {
    return (
        <div className="flex items-start gap-3 mb-6">
            <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
                <Icon size={20} />
            </div>
            <div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                    {title}
                </h2>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
        </div>
    );
}

// ─── Songs Grid ───────────────────────────────────────────────────────────────

function SongsGrid({ songs, activeSongId, isPlaying, onCardClick, onAddToPlaylist, sectionId }) {
    return (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
                {songs.map((song, i) => {
                    const uniqueId = typeof song.id === 'object' ? `${song.id.playlistId}-${song.id.songId}` : song.id;
                    return (
                        <SongCard
                            key={`${sectionId}-${uniqueId}`}
                            song={song}
                            index={i}
                            activeSongId={activeSongId}
                            isPlaying={isPlaying}
                            onCardClick={onCardClick}
                            onAddToPlaylist={onAddToPlaylist}
                        />
                    );
                })}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white/4 animate-pulse">
            <div className="aspect-square bg-white/8" />
            <div className="p-3 space-y-2">
                <div className="h-3 bg-white/8 rounded-full w-3/4" />
                <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
            </div>
        </div>
    );
}

// ─── Main Home Component ──────────────────────────────────────────────────────

export default function Home() {
    const [selectedMood, setSelectedMood] = useState("CHILL");
    const [selectedLanguage, setSelectedLanguage] = useState("Hindi");
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasFetched, setHasFetched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    // ── Global player context ───────────────────────────────────────────────
    const { playSong, pauseSong, currentSong, isPlaying } = usePlayer();

    const moodSongs = songs.slice(0, 5);
    const trendingSongs = songs.slice(5, 10);

    const currentMood = MOODS.find((m) => m.id === selectedMood) || MOODS[3];

    // ── Fetch ──────────────────────────────────────────────────────────────────
    const fetchSongs = useCallback(async () => {
        setLoading(true);
        setSongs([]);
        setError(null);
        try {
            const { data } = await api.get("/home/mood-search", {
                params: { mood: selectedMood, language: selectedLanguage },
            });
            setSongs(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                "Couldn't load songs. Please try again."
            );
            setSongs([]);
        } finally {
            setLoading(false);
            setHasFetched(true);
        }
    }, [selectedMood, selectedLanguage]);

    // Fetch on mount or filter change
    useEffect(() => {
        fetchSongs();
    }, [fetchSongs]);

    // ── Card click handler ─────────────────────────────────────────────────────
    const handleCardClick = useCallback(
        (song) => {
            if (currentSong?.id === song.id) {
                // Same song — toggle play/pause
                if (isPlaying) {
                    pauseSong();
                } else {
                    playSong(song, songs);
                }
            } else {
                playSong(song, songs);
            }
        },
        [currentSong, isPlaying, playSong, pauseSong, songs]
    );

    const handleOpenPlaylistModal = useCallback((song) => {
        setSelectedSong(song);
        setIsModalOpen(true);
    }, []);

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <>
            {/* Sound bar animation */}
            <style>{`
        @keyframes soundBar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>

            <div className="min-h-screen text-white pb-36">
                {/* ── Hero / Filter Bar ────────────────────────────────────────────── */}
                <div className="relative overflow-hidden">
                    {/* Background glow based on mood */}
                    <div
                        className="absolute inset-0 opacity-15 transition-all duration-700"
                        style={{
                            background: `radial-gradient(ellipse 80% 60% at 50% -20%, ${currentMood.color}, transparent)`,
                        }}
                    />

                    <div className="relative z-10 px-6 md:px-10 pt-10 pb-8">
                        {/* Greeting */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">
                                Welcome back
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                What's your vibe{" "}
                                <span className="text-[#FFD700]">today?</span>
                            </h1>
                        </motion.div>

                        {/* Controls */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-wrap items-center gap-3"
                        >
                            {MOODS.map((mood) => (
                                <MoodButton
                                    key={mood.id}
                                    mood={mood}
                                    isSelected={selectedMood === mood.id}
                                    onClick={(id) => {
                                        if (id !== selectedMood) {
                                            setSongs([]);
                                            setLoading(true);
                                            setSelectedMood(id);
                                        }
                                    }}
                                />
                            ))}

                            <div className="w-px h-8 bg-white/10 hidden sm:block" />

                            <button
                                onClick={() => setIsLangModalOpen(true)}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-[#FFD700]/50 text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:bg-white/10"
                            >
                                <span>🌐</span>
                                <span>{selectedLanguage}</span>
                                <ChevronDown size={14} className="text-gray-500" />
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    setSongs([]);
                                    setLoading(true);
                                    fetchSongs();
                                }}
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#FFD700]/20"
                            >
                                {loading ? (
                                    <Loader2 size={15} className="animate-spin" />
                                ) : (
                                    <Sparkles size={15} />
                                )}
                                {loading ? "Loading..." : "Discover"}
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
                </div>

                {/* ── Content ──────────────────────────────────────────────────────── */}
                <div className="px-6 md:px-10 mt-6 space-y-12">
                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm"
                            >
                                <span className="text-lg">⚠️</span>
                                {error}
                                <button
                                    onClick={fetchSongs}
                                    className="ml-auto underline hover:text-red-300"
                                >
                                    Retry
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading skeletons */}
                    {loading && (
                        <>
                            <div>
                                <div className="h-6 bg-white/5 rounded-full w-64 mb-6 animate-pulse" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="h-6 bg-white/5 rounded-full w-56 mb-6 animate-pulse" />
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <SkeletonCard key={i} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Empty state */}
                    {!loading && hasFetched && songs.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24"
                        >
                            <Music2 size={48} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-400 text-lg font-medium">
                                No songs found
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                Try a different mood or language.
                            </p>
                        </motion.div>
                    )}

                    {/* ── Section 1: Mood Songs ─────────────────────────────────────── */}
                    {!loading && moodSongs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <SectionHeader
                                icon={Sparkles}
                                title={`Because you're feeling ${currentMood.label}`}
                                subtitle={`Handpicked for your ${currentMood.label.toLowerCase()} mood`}
                                accentColor={currentMood.color}
                            />
                            <SongsGrid
                                sectionId={`mood-${currentMood.id}`}
                                songs={moodSongs}
                                activeSongId={currentSong?.id}
                                isPlaying={isPlaying}
                                onCardClick={handleCardClick}
                                onAddToPlaylist={handleOpenPlaylistModal}
                            />
                        </motion.div>
                    )}

                    {/* ── Section 2: Trending Language Songs ───────────────────────── */}
                    {!loading && trendingSongs.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <SectionHeader
                                icon={TrendingUp}
                                title={`Trending ${selectedLanguage} Hits`}
                                subtitle={`Most-played ${selectedLanguage} tracks right now`}
                                accentColor="#FFD700"
                            />
                            <SongsGrid
                                sectionId={`trending-${selectedLanguage}`}
                                songs={trendingSongs}
                                activeSongId={currentSong?.id}
                                isPlaying={isPlaying}
                                onCardClick={handleCardClick}
                                onAddToPlaylist={handleOpenPlaylistModal}
                            />
                        </motion.div>
                    )}
                </div>
            </div>

            <LanguageModal
                isOpen={isLangModalOpen}
                onClose={() => setIsLangModalOpen(false)}
                selectedLanguage={selectedLanguage}
                onSelect={(lang) => {
                    if (lang !== selectedLanguage) {
                        setSongs([]);
                        setLoading(true);
                        setSelectedLanguage(lang);
                    }
                }}
                languages={LANGUAGES}
            />
        </>
    );
}
