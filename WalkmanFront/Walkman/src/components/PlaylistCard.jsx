import React from "react";
import { motion } from "framer-motion";
import { Music2, Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function PlaylistCard({ playlist, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="group relative"
        >
            <Link to={`/playlist/${playlist.id}`}>
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 border border-white/5 bg-zinc-900 group-hover:border-[#FFD700]/30 transition-all duration-300 shadow-lg group-hover:shadow-[#FFD700]/10">
                    {playlist.thumbnailUrl ? (
                        <img
                            src={playlist.thumbnailUrl}
                            alt={playlist.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 text-zinc-600">
                            <Music2 size={64} className="group-hover:text-[#FFD700]/40 transition-colors" />
                        </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-14 h-14 rounded-full bg-[#FFD700] flex items-center justify-center shadow-lg shadow-[#FFD700]/40 translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                        >
                            <Play fill="black" size={24} className="ml-1" />
                        </motion.div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-[#FFD700] uppercase tracking-wider">
                            {playlist.mood}
                        </span>
                    </div>
                </div>

                <h3 className="text-white font-bold truncate group-hover:text-[#FFD700] transition-colors">
                    {playlist.name}
                </h3>
                <p className="text-zinc-500 text-sm truncate">
                    {playlist.count || 0} tracks
                </p>
            </Link>
        </motion.div>
    );
}
