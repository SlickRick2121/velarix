import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceHero from '@/components/ServiceHero';
import SEO from '@/components/SEO';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Zap, Search, Shield, BarChart3, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WebOptimization = () => {
  const navigate = useNavigate();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  const features = [
    {
      icon: Zap,
      title: "Performance Optimization",
      description: "Speed up your site with code optimization, image compression, caching strategies, and CDN setup. Achieve lightning-fast load times that keep users engaged."
    },
    {
      icon: Search,
      title: "SEO Enhancement",
      description: "Improve your search rankings with technical SEO audits, meta optimization, structured data, and content strategy that drives organic traffic."
    },
    {
      icon: Shield,
      title: "Security & Maintenance",
      description: "Keep your site secure with regular updates, security patches, malware scanning, and backup systems. Peace of mind with proactive monitoring."
    },
    {
      icon: BarChart3,
      title: "Analytics & Monitoring",
      description: "Track performance with comprehensive analytics setup, conversion tracking, and regular reporting to understand what's working and what needs improvement."
    }
  ];

  const services = [
    "Website speed optimization and performance audits",
    "SEO technical audits and implementation",
    "Security updates and vulnerability patching",
    "Regular content updates and backups",
    "Mobile responsiveness optimization",
    "Conversion rate optimization (CRO)",
    "Google Analytics and tracking setup",
    "Ongoing technical support and troubleshooting"
  ];

  return (
    <>
      <SEO
        title="Web Optimization & Maintenance | Velarix Digital Studio"
        description="Website speed optimization, SEO enhancement, security updates, and ongoing maintenance. Keep your digital presence running smoothly with professional optimization services."
        keywords="web optimization, SEO services, website speed optimization, website maintenance, performance optimization, security updates, technical SEO, Netherlands web optimization, US web maintenance, small business SEO"
        canonical="https://velarixsolutions.nl/web-optimization"
      />
      <Navigation />
      <ServiceHero
        title="Web Optimization"
        subtitle="Keep your digital presence running smoothly with ongoing optimization and technical support"
        icon={
          <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
            <path fill="currentColor" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8 7.2 16 16 16H288c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V64h32c17.7 0 32-14.3 32-32zM143.5 120.6c4.7-2.9 10.6-3.5 15.9-1.6l176 48c8.2 2.2 14.6 8.9 16.8 17.1s.4 17.1-5.6 23.2l-64 56c-6.2 5.4-14.6 7-22.2 4.2l-88-28-54.7 54.7c5.8 8.7 9.2 19 9.2 30.1c0 30.9-25.1 56-56 56s-56-25.1-56-56s25.1-56 56-56c4.5 0 8.9 .7 13 2l54.7-54.7-28-88c-2.8-7.6-1.2-16 4.2-22.2l56-64c6.1-6.1 15.1-8.5 23.2-5.6zm337 294.8l-64-56c-6.2-5.4-14.6-7-22.2-4.2l-88 28-54.7-54.7c5.8-8.7 9.2-19 9.2-30.1c0-30.9-25.1-56-56-56s-56 25.1-56 56s25.1 56 56 56c4.5 0 8.9-.7 13-2l54.7 54.7 28 88c2.8 7.6 1.2 16-4.2 22.2l-56 64c-6.1 6.1-15.1 8.5-23.2 5.6s-14.6-8.9-16.8-17.1l-48-176c-1.9-5.3-1.3-11.2 1.6-15.9s7.5-8.1 13-9.4l176-48c8.2-2.2 17.1-.4 23.2 5.6s8.5 15.1 5.6 23.2z" />
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
              How We Optimize
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

      {/* Services List Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container px-4 mx-auto">
          <div 
            ref={servicesRef as any}
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
              servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center tracking-tight">
              Our Services
            </h2>
            <div className="backdrop-blur-xl bg-card/60 border border-accent/20 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, index) => {
                  const { ref, isVisible } = useScrollAnimation();
                  return (
                    <div
                      key={index}
                      ref={ref as any}
                      className={`flex items-start gap-3 transition-all duration-700 ${
                        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/80 font-light">{service}</span>
                    </div>
                  );
                })}
              </div>
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
                Ready to Optimize Your Site?
              </h2>
              <p className="text-xl text-foreground/70 mb-8 font-light max-w-2xl mx-auto">
                Let's improve your site's performance, security, and search visibility to drive better results.
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

export default WebOptimization;

