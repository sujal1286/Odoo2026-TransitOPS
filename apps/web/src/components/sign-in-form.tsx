import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schemas";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";

type SignInInputs = z.infer<typeof signInSchema>;

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const { isPending } = authClient.useSession();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInInputs>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: SignInInputs) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      },
      {
        onSuccess: () => {
          toast.success("Sign in successful");
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

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Controller
              control={control}
              name="rememberMe"
              render={({ field }) => (
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-zinc-700 data-[state=checked]:bg-amber-700 data-[state=checked]:text-white"
                />
              )}
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
            >
              Remember me
            </Label>
          </div>

          <button type="button" className="text-sm font-medium text-sky-500 hover:text-sky-400">
            Forgot password?
          </button>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full bg-amber-700 hover:bg-amber-600 text-white border-amber-800 shadow-sm transition-colors"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="text-sm font-medium text-sky-500 hover:text-sky-400"
        >
          Need an account? Sign Up
        </button>
      </div>
    </div>
  );
}
