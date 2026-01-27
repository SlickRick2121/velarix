
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Globe, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const projects = [
  {
    id: 1,
    title: "My Portfolio",
    url: "https://esco.veroe.fun",
    image: "https://s0.wp.com/mshots/v1/https://esco.veroe.fun?w=800",
    category: "Metaphysical App",
    description: "Escos' Work",
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    color: "from-purple-500/20 to-indigo-500/20"
  },
  {
    id: 2,
    title: "CryptoTrade Platform",
    url: "https://crypto.veroe.fun",
    image: "https://s0.wp.com/mshots/v1/https://crypto.veroe.fun?w=800",
    category: "FinTech",
    description: "Cryptocurrency trading platform with real-time data visualization and market analysis tools.",
    technologies: ["React", "Web3", "Recharts"],
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: 4,
    title: "My Astro Signs",
    url: "https://escosigns.veroe.fun",
    image: "https://s0.wp.com/mshots/v1/https://escosigns.veroe.fun?w=800",
    category: "Personal",
    description: "My Signs And Overview",
    technologies: ["React", "Tailwind"],
    color: "from-amber-500/20 to-orange-500/20"
  },
  {
    id: 5,
    title: "PasteBin",
    url: "https://veroe.space",
    image: "https://s0.wp.com/mshots/v1/https://veroe.space?w=800",
    category: "PasteBin",
    description: "Privately Built/Maintained PasteBin For Esco",
    technologies: ["React", "Framer Motion", "Vite"],
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    id: 6,
    title: "Farkle Game",
    url: "https://farkle.velarixsolutions.nl",
    image: "https://s0.wp.com/mshots/v1/https://farkle.velarixsolutions.nl?w=800",
    category: "Games",
    description: "Classic dice game, just digitalized with additions of visuals :)",
    technologies: ["React", "shadcn/ui", "Lucide"],
    color: "from-rose-500/20 to-pink-500/20"
  },
  {
    id: 7,
    title: "Spelling Bee",
    url: "https://spell.velarixsolutions.nl",
    image: "https://s0.wp.com/mshots/v1/https://spell.velarixsolutions.nl?w=800",
    category: "Games",
    description: "NYT Clone",
    technologies: ["React", "Monaco Editor", "SystemUI"],
    color: "from-slate-500/20 to-gray-500/20"
  }
];

const Portfolio = () => {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();

  return (
    <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="container px-4 mx-auto">
        <div
          ref={titleRef as any}
          className={`text-center mb-16 transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Portfolio
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">Selected Creations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Engineering digital experiences with precision and artistic vision.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => {
            const { ref, isVisible } = useScrollAnimation();

            return (
              <Card
                key={project.id}
                ref={ref as any}
                className={`group border-border/40 bg-secondary/10 hover:bg-secondary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/5 overflow-hidden cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => project.url && window.open(project.url, '_blank', 'noopener,noreferrer')}
              >
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden bg-muted/20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${project.color} mix-blend-overlay z-10`} />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800`;
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full">
                      <ExternalLink className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-widest text-accent uppercase">
                      {project.category}
                    </span>
                    <div className="flex gap-2">
                      <Github className="w-4 h-4 text-muted-foreground hover:text-white transition-colors" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight group-hover:text-accent transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="bg-background/50 border-border/50 font-normal text-[10px]">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 3 && (
                      <Badge variant="outline" className="bg-background/50 border-border/50 font-normal text-[10px]">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
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
