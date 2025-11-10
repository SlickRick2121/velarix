import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import PageTransition from "@/components/PageTransition";
import InitialLoader from "@/components/InitialLoader";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import WebsiteEcommerce from "./pages/WebsiteEcommerce";
import BrandingContent from "./pages/BrandingContent";
import TechnicalAutomation from "./pages/TechnicalAutomation";
import WebOptimization from "./pages/WebOptimization";
import TechnicalConsultation from "./pages/TechnicalConsultation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InitialLoader />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthGuard>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/login" element={<Login />} />
                <Route path="/website-ecommerce" element={<WebsiteEcommerce />} />
                <Route path="/branding-content" element={<BrandingContent />} />
                <Route path="/technical-automation" element={<TechnicalAutomation />} />
                <Route path="/web-optimization" element={<WebOptimization />} />
                <Route path="/technical-consultation" element={<TechnicalConsultation />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </AuthGuard>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;