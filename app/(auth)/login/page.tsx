'use client';

import {useRouter} from 'next/navigation';
import {useActionState, useEffect, useState} from 'react';

import {AuthForm} from '@/components/auth-form';
import {SubmitButton} from '@/components/submit-button';

import {login, type LoginActionState} from '../actions';
import styles from "./page.module.css"
import CardPanel from "@/components/CardPanel/card-panel";
import Image from "next/image";

export default function Page() {
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
        console.log("HERE")
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

    useEffect(()=>{
        validateForm();
    },[email])

    useEffect(()=>{
        if(errors.email === ''){
            formAction(formData);
        }

    }, [errors])

    const handleSubmit = (formData: FormData) => {
        setEmail(formData.get('email') as string)
        setFormData(formData);
        setInitState(false);
    };

    const validateForm = () => {
        let isValid = true;
        let errors = {email: ""};

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Email validation
        if (email === '' && !initState) {
            errors.email = "Email is required.";
            isValid = false;
        } 
        
        if (email !== '' && !emailRegex.test(email)) {
            errors.email = "Enter a valid email.";
            isValid = false;
        }

        setErrors(errors);
    };

    return (
        <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-backgroundOpac">
            <div className="flex flex-row flex-1 justify-between py-16 px-40 h-full gap-16">
                {/*<div className="flex-col flex-1 justify-center items-start gap-8 inline-flex">
                    <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch justify-start items-center gap-4 inline-flex">
                            <div className="text-primary text-greeting font-bold font-clarys">Meet</div>
                            <div
                                className="text-gradient text-greeting font-bold font-clarys leading-[135px]">Clarys.AI
                            </div>
                        </div>
                        <div
                            className="self-stretch text-primary text-[32px] font-normal font-clarys leading-loose">your
                            OpenGov AI assistant
                        </div>
                    </div>
                    <div className="text-primary text-base font-normal font-clarys leading-normal">Clarys.ai is here to
                        simplify decision-making in OpenGov. Trained on OpenGov data, Clarys helps you explore on-chain
                        and off-chain data, proposals, and discussions effortlessly.<br/><br/>Take control of OpenGov
                        with Clarys—smart, efficient, and built for better decisions.
                    </div>
                </div>*/}
                <div className={styles.welcomeInfo}>
                    <div className={styles.welcomeTitle}>
                        Meet <span className={styles.welcomeTitleName}> Clarys.AI </span>
                    </div>
                    <div className={styles.welcomeSubtitle}>your OpenGov AI assistant</div>
                    <div className={styles.welcomeText}>
                        Clarys.ai is here to simplify decision-making in OpenGov. Trained on
                        OpenGov data, Clarys helps you explore on-chain and off-chain data,
                        proposals, and discussions effortlessly.
                    </div>
                    <div className={styles.welcomeText}>
                        Take control of OpenGov with Clarys—smart, efficient, and built for
                        better decisions.
                    </div>
                </div>
                {/*<div className="h-[952px] flex-col justify-center items-start gap-8 inline-flex">
                    <div className="self-stretch h-[168px] flex-col justify-start items-start gap-4 flex">
                        <div className="self-stretch justify-start items-center gap-4 inline-flex">
                            <div className="text-[#121214] text-[120px] font-bold font-['Montserrat'] leading-[120px]">Meet</div>
                            <div className={`text-[#ff2670] text-[120px] font-bold font-['Montserrat'] leading-[120px] ${styles.welcomeTitleName}`}>Clarys.AI</div>
                        </div>
                        <div className="self-stretch text-[#121214] text-[32px] font-normal font-['Montserrat'] leading-loose">your OpenGov AI assistant</div>
                    </div>
                    <div className="w-[640px] text-[#121214] text-base font-normal font-['Montserrat'] leading-normal">Clarys.ai is here to simplify decision-making in OpenGov. Trained on OpenGov data, Clarys helps you explore on-chain and off-chain data, proposals, and discussions effortlessly.<br/><br/>Take control of OpenGov with Clarys—smart, efficient, and built for better decisions.</div>
                </div>*/}

                <CardPanel>

                    {/*<div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-16 flex">
                        <div className="self-stretch justify-start items-center gap-4 inline-flex">
                            <Image src="/images/logo_horizontal_plain.png" alt="logomark" width={352}
                                   height={68.25}></Image>
                        </div>
                        <div className="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-8 flex">
                            <div className="self-stretch flex-col justify-start items-start gap-4 flex">
                                <div
                                    className="self-stretch text-primary text-xl font-bold font-clarys uppercase leading-normal">Log
                                    in
                                </div>
                                <div
                                    className="self-stretch text-primary text-sm font-normal font-clarys leading-normal">Please
                                    input you Email address to start using Clarys.AI & help you simplify your workflow
                                </div>
                            </div>
                            <AuthForm action={handleSubmit} defaultEmail={email}>
                                <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
                            </AuthForm>
                        </div>
                    </div>*/}
                    <Image src="/images/logo_horizontal_plain.png" alt="logomark" width={352}
                           height={68.25}></Image>
                    <div className={styles.content}>
                        <div className={styles.contentTitle}>LOG IN</div>
                        <div className={styles.contentText}>Please input your Email address to start using Clarys.AI
                            &
                            help
                            you
                            simplify
                            your workflow
                        </div>
                        <AuthForm action={handleSubmit} defaultEmail={email}>
                            {errors.email && (
                                <p hidden={!errors.email} className={styles.errorLabel}>{errors.email}</p>
                            )}
                            <SubmitButton isSuccessful={isSuccessful}>Sign in</SubmitButton>
                        </AuthForm>
                    </div>
                </CardPanel>
            </div>
        </div>
    );
}
