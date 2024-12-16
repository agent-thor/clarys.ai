import Form from "next/form";

import { Input } from "./ui/input";
import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { login, LoginActionState } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed") {
      setErrors({ email: "Invalid credentials." });
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      setErrors({ email: "Email address is not valid." });
    } else if (state.status === "success") {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  const validateForm = (email: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let validationErrors = { email: "" };

    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Email address is not valid.";
    }

    setErrors(validationErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    validateForm(email);
  };

  const handleSubmit = (formData: FormData) => {
    if (!errors.email) {
      formAction(formData);
    }
  };

  return (
    <Form
      action={handleSubmit}
      className="flex-1 flex flex-col gap-[3px] w-full"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <Input
          id="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          onKeyUp={handleKeyUp}
          className={errors.email ? "invalid" : ""}
          placeholder="Your email address"
          autoComplete="email"
          required
          autoFocus
        />
      </div>
      <p className="h-[14px] text-[10px] leading-[10px] mb-0.5 px-4 text-warning">
        {errors.email}
      </p>
      <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
    </Form>
  );
}
