import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/pages/Login';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Authorized Admin Emails
  const ADMIN_EMAILS = ['admin@velarix.digital', 'voee1@protonmail.com', 'voee178@gmail.com'];

  useEffect(() => {
    // Small delay to allow auth context to initialize
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // If on login page, always show it
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          <p className="text-muted-foreground animate-pulse font-mono text-xs uppercase tracking-widest">Verifying Identity...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // Admin protection for analytics
  if (location.pathname === '/analytics') {
    const isAuthorized = user?.email && ADMIN_EMAILS.includes(user.email);

    if (!isAuthorized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-4xl font-bold text-destructive">403: Access Denied</h1>
            <p className="text-muted-foreground">Your identity ({user?.email}) is verified but not authorized for Nexus Admin Intelligence access.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-accent text-black rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Return to Site
            </button>
          </div>
        </div>
      );
    }
  }

  // User is authenticated and authorized, show the app
  return <>{children}</>;
}

