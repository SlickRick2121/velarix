import { useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceHero from '@/components/ServiceHero';
import SEO from '@/components/SEO';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Globe, ShoppingCart, Code, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebsiteEcommerce = () => {
  const navigate = useNavigate();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: processRef, isVisible: processVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  const features = [
    {
      icon: Globe,
      title: "Custom Web Development",
      description: "Tailored websites built with modern frameworks like React, Next.js, and Vue.js. Responsive, fast, and optimized for all devices."
    },
    {
      icon: ShoppingCart,
      title: "eCommerce Solutions",
      description: "Complete online store setup with payment gateways, inventory management, and secure checkout systems. Shopify, WooCommerce, or custom solutions."
    },
    {
      icon: Code,
      title: "Modern Tech Stack",
      description: "Built with cutting-edge technologies ensuring scalability, performance, and maintainability for your growing business."
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Lightning-fast load times, SEO optimization, and mobile-first design to maximize conversions and user engagement."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Discovery & Planning",
      description: "We start by understanding your business goals, target audience, and technical requirements to create a comprehensive strategy."
    },
    {
      step: "02",
      title: "Design & Development",
      description: "Custom design mockups followed by agile development with regular check-ins to ensure alignment with your vision."
    },
    {
      step: "03",
      title: "Testing & Launch",
      description: "Rigorous testing across devices and browsers, followed by a smooth launch with full documentation and training."
    },
    {
      step: "04",
      title: "Ongoing Support",
      description: "Continuous maintenance, updates, and optimization to keep your site running smoothly and growing with your business."
    }
  ];

  return (
    <>
      <SEO
        title="Website & eCommerce Solutions | Velarix Digital Studio"
        description="Custom web development and online store setup with React, Next.js, and Vue.js. Professional eCommerce solutions for small businesses across Netherlands and United States."
        keywords="web development, eCommerce solutions, online store setup, React developer, Next.js developer, Shopify development, WooCommerce, custom website design, small business website, Netherlands web design, US eCommerce"
        canonical="https://velarixsolutions.nl/website-ecommerce"
      />
      <Navigation />
      <ServiceHero
        title="Website & eCommerce"
        subtitle="Professional websites and online stores tailored to your business needs, built with modern technologies"
        icon={
          <svg viewBox="0 0 640 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
            <path fill="currentColor" d="M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z" />
          </svg>
        }
      />

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
        <div className="container px-4 mx-auto">
          <div 
            ref={featuresRef as any}
            className={`max-w-6xl mx-auto transition-all duration-1000 ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center tracking-tight mb-16">
              What We Deliver
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const { ref, isVisible } = useScrollAnimation();
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    ref={ref as any}
                    className={`backdrop-blur-xl bg-card/60 border border-accent/20 rounded-2xl p-8 transition-all duration-700 hover:border-accent/40 hover:shadow-xl hover:shadow-accent/10 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                      <Icon className="h-7 w-7 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 tracking-tight">{feature.title}</h3>
                    <p className="text-foreground/70 leading-relaxed font-light">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container px-4 mx-auto">
          <div 
            ref={processRef as any}
            className={`max-w-5xl mx-auto transition-all duration-1000 ${
              processVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight">
              Our Process
            </h2>
            <div className="space-y-12">
              {process.map((item, index) => {
                const { ref, isVisible } = useScrollAnimation();
                return (
                  <div
                    key={index}
                    ref={ref as any}
                    className={`flex gap-8 items-start transition-all duration-700 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border-2 border-accent/30 flex items-center justify-center">
                        <span className="text-3xl font-bold text-accent">{item.step}</span>
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.title}</h3>
                      <p className="text-foreground/70 leading-relaxed font-light text-lg">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div 
            ref={ctaRef as any}
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
              ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="backdrop-blur-xl bg-card/60 border border-accent/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Ready to Build Your Digital Presence?
              </h2>
              <p className="text-xl text-foreground/70 mb-8 font-light max-w-2xl mx-auto">
                Let's discuss how we can create a stunning website or eCommerce store that drives results for your business.
              </p>
              <button
                onClick={() => navigate('/#contact')}
                className="group relative px-10 py-6 text-base font-semibold text-foreground bg-gradient-to-r from-accent/80 via-accent/70 to-accent/80 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/70 via-accent/80 to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default WebsiteEcommerce;

