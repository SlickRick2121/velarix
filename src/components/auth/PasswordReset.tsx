import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';

const emailSchema = z.string().email('Invalid email address');

interface PasswordResetProps {
  onBack: () => void;
}

export default function PasswordReset({ onBack }: PasswordResetProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(email);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSent(true);
      toast({
        title: 'Reset link sent!',
        description: 'Check your email for the password reset link.',
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      let errorMessage = error.message || 'Failed to send reset link';
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

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-foreground">Check your email</h3>
        <p className="text-foreground/70">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <Button
          onClick={onBack}
          variant="outline"
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to login
      </button>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Reset Password</h2>
        <p className="text-foreground/70">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email Address</Label>
          <Input
            type="email"
            id="reset-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="bg-white/5 border-accent/30"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-accent/80 to-accent/70 hover:scale-105 transition-transform"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </div>
  );
}
