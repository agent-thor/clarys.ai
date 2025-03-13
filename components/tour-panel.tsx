import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function TourPanel({
  className,
  tourNeeded,
}: {
  className?: string;
  tourNeeded: boolean;
}) {
  const router = useRouter();

  const step1 = (
    <div className="self-stretch grow shrink basis-0 justify-start items-start gap-8 inline-flex flex-1">
      <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
        <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">
          Why use Clarys.AI
        </div>
        <div className="w-[480px]">
          <div className="text-primary text-[14px] font-normal font-clarys leading-6 pb-8">
            Clarys is your personalized AI assistant, trained on OpenGov data.
            It helps you navigate through on-chain & off-chain data, proposals
            and discussions.
            <br />
          </div>
          <div className="text-primary text-[14px] font-normal font-clarys leading-6">
            Clarys.ai is built for:
            <br />
          </div>
          <ul className="text-primary text-[14px] font-bold font-clarys leading-6 list-disc list-inside pl-2 marker:font-normal">
            <li> DOT Holders </li>
            <li> Bounty Curators and </li>
            <li> DVs </li>
          </ul>
          <div className="text-primary text-[14px] font-normal font-clarys leading-6">
            to make better decisions within OpenGov.
          </div>
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="w-[560px] h-[280px] relative">
          <img
            className="absolute left-[0px] top-[62.80px] origin-top-left rounded-2xl "
            src="/images/layer_4.png"
            alt="layer_4"
          />
          <img
            className="absolute left-[12.11px] top-[31.69px] origin-top-left rounded-2xl "
            src="/images/layer_3.png"
            alt="layer_3"
          />
          <img
            className="absolute left-[24.22px] top-[0.58px] origin-top-left rounded-2xl "
            src="/images/layer_2.png"
            alt="layer_2"
          />
          <img
            className="absolute left-[36.33px] top-[-30.53px] origin-top-left rounded-2xl "
            src="/images/layer_1.png"
            alt="layer_1"
          />
        </div>
      </div>
    </div>
  );

  const step2 = (
    <div className="self-stretch grow shrink basis-0 justify-start items-start gap-8 inline-flex flex-1">
      <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
        <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">
          What Clarys.AI can do for you
        </div>
        <div className="w-[480px]">
          <div className="text-primary text-[14px] font-normal font-clarys leading-6">
            As your OpenGov assistant, Clarys automates your workflow as
            follows: <br />
          </div>
          <div className="text-primary text-[14px] font-bold font-clarys leading-6">
            Check Accountability:
          </div>
          <div className="text-primary text-[14px] font-normal font-clarys leading-6">
            Find out how complete a proposal is and how trustworthy its
            beneficiary.
            <br />
            <br />
          </div>
          <div className="text-primary text-[14px] font-bold font-clarys leading-6">
            Compare:
          </div>
          <div className="text-primary text-[14px] font-normal font-clarys leading-6">
            Double check if bounty submissions have also been submitted to
            Treasury or other funding streams.
            <br />
            <br />
          </div>
          <div className="text-primary text-[14px] font-bold font-clarys leading-6">
            Categorize:
          </div>
          <div className="text-primary text-[14px] font-normal font-clarys leading-6">
            Quickly access proposals, discussions and bounty submissions within
            categories.
          </div>
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="w-[560px] h-[280px] relative">
          <img
            className="absolute top-[-16px] w-[560px] h-[315px]"
            src="/images/step_2.png"
            alt="step 2"
          />
        </div>
      </div>
    </div>
  );

  const step3 = (
    <div className="self-stretch grow shrink basis-0 justify-start items-start gap-8 inline-flex flex-1">
      <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
        <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">
          How Clarys.AI does it
        </div>
        <ul className="text-primary text-[14px] font-clarys leading-6 list-disc list-inside pl-2 marker:font-normal space-y-8">
          <li>
            <span className="font-bold"> Decide </span>
            <span className="text-primary text-[14px] font-normal font-clarys leading-6">
              automated Workflow, e.g. Accountability check, proposal comparison
              or category overview
            </span>
          </li>
          <li>
            <span className="font-bold"> Tell </span>
            <span className="text-primary text-[14px] font-normal font-clarys leading-6">
              Clarys.AI what kind of user you are
            </span>
          </li>
          <li>
            <span className="font-bold"> Start </span>
            <span className="text-primary text-[14px] font-normal font-clarys leading-6">
              checking proposals
            </span>{" "}
          </li>
        </ul>
      </div>
      <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-2.5 inline-flex">
        <div className="w-[560px] h-[280px] relative">
          <img
            className="absolute top-[-16px] w-[560px] h-[315px]"
            src="/images/step_3.png"
            alt="step 3"
          />
        </div>
      </div>
    </div>
  );

  const steps = [step1, step2, step3];

  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowOnStartup, setDontShowOnStartup] = useState(!tourNeeded);

  const buttonTexts = [
    { previous: "", next: "See What" },
    { previous: "Why Clarys", next: "Learn How" },
    { previous: "See What", next: "Start using Clarys.AI" },
  ];

  useEffect(() => {
    if (tourNeeded !== null) {
      setDontShowOnStartup(tourNeeded);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleTourComplete(true);
      handleTourNeeded(!dontShowOnStartup);

      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onDontShowOnStartupChanged = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDontShowOnStartup(e.target.checked);
  };

  return (
    <div
      className={
        "stepContainer self-stretch grow shrink bg-transparent w-full flex flex-col flex-1 justify-between overflow-y-auto pt-8"
      }
    >
      <div className="stepPanel shrink text-primary pb-16 flex flex-col flex-1 w-full min-h-[320px] h-auto overflow-y-scroll hiddenScroll">
        {steps[currentStep]}
      </div>
      <div className="stepToolbar w-full h-16 justify-start items-start gap-8 inline-flex">
        <div className="grow shrink basis-0 h-12 justify-start items-center gap-2 flex">
          <label className="relative flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="dontShowOnStartup"
              checked={dontShowOnStartup}
              onChange={(e) => onDontShowOnStartupChanged(e)}
              className="peer hidden"
            />
            <div className="w-12 h-12 border border-white/30 rounded-2xl justify-center items-center gap-4 flex checkBoxEffects transition">
              {/*peer-checked:border-white/70*/}
              {dontShowOnStartup && (
                <img src="/images/check.svg" className="peer-checked" />
              )}
            </div>
          </label>
          <label
            htmlFor="dontShowOnStartup"
            className="font-clarys text-[14px] text-black"
          >
            Do not show on next startup
          </label>
        </div>
        <div className="justify-start items-center gap-4 flex">
          {currentStep !== 0 && (
            <Button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="w-[240px] h-[48px] rounded-2xl px-8 py-4 border"
            >
              <Image
                src="/images/previous.svg"
                alt="previous"
                width={14.7}
                height={5.33}
              />
              <span className="text-clarys text-primary text-[14px]">
                {buttonTexts[currentStep].previous}
              </span>
            </Button>
          )}
          <Button
            onClick={nextStep}
            className="w-[240px] h-[48px] rounded-2xl px-8 py-4 border"
          >
            <span className="text-clarys text-primary text-[14px]">
              {buttonTexts[currentStep].next}
            </span>
            <Image
              src="/images/next.svg"
              alt="next"
              width={14.7}
              height={5.33}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const handleTourComplete = (tourCompleted: boolean) => {
  document.cookie = `tourCompleted=${String(
    tourCompleted
  )}; path=/; max-age=31536000`; // Expires in 1 year
};
export const handleTourNeeded = (tourNeeded: boolean) => {
  document.cookie = `tourNeeded=${String(
    tourNeeded
  )}; path=/; max-age=31536000`; // Expires in 1 year
};
