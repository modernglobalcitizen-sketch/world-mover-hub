import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Globe, Loader2, CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { z } from "zod";

const fields = [
  "Technology & IT",
  "Healthcare & Medicine",
  "Education & Research",
  "Business & Finance",
  "Arts & Creative",
  "Engineering",
  "Science",
  "Law & Policy",
  "Non-profit & Social Impact",
  "Agriculture & Environment",
  "Media & Communications",
  "Other"
];

const opportunityTypes = [
  { id: "grant", label: "Grants & Funding" },
  { id: "competition", label: "Competitions" },
  { id: "internship", label: "Internships" },
  { id: "training", label: "Training & Workshops" },
  { id: "conference", label: "Conferences & Events" },
  { id: "other", label: "Other" },
];

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria",
  "Bangladesh", "Belarus", "Belgium", "Bolivia", "Brazil", "Bulgaria", "Cambodia",
  "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica", "Croatia",
  "Cuba", "Czech Republic", "Denmark", "Dominican Republic", "Ecuador", "Egypt",
  "El Salvador", "Estonia", "Ethiopia", "Finland", "France", "Germany", "Ghana",
  "Greece", "Guatemala", "Haiti", "Honduras", "Hungary", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Libya", "Lithuania",
  "Malaysia", "Mexico", "Morocco", "Myanmar", "Nepal", "Netherlands", "New Zealand",
  "Nicaragua", "Nigeria", "North Korea", "Norway", "Pakistan", "Panama", "Paraguay",
  "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Senegal", "Serbia", "Singapore", "Slovakia", "Slovenia",
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden",
  "Switzerland", "Syria", "Taiwan", "Tanzania", "Thailand", "Tunisia", "Turkey",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States",
  "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character" });

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: passwordSchema,
});

const signupSchema = loginSchema.extend({
  country: z.string().min(1, { message: "Please select your country" }),
  fieldOfWork: z.string().min(1, { message: "Please select your field" }),
  opportunityInterests: z.array(z.string()).min(1, { message: "Please select at least one opportunity type" }),
  otherOpportunity: z.string().optional(),
}).refine((data) => {
  if (data.opportunityInterests.includes("other")) {
    return data.otherOpportunity && data.otherOpportunity.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify your other opportunity",
  path: ["otherOpportunity"],
});

type SignupStep = 'form' | 'payment' | 'creating';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState<SignupStep>('form');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [fieldOfWork, setFieldOfWork] = useState("");
  const [opportunityInterests, setOpportunityInterests] = useState<string[]>([]);
  const [otherOpportunity, setOtherOpportunity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'cancelled' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Check for payment return
  useEffect(() => {
    const payment = searchParams.get('payment');
    // PayPal returns subscription_id in the URL
    const subIdFromUrl = searchParams.get('subscription_id');
    // We also store it in sessionStorage as backup
    const subIdFromStorage = sessionStorage.getItem('pendingSubscriptionId');
    const subId = subIdFromUrl || subIdFromStorage;
    
    if (payment === 'success' && subId) {
      setPaymentStatus('success');
      setSubscriptionId(subId);
      setIsLogin(false);
      setSignupStep('creating');
      
      // Load saved signup data from sessionStorage
      const savedData = sessionStorage.getItem('pendingSignup');
      if (savedData) {
        const data = JSON.parse(savedData);
        setEmail(data.email || '');
        setPassword(data.password || '');
        setCountry(data.country || '');
        setFieldOfWork(data.fieldOfWork || '');
        setOpportunityInterests(data.opportunityInterests || []);
        setOtherOpportunity(data.otherOpportunity || '');
      }
    } else if (payment === 'cancelled') {
      setPaymentStatus('cancelled');
      setIsLogin(false);
      setSignupStep('form');
      sessionStorage.removeItem('pendingSubscriptionId');
      toast({
        title: "Payment cancelled",
        description: "Your payment was cancelled. Please try again to complete signup.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  // Handle account creation after successful payment
  useEffect(() => {
    if (paymentStatus === 'success' && subscriptionId && signupStep === 'creating') {
      createAccountAfterPayment();
    }
  }, [paymentStatus, subscriptionId, signupStep]);

  const createAccountAfterPayment = async () => {
    setLoading(true);
    
    try {
      // Verify subscription is active
      const verifyResponse = await supabase.functions.invoke('paypal-subscription', {
        body: {
          action: 'verify-subscription',
          subscriptionId: subscriptionId,
        },
      });

      if (verifyResponse.error || !verifyResponse.data?.verified) {
        toast({
          title: "Payment verification failed",
          description: "We couldn't verify your payment. Please contact support.",
          variant: "destructive",
        });
        setSignupStep('form');
        setLoading(false);
        return;
      }

      // Get saved signup data
      const savedData = sessionStorage.getItem('pendingSignup');
      if (!savedData) {
        toast({
          title: "Session expired",
          description: "Please fill in your details again.",
          variant: "destructive",
        });
        setSignupStep('form');
        setLoading(false);
        return;
      }

      const signupData = JSON.parse(savedData);
      
      // Build final opportunity interests array
      const finalInterests = signupData.opportunityInterests.includes("other") && signupData.otherOpportunity?.trim()
        ? [...signupData.opportunityInterests.filter((i: string) => i !== "other"), signupData.otherOpportunity.trim()]
        : signupData.opportunityInterests;

      // Create account via edge function
      const createResponse = await supabase.functions.invoke('paypal-subscription', {
        body: {
          action: 'link-user',
          subscriptionId: subscriptionId,
          signupData: {
            email: signupData.email,
            password: signupData.password,
            country: signupData.country,
            fieldOfWork: signupData.fieldOfWork,
            opportunityInterests: finalInterests,
          },
        },
      });

      if (createResponse.error || !createResponse.data?.success) {
        toast({
          title: "Account creation failed",
          description: createResponse.data?.error || "Please try again or contact support.",
          variant: "destructive",
        });
        setSignupStep('form');
        setLoading(false);
        return;
      }

      // Clear saved data
      sessionStorage.removeItem('pendingSignup');

      toast({
        title: "Welcome to Global Moves Network!",
        description: "Your account has been created. Please sign in.",
      });

      // Switch to login
      setIsLogin(true);
      setSignupStep('form');
      setPaymentStatus(null);
      
    } catch (error) {
      console.error('Account creation error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setSignupStep('form');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      if (isLogin) {
        const validation = loginSchema.safeParse({ email, password });
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

        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          toast({
            title: "Login failed",
            description: error.message === "Invalid login credentials" 
              ? "Invalid email or password. Please try again."
              : error.message,
            variant: "destructive",
          });
        }
      } else {
        // Signup flow - validate form first
        const validation = signupSchema.safeParse({ 
          email, 
          password, 
          country, 
          fieldOfWork,
          opportunityInterests,
          otherOpportunity
        });
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

        // Save signup data to sessionStorage
        sessionStorage.setItem('pendingSignup', JSON.stringify({
          email: email.trim(),
          password,
          country,
          fieldOfWork,
          opportunityInterests,
          otherOpportunity: otherOpportunity.trim(),
        }));

        // Create PayPal subscription
        const response = await supabase.functions.invoke('paypal-subscription', {
          body: {
            action: 'create-subscription',
            email: email.trim(),
          },
        });

        if (response.error || !response.data?.approvalUrl) {
          toast({
            title: "Payment setup failed",
            description: response.data?.error || "Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Store subscription ID for return
        const returnUrl = new URL(response.data.approvalUrl);
        sessionStorage.setItem('pendingSubscriptionId', response.data.subscriptionId);

        // Redirect to PayPal
        window.location.href = response.data.approvalUrl;
        return;
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

  // Show creating account state
  if (signupStep === 'creating') {
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

          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft text-center">
            {loading ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Creating Your Account</h2>
                <p className="text-muted-foreground">
                  Please wait while we set up your membership...
                </p>
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your account is being created...
                </p>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground mb-4">
                  Please try again or contact support.
                </p>
                <Button onClick={() => { setSignupStep('form'); setPaymentStatus(null); }}>
                  Try Again
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo */}
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

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
          <h1 className="text-2xl font-display font-bold text-center text-foreground mb-2">
            {isLogin ? "Welcome back" : "Join the movement"}
          </h1>
          <p className="text-center text-muted-foreground mb-4">
            {isLogin
              ? "Sign in to access your account"
              : "Create an account to get started"}
          </p>

          {/* Pricing info for signup */}
          {!isLogin && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">$10/month membership</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Get full access to opportunities, breakout rooms, and community resources. 
                Cancel anytime.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fieldOfWork">What field are you in?</Label>
                  <Select value={fieldOfWork} onValueChange={setFieldOfWork}>
                    <SelectTrigger className={errors.fieldOfWork ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select your field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((f) => (
                        <SelectItem key={f} value={f}>
                          {f}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fieldOfWork && (
                    <p className="text-sm text-destructive">{errors.fieldOfWork}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>What opportunities are you looking for?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {opportunityTypes.map((type) => (
                      <div key={type.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.id}
                          checked={opportunityInterests.includes(type.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setOpportunityInterests([...opportunityInterests, type.id]);
                            } else {
                              setOpportunityInterests(opportunityInterests.filter(i => i !== type.id));
                              if (type.id === "other") setOtherOpportunity("");
                            }
                          }}
                        />
                        <label
                          htmlFor={type.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {opportunityInterests.includes("other") && (
                    <Input
                      placeholder="Please specify other opportunities..."
                      value={otherOpportunity}
                      onChange={(e) => setOtherOpportunity(e.target.value)}
                      className="mt-2"
                    />
                  )}
                  {errors.opportunityInterests && (
                    <p className="text-sm text-destructive">{errors.opportunityInterests}</p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={loading || (!isLogin && (!country || !fieldOfWork || opportunityInterests.length === 0 || (opportunityInterests.includes("other") && !otherOpportunity.trim())))}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Continue to Payment ($10/month)
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setPaymentStatus(null);
              }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
