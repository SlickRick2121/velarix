import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const blogPosts = [
  {
    id: "modern-web-design-trends-2025",
    title: "Modern Web Design Trends for 2025",
    excerpt: "Explore the latest design patterns, micro-interactions, and visual aesthetics shaping the web this year.",
    category: "Design",
    date: "2025-01-15",
    readTime: "5 min read"
  },
  {
    id: "small-business-automation-guide",
    title: "Small Business Automation Guide",
    excerpt: "Practical strategies to automate repetitive tasks and focus on what matters most for your business.",
    category: "Automation",
    date: "2025-01-10",
    readTime: "7 min read"
  },
  {
    id: "cross-border-digital-presence",
    title: "Building a Cross-Border Digital Presence",
    excerpt: "How to effectively reach audiences in multiple countries with localized digital strategies.",
    category: "Strategy",
    date: "2025-01-05",
    readTime: "6 min read"
  },
  {
    id: "ecommerce-optimization-tips",
    title: "E-Commerce Optimization Tips",
    excerpt: "Proven techniques to improve conversion rates and enhance the shopping experience.",
    category: "E-Commerce",
    date: "2024-12-28",
    readTime: "8 min read"
  }
];

const categories = ["All", "Design", "Automation", "Strategy", "E-Commerce"];

const Blog = () => {
  const navigate = useNavigate();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-28 pb-24">
        <div className="container px-4 mx-auto">
          <div 
            ref={titleRef as any}
            className={`text-center mb-16 transition-all duration-700 ${
              titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Insights</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Thoughts on design, technology, and digital strategy
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => {
              const { ref, isVisible } = useScrollAnimation();
              
              return (
                <Card 
                  key={post.id}
                  ref={ref as any}
                  className={`border border-border hover:border-accent/50 transition-all duration-700 hover:shadow-elevated cursor-pointer group ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="font-light">
                        {post.category}
                      </Badge>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-2 tracking-tight group-hover:text-accent transition-colors">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed font-light">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-light">{post.readTime}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="group-hover:text-accent transition-colors"
                      >
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
