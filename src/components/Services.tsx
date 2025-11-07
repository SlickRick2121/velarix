import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Palette, Cog, Zap, MessageSquare } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const services = [
  {
    icon: Globe,
    title: "Website & eCommerce Setup",
    description: "Professional websites and online stores tailored to your business needs, built with modern technologies."
  },
  {
    icon: Palette,
    title: "Branding & Content Strategy",
    description: "Develop a cohesive brand identity and content plan that resonates with your target audience."
  },
  {
    icon: Cog,
    title: "Technical Automation",
    description: "API integrations, hosting solutions, and domain setup to streamline your digital operations."
  },
  {
    icon: Zap,
    title: "Web Optimization & Maintenance",
    description: "Keep your digital presence running smoothly with ongoing optimization and technical support."
  },
  {
    icon: MessageSquare,
    title: "Freelance Technical Consultation",
    description: "Expert guidance on technology decisions, digital strategy, and implementation planning."
  }
];

const Services = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4 mx-auto">
        <div 
          ref={titleRef as any}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">What We Craft</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Refined digital solutions tailored to your vision
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => {
            const { ref, isVisible } = useScrollAnimation();
            
            return (
              <Card 
                key={index} 
                ref={ref as any}
                className={`border border-border hover:border-accent/50 transition-all duration-700 hover:shadow-elevated group ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="h-7 w-7 text-accent" />
                  </div>
                  <CardTitle className="text-xl mb-2 tracking-tight">{service.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed font-light">
                    {service.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
