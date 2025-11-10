import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import EmailPasswordAuth from '@/components/auth/EmailPasswordAuth';
import GoogleAuth from '@/components/auth/GoogleAuth';
import PasswordReset from '@/components/auth/PasswordReset';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSuccess = () => {
    navigate('/');
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/30 to-background animate-gradient-xy opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(115,115,115,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(115,115,115,0.1),transparent_50%)]" />
      
      {/* Glassmorphic Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-card/80 border border-accent/20 rounded-3xl shadow-2xl p-8 md:p-10 animate-fade-in-up">
          {showReset ? (
            <PasswordReset onBack={() => setShowReset(false)} />
          ) : (
            <>
              {/* Logo/Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-accent/10 rounded-full blur-xl" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-accent/30 to-accent/10 rounded-full flex items-center justify-center border border-accent/30">
                    <svg 
                      className="w-10 h-10 text-foreground" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Header Text */}
              <div className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-foreground/70 text-lg font-light">
                  Sign in to continue to your account
                </p>
              </div>

              {/* Google Login */}
              <div className="mb-4">
                <GoogleAuth />
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-accent/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-foreground/60">Or continue with email</span>
                </div>
              </div>

              {/* Email/Password Auth */}
              <EmailPasswordAuth onSuccess={handleSuccess} />

              {/* Forgot Password Link */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowReset(true)}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Footer Text */}
              <p className="text-center text-foreground/60 text-sm mt-8 font-light">
                By continuing, you agree to our{' '}
                <button 
                  onClick={() => navigate('/terms')}
                  className="text-foreground/80 hover:text-foreground underline transition-colors"
                >
                  Terms of Service
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
