import React, { createContext, useContext, useRef, useState, useCallback, useEffect } from "react";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const audioRef = useRef(new Audio());

    const pauseSong = useCallback(() => {
        audioRef.current.pause();
        setIsPlaying(false);
    }, []);

    const resumeSong = useCallback(() => {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { });
    }, []);

    const nextSong = useCallback(() => {
        if (queue.length > 0 && currentIndex < queue.length - 1) {
            const nextIdx = currentIndex + 1;
            setCurrentIndex(nextIdx);
            setCurrentSong(queue[nextIdx]);
        }
    }, [queue, currentIndex]);

    const prevSong = useCallback(() => {
        if (queue.length > 0 && currentIndex > 0) {
            const prevIdx = currentIndex - 1;
            setCurrentIndex(prevIdx);
            setCurrentSong(queue[prevIdx]);
        }
    }, [queue, currentIndex]);

    // Wire up global ended listener once
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => {
            console.log("PlayerContext: Song ended");
            if (queue.length > 0 && currentIndex < queue.length - 1) {
                console.log("PlayerContext: Auto-playing next song in queue");
                nextSong();
            } else {
                setIsPlaying(false);
            }
        };
        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("ended", handleEnded);
            audio.pause();
            audio.src = "";
        };
    }, [queue, currentIndex, nextSong]); // Added nextSong to dependencies

    // Auto-play whenever currentSong changes
    useEffect(() => {
        if (!currentSong?.previewUrl) {
            console.log("PlayerContext: No song or previewUrl provided", currentSong);
            return;
        }
        console.log("PlayerContext: Attempting to play", currentSong.previewUrl);
        const audio = audioRef.current;
        audio.pause();
        audio.src = currentSong.previewUrl;
        audio.load();
        audio
            .play()
            .then(() => {
                console.log("PlayerContext: Playback started successfully");
                setIsPlaying(true);
            })
            .catch((e) => {
                console.error("PlayerContext: Playback error:", e);
                setIsPlaying(false);
            });
    }, [currentSong]);

    const playSong = useCallback((song, contextList = []) => {
        if (!song) return;
        console.log("PlayerContext: playSong triggered for", song.id);

        if (contextList && contextList.length > 0) {
            setQueue(contextList);
            const idx = contextList.findIndex(s => s.id === song.id);
            setCurrentIndex(idx !== -1 ? idx : 0);
        } else {
            setQueue([song]);
            setCurrentIndex(0);
        }

        // Same song → just resume
        if (currentSong?.id == song.id) {
            audioRef.current.play()
                .then(() => {
                    console.log("PlayerContext: Resumed existing song");
                    setIsPlaying(true);
                })
                .catch((e) => console.error("PlayerContext: Resume error", e));
            return;
        }
        setCurrentSong(song);
    }, [currentSong]);

    const playPlaylist = useCallback((songs, startIndex = 0) => {
        if (!songs || songs.length === 0) return;
        console.log("PlayerContext: playPlaylist triggered with", songs.length, "songs");
        setQueue(songs);
        setCurrentIndex(startIndex);
        setCurrentSong(songs[startIndex]);
    }, []);

    const togglePlayPause = useCallback(() => {
        if (isPlaying) {
            pauseSong();
        } else {
            resumeSong();
        }
    }, [isPlaying, pauseSong, resumeSong]);

    const toggleExpanded = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const collapsePlayer = useCallback(() => {
        setIsExpanded(false);
    }, []);


    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                isPlaying,
                isExpanded,
                queue,
                currentIndex,
                audioRef,
                playSong,
                playPlaylist,
                nextSong,
                prevSong,
                pauseSong,
                resumeSong,
                togglePlayPause,
                toggleExpanded,
                collapsePlayer,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const ctx = useContext(PlayerContext);
    if (!ctx) throw new Error("usePlayer must be used within a <PlayerProvider>");
    return ctx;
}

export default PlayerProvider;

