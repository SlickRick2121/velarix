import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const VeroeLink = () => {
    return (
        <motion.a
            href="https://veroe.space"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="fixed left-6 bottom-10 z-[50] flex items-center gap-3 px-4 py-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-primary/50 transition-all duration-300 group"
        >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center overflow-hidden">
                <span className="text-white font-bold text-xs">V</span>
            </div>
            <div className="flex flex-col">
                <span className="text-white text-xs font-bold tracking-wider uppercase group-hover:text-primary transition-colors">Veroe</span>
                <span className="text-[10px] text-gray-400 group-hover:text-gray-300 transition-colors flex items-center gap-1">
                    Explore Space <ExternalLink className="w-2 h-2" />
                </span>
            </div>

            {/* Decorative pulse effect */}
            <div className="absolute inset-0 rounded-full bg-primary/20 scale-100 opacity-0 group-hover:animate-ping pointer-events-none" />
        </motion.a>
    );
};

export default VeroeLink;
