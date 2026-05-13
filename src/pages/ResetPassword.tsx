import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Globe, Loader2, Lock } from "lucide-react";
import { z } from "zod";

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

const confirmSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isValidRecovery, setIsValidRecovery] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleRecovery = async () => {
      // Supabase puts the recovery token in the URL hash after redirect
      const hash = window.location.hash;
      const params = new URLSearchParams(hash.replace("#", ""));
      const type = params.get("type");

      if (type === "recovery") {
        // The session is automatically set by Supabase from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          toast({
            title: "Invalid or expired link",
            description: "This password reset link is no longer valid. Please request a new one.",
            variant: "destructive",
          });
          setIsValidRecovery(false);
        } else {
          setIsValidRecovery(true);
        }
      } else {
        // No recovery token in URL — user may have navigated here directly
        setIsValidRecovery(false);
      }

      setCheckingSession(false);
    };

    handleRecovery();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const validation = confirmSchema.safeParse({ password, confirmPassword });
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password updated",
          description: "Your password has been reset. You can now sign in with your new password.",
        });
        navigate("/auth");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Verifying your reset link...</p>
        </div>
      </div>
    );
  }

  if (!isValidRecovery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center">
            <a href="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <Globe className="h-6 w-6" />
              </div>
              <span className="text-2xl font-display font-semibold text-foreground">
                The Global Moves
              </span>
            </a>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft text-center space-y-4">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-display font-bold text-foreground">
              Invalid or Expired Link
            </h1>
            <p className="text-muted-foreground">
              This password reset link is no longer valid. Please request a new one.
            </p>
            <Button variant="hero" onClick={() => navigate("/auth")} className="w-full">
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <a href="/" className="inline-flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Globe className="h-6 w-6" />
            </div>
            <span className="text-2xl font-display font-semibold text-foreground">
              The Global Moves
            </span>
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <h1 className="text-2xl font-display font-bold text-center text-foreground mb-2">
            Set a new password
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            Choose a strong password for your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
