import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { RoleEnum, signUpSchema } from "@/lib/schemas";
import type { Role } from "@/lib/schemas";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const { isPending } = authClient.useSession();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "DISPATCHER" as Role,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          role: value.role,
        },
        {
          onSuccess: () => {
            toast.success("Sign up successful");
            navigate({ to: "/dashboard" });
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: signUpSchema,
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  Name
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="John Doe"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-[#111113] border-zinc-800 text-zinc-200 focus-visible:ring-amber-700/50"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs mt-1">
                    {String((error as any)?.message ?? error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  Email
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  placeholder="name@transitops.in"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-[#111113] border-zinc-800 text-zinc-200 focus-visible:ring-amber-700/50"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs mt-1">
                    {String((error as any)?.message ?? error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  Password
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="bg-[#111113] border-zinc-800 text-zinc-200 focus-visible:ring-amber-700/50"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs mt-1">
                    {String((error as any)?.message ?? error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="role">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor={field.name} className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                  Role (RBAC)
                </Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as Role)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-[#111113] px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-200 appearance-none"
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '1rem auto' }}
                >
                  <option value="FLEET_MANAGER">Fleet Manager</option>
                  <option value="DISPATCHER">Dispatcher</option>
                  <option value="SAFETY_OFFICER">Safety Officer</option>
                  <option value="FINANCIAL_ANALYST">Financial Analyst</option>
                  <option value="DRIVER">Driver</option>
                </select>
                {field.state.meta.errors.map((error) => (
                  <p key={String((error as any)?.message ?? error)} className="text-red-500 text-xs mt-1">
                    {String((error as any)?.message ?? error)}
                  </p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <div className="pt-2">
          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full bg-amber-700 hover:bg-amber-600 text-white border-amber-800 shadow-sm transition-colors"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Signing up..." : "Sign Up"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="text-sm font-medium text-sky-500 hover:text-sky-400"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
}
