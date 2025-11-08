import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90"
      />
      
      <div className="container relative z-10 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-8">
            <h1 className="mb-4 text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              Velarix<span className="text-accent">.</span>
            </h1>
            <p className="text-xl md:text-2xl font-light tracking-wide text-gray-300">
              Digital Studio
            </p>
          </div>
          
          <p className="mb-12 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto font-light">
            Crafting modern digital experiences for small businesses and creators across the Netherlands and United States
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={scrollToContact}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium px-10 py-7 text-base transition-all hover:scale-[1.02] shadow-lg hover:shadow-glow"
            >
              Start Project <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 hover:border-white/50 font-medium px-10 py-7 text-base transition-all"
            >
              Explore Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
