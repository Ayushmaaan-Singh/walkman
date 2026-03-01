import React, { useState } from "react";
import { Play, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Maximize2 } from "lucide-react";
import FullScreenPlayer from "./FullScreenPlayer";

export default function PlayerBar() {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const currentTrack = {
        id: 3,
        title: "Get Lucky",
        artist: "Daft Punk",
        album: "Random Access Memories",
        duration: "6:09",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    };


    return (
        <>
            <FullScreenPlayer
                isOpen={isFullScreen}
                onClose={() => setIsFullScreen(false)}
                track={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
            />
            <div className="fixed bottom-0 left-0 right-0 h-24 bg-card border-t border-card-hover px-4 py-3 flex items-center justify-between z-50 text-foreground">
                {/* Current Song Info */}
                <div
                    className="flex items-center gap-4 w-1/3 cursor-pointer group"
                    onClick={() => setIsFullScreen(true)}
                >
                    <div className="relative">
                        <img
                            src={currentTrack.image}
                            alt="Album Art"
                            className="h-14 w-14 rounded object-cover group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 size={20} className="text-white drop-shadow-md" />
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <h4 className="text-sm font-semibold hover:underline cursor-pointer">{currentTrack.title}</h4>
                        <span className="text-xs text-secondary hover:underline cursor-pointer">{currentTrack.artist}</span>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center w-1/3 gap-2">
                    <div className="flex items-center gap-6">
                        <button className="text-gray-400 hover:text-white transition">
                            <Shuffle size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-white transition">
                            <SkipBack size={20} fill="currentColor" />
                        </button>
                        <button
                            className="bg-white text-black rounded-full p-2 hover:scale-105 transition"
                            onClick={() => setIsPlaying(!isPlaying)}
                        >
                            {isPlaying ? <span className="font-bold text-xs">❚❚</span> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button className="text-gray-400 hover:text-white transition">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                        <button className="text-gray-400 hover:text-white transition">
                            <Repeat size={16} />
                        </button>
                    </div>

                    <div className="flex items-center w-full gap-2 max-w-md">
                        <span className="text-xs text-secondary">0:00</span>
                        <div className="h-1 bg-secondary/30 rounded-full w-full relative group cursor-pointer">
                            <div className="absolute top-0 left-0 h-full w-1/3 bg-foreground group-hover:bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs text-secondary">4:03</span>
                    </div>
                </div>

                {/* Volume / Extra Controls */}
                <div className="flex items-center justify-end w-1/3 gap-4">
                    <Volume2 size={20} className="text-secondary" />
                    <div className="w-24 h-1 bg-secondary/30 rounded-full cursor-pointer relative group">
                        <div className="absolute top-0 left-0 h-full w-2/3 bg-foreground group-hover:bg-primary rounded-full"></div>
                    </div>
                </div>
            </div>
        </>
    );
}
