
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Chrome, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/ui/logo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    if (isSignUp && !verificationSent) {
      // Simulate sending verification email
      setTimeout(() => {
        setVerificationSent(true);
        setIsLoading(false);
        toast({
          title: "Verification Email Sent",
          description: "Please check your email and click the verification link",
        });
      }, 1000);
      return;
    }

    // Simulate email verification check for sign up
    if (isSignUp && verificationSent && !isVerified) {
      setTimeout(() => {
        setIsVerified(true);
        setIsLoading(false);
        toast({
          title: "Email Verified!",
          description: "Your account has been verified. You can now sign in.",
        });
      }, 1000);
      return;
    }

    // Handle actual login/signup
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        provider: 'email' as const
      };
      
      // Set remember me duration
      const userData = JSON.stringify(user);
      if (rememberMe) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        localStorage.setItem('fittrack-user', userData);
        localStorage.setItem('fittrack-user-expiry', expiryDate.toISOString());
      } else {
        localStorage.setItem('fittrack-user', userData);
        localStorage.removeItem('fittrack-user-expiry');
      }
      
      login(user);
      onClose();
      setIsLoading(false);
      
      toast({
        title: "Welcome!",
        description: isSignUp ? "Account created successfully!" : "Successfully logged in",
      });
    }, 1000);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const user = {
        id: Date.now().toString(),
        email: 'user@gmail.com',
        name: 'Google User',
        provider: 'google' as const
      };
      
      // Set remember me duration for Google auth
      const userData = JSON.stringify(user);
      if (rememberMe) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        localStorage.setItem('fittrack-user', userData);
        localStorage.setItem('fittrack-user-expiry', expiryDate.toISOString());
      } else {
        localStorage.setItem('fittrack-user', userData);
        localStorage.removeItem('fittrack-user-expiry');
      }
      
      login(user);
      onClose();
      setIsLoading(false);
      
      toast({
        title: "Welcome!",
        description: "Successfully logged in with Google",
      });
    }, 1000);
  };

  const simulateVerification = () => {
    setIsVerified(true);
    toast({
      title: "Email Verified!",
      description: "You can now complete your registration",
    });
  };

  // Main login interface without dialog wrapper when used as main screen
  const loginContent = (
    <div className="w-full max-w-md mx-auto space-y-6 p-6">
      {/* Logo and title */}
      <div className="text-center space-y-4">
        <Logo size="lg" className="mx-auto" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            FitTrack
          </h1>
          <p className="text-muted-foreground mt-2">
            Your Personal Fitness Companion
          </p>
        </div>
      </div>

      {/* Auth form */}
      <div className="space-y-4">
        {/* Google Login */}
        <Button
          variant="outline"
          className="w-full h-12 text-gray-700 border-gray-300"
          onClick={handleGoogleAuth}
          disabled={isLoading}
        >
          <Chrome className="w-5 h-5 mr-2" />
          Continue with Google
        </Button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
        
        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Verification status for sign up */}
          {isSignUp && verificationSent && (
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center space-x-2">
                {isVerified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600">Email verified!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm text-yellow-600">Verification email sent</span>
                  </>
                )}
              </div>
              {!isVerified && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={simulateVerification}
                  className="w-full"
                >
                  Simulate Email Verification
                </Button>
              )}
            </div>
          )}

          {/* Remember me checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">
              Remember this account for 30 days
            </Label>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-12"
            disabled={isLoading || (isSignUp && verificationSent && !isVerified)}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isLoading ? (
              isSignUp && !verificationSent ? 'Sending verification...' : 
              isSignUp && verificationSent && !isVerified ? 'Verify email first' :
              'Signing in...'
            ) : (
              isSignUp ? 
                verificationSent && isVerified ? 'Complete Registration' :
                verificationSent ? 'Verify Email' : 'Sign Up' 
              : 'Sign In'
            )}
          </Button>

          {/* Toggle between sign in/up */}
          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setVerificationSent(false);
                setIsVerified(false);
                setConfirmPassword('');
              }}
              disabled={isLoading}
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </form>
        
        <p className="text-xs text-center text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );

  // If used as a modal (when isOpen is controlled)
  if (onClose !== (() => {})) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {isSignUp ? 'Create Account' : 'Sign in to FitTrack'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {loginContent}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Return as main interface (no dialog wrapper)
  return loginContent;
};
