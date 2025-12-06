"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Mail, KeyRound, Shield } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

type Step = "request" | "verify";

export default function ForgotPasswordPage() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState<Step>("request");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("flow", "reset");

      await signIn("password", formData);
      setStep("verify");
      setSuccessMessage("Check your email for a password reset code!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send reset code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("code", code);
      formData.set("newPassword", newPassword);
      formData.set("flow", "reset-verification");

      await signIn("password", formData);
      setSuccessMessage("Password reset successful! Redirecting to sign in...");
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code or failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Brand Logo Component (reusable)
  const BrandLogo = () => (
    <Link href="/" className="flex items-center justify-center gap-3 group">
      <div className="h-[60px] w-[60px] rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center transition-transform group-hover:scale-105">
        <Shield className="h-8 w-8 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-3xl leading-none">S.N.O.S.</span>
        <span className="text-sm text-muted-foreground leading-none">Say No to Online Scam</span>
      </div>
    </Link>
  );

  if (step === "request") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-6">
          <BrandLogo />
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a code to reset your password
              </CardDescription>
            </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestReset} className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Code"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Back to Sign In
                </Link>
              </div>
            </form>
          </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <BrandLogo />
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter the code from your email and your new password
            </CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyAndReset} className="space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive text-destructive text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                disabled={isLoading}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-xs text-muted-foreground text-center">
                Code sent to {email}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => {
                  setStep("request");
                  setCode("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError(null);
                  setSuccessMessage(null);
                }}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-full"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
