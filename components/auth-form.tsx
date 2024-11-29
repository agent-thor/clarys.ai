import Form from 'next/form';

import {Input} from './ui/input';
import {useActionState, useEffect, useState} from "react";
import {SubmitButton} from "@/components/submit-button";
import {login, LoginActionState} from "@/app/(auth)/actions";
import {useRouter} from "next/navigation";

export function AuthForm() {

    const router = useRouter();
    const [formData, setFormData] = useState<FormData>(new FormData());
    const [email, setEmail] = useState('');
    const [initState, setInitState] = useState(true);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [errors, setErrors] = useState({email: ""});

    const [state, formAction] = useActionState<LoginActionState, FormData>(
        login,
        {
            status: 'idle',
        },
    );

    useEffect(() => {
        console.log("HERE");
        // debugger;
        let errors = {email: ""};
        if (state.status === 'failed') {
            errors.email = "Invalid credentials."
            setErrors(errors);
            // toast.error('Invalid credentials!');
        } else if (state.status === 'invalid_data') {
            validateForm();
            // toast.error('Failed validating your submission!');
        } else if (state.status === 'success') {
            setIsSuccessful(true);
            router.refresh();
        }
    }, [state.status, router]);

    useEffect(() => {
        validateForm();
    }, [email])

    useEffect(() => {
        if (errors.email === '') {
            formAction(formData);
        }

    }, [errors])

    const handleSubmit = (formData: FormData) => {
        setEmail(formData.get('email') as string)
        setFormData(formData);
        setInitState(false);
    };

    const validateForm = () => {
        let errors = {email: ""};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' && !initState) {
            errors.email = "Email is required.";
        }

        if (email !== '' && !emailRegex.test(email)) {
            errors.email = "Enter a valid email.";
        }

        setErrors(errors);
    };
    return (
        <Form action={handleSubmit} className="flex-1 flex flex-col gap-4 w-full" noValidate>
            <div className="flex flex-col gap-2">
                <Input
                    id="email"
                    key="email"
                    name="email"
                    className={errors.email ? 'invalid' : ''}
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
            {errors.email && (
                <p hidden={!errors.email}
                   className='text-[10px] leading-[10px] mb-0.5 px-4 text-warning fixed top-[370px]'>{errors.email}</p>
            )}
            <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
            {/*{children}*/}

        </Form>
    );
}

/*import Form from 'next/form';

import { Input } from './ui/input';
import { Label } from './ui/label';

export function AuthForm({
  action,
  children,
  defaultEmail = '',
}: {
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  children: React.ReactNode;
  defaultEmail?: string;
}) {
  return (
    <Form action={action} className="flex flex-col gap-4 px-4 sm:px-16">
      <div className="flex flex-col gap-2">
        <Label
          htmlFor="email"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Email Address
        </Label>

        <Input
          id="email"
          name="email"
          className="bg-muted text-md md:text-sm"
          type="email"
          placeholder="user@acme.com"
          autoComplete="email"
          required
          autoFocus
          defaultValue={defaultEmail}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor="password"
          className="text-zinc-600 font-normal dark:text-zinc-400"
        >
          Password
        </Label>

        <Input
          id="password"
          name="password"
          className="bg-muted text-md md:text-sm"
          type="password"
          required
        />
      </div>

      {children}
    </Form>
  );
}*/
