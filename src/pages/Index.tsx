import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function Index() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      const threeScript = document.createElement('script');
      threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
      threeScript.async = true;
      
      threeScript.onload = () => {
        const vantaScript = document.createElement('script');
        vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
        vantaScript.async = true;
        
        vantaScript.onload = () => {
          if (window.VANTA && vantaRef.current) {
            vantaEffect.current = window.VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.00,
              minWidth: 200.00,
              scale: 1.00,
              scaleMobile: 1.00,
              color: '#009FB7', // Moonstone - primary brand color
              backgroundColor: 'rgba(0, 0, 0, 0.01)',
              backgroundAlpha: 0.1,
              points: 20.00, // More points for better visibility
              maxDistance: 25.00, // Longer connections for visibility
              spacing: 20.00, // Uniform spacing
              showLines: true,
              lineSpeed: 0.3, // Smooth movement
              showDots: true,
              dotRadius: 2.0, // Larger dots for visibility
              lineWidth: 1.2, // Thicker lines for visibility
              cameraDistance: 50.00
            });
          }
        };
        
        document.body.appendChild(vantaScript);
      };
      
      document.body.appendChild(threeScript);
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <div ref={vantaRef} className="fixed inset-0 -z-10" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/60 to-background/70 pointer-events-none" />
      <div className="relative">
        <Navigation />
        <Hero />
        <Services />
        <About />
        <Portfolio />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
