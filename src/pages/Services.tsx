import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import ServiceCard3D from '@/components/ServiceCard3D';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import '@/components/ServiceCard3D.css';

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

// Services based on PlentifulPower Consulting business plan
const services = [
  {
    text: "Website & eCommerce",
    path: "/website-ecommerce",
    rotation: -15,
    icon: (
      <svg viewBox="0 0 640 512" height="1em" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z"
        ></path>
      </svg>
    )
  },
  {
    text: "Branding & Content",
    path: "/branding-content",
    rotation: 5,
    icon: (
      <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"
        ></path>
      </svg>
    )
  },
  {
    text: "Technical Automation",
    path: "/technical-automation",
    rotation: 25,
    icon: (
      <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"
        ></path>
      </svg>
    )
  },
  {
    text: "Web Optimization",
    path: "/web-optimization",
    rotation: -10,
    icon: (
      <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8 7.2 16 16 16H288c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V64h32c17.7 0 32-14.3 32-32zM143.5 120.6c4.7-2.9 10.6-3.5 15.9-1.6l176 48c8.2 2.2 14.6 8.9 16.8 17.1s.4 17.1-5.6 23.2l-64 56c-6.2 5.4-14.6 7-22.2 4.2l-88-28-54.7 54.7c5.8 8.7 9.2 19 9.2 30.1c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56c4.5 0 8.9 .7 13 2l54.7-54.7-28-88c-2.8-7.6-1.2-16 4.2-22.2l56-64c6.1-6.1 15.1-8.5 23.2-5.6zm337 294.8l-64-56c-6.2-5.4-14.6-7-22.2-4.2l-88 28-54.7-54.7c5.8-8.7 9.2-19 9.2-30.1c0-30.9-25.1-56-56-56s-56 25.1-56 56s25.1 56 56 56c4.5 0 8.9-.7 13-2l54.7 54.7 28 88c2.8 7.6 1.2 16-4.2 22.2l-56 64c-6.1 6.1-15.1 8.5-23.2 5.6s-14.6-8.9-16.8-17.1l-48-176c-1.9-5.3-1.3-11.2 1.6-15.9s7.5-8.1 13-9.4l176-48c8.2-2.2 17.1-.4 23.2 5.6s8.5 15.1 5.6 23.2z"
        ></path>
      </svg>
    )
  },
  {
    text: "Technical Consultation",
    path: "/technical-consultation",
    rotation: 15,
    icon: (
      <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
        ></path>
      </svg>
    )
  }
];

const Services = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<any>(null);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  useEffect(() => {
    if (!vantaRef.current) return;

    const threeScript = document.createElement('script');
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
    threeScript.async = true;
    
    threeScript.onload = () => {
      const vantaScript = document.createElement('script');
      vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
      vantaScript.async = true;
      
      vantaScript.onload = () => {
        if (vantaRef.current && window.VANTA && window.THREE) {
          vantaEffect.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: '#009FB7',
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
            backgroundAlpha: 0.1,
            points: 15.00,
            maxDistance: 25.00,
            spacing: 18.00
          });
        }
      };
      
      document.body.appendChild(vantaScript);
    };
    
    document.body.appendChild(threeScript);

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <SEO
        title="Services | Velarix Digital Studio"
        description="Explore our comprehensive digital services: Website & eCommerce development, Branding & Content strategy, Technical Automation, Web Optimization, and Technical Consultation."
        keywords="digital services, web development services, eCommerce solutions, branding services, technical automation, web optimization, technical consultation, digital studio services"
        canonical="https://velarix.digital/services"
      />
      <div ref={vantaRef} className="fixed inset-0 -z-10" />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/60 to-background/70 pointer-events-none" />
      <div className="relative">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-primary/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,159,183,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,159,183,0.15),transparent_50%)]" />
          
          <div 
            ref={titleRef as any}
            className={`container relative z-10 px-4 mx-auto text-center transition-all duration-1000 ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight drop-shadow-2xl">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-12 font-light max-w-2xl mx-auto drop-shadow-lg">
              Refined digital solutions tailored to your vision
            </p>
          </div>
        </section>

        {/* Services Cards Section */}
        <section className="py-24 bg-gradient-to-b from-background/80 to-secondary/20">
          <div className="container px-4 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {services.map((service, index) => {
                const { ref, isVisible } = useScrollAnimation();
                
                return (
                  <div
                    key={index}
                    ref={ref as any}
                    className={`transition-all duration-700 flex justify-center ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <ServiceCard3D
                      text={service.text}
                      rotation={service.rotation}
                      path={service.path}
                      icon={service.icon}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Services;

