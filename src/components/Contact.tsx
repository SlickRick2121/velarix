import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  projectType: z.string().min(1, "Please select a project type"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters")
});

const Contact = () => {
  const { toast } = useToast();
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardRef, isVisible: cardVisible } = useScrollAnimation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = contactSchema.parse(formData);

      // Create mailto link with encoded data
      const subject = encodeURIComponent(`New Project Inquiry: ${validatedData.projectType}`);
      const body = encodeURIComponent(
        `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nProject Type: ${validatedData.projectType}\n\nMessage:\n${validatedData.message}`
      );

      window.location.href = `mailto:admin@velarixsolutions.nl?subject=${subject}&body=${body}`;

      toast({
        title: "Opening email client",
        description: "Your default email client will open with your message."
      });

      // Reset form
      setFormData({ name: "", email: "", projectType: "", message: "" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);

        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-secondary/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div
            ref={titleRef as any}
            className={`text-center mb-12 transition-all duration-700 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Let's Create Together</h2>
            <p className="text-xl text-muted-foreground font-light">
              Ready to elevate your digital presence? Let's talk.
            </p>
          </div>

          <Card
            ref={cardRef as any}
            className={`border border-border transition-all duration-700 delay-200 ${cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl tracking-tight">Start Your Project</CardTitle>
              <CardDescription className="text-base font-light">
                Whether you're in the Netherlands or the United States, I'm here to help bring your vision to life.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select
                    value={formData.projectType}
                    onValueChange={(value) => setFormData({ ...formData, projectType: value })}
                  >
                    <SelectTrigger className={errors.projectType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="website">Website Design</SelectItem>
                      <SelectItem value="ecommerce">E-Commerce Setup</SelectItem>
                      <SelectItem value="branding">Branding & Strategy</SelectItem>
                      <SelectItem value="automation">Technical Automation</SelectItem>
                      <SelectItem value="consultation">General Consultation</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.projectType && (
                    <p className="text-sm text-destructive">{errors.projectType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className={errors.message ? "border-destructive" : ""}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative bg-gradient-to-r from-accent/80 via-accent/70 to-accent/80 rounded-xl px-6 py-6 text-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/70 via-accent/80 to-accent/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </button>
                </div>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 pt-8 border-t border-border text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span>Netherlands & United States</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent" />
                  <a
                    href="mailto:admin@velarixsolutions.nl"
                    className="hover:text-accent transition-colors"
                  >
                    admin@velarixsolutions.nl
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-8 font-light">
            Operating remotely and in-person • Serving clients internationally
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
