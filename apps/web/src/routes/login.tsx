import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import loginBg from "@/components/fleet-login-bg.png";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [showSignIn, setShowSignIn] = useState(true);

  return (
    <div className="grid min-h-[100dvh] w-full lg:grid-cols-2 bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans">
      {/* Left Pane - Premium Image Overlay */}
      <div className="relative hidden lg:flex flex-col p-16 justify-between overflow-hidden bg-zinc-950">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 scale-105 transition-all duration-1000"
          style={{ backgroundImage: `url(${loginBg})` }}
        />
        {/* Tech grid/gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/70 to-zinc-950/40" />

        {/* Top Branding Section */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600/30 border border-amber-500/50 rounded-lg flex items-center justify-center backdrop-blur-md shadow-lg">
            <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-amber-500 rounded-sm" />
              ))}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">TransitOps</h1>
            <p className="text-xs text-zinc-400 font-medium">Smart Operations Platform</p>
          </div>
        </div>

        {/* Middle Feature/Quote Card */}
        <div className="relative z-10 max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Enterprise Edition
          </span>
          <blockquote className="text-lg font-medium text-zinc-200 leading-relaxed mb-4">
            "Optimizing fleet dispatching, monitoring active vehicle health, and managing operations financials in one unified terminal."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-sm">
              TO
            </div>
            <div>
              <p className="text-sm font-semibold text-white">TransitOps Terminal</p>
              <p className="text-xs text-zinc-500">Autonomous Fleet Analytics</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs font-medium text-zinc-500 uppercase tracking-widest">
          TransitOps © 2026 · secure rbac gateway
        </div>
      </div>

      {/* Right Pane - Dark Theme */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-white/40 dark:bg-zinc-950/60 backdrop-blur-md">
        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-medium tracking-tight mb-2 text-zinc-100">
            {showSignIn ? "Sign in to your account" : "Create an account"}
          </h2>
          <p className="text-sm text-zinc-400 mb-8">
            {showSignIn ? "Enter your credentials to continue" : "Sign up to join TransitOps"}
          </p>

          {showSignIn ? (
            <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
          )}

        </div>
      </div>
    </div>
  );
}
