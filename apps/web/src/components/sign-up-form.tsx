import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/schemas";
import type { Role } from "@/lib/schemas";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type SignUpInputs = z.infer<typeof signUpSchema>;

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const { isPending } = authClient.useSession();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "DISPATCHER",
    },
    mode: "onChange",
  });

  const onSubmit = async (values: SignUpInputs) => {
    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
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
  };

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Name
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            {...register("name")}
            className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-800 text-zinc-800 dark:text-zinc-200 focus-visible:ring-amber-700/50"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@transitops.in"
            {...register("email")}
            className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-800 text-zinc-800 dark:text-zinc-200 focus-visible:ring-amber-700/50"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md border-zinc-800 text-zinc-800 dark:text-zinc-200 focus-visible:ring-amber-700/50"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="role" className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Role (RBAC)
          </Label>
          <select
            id="role"
            {...register("role")}
            className="flex h-10 w-full items-center justify-between rounded-md border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-700/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-zinc-800 dark:text-zinc-200 appearance-none cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2371717a%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '1rem auto' }}
          >
            <option value="FLEET_MANAGER">Fleet Manager</option>
            <option value="DISPATCHER">Dispatcher</option>
            <option value="SAFETY_OFFICER">Safety Officer</option>
            <option value="FINANCIAL_ANALYST">Financial Analyst</option>
            <option value="DRIVER">Driver</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs mt-1">
              {errors.role.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 text-white border-amber-800 shadow-sm transition-colors"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
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
