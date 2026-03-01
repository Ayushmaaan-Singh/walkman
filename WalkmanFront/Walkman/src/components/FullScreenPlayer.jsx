import React, { useRef, useState, useEffect } from "react";
import ColorThief from "colorthief";
import { motion } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Repeat, Shuffle } from "lucide-react";
import "./FullScreenPlayer.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(s) {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function FullScreenPlayer({
    song,
    isPlaying,
    progress,
    currentTime,
    duration,
    onTogglePlay,
    onCollapse,
    onNext,
    onPrev,
    onSeek
}) {
    const [gradientColor, setGradientColor] = useState({ r: 20, g: 20, b: 20 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragAngle, setDragAngle] = useState(0);
    const imgRef = useRef(null);
    const vinylRef = useRef(null);

    // Extract colors via ColorThief
    useEffect(() => {
        if (!song?.thumbnailUrl) return;

        const img = imgRef.current;
        if (!img) return;

        const thief = new ColorThief();

        const handleLoad = () => {
            try {
                const color = thief.getColor(img);
                setGradientColor({ r: color[0], g: color[1], b: color[2] });
            } catch (e) {
                console.error("Color extraction failed", e);
                setGradientColor({ r: 20, g: 20, b: 20 });
            }
        };

        if (img.complete && img.naturalWidth > 0) {
            handleLoad();
        } else {
            img.addEventListener("load", handleLoad);
            return () => img.removeEventListener("load", handleLoad);
        }
    }, [song]);

    if (!song) return null;

    const { r, g, b } = gradientColor;

    const handleProgressClick = (e) => {
        if (!onSeek) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        onSeek(pct * duration);
    };

    // ── Vinyl Rotation Seeking ──────────────────────────────────────────────
    const handleVinylInteraction = (e) => {
        if (!vinylRef.current || !onSeek) return;

        const rect = vinylRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;

        // Calculate angle in degrees (0 is top, clockwise)
        let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;

        setDragAngle(angle);
        const pct = angle / 360;
        onSeek(pct * duration);
    };

    const handleStartDragging = (e) => {
        setIsDragging(true);
        handleVinylInteraction(e);
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMove = (e) => handleVinylInteraction(e);
        const handleEnd = () => setIsDragging(false);

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseup", handleEnd);
        window.addEventListener("touchmove", handleMove);
        window.addEventListener("touchend", handleEnd);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("mouseup", handleEnd);
            window.removeEventListener("touchmove", handleMove);
            window.removeEventListener("touchend", handleEnd);
        };
    }, [isDragging]);

    return (
        <div
            className="player-overlay animate-in fade-in zoom-in-95 duration-700"
            style={{
                background: `linear-gradient(to bottom, rgb(${r},${g},${b}), rgb(${Math.round(r * 0.2)},${Math.round(g * 0.2)},${Math.round(b * 0.2)}))`
            }}
        >
            {/* Ambient Background Particles/Glow */}
            <div className="ambient-background">
                <div
                    className="glow-orb"
                    style={{ backgroundColor: `rgb(${r},${g},${b})`, opacity: isPlaying ? 0.3 : 0.1 }}
                />
            </div>

            {/* Dynamic Background Blur Layer */}
            <div
                className="bg-glow"
                style={{
                    backgroundImage: `url(${song.thumbnailUrl})`,
                    opacity: 0.15
                }}
            />

            {/* Close Button */}
            <button
                onClick={onCollapse}
                className="absolute top-8 left-8 z-50 text-white/40 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all active:scale-95"
                aria-label="Close"
            >
                <ChevronDown size={32} />
            </button>

            <div className="player-container centered-view">
                <div className="player-content-wrapper">
                    {/* Centered Album Art / Vinyl */}
                    <motion.div
                        ref={vinylRef}
                        className={`vinyl-wrapper ${isDragging ? 'dragging' : ''}`}
                        onMouseDown={handleStartDragging}
                        onTouchStart={handleStartDragging}
                        animate={{
                            y: isPlaying && !isDragging ? [0, -15, 0] : 0,
                            rotate: isDragging ? dragAngle : (isPlaying ? 360 : 0)
                        }}
                        transition={{
                            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                            rotate: isDragging ? { type: "tween", ease: "linear", duration: 0 } : { repeat: Infinity, duration: 20, ease: "linear" }
                        }}
                    >
                        <div className={`vinyl-disc ${isPlaying ? 'playing' : ''}`} />
                        <div className="relative z-10 art-container">
                            <motion.img
                                ref={imgRef}
                                src={song.thumbnailUrl}
                                alt={song.title}
                                className="album-art"
                                crossOrigin="anonymous"
                                animate={{ scale: isPlaying ? 1.05 : 1 }}
                                transition={{ duration: 0.5 }}
                                onError={(e) => {
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(song.title)}&background=1a1a1a&color=FFD700&size=400&bold=true&font-size=0.3`;
                                }}
                            />
                            {/* Inner Circle Shadow */}
                            <div className="vinyl-inner-shadow" />
                        </div>
                    </motion.div>

                    <div className="track-info">
                        <motion.h2
                            className="track-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {song.title}
                        </motion.h2>
                        <motion.p
                            className="track-artist"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {song.artistName}
                        </motion.p>
                    </div>

                    {/* Progress Bar */}
                    <div className="progress-container">
                        <div className="progress-track" onClick={handleProgressClick}>
                            <motion.div
                                className="progress-fill"
                                style={{ width: `${progress}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-zinc-500/60 mt-3 font-bold tracking-widest uppercase">
                            <span>{fmt(currentTime)}</span>
                            <span>{fmt(duration)}</span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="controls">
                        <button className="control-btn-secondary"><Shuffle size={20} /></button>
                        <button className="control-btn" onClick={onPrev}>
                            <SkipBack size={28} fill="white" />
                        </button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="play-btn-large"
                            onClick={onTogglePlay}
                        >
                            {isPlaying ? (
                                <Pause size={32} fill="black" />
                            ) : (
                                <Play size={32} fill="black" className="ml-1" />
                            )}
                        </motion.button>

                        <button className="control-btn" onClick={onNext}>
                            <SkipForward size={28} fill="white" />
                        </button>
                        <button className="control-btn-secondary"><Repeat size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
