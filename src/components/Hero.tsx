import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-consulting.jpg";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            PlentifulPower <span className="text-accent">Consulting</span>
          </h1>
          
          <p className="mb-8 text-xl md:text-2xl text-gray-200 leading-relaxed">
            Empowering small businesses and creators with modern digital solutions across the Netherlands and United States
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg transition-all hover:scale-105 shadow-lg"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-6 text-lg transition-all"
            >
              View Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
