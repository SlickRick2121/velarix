import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    id: 1,
    title: "ESCO Astrology Guide",
    url: "https://escosigns.velarixsolutions.nl",
    category: "Web Application",
    description: "Interactive astrology guide featuring all 12 zodiac signs with a modern glassmorphic design and gradient interface.",
    technologies: ["React", "GitHub", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "CryptoTrade Platform",
    url: "https://crypto.velarixsolutions.nl",
    category: "Financial Technology",
    description: "Cryptocurrency trading platform with real-time data visualization and market analysis tools.",
    technologies: ["React", "GitHub", "Web3"],
  },
  {
    id: 4,
    title: "Velarix Store",
    url: "https://store.velarixsolutions.nl",
    category: "Web Design",
    description: "Modern web platform with immersive visual design featuring landscape imagery and dynamic overlays.",
    technologies: ["React", "GitHub", "Tailwind CSS"],
  },
  {
    id: 5,
    title: "Velarix Solutions",
    url: "https://velarixsolutions.nl",
    category: "Business Website",
    description: "Professional business website with clean, modern design and responsive layout for optimal user experience.",
    technologies: ["React", "GitHub", "Responsive Design"],
  },
  {
    id: 6,
    title: "ESCO Dashboard",
    url: "https://esco.velarixsolutions.nl",
    category: "Dashboard Application",
    description: "Feature-rich dashboard and configuration interface with modern UI elements and intuitive navigation.",
    technologies: ["React", "GitHub", "Dashboard UI"],
  },
  {
    id: 7,
    title: "Find Terminal Interface",
    url: "https://find.velarixsolutions.nl",
    category: "Developer Tools",
    description: "Terminal-style interface and code editor with syntax highlighting and developer-focused features.",
    technologies: ["React", "GitHub", "Code Editor"],
  },
  {
    id: 8,
    title: "Lazy Application",
    url: "https://lazy.velarixsolutions.nl",
    category: "Web Application",
    description: "Modern web application built with Next.js for optimal performance and server-side rendering.",
    technologies: ["Next.js", "GitHub", "SSR"],
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
                className={`border border-border hover:border-accent/50 transition-all duration-700 hover:shadow-elevated cursor-pointer ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => project.url && window.open(project.url, '_blank', 'noopener,noreferrer')}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary" className="font-light">
                      {project.category}
                    </Badge>
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-2xl tracking-tight">{project.title}</CardTitle>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 transition-colors flex-shrink-0 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
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
                  
                  {project.url && (
                    <div className="pt-4">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-medium"
                      >
                        Visit Live Site
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  )}
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
