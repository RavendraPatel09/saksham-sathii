import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Loader2, ArrowRight, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { apiRequest } from '@/lib/api/client';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [expiresInSeconds, setExpiresInSeconds] = useState(600); // 10 minutes

  // Refs for auto-focusing next digit inputs
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Redirect if no email present
    if (!email) {
      toast.error('Email address is required for verification.');
      navigate('/register');
    }

    // Auto-focus first field
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate]);

  // Countdown timer for OTP Expiry (10 minutes)
  useEffect(() => {
    if (expiresInSeconds <= 0) return;
    const timer = setInterval(() => {
      setExpiresInSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresInSeconds]);

  // Resend button cooldown timer (60 seconds)
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric inputs
    if (value && !/^\d$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace focus behavior
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (!/^\d{6}$/.test(pasteData.trim())) {
      toast.error('Please paste a valid 6-digit numeric verification code.');
      return;
    }

    const digits = pasteData.trim().split('');
    setOtpDigits(digits);

    // Focus last input
    inputRefs.current[5]?.focus();
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    if (otp.length < 6) {
      toast.error('Please enter the full 6-digit verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });

      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      await apiRequest('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      toast.success('Verification code resent successfully.');
      setOtpDigits(Array(6).fill(''));
      setExpiresInSeconds(600); // Reset expiry to 10 minutes
      setResendCooldown(60); // Reset cooldown to 60 seconds
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend verification code.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md border-none shadow-xl bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base mt-2">
            We sent a 6-digit verification code to
            <span className="font-semibold text-foreground block mt-1 break-all">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 max-w-xs mx-auto">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(index, e.target.value)}
                  onKeyDown={e => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg bg-background border-muted-foreground/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            {expiresInSeconds > 0 ? (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Code expires in: <span className="font-bold text-foreground">{formatTime(expiresInSeconds)}</span></span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">Verification code has expired</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 shadow-lg shadow-primary/20 text-base font-semibold"
              disabled={isSubmitting || expiresInSeconds <= 0}
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Verifying...</>
              ) : (
                <><ArrowRight className="w-5 h-5 mr-2" /> Verify Email</>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-3 border-t pt-5">
          <div className="text-sm text-center">
            Didn't receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className={`font-semibold hover:underline transition-colors ${
                resendCooldown > 0
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-primary'
              }`}
            >
              {isResending ? (
                <span>Resending...</span>
              ) : resendCooldown > 0 ? (
                <span>Resend Code ({resendCooldown}s)</span>
              ) : (
                <span className="flex items-center gap-1 inline-flex">
                  <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                </span>
              )}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
