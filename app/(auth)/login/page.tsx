'use client';

import {AuthForm} from '@/components/auth-form';
import CardPanel from "@/components/ui/card-panel";
import Image from "next/image";

export default function Page() {
    return (
        <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-backgroundOpac">
            <div className="flex flex-row flex-1 justify-between py-16 px-40 h-full gap-16">
                <div className='flex flex-col justify-center gap-8'>
                    <div className='flex flex-col gap-4'>
                        <div className='font-clarys leading-[120px] font-bold text-greetingBig text-left'>
                            <span className='text-black'>Meet</span> <span className='text-gradient'> Clarys.AI </span>
                        </div>
                        <div className="self-stretch text-primary text-[32px] font-normal font-clarys leading-8">your OpenGov AI assistant</div>
                    </div>
                    <div className="w-[640px] text-primary text-base font-normal font-clarys leading-normal">Clarys.AI is here to simplify decision-making in OpenGov. Trained on OpenGov data, Clarys helps you explore on-chain and off-chain data, proposals, and discussions effortlessly.<br/><br/>Take control of OpenGov with Clarys—smart, efficient, and built for better decisions.</div>
                </div>
                <CardPanel>
                    <Image src="/images/logo_horizontal_plain.png" alt="logomark" width={352}
                           height={68.25}></Image>
                    <div className='flex flex-col flex-1 pt-8 gap-4'>
                        <div className="text-[24px] font-bold text-black">LOG IN</div>
                        <div className="text-[14px] pb-4 text-black">Please input your Email address to start using Clarys.AI
                            &
                            help
                            you
                            simplify
                            your workflow
                        </div>
                        <AuthForm>
                        </AuthForm>
                    </div>
                </CardPanel>
            </div>
        </div>
    );
}
