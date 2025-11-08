import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    id: 1,
    title: "Artisan Bakery Website",
    category: "Web Design",
    description: "Complete digital transformation for a local bakery, including e-commerce integration and online ordering system.",
    technologies: ["React", "Shopify", "Tailwind CSS"],
    testimonial: {
      text: "Velarix transformed our online presence. Sales increased by 150% in the first quarter.",
      author: "Sarah Mitchell",
      role: "Owner, Sweet Traditions Bakery"
    }
  },
  {
    id: 2,
    title: "Creative Agency Rebrand",
    category: "Branding",
    description: "Full brand identity redesign and digital strategy for a growing creative agency.",
    technologies: ["Figma", "WordPress", "Brand Guidelines"],
    testimonial: {
      text: "The rebrand elevated our entire business. We're now attracting premium clients.",
      author: "Marcus Johnson",
      role: "Director, Studio Eight"
    }
  },
  {
    id: 3,
    title: "SaaS Platform Integration",
    category: "Technical Automation",
    description: "API integration and workflow automation for a B2B software platform.",
    technologies: ["Node.js", "REST API", "Zapier"],
    testimonial: {
      text: "Cut our manual processes by 80%. The automation works flawlessly.",
      author: "Emily Chen",
      role: "CTO, FlowMetrics"
    }
  }
];

const Portfolio = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  
  return (
    <section id="portfolio" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div 
          ref={titleRef as any}
          className={`text-center mb-16 transition-all duration-700 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Selected Work</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Case studies from recent projects
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => {
            const { ref, isVisible } = useScrollAnimation();
            
            return (
              <Card 
                key={project.id}
                ref={ref as any}
                className={`border border-border hover:border-accent/50 transition-all duration-700 hover:shadow-elevated ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="font-light">
                      {project.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 tracking-tight">{project.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed font-light">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="font-light text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-border">
                    <div className="flex gap-3">
                      <Quote className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-muted-foreground italic mb-3 leading-relaxed">
                          "{project.testimonial.text}"
                        </p>
                        <p className="text-sm font-medium">{project.testimonial.author}</p>
                        <p className="text-xs text-muted-foreground font-light">{project.testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
