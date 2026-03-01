import React from "react";
import { Play, Heart, MoreHorizontal, Shuffle } from "lucide-react";
import { TRACKS } from "../data/mockData";

export default function Playlist() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-yellow-900/10 via-background to-background pb-32">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-end gap-8 p-8 md:p-12 pb-8">
                <div className="relative group">
                    <img
                        src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&q=80"
                        alt="Playlist Cover"
                        className="w-64 h-64 md:w-72 md:h-72 shadow-2xl shadow-black/60 rounded-lg object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Play fill="white" size={64} className="text-white drop-shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                </div>

                <div className="flex flex-col gap-3 text-foreground">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Curated Playlist</span>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none">Daily Mix 1</h1>
                    <p className="text-secondary text-lg font-medium max-w-2xl">
                        A perfect blend of M83, The Weeknd, Daft Punk, Dua Lipa and more to start your day.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 font-medium">
                        <span className="text-white hover:underline cursor-pointer">Walkman Editors</span>
                        <span>•</span>
                        <span>Updated yesterday</span>
                        <span>•</span>
                        <span>50 songs, 3 hr 15 min</span>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="px-8 md:px-12 py-4 flex items-center gap-4 border-b border-white/5 sticky top-[64px] z-30 bg-background/95 backdrop-blur-md">
                <button className="flex items-center gap-2 bg-primary hover:bg-primary/80 text-black px-8 py-3 rounded-md font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Play fill="currentColor" size={20} />
                    Play
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-md font-bold text-sm transition-all hover:scale-105 active:scale-95">
                    <Shuffle size={18} />
                    Shuffle
                </button>
                <div className="flex-1"></div>
                <button className="p-3 text-gray-400 hover:text-primary hover:bg-white/5 rounded-full transition-all">
                    <Heart size={24} />
                </button>
                <button className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all">
                    <MoreHorizontal size={24} />
                </button>
            </div>

            {/* Grid View (Apple Music Style) */}
            <div className="px-8 md:px-12 pt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Tracks</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {TRACKS.concat(TRACKS).concat(TRACKS).map((track, i) => (
                        <div
                            key={`${track.id}-${i}`}
                            className="group relative bg-card p-4 rounded-xl hover:bg-card-hover transition-colors duration-300 cursor-pointer"
                        >
                            <div className="relative aspect-square overflow-hidden rounded-lg mb-4 shadow-lg">
                                <img
                                    src={track.image}
                                    alt={track.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Play Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                                    <span className="text-white/80 text-xs font-mono">{track.duration}</span>
                                    <button className="bg-primary hover:scale-110 text-white rounded-full p-2 shadow-lg transition-transform transform translate-y-4 group-hover:translate-y-0">
                                        <Play fill="currentColor" size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-white font-bold text-base truncate pr-2 group-hover:text-primary transition-colors">
                                    {track.title}
                                </h3>
                                <p className="text-gray-400 text-sm truncate hover:underline">
                                    {track.artist}
                                </p>
                                <p className="text-gray-600 text-xs truncate">
                                    {track.album}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
