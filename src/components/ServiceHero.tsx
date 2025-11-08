import { useEffect, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowDown } from 'lucide-react';

interface ServiceHeroProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const ServiceHero = ({ title, subtitle, icon }: ServiceHeroProps) => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    const particles = particlesRef.current;
    const particleCount = 50;

    // Create floating particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-accent/30 rounded-full';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particle.style.animationDuration = `${5 + Math.random() * 5}s`;
      particles.appendChild(particle);
    }

    return () => {
      particles.innerHTML = '';
    };
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30" />
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
        <style>{`
          @keyframes float-particle {
            0%, 100% {
              transform: translate(0, 0) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
              opacity: 0.6;
            }
          }
          .absolute div {
            animation: float-particle infinite ease-in-out;
          }
        `}</style>
      </div>
      
      {/* Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,159,183,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,159,183,0.15),transparent_50%)]" />
      
      <div 
        ref={ref as any}
        className={`container relative z-10 px-4 mx-auto transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon with Glow */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 bg-white/5 backdrop-blur-xl border-2 border-accent/30 rounded-2xl flex items-center justify-center">
                <div className="text-accent scale-150">
                  {icon}
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/80 mb-12 font-light max-w-2xl mx-auto drop-shadow-lg">
            {subtitle}
          </p>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-16 animate-bounce">
            <ArrowDown className="h-6 w-6 text-accent/60" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;

