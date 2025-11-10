import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'About', id: 'about' },
    { label: 'Portfolio', id: 'portfolio' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', id: 'contact' }
  ];

  const isServicesPage = location.pathname === '/services';

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-accent/20' : 'bg-background/70 backdrop-blur-md'
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={() => {
              if (isHomePage) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
            }}
            className="text-2xl font-bold hover:text-accent transition-colors tracking-tight drop-shadow-lg"
          >
            Velarix<span className="text-accent">.</span>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = link.path === '/services' && isServicesPage;
              return (
                <button
                  key={link.label}
                  onClick={() => link.path ? handleNavigation(link.path) : scrollToSection(link.id!)}
                  className={`transition-colors font-medium drop-shadow-sm ${
                    isActive 
                      ? 'text-[#FE4A49]' 
                      : 'text-foreground hover:text-accent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className="group relative px-4 py-2 text-sm font-medium text-foreground bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 btn-modern"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="group relative px-4 py-2 text-sm font-medium text-foreground bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 btn-modern"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="group relative px-4 py-2 text-sm font-medium text-foreground bg-white/5 backdrop-blur-sm border border-accent/30 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-accent/50 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 btn-modern"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  Login
                </span>
              </button>
            )}
            <button
              onClick={() => scrollToSection('contact')}
              className="group relative px-6 py-2 text-sm font-semibold text-foreground bg-gradient-to-r from-accent/80 to-accent/70 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern animate-pulse-glow"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/70 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border bg-background/95 backdrop-blur-md">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isActive = link.path === '/services' && isServicesPage;
                return (
                  <button
                    key={link.label}
                    onClick={() => link.path ? handleNavigation(link.path) : scrollToSection(link.id!)}
                    className={`transition-colors font-medium text-left px-4 py-2 ${
                      isActive 
                        ? 'text-[#FE4A49]' 
                        : 'text-foreground hover:text-accent'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
              <div className="px-4 pt-2 space-y-2">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full group relative bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-3 text-foreground font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 btn-modern"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <User className="h-4 w-4" />
                        Profile
                      </span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full group relative bg-white/5 backdrop-blur-sm border-2 border-white/20 rounded-xl px-4 py-3 text-foreground font-medium transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 btn-modern"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <LogOut className="h-4 w-4 transition-transform group-hover:rotate-12" />
                        Logout
                      </span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate('/login');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full group relative bg-white/5 backdrop-blur-sm border-2 border-accent/30 rounded-xl px-4 py-3 text-foreground font-medium transition-all duration-300 hover:bg-white/10 hover:border-accent/50 hover:scale-105 hover:shadow-lg hover:shadow-accent/20 btn-modern"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      Login
                    </span>
                  </button>
                )}
                <button
                  onClick={() => scrollToSection('contact')}
                  className="w-full group relative bg-gradient-to-r from-accent/80 to-accent/70 rounded-xl px-4 py-3 text-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/70 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
