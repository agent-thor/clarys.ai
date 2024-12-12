import Form from "next/form";

import { Input } from "./ui/input";
import { useActionState, useEffect, useState } from "react";
import { SubmitButton } from "@/components/submit-button";
import { login, LoginActionState } from "@/app/(auth)/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuthForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [email, setEmail] = useState("");
  const [initState, setInitState] = useState(true);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errors, setErrors] = useState({ email: "" });

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    let errors: { email: string } = { email: "" };
    if (state.status === "failed") {
      errors.email = "Invalid credentials.";
      setErrors(errors);
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      validateForm();
    } else if (state.status === "success") {
      setIsSuccessful(true);
      router.refresh();
    }
  }, [state.status, router]);

  useEffect(() => {
    console.log("effect validate form");
    validateForm();
  }, [email]);

  useEffect(() => {
    if (errors.email === "") {
      formAction(formData);
    }
  }, [errors]);

  const handleSubmit = (formData: FormData) => {
    console.log("handle submit");
    setEmail(formData.get("email") as string);
    setFormData(formData);
    setInitState(false);
  };

  const validateForm = () => {
    let errors = { email: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "" && !initState) {
      errors.email = "Email is required.";
    }

    if (email !== "" && !emailRegex.test(email)) {
      errors.email = "Email address is not valid.";
    }

    setErrors(errors);
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
          key="email"
          name="email"
          className={errors.email ? "invalid" : ""}
          // type="email"
          placeholder="Your email address"
          autoComplete="email"
          required
          autoFocus
          defaultValue={email}
        />

        {/*   <Input
                    id="password"
                    name="password"
                    className="bg-muted text-md md:text-sm"
                    type="password"
                    required
                  />
                </div>*/}
      </div>
      <p
        className={`h-[14px] text-[10px] leading-[10px] mb-0.5 px-4 text-warning relative top-10}`}
      >
        {" "}
        {errors.email ? errors.email : ""}
      </p>
      <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
    </Form>
  );
}
