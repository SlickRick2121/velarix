import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ServiceHero from '@/components/ServiceHero';
import SEO from '@/components/SEO';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { MessageSquare, Lightbulb, Target, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechnicalConsultation = () => {
  const navigate = useNavigate();
  const { ref: featuresRef, isVisible: featuresVisible } = useScrollAnimation();
  const { ref: servicesRef, isVisible: servicesVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  const features = [
    {
      icon: Lightbulb,
      title: "Strategic Planning",
      description: "Expert guidance on technology stack selection, architecture decisions, and long-term digital strategy that aligns with your business goals."
    },
    {
      icon: Target,
      title: "Implementation Roadmaps",
      description: "Detailed project plans, timelines, and resource allocation strategies to ensure successful execution of your digital initiatives."
    },
    {
      icon: MessageSquare,
      title: "Technical Reviews",
      description: "Code reviews, architecture audits, and performance assessments to identify improvements and ensure best practices are followed."
    },
    {
      icon: Users,
      title: "Team Training",
      description: "Knowledge transfe   r sessions, documentation, and training to empower your team with the skills needed to maintain and grow your systems."
    }
  ];

  const services = [
    "Technology stack evaluation and recommendations",
    "Digital strategy and roadmap development",
    "Architecture design and system planning",
    "Code review and technical audits",
    "Performance optimization consulting",
    "Security assessment and recommendations",
    "Team training and knowledge transfer",
    "Ongoing technical advisory support"
  ];

  return (
    <>
      <SEO
        title="Technical Consultation Services | Velarix Digital Studio"
        description="Expert guidance on technology decisions, digital strategy, and implementation planning. Technical consultation for small businesses and startups."
        keywords="technical consultation, technology consulting, digital strategy, tech stack selection, architecture consulting, code review, technical advisory, Netherlands tech consulting, US technical consultation, freelance tech consultant"
        canonical="https://velarixsolutions.nl/technical-consultation"
      />
      <Navigation />
      <ServiceHero
        title="Technical Consultation"
        subtitle="Expert guidance on technology decisions, digital strategy, and implementation planning"
        icon={
          <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
            <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
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
              How We Consult
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
                Ready for Expert Guidance?
              </h2>
              <p className="text-xl text-foreground/70 mb-8 font-light max-w-2xl mx-auto">
                Let's discuss your technical challenges and create a strategic plan to achieve your digital goals.
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

export default TechnicalConsultation;

