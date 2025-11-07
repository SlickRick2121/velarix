import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const blogContent: Record<string, any> = {
  "modern-web-design-trends-2025": {
    title: "Modern Web Design Trends for 2025",
    category: "Design",
    date: "2025-01-15",
    readTime: "5 min read",
    content: `
      <p>The web design landscape continues to evolve rapidly, and 2025 brings exciting new patterns that balance aesthetics with functionality. Here are the key trends shaping modern digital experiences.</p>

      <h2>1. Minimalist Maximalism</h2>
      <p>The paradox of 2025: designs are simultaneously more minimal and more expressive. Clean layouts with strategic moments of bold typography, vivid accents, and micro-animations create impact without overwhelming users.</p>

      <h2>2. Fluid Typography & Adaptive Spacing</h2>
      <p>Responsive design has matured beyond breakpoints. Modern sites use fluid typography that scales seamlessly across devices, paired with container queries for truly adaptive components.</p>

      <h2>3. Purposeful Motion</h2>
      <p>Animations are no longer decorative—they guide attention, provide feedback, and enhance comprehension. Scroll-triggered effects and view transitions create engaging, cinema-quality experiences.</p>

      <h2>4. Sophisticated Color Systems</h2>
      <p>Dark mode is standard. Advanced color systems with semantic tokens enable elegant light/dark transitions and ensure accessibility across all color schemes.</p>

      <h2>Conclusion</h2>
      <p>These trends reflect a maturing web: sophisticated yet accessible, expressive yet purposeful. The best designs in 2025 will be those that thoughtfully balance innovation with usability.</p>
    `
  },
  "small-business-automation-guide": {
    title: "Small Business Automation Guide",
    category: "Automation",
    date: "2025-01-10",
    readTime: "7 min read",
    content: `
      <p>Automation isn't just for enterprise companies. Small businesses can leverage powerful tools to eliminate repetitive tasks and focus on growth.</p>

      <h2>Start With What Matters</h2>
      <p>Don't automate everything at once. Identify your most time-consuming, repetitive tasks. Common candidates include email responses, appointment scheduling, invoice generation, and social media posting.</p>

      <h2>Essential Automation Tools</h2>
      <p>Modern automation platforms like Zapier, Make, and n8n connect your existing tools without code. CRM systems automate customer communications. Email marketing platforms handle sequences automatically.</p>

      <h2>API Integrations</h2>
      <p>Custom integrations between your specific tools can save hours daily. Connecting your website forms to your CRM, syncing inventory across platforms, or automating order fulfillment transforms operations.</p>

      <h2>Measure Impact</h2>
      <p>Track time saved and errors reduced. Most businesses see 10-20 hours reclaimed weekly after implementing strategic automation.</p>
    `
  },
  "cross-border-digital-presence": {
    title: "Building a Cross-Border Digital Presence",
    category: "Strategy",
    date: "2025-01-05",
    readTime: "6 min read",
    content: `
      <p>Expanding your digital presence across borders requires more than translation—it demands cultural adaptation and strategic localization.</p>

      <h2>Localization vs Translation</h2>
      <p>Translation converts words. Localization adapts your entire experience: currency, date formats, cultural references, imagery, and tone. A well-localized site feels native to each market.</p>

      <h2>Technical Considerations</h2>
      <p>Implement hreflang tags for SEO. Use CDNs for fast load times globally. Consider local payment methods and hosting regulations. Plan for different privacy laws (GDPR, CCPA, etc.).</p>

      <h2>Content Strategy</h2>
      <p>Create region-specific content calendars. What resonates in Amsterdam may not work in Austin. Partner with local creators who understand regional nuances.</p>

      <h2>Building Trust</h2>
      <p>Display local contact information, currencies, and language options prominently. Show social proof from each region. Transparency about shipping, returns, and support builds confidence.</p>
    `
  },
  "ecommerce-optimization-tips": {
    title: "E-Commerce Optimization Tips",
    category: "E-Commerce",
    date: "2024-12-28",
    readTime: "8 min read",
    content: `
      <p>Converting visitors into customers requires optimizing every step of the purchase journey. Here's how to improve your e-commerce performance.</p>

      <h2>Speed Is Revenue</h2>
      <p>Every second of load time costs conversions. Optimize images, implement lazy loading, use CDNs, and minimize JavaScript. Target sub-2-second load times.</p>

      <h2>Friction-Free Checkout</h2>
      <p>Reduce checkout to 3 steps or fewer. Offer guest checkout. Display security badges. Show all costs upfront—surprise fees at checkout are the leading cause of abandonment.</p>

      <h2>Product Presentation</h2>
      <p>High-quality images from multiple angles are non-negotiable. Add videos when possible. Write detailed, benefit-focused descriptions. Display reviews prominently.</p>

      <h2>Mobile Experience</h2>
      <p>Over 60% of e-commerce traffic is mobile. Ensure tap targets are sized appropriately, forms are easy to complete, and images load quickly.</p>

      <h2>Trust Signals</h2>
      <p>Display return policies clearly. Show customer reviews. Use trust badges. Provide multiple contact methods. Transparency drives conversions.</p>
    `
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const post = slug ? blogContent[slug] : null;
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <article className="pt-28 pb-24">
        <div className="container px-4 mx-auto max-w-3xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights
          </Button>
          
          <header className="mb-12">
            <Badge variant="secondary" className="mb-4 font-light">
              {post.category}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>
          
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-light"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-16 pt-8 border-t border-border">
            <Button 
              onClick={() => navigate('/blog')}
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> More Insights
            </Button>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default BlogPost;
