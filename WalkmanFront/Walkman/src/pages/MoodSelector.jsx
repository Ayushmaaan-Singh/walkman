import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smile, Frown, Zap, Coffee } from "lucide-react";

const moods = [
  {
    id: "happy",
    label: "HAPPY",
    icon: Smile,
    gradient: "from-yellow-400 to-orange-500",
    shadow: "shadow-orange-500/50",
    description: "Feeling great and ready to vibe.",
  },
  {
    id: "sad",
    label: "SAD",
    icon: Frown,
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/50",
    description: "Need some comfort tunes.",
  },
  {
    id: "pumped",
    label: "PUMPED",
    icon: Zap,
    gradient: "from-red-500 to-purple-600",
    shadow: "shadow-red-500/50",
    description: "Time to get energetic!",
  },
  {
    id: "chill",
    label: "CHILL",
    icon: Coffee,
    gradient: "from-emerald-400 to-teal-600",
    shadow: "shadow-teal-500/50",
    description: "Relaxing and unwinding.",
  },
];

export default function MoodSelector() {
  const navigate = useNavigate();

  const handleSelectMood = (moodId) => {
    // Save mood to local storage or context if needed
    console.log("Selected mood:", moodId);
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80 z-0" />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-12"
      >
        <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          How are you feeling?
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
          Select your mood to customize your listening experience.
        </p>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl px-4">
        {moods.map((mood, index) => (
          <motion.button
            key={mood.id}
            onClick={() => handleSelectMood(mood.id)}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative h-80 rounded-2xl p-6 flex flex-col justify-between overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-transparent transition-colors duration-300`}
          >
            {/* Hover Gradient Background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
            />
            
            {/* Icon */}
            <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${mood.gradient} ${mood.shadow} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <mood.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <div className="text-left z-10">
              <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors duration-300">
                {mood.label}
              </h3>
              <p className="text-gray-400 text-sm group-hover:text-gray-200 transition-colors duration-300">
                {mood.description}
              </p>
            </div>

            {/* Glowing orb effect on hover */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${mood.gradient} rounded-full blur-[60px] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
