import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceHero from '@/components/ServiceHero';
import SEO from '@/components/SEO';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Palette, PenTool, Target, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrandingContent = () => {
  const navigate = useNavigate();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  const features = [
    {
      icon: Palette,
      title: "Brand Identity Design",
      description: "Complete visual identity including logos, color palettes, typography, and brand guidelines that reflect your unique value proposition."
    },
    {
      icon: PenTool,
      title: "Content Strategy",
      description: "Data-driven content plans that engage your audience, build trust, and drive conversions across all digital channels."
    },
    {
      icon: Target,
      title: "Audience Research",
      description: "Deep dive into your target market to create messaging and visuals that resonate and convert your ideal customers."
    },
    {
      icon: TrendingUp,
      title: "Brand Consistency",
      description: "Ensuring your brand voice and visual identity remain consistent across all touchpoints for maximum impact."
    }
  ];

  const services = [
    "Logo design and brand mark development",
    "Complete brand style guide creation",
    "Content calendar and editorial planning",
    "Social media content strategy",
    "Email marketing content development",
    "Website copywriting and optimization",
    "Brand voice and tone guidelines",
    "Visual asset creation and management"
  ];

  return (
    <>
      <SEO
        title="Branding & Content Strategy | Velarix Digital Studio"
        description="Complete brand identity design, content strategy, and visual asset creation. Logo design, brand guidelines, and content planning for small businesses."
        keywords="branding services, brand identity design, logo design, content strategy, brand guidelines, visual identity, brand voice, content marketing, Netherlands branding, US brand design, small business branding"
        canonical="https://velarixsolutions.nl/branding-content"
      />
      <Navigation />
      <ServiceHero
        title="Branding & Content"
        subtitle="Develop a cohesive brand identity and content plan that resonates with your target audience"
        icon={
          <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
            <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
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
              What We Create
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
                Ready to Build Your Brand? We are too.
              </h2>
              <p className="text-xl text-foreground/70 mb-8 font-light max-w-2xl mx-auto">
                Let's create a brand identity and content strategy.
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

export default BrandingContent;

