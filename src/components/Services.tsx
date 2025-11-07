import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Palette, Cog, Zap, MessageSquare } from "lucide-react";

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
  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Services</h2>
          <p className="text-xl text-muted-foreground">
            Comprehensive digital solutions to help your business thrive
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="h-7 w-7 text-accent" />
                </div>
                <CardTitle className="text-xl">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
