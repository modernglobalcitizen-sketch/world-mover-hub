import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type State =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "already" }
  | { kind: "invalid" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!token) {
      setState({ kind: "invalid" });
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setState({ kind: "invalid" });
          return;
        }
        if (data.valid === false && data.reason === "already_unsubscribed") {
          setState({ kind: "already" });
        } else if (data.valid) {
          setState({ kind: "ready" });
        } else {
          setState({ kind: "invalid" });
        }
      } catch {
        setState({ kind: "invalid" });
      }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setState({ kind: "submitting" });
    try {
      const { data, error } = await supabase.functions.invoke(
        "handle-email-unsubscribe",
        { body: { token } }
      );
      if (error) throw error;
      if (data?.success) {
        setState({ kind: "success" });
      } else if (data?.reason === "already_unsubscribed") {
        setState({ kind: "already" });
      } else {
        setState({ kind: "error", message: "Could not unsubscribe." });
      }
    } catch (e: any) {
      setState({ kind: "error", message: e?.message ?? "Something went wrong." });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg text-center space-y-4">
            <h1 className="text-2xl font-bold font-serif">Unsubscribe</h1>
            {state.kind === "loading" && (
              <p className="text-muted-foreground">Checking your link…</p>
            )}
            {state.kind === "ready" && (
              <>
                <p className="text-muted-foreground">
                  Click below to stop receiving emails from Global Moves Network.
                </p>
                <Button onClick={confirm} size="lg" className="w-full">
                  Confirm Unsubscribe
                </Button>
              </>
            )}
            {state.kind === "submitting" && (
              <p className="text-muted-foreground">Processing…</p>
            )}
            {state.kind === "success" && (
              <p className="text-muted-foreground">
                You've been unsubscribed. We're sorry to see you go.
              </p>
            )}
            {state.kind === "already" && (
              <p className="text-muted-foreground">
                This email address is already unsubscribed.
              </p>
            )}
            {state.kind === "invalid" && (
              <p className="text-muted-foreground">
                This unsubscribe link is invalid or expired.
              </p>
            )}
            {state.kind === "error" && (
              <p className="text-destructive">{state.message}</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Unsubscribe;
