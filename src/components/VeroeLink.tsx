import React from 'react';
import { motion } from 'framer-motion';
import { FileCode, ExternalLink, Sparkles } from 'lucide-react';

const VeroeLink = () => {
    return (
        <motion.a
            href="https://veroe.space"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 1.5
            }}
            whileHover={{ scale: 1.02, x: 8 }}
            whileTap={{ scale: 0.98 }}
            className="fixed left-8 bottom-12 z-[50] flex items-center gap-4 px-6 py-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:border-primary/40 hover:bg-black/60 transition-all duration-500 group overflow-hidden"
        >
            {/* Background Animated Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-gradient-x" />

            {/* Icon with orbital animation */}
            <div className="relative">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-primary/30 scale-150"
                />
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 relative z-10">
                    <FileCode className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
            </div>

            <div className="flex flex-col relative z-10">
                <div className="flex items-center gap-2">
                    <span className="text-white text-lg font-black tracking-tighter uppercase group-hover:text-primary transition-colors duration-300">
                        Veroe Paste
                    </span>
                    <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 font-medium tracking-wide group-hover:text-gray-200 transition-colors uppercase">
                        Encrypted Pastebin
                    </span>
                    <ExternalLink className="w-3 h-3 text-primary/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
            </div>

            {/* Corner Accent */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20" style={{ backgroundSize: '100% 2px, 3px 100%' }} />
        </motion.a>
    );
};

export default VeroeLink;
