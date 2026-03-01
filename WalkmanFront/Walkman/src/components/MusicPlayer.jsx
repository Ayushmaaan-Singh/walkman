import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import ColorThief from "colorthief";
import { usePlayer } from "../context/PlayerContext";
import FullScreenPlayer from "./FullScreenPlayer";

// ─── Progress Hook ────────────────────────────────────────────────────────────

function useAudioProgress(audioRef) {
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onTimeUpdate = () => {
            const pct = audio.duration
                ? (audio.currentTime / audio.duration) * 100
                : 0;
            setProgress(isNaN(pct) ? 0 : pct);
            setCurrentTime(audio.currentTime);
        };
        const onLoadedMetadata = () => setDuration(audio.duration || 0);

        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        return () => {
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
        };
    }, [audioRef]);

    return { progress, currentTime, duration };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(s) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Seakable Progress Bar ────────────────────────────────────────────────────

function ProgressBar({ progress, currentTime, duration, audioRef }) {
    const handleSeek = useCallback(
        (e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            if (audioRef.current?.duration) {
                audioRef.current.currentTime = pct * audioRef.current.duration;
            }
        },
        [audioRef]
    );

    return (
        <div className="flex items-center gap-3 w-full px-1">
            <span className="text-xs font-mono w-9 text-right select-none" style={{ color: "rgba(255,255,255,0.5)" }}>
                {fmt(currentTime)}
            </span>
            <div
                className="relative flex-1 h-1 rounded-full cursor-pointer group"
                style={{ background: "rgba(255,255,255,0.15)" }}
                onClick={handleSeek}
            >
                <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-100 bg-[#FFD700]"
                    style={{ width: `${progress}%` }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#FFD700] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ left: `calc(${progress}% - 6px)` }}
                />
            </div>
            <span className="text-xs font-mono w-9 select-none" style={{ color: "rgba(255,255,255,0.5)" }}>
                {fmt(duration)}
            </span>
        </div>
    );
}

// ─── Minimized Bar ────────────────────────────────────────────────────────────

function MinimizedBar({ song, isPlaying, progress, currentTime, duration, onTogglePlay, onExpand, onNext, onPrev }) {
    return (
        <div className="flex flex-col cursor-pointer" onClick={onExpand}>
            {/* Thin gold progress indicator at very top */}
            <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                    className="h-full bg-[#FFD700] transition-all duration-100"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex items-center gap-4 px-5 py-3">
                {/* Thumbnail w/ sound bars */}
                <div className="relative flex-shrink-0">
                    <img
                        src={song.thumbnailUrl}
                        alt={song.title}
                        className="w-11 h-11 rounded-lg object-cover"
                        onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&background=1a1a1a&color=FFD700&size=80&bold=true`;
                        }}
                    />
                    {isPlaying && (
                        <div className="absolute inset-0 flex items-end justify-center pb-1 gap-[2px]">
                            {[1, 2, 3].map((i) => (
                                <span
                                    key={i}
                                    className="w-[3px] bg-[#FFD700] rounded-full opacity-90"
                                    style={{
                                        height: `${30 + i * 15}%`,
                                        animation: `soundBar 0.6s ease-in-out infinite alternate`,
                                        animationDelay: `${i * 0.12}s`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Song info */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate leading-tight">{song.title}</p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{song.artistName}</p>
                </div>

                {/* Time */}
                <span className="hidden sm:block text-xs font-mono flex-shrink-0" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {fmt(currentTime)} / {fmt(duration)}
                </span>

                {/* Controls — stops click from expanding */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrev(); }}
                        className="text-white hover:text-[#FFD700] transition-colors"
                    >
                        <SkipBack size={20} fill="currentColor" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
                        className="w-10 h-10 rounded-full bg-[#FFD700] flex items-center justify-center hover:bg-[#FFD700]/90 transition-colors flex-shrink-0 shadow-lg shadow-[#FFD700]/20"
                    >
                        {isPlaying
                            ? <Pause fill="black" size={16} color="black" />
                            : <Play fill="black" size={16} color="black" className="ml-0.5" />}
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); onNext(); }}
                        className="text-white hover:text-[#FFD700] transition-colors"
                    >
                        <SkipForward size={20} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main MusicPlayer ─────────────────────────────────────────────────────────

export default function MusicPlayer() {
    const {
        currentSong,
        isPlaying,
        isExpanded,
        audioRef,
        togglePlayPause,
        toggleExpanded,
        collapsePlayer,
        nextSong,
        prevSong,
    } = usePlayer();

    const { progress, currentTime, duration } = useAudioProgress(audioRef);

    if (!currentSong) return null;

    console.log("MusicPlayer: Rendering for song", currentSong.id, "expanded:", isExpanded);

    return (
        <>
            <style>{`
                @keyframes soundBar {
                    from { transform: scaleY(0.35); }
                    to   { transform: scaleY(1); }
                }
            `}</style>

            {/* Dark backdrop when expanded */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={collapsePlayer}
                    />
                )}
            </AnimatePresence>

            {/* Player shell */}
            <motion.div
                layout
                initial={{ y: 100, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1,
                    // Handle the left offset explicitly to avoid Framer Motion sticky styles
                    left: isExpanded ? 0 : (window.innerWidth >= 768 ? 256 : 0),
                    top: isExpanded ? 0 : "auto",
                    bottom: 0,
                    right: 0,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className={`fixed z-50 overflow-hidden ${!isExpanded ? "h-auto" : "h-screen"}`}
                style={{
                    background: isExpanded ? "transparent" : "rgba(14,14,14,0.97)",
                    backdropFilter: isExpanded ? "none" : "blur(24px)",
                    borderTop: isExpanded ? "none" : "1px solid rgba(255,255,255,0.07)",
                    zIndex: isExpanded ? 100 : 50
                }}
            >
                <AnimatePresence mode="wait">
                    {isExpanded ? (
                        <FullScreenPlayer
                            key="expanded"
                            song={currentSong}
                            isPlaying={isPlaying}
                            progress={progress}
                            currentTime={currentTime}
                            duration={duration}
                            onTogglePlay={togglePlayPause}
                            onCollapse={collapsePlayer}
                            onNext={nextSong}
                            onPrev={prevSong}
                            onSeek={(time) => {
                                if (audioRef.current) {
                                    audioRef.current.currentTime = time;
                                }
                            }}
                        />
                    ) : (
                        <motion.div
                            key="minimized"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MinimizedBar
                                song={currentSong}
                                isPlaying={isPlaying}
                                progress={progress}
                                currentTime={currentTime}
                                duration={duration}
                                audioRef={audioRef}
                                onTogglePlay={togglePlayPause}
                                onExpand={toggleExpanded}
                                onNext={nextSong}
                                onPrev={prevSong}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
