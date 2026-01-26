import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Phone } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isPhoneMode, setIsPhoneMode] = useState(false);
  const recaptchaVerifierRef = useRef<any>(null);
  const [adminPin, setAdminPin] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { setUser, setIsAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Initialize reCAPTCHA verifier when component mounts
    if (isPhoneMode && !recaptchaVerifierRef.current) {
      const initializeRecaptcha = async () => {
        try {
          const { RecaptchaVerifier } = await import('firebase/auth');
          const { auth } = await import('@/lib/firebase');

          recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved
            },
            'expired-callback': () => {
              toast({
                title: "reCAPTCHA Expired",
                description: "Please try again",
                variant: "destructive",
              });
            }
          });
        } catch (error) {
          console.error('reCAPTCHA initialization error:', error);
        }
      };

      initializeRecaptcha();
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, [isPhoneMode, toast]);


  const handleAdminLogin = () => {
    if (adminPin === '2323') {
      const mockUser: any = {
        uid: 'admin-railway',
        email: 'admin@velarix.digital',
        displayName: 'Railway Admin',
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      sessionStorage.setItem('is_admin_session', 'true');
      sessionStorage.setItem('admin_access_pin', '2323');

      toast({
        title: "Access Granted",
        description: "Welcome back, Admin.",
      });
      navigate('/analytics');
    } else {
      toast({
        title: "Invalid PIN",
        description: "Incorrect administrative code.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('@/lib/firebase');
      const { notifyUserCreated, notifyUserLogin } = await import('@/lib/discord');

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

      // Send Discord notification
      if (isNewUser) {
        await notifyUserCreated({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          providerId: 'google.com',
        });
      } else {
        await notifyUserLogin({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          providerId: 'google.com',
        });
      }

      // User is automatically set via onAuthStateChanged in AuthContext
      toast({
        title: "Welcome!",
        description: `Successfully logged in as ${user.displayName || user.email}`,
      });
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = "Failed to login with Google";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in was cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup was blocked. Please allow popups for this site.";
      } else if (error.code === 'auth/configuration-not-found') {
        errorMessage = "Google Sign-In is not enabled in Firebase. Please enable it in Firebase Console → Authentication → Sign-in method.";
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "This domain is not authorized. Please add this domain to Firebase Console → Authentication → Settings → Authorized domains.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handlePhoneLogin = async () => {
    try {
      if (!phoneNumber) {
        toast({
          title: "Error",
          description: "Please enter a phone number",
          variant: "destructive",
        });
        return;
      }

      const { signInWithPhoneNumber } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');

      if (!recaptchaVerifierRef.current) {
        const { RecaptchaVerifier } = await import('firebase/auth');
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      }

      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifierRef.current);
      setConfirmationResult(confirmation);
      toast({
        title: "Code Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error: any) {
      console.error('Phone login error:', error);

      let errorMessage = "Failed to send verification code";
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "Invalid phone number format";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async () => {
    try {
      if (!verificationCode || !confirmationResult) {
        toast({
          title: "Error",
          description: "Please enter the verification code",
          variant: "destructive",
        });
        return;
      }

      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;
      const { notifyUserCreated, notifyUserLogin } = await import('@/lib/discord');

      // Check if this is a new user (creation time equals last sign in time)
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

      // Send Discord notification
      if (isNewUser) {
        await notifyUserCreated({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          providerId: 'phone',
        });
      } else {
        await notifyUserLogin({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          providerId: 'phone',
        });
      }

      toast({
        title: "Welcome!",
        description: `Successfully logged in with phone number`,
      });
      navigate('/');
    } catch (error: any) {
      console.error('Verification error:', error);

      let errorMessage = "Invalid verification code";
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "Invalid code. Please try again.";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "Code expired. Please request a new one.";
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Don't render if already authenticated (will redirect)
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

          {/* Tab Selection */}
          <div className="flex gap-2 mb-8 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => { setIsAdminMode(false); setIsPhoneMode(false); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${!isAdminMode && !isPhoneMode ? 'bg-accent text-black' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Google
            </button>
            <button
              onClick={() => { setIsAdminMode(false); setIsPhoneMode(true); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${!isAdminMode && isPhoneMode ? 'bg-accent text-black' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Phone
            </button>
            <button
              onClick={() => { setIsAdminMode(true); }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${isAdminMode ? 'bg-accent text-black' : 'text-foreground/60 hover:text-foreground'}`}
            >
              Admin
            </button>
          </div>

          {/* Login Options */}
          {isAdminMode ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-foreground/80 text-sm font-medium">Admin PIN</label>
                <input
                  type="password"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full bg-white/5 border border-accent/30 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm text-center tracking-[1em] text-2xl font-bold"
                  maxLength={4}
                />
              </div>
              <button
                onClick={handleAdminLogin}
                className="w-full group relative bg-gradient-to-r from-accent/80 to-accent/70 rounded-xl px-4 py-4 text-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Verify Credentials
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/70 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              </button>
            </div>
          ) : !isPhoneMode ? (
            <>
              {/* Google Login Button */}
              <button
                onClick={handleGoogleLogin}
                className="w-full group relative overflow-hidden bg-white/5 backdrop-blur-xl border-2 border-accent/30 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 btn-modern mb-4"
              >
                <div className="flex items-center justify-center gap-4 relative z-10">
                  {/* Google Icon */}
                  <div className="transition-transform group-hover:scale-110">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>

                  {/* Button Text */}
                  <span className="text-foreground font-semibold text-lg">
                    Continue with Google
                  </span>
                </div>

                {/* Animated Shimmer Effect */}
                <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Phone Login Button */}
              <button
                onClick={() => setIsPhoneMode(true)}
                className="w-full group relative overflow-hidden bg-white/5 backdrop-blur-xl border-2 border-accent/30 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/20 btn-modern"
              >
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <Phone className="w-6 h-6 text-foreground transition-transform group-hover:rotate-12" />
                  <span className="text-foreground font-semibold text-lg">
                    Continue with Phone
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </button>
            </>
          ) : (
            <div className="space-y-4">
              {!confirmationResult ? (
                <>
                  <div className="space-y-2">
                    <label className="text-foreground/80 text-sm font-medium">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                      className="w-full bg-white/5 border border-accent/30 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm"
                    />
                  </div>
                  <div id="recaptcha-container"></div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setIsPhoneMode(false);
                        setPhoneNumber('');
                      }}
                      className="flex-1 group relative bg-white/5 backdrop-blur-sm border-2 border-accent/20 rounded-xl px-4 py-3 text-foreground font-medium transition-all duration-300 hover:bg-white/10 hover:border-accent/30 hover:scale-105 btn-modern"
                    >
                      <span className="relative z-10">Back</span>
                    </button>
                    <button
                      onClick={handlePhoneLogin}
                      className="flex-1 group relative bg-gradient-to-r from-accent/80 to-accent/70 rounded-xl px-4 py-3 text-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern"
                    >
                      <span className="relative z-10">Send Code</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/70 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-foreground/80 text-sm font-medium">Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="w-full bg-white/5 border border-accent/30 rounded-xl px-4 py-3 text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setConfirmationResult(null);
                        setVerificationCode('');
                        setPhoneNumber('');
                      }}
                      className="flex-1 group relative bg-white/5 backdrop-blur-sm border-2 border-accent/20 rounded-xl px-4 py-3 text-foreground font-medium transition-all duration-300 hover:bg-white/10 hover:border-accent/30 hover:scale-105 btn-modern"
                    >
                      <span className="relative z-10">Cancel</span>
                    </button>
                    <button
                      onClick={handleVerifyCode}
                      className="flex-1 group relative bg-gradient-to-r from-accent/80 to-accent/70 rounded-xl px-4 py-3 text-foreground font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/30 btn-modern"
                    >
                      <span className="relative z-10">Verify</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/70 to-accent/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Footer Text */}
          <p className="text-center text-foreground/60 text-sm mt-8 font-light">
            By continuing, you agree to our{' '}
            <button
              onClick={() => navigate('/terms')}
              className="text-foreground/80 hover:text-foreground underline transition-colors"
            >
              Terms of Service
            </button>
            {' '}and{' '}
            <button
              onClick={() => navigate('/privacy')}
              className="text-foreground/80 hover:text-foreground underline transition-colors"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
