import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Let's Work Together</h2>
            <p className="text-xl text-muted-foreground">
              Ready to elevate your digital presence? Get in touch today.
            </p>
          </div>
          
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Start Your Project</CardTitle>
              <CardDescription className="text-base">
                Whether you're in the Netherlands or the United States, I'm here to help bring your vision to life.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span>Netherlands & United States</span>
                </div>
                
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-accent" />
                  <a 
                    href="mailto:contact@plentifulpower.com" 
                    className="hover:text-accent transition-colors"
                  >
                    contact@plentifulpower.com
                  </a>
                </div>
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-10 py-6 text-lg transition-all hover:scale-105"
                  onClick={() => window.location.href = 'mailto:contact@plentifulpower.com'}
                >
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <p className="text-center text-sm text-muted-foreground mt-8">
            Operating remotely and in-person • Serving clients internationally
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
