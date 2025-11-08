import { CheckCircle2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const About = () => {
  const highlights = [
    "Cross-border expertise: US & Netherlands",
    "Remote and in-person services",
    "Personalized, one-on-one attention",
    "Modern, efficient digital tools",
    "Focus on small businesses & creators"
  ];
  
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();
  const { ref: missionRef, isVisible: missionVisible } = useScrollAnimation();

  return (
    <section id="about" className="py-24">
      <div className="container px-4 mx-auto">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div 
              ref={contentRef as any}
              className={`transition-all duration-700 ${
                contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Where Craft Meets Code
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed font-light">
                Velarix is a boutique digital studio dedicated to empowering small businesses and independent creators with refined, personalized digital solutions.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed font-light">
                Operating across the Netherlands and United States, I bring a unique cross-border perspective to help you navigate the modern digital landscape with elegance and precision.
              </p>
              
              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div 
              ref={missionRef as any}
              className={`bg-gradient-to-br from-primary to-primary/80 p-8 rounded-2xl text-primary-foreground transition-all duration-700 ${
                missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4">Mission Statement</h3>
              <p className="text-lg leading-relaxed opacity-95">
                My mission is to empower small businesses and independent creators with modern, efficient, and visually striking digital tools. I aim to bridge the gap between creative expression and technological fluency by offering practical and personalized solutions.
              </p>
              
              <div className="mt-8 pt-8 border-t border-primary-foreground/20">
                <h4 className="font-semibold mb-2">Target Market</h4>
                <p className="opacity-90">
                  Freelancers, small businesses, and creative agencies seeking to establish or enhance their digital presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
