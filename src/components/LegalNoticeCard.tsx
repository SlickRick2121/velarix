import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";

const LegalNoticeCard = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          damping: 25,
          stiffness: 120,
          delay: 0.5 
        }}
        className={cn(
          "pointer-events-auto max-w-2xl w-full",
          "bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl",
          "relative overflow-hidden group"
        )}
      >
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-500" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldAlert className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-wider">Dutch / NL Politie:</h2>
          </div>

          <div className="space-y-6 text-gray-300">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <span className="text-gray-500 text-xs uppercase font-bold block mb-1">Reference Number (RN)</span>
              <p className="text-primary font-mono text-lg font-bold">260129-PS182481438</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <span className="text-primary font-bold">1.</span>
                <p>Please stop crawling / crawl attempting my website.</p>
              </div>

              <div className="flex gap-4">
                <span className="text-primary font-bold">2.</span>
                <p>
                  We are done here, I have a <span className="text-white font-semibold">.rar archive</span> full of texts and evidence of suggesting at extortion / blackmail regarding my new job, Suicidal persuasion, Mocking, Bullying, etc.
                </p>
              </div>

              <div className="flex gap-4">
                <span className="text-primary font-bold">3.</span>
                <p>
                  I would prefer to leave this at a petty civil case and simply obey the request of no-communication <span className="font-bold text-white uppercase italic">FROM BOTH PARTIES FOREVER</span>.
                </p>
              </div>

              <div className="flex gap-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <span className="text-red-400 font-bold">4.</span>
                <p className="text-red-100 font-medium">
                  Please remember the <span className="font-bold underline">BOTH PARTIES</span>. if she contacts me again, I will be reporting it.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
             <button 
              onClick={() => {
                const card = document.getElementById('legal-notice-card');
                if (card) card.style.display = 'none';
              }}
              className="px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/50 text-primary rounded-lg transition-all duration-300 uppercase text-sm font-bold tracking-widest"
             >
                Acknowledge
             </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LegalNoticeCard;
