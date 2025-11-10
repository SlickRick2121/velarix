import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

interface EmailPasswordAuthProps {
  onSuccess: () => void;
}

export default function EmailPasswordAuth({ onSuccess }: EmailPasswordAuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      emailSchema.parse(email);
      passwordSchema.parse(password);

      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              display_name: displayName || null,
            },
          },
        });

        if (error) throw error;

        toast({
          title: 'Account created!',
          description: 'Welcome to the platform!',
        });
        onSuccess();
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in.',
        });
        onSuccess();
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      let errorMessage = error.message || 'Authentication failed';
      if (error instanceof z.ZodError) {
        errorMessage = error.errors[0].message;
      }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailAuth} className="space-y-4">
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="displayName">Display Name (optional)</Label>
          <Input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="John Doe"
            className="bg-white/5 border-accent/30"
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="bg-white/5 border-accent/30"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          minLength={6}
          className="bg-white/5 border-accent/30"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-accent/80 to-accent/70 hover:scale-105 transition-transform"
      >
        {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
      </Button>

      <button
        type="button"
        onClick={() => setIsSignUp(!isSignUp)}
        className="w-full text-sm text-foreground/70 hover:text-foreground transition-colors"
      >
        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
      </button>
    </form>
  );
}
