import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Loader2, Music2, Mic2, Disc3, Play, Pause, Volume2, X, Plus } from "lucide-react";
import api from "../api/axios";
import { usePlayer } from "../context/PlayerContext";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

// ─── Badge config per type ─────────────────────────────────────────────────────

const TYPE_BADGE = {
    track: {
        label: "Track",
        icon: Music2,
        className: "bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/30",
    },
    collection: {
        label: "Album",
        icon: Disc3,
        className: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
    },
    artist: {
        label: "Artist",
        icon: Mic2,
        className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    },
};

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white/4 animate-pulse">
            <div className="aspect-square bg-white/8" />
            <div className="p-3 space-y-2">
                <div className="h-3 bg-white/8 rounded-full w-3/4" />
                <div className="h-2.5 bg-white/5 rounded-full w-1/2" />
                <div className="h-4 bg-white/5 rounded-full w-1/4 mt-1" />
            </div>
        </div>
    );
}

// ─── Result Card ───────────────────────────────────────────────────────────────

function ResultCard({ result, index, activeSongId, isPlaying, onCardClick, onAddToPlaylist }) {
    const getFlattenedId = (id) => typeof id === 'object' ? id.songId : id;
    const isTrack = result.type === "track";
    const isActive = isTrack && getFlattenedId(activeSongId) === getFlattenedId(result.id);
    const showPause = isActive && isPlaying;
    const badge = TYPE_BADGE[result.type] || TYPE_BADGE.track;
    const BadgeIcon = badge.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
            className={`group relative bg-white/4 hover:bg-white/8 border rounded-2xl overflow-hidden transition-all duration-300 ${isTrack ? "cursor-pointer" : "cursor-default"
                } ${isActive ? "border-[#FFD700]/30" : "border-white/6 hover:border-white/15"}`}
            onClick={() => isTrack && onCardClick(result)}
        >
            {/* Thumbnail */}
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={result.thumbnailUrl}
                    alt={result.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            result.title
                        )}&background=1a1a1a&color=FFD700&size=256&bold=true&font-size=0.4`;
                    }}
                />

                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Play / Pause button — only for tracks */}
                {isTrack && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {showPause ? (
                                <motion.div
                                    key="pause"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/40"
                                >
                                    <Pause fill="black" size={18} color="black" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="play"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 0 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="w-12 h-12 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                >
                                    <Play fill="black" size={18} color="black" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Sound-bar animation when active */}
                {isActive && isPlaying && (
                    <div className="absolute top-3 right-3 flex items-end gap-0.5 h-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-1 bg-[#FFD700] rounded-full"
                                style={{
                                    height: `${40 + i * 20}%`,
                                    animation: "soundBar 0.8s ease-in-out infinite alternate",
                                    animationDelay: `${i * 0.15}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Preview label — only for tracks */}
                {isTrack && (
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <span className="bg-black/70 backdrop-blur-sm text-[10px] text-gray-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Volume2 size={9} />
                            30s
                        </span>
                    </div>
                )}

                {/* Add to Playlist Button */}
                {isTrack && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToPlaylist(result);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700] transition-all duration-200"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            {/* Card info */}
            <div className="p-3">
                {/* Type badge */}
                <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${badge.className}`}
                >
                    <BadgeIcon size={9} />
                    {badge.label}
                </span>

                <h4
                    className={`font-semibold text-sm truncate mb-0.5 transition-colors duration-200 ${isActive
                        ? "text-[#FFD700]"
                        : "text-white group-hover:text-[#FFD700]"
                        }`}
                >
                    {result.title}
                </h4>
                <p className="text-xs text-gray-400 truncate">{result.artistName}</p>
                {result.albumName && (
                    <p className="text-xs text-gray-600 truncate mt-0.5">{result.albumName}</p>
                )}
            </div>
        </motion.div>
    );
}

// ─── Main Search Component ─────────────────────────────────────────────────────

export default function Search() {
    const [query, setQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSong, setSelectedSong] = useState(null);

    const { playSong, pauseSong, currentSong, isPlaying } = usePlayer();
    const inputRef = useRef(null);

    // ── Fetch ────────────────────────────────────────────────────────────────────
    const handleSearch = useCallback(
        async (overrideQuery) => {
            const q = (overrideQuery ?? query).trim();
            if (!q) return;
            setLoading(true);
            setError(null);
            setHasSearched(true);
            try {
                const { data } = await api.get("/search", { params: { q } });
                setSearchResults(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                    "Couldn't complete the search. Please try again."
                );
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        },
        [query]
    );

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const handleClear = () => {
        setQuery("");
        setSearchResults([]);
        setHasSearched(false);
        setError(null);
        inputRef.current?.focus();
    };

    // ── Card click ───────────────────────────────────────────────────────────────
    const handleCardClick = useCallback(
        (result) => {
            if (result.type !== "track") return;
            console.log("Playing track:", result);
            if (!result.previewUrl) {
                console.warn("Missing previewUrl for track:", result.id);
            }

            const trackList = searchResults.filter(r => r.type === "track");

            if (currentSong?.id === result.id) {
                isPlaying ? pauseSong() : playSong(result, trackList);
            } else {
                playSong(result, trackList);
            }
        },
        [currentSong, isPlaying, playSong, pauseSong, searchResults]
    );

    const handleOpenPlaylistModal = useCallback((song) => {
        setSelectedSong(song);
        setIsModalOpen(true);
    }, []);

    // ── Render ───────────────────────────────────────────────────────────────────
    return (
        <>
            <style>{`
                @keyframes soundBar {
                    from { transform: scaleY(0.4); }
                    to   { transform: scaleY(1); }
                }
            `}</style>

            <div className="min-h-screen text-white pb-36">
                {/* ── Hero / Search bar ──────────────────────────────────────────── */}
                <div className="relative overflow-hidden">
                    {/* Ambient background glow */}
                    <div className="absolute inset-0 opacity-10"
                        style={{
                            background:
                                "radial-gradient(ellipse 80% 60% at 50% -20%, #FFD700, transparent)",
                        }}
                    />

                    <div className="relative z-10 px-6 md:px-10 pt-10 pb-8">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mb-1">
                                Discover
                            </p>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Find your{" "}
                                <span className="text-[#FFD700]">sound</span>
                            </h1>
                        </motion.div>

                        {/* Search Input */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-3 max-w-2xl"
                        >
                            <div className="relative flex-1">
                                <SearchIcon
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                                />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    id="search-input"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search songs, albums, artists…"
                                    className="w-full bg-white/6 border border-white/10 hover:border-white/20 focus:border-[#FFD700]/50 focus:outline-none focus:ring-0 text-white placeholder-gray-500 rounded-2xl pl-11 pr-10 py-3.5 text-sm font-medium transition-all duration-200 backdrop-blur-sm"
                                />
                                {/* Clear button */}
                                <AnimatePresence>
                                    {query && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.7 }}
                                            transition={{ duration: 0.15 }}
                                            onClick={handleClear}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                        >
                                            <X size={16} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Search button */}
                            <motion.button
                                id="search-submit-btn"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => handleSearch()}
                                disabled={loading || !query.trim()}
                                className="flex items-center gap-2 bg-[#FFD700] hover:bg-[#FFD700]/90 text-black px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FFD700]/20 whitespace-nowrap"
                            >
                                {loading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <SearchIcon size={16} />
                                )}
                                {loading ? "Searching…" : "Search"}
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent" />
                </div>

                {/* ── Content ────────────────────────────────────────────────────── */}
                <div className="px-6 md:px-10 mt-6">
                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl px-4 py-3 text-sm mb-6"
                            >
                                <span className="text-lg">⚠️</span>
                                {error}
                                <button
                                    onClick={() => handleSearch()}
                                    className="ml-auto underline hover:text-red-300"
                                >
                                    Retry
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading skeletons — 10 cards */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        >
                            {Array.from({ length: 10 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </motion.div>
                    )}

                    {/* Results grid */}
                    {!loading && searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Result count */}
                            <p className="text-sm text-gray-500 mb-5">
                                <span className="text-white font-semibold">
                                    {searchResults.length}
                                </span>{" "}
                                result{searchResults.length !== 1 ? "s" : ""} for{" "}
                                <span className="text-[#FFD700] font-semibold">
                                    &ldquo;{query}&rdquo;
                                </span>
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {searchResults.map((result, i) => (
                                    <ResultCard
                                        key={result.type === 'track' ? `track-${result.id}` : `${result.type}-${result.id}`}
                                        result={result}
                                        index={i}
                                        activeSongId={currentSong?.id}
                                        isPlaying={isPlaying}
                                        onCardClick={handleCardClick}
                                        onAddToPlaylist={handleOpenPlaylistModal}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Empty state — after a search with no results */}
                    {!loading && hasSearched && searchResults.length === 0 && !error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-24"
                        >
                            <Music2 size={48} className="mx-auto text-gray-700 mb-4" />
                            <p className="text-gray-400 text-lg font-medium">
                                No results found
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                Try different keywords or check spelling.
                            </p>
                        </motion.div>
                    )}

                    {/* Welcome state — before any search */}
                    {!loading && !hasSearched && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center py-24"
                        >
                            <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 flex items-center justify-center mx-auto mb-5">
                                <SearchIcon size={32} className="text-[#FFD700]/60" />
                            </div>
                            <p className="text-gray-400 text-lg font-medium">
                                Start searching
                            </p>
                            <p className="text-gray-600 text-sm mt-1">
                                Search for tracks, albums, or artists.
                            </p>
                        </motion.div>
                    )}
                </div>
            </div>

            <AddToPlaylistModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                song={selectedSong}
            />
        </>
    );
}
