import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Languages, Check } from "lucide-react";

export default function LanguageModal({ isOpen, onClose, selectedLanguage, onSelect, languages }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700]">
                                    <Languages size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Select Language</h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">Recommendations will update</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-3 grid grid-cols-1 gap-1">
                            {languages.map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => {
                                        onSelect(lang);
                                        onClose();
                                    }}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${selectedLanguage === lang
                                            ? "bg-[#FFD700]/10 text-[#FFD700] ring-1 ring-[#FFD700]/30"
                                            : "hover:bg-white/5 text-zinc-400 hover:text-white"
                                        }`}
                                >
                                    <span className="font-semibold text-sm">{lang}</span>
                                    {selectedLanguage === lang && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-5 h-5 rounded-full bg-[#FFD700] flex items-center justify-center text-black"
                                        >
                                            <Check size={12} strokeWidth={4} />
                                        </motion.div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Footer Spacer */}
                        <div className="h-4" />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
