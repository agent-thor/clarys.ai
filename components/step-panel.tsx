import React, { useState, useEffect } from "react";
import {Button} from "@/components/ui/button";
import {saveTourNeeded} from "@/app/(chat)/actions";
import {useRouter} from "next/navigation";

interface TourPanelProps {
  className?: string;
  tourNeeded: boolean;
}

export default function TourPanel({ className, tourNeeded }: React.FC<TourPanelProps>){

  const router = useRouter();

  const step1 = <div className="self-stretch grow shrink basis-0 justify-start items-start gap-8 inline-flex">
    <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
      <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">Why use Clarys.AI
      </div>
      <div className="w-[480px]">
        <div className="text-primary text-[14px] font-normal font-clarys leading-6 pb-8">
          Clarys is your personalized AI assistant, trained on OpenGov data.  It helps you navigate through on-chain & off-chain data, proposals and discussions.

          <br/></div>
        <div className="text-primary text-[14px] font-normal font-clarys leading-6">
          Clarys.ai is built for:
          <br/></div>
        <ul className="text-primary text-[14px] font-bold font-clarys leading-6 list-disc list-inside pl-2 marker:font-normal">
          <li> DOT Holders </li>
          <li> Bounty Curators and </li>
          <li> DVs </li>
        </ul>
        <span className="text-primary text-[14px] font-normal font-clarys leading-6">to make better decisions within OpenGov.</span></div>
    </div>
    <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="w-[560px] h-[280px] relative">
        <img className="absolute left-[0px] top-[62.80px] origin-top-left rounded-2xl " src="/images/layer_4.png" alt='layer_4'/>
        <img className="absolute left-[12.11px] top-[31.69px] origin-top-left rounded-2xl " src="/images/layer_3.png" alt='layer_3'/>
        <img className="absolute left-[24.22px] top-[0.58px] origin-top-left rounded-2xl " src="/images/layer_2.png" alt='layer_2'/>
        <img className="absolute left-[36.33px] top-[-30.53px] origin-top-left rounded-2xl " src="/images/layer_1.png" alt='layer_1'/>

      </div>
    </div>
  </div>

  const step2 = <div className="self-stretch grow shrink basis-0 justify-start items-start gap-8 inline-flex">
    <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
      <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">What Clarys.AI can do for you
      </div>
      <div className="w-[480px]"><span className="text-primary text-[14px] font-normal font-clarys leading-6">As your OpenGov assistant, Clarys automates your workflow as follows:  <br/></span><span className="text-primary text-[14px] font-bold font-clarys leading-6">Check Accountability:</span><span className="text-primary text-[14px] font-normal font-clarys leading-6"> Find out how complete a proposal is and how trustworthy its beneficiary.<br/><br/></span><span className="text-primary text-[14px] font-bold font-clarys leading-6">Compare:</span><span className="text-primary text-[14px] font-normal font-clarys leading-6"> Double check if bounty submissions have also been submitted to Treasury or other funding streams.<br/><br/></span><span className="text-primary text-[14px] font-bold font-clarys leading-6">Categorize:</span><span className="text-primary text-[14px] font-normal font-clarys leading-6"> Quickly access proposals, discussions and bounty submissions within categories.</span></div>

    </div>
    <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="w-[560px] h-[280px] relative">
        <img className="absolute top-[-16px] w-[560px] h-[315px]" src="/images/step_2.png" alt='step 2' />
      </div>
    </div>
  </div>

  const step3 = <div className="self-stretch grow shrink basis-0 justify-start items-start gap-8 inline-flex">
    <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-8 inline-flex">
      <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">How Clarys.AI does it
      </div>
      <div className="w-[480px]"><span className="text-primary text-[14px] font-bold font-clarys leading-6">Decide</span><span className="text-primary text-[14px] font-normal font-clarys leading-6"> automated Workflow, e.g. Accountability check, proposal comparison or category overview<br/></span><span className="text-primary text-[14px] font-normal font-clarys leading-6"><br/></span><span className="text-primary text-[14px] font-bold font-clarys leading-6">Tell</span><span className="text-primary text-[14px] font-normal font-clarys leading-6"> Clarys.AI what kind of user you are<br/></span><span className="text-primary text-[14px] font-normal font-clarys leading-6"><br/></span><span className="text-primary text-[14px] font-bold font-clarys leading-6">Start</span><span className="text-primary text-[14px] font-normal font-clarys leading-6"> checking proposals</span></div>

    </div>
    <div className="grow shrink basis-0 self-stretch flex-col justify-start items-start gap-2.5 inline-flex">
      <div className="w-[560px] h-[280px] relative">
        <img className="absolute top-[-16px] w-[560px] h-[315px]" src="/images/step_3.png" alt='step 3' />
      </div>
    </div>
  </div>

  const steps = [
    step1,
    step2,
    step3,
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isShowTourOnStart, setIsShowTourOnStart] = useState(true);

  useEffect(() => {
    if (tourNeeded !== null) {
      setIsShowTourOnStart(tourNeeded);
    }
  }, []);

  // useEffect(() => {
  //   tourNeeded = isShowTourOnStart;
  // }, [isShowTourOnStart]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      saveTourNeeded(isShowTourOnStart);
      router.push('/');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onShowTourOnStartChanged = (e) => {
    setIsShowTourOnStart(e.target.checked);
    saveTourNeeded(!e.target.checked);
  }

  return (
    <div className={`bg-transparent w-full flex-col flex-1 justify-between ${className}`}>
      {/* Tour Content */}
      <div className="text-gray-600 mb-6 flex flex-col flex-1">{steps[currentStep]}</div>
      <div className="w-full h-12 justify-start items-start gap-8 inline-flex flex-1">
        <div className="grow shrink basis-0 h-12 justify-start items-center gap-2 flex">
          {/*<div className="p-4 bg-gradient-to-b from-[#dbdde0] to-[#e6e8eb] rounded-2xl shadow-inner border border-white/30 justify-center items-center gap-4 flex">*/}
          {/*  <div className="w-4 h-4 pl-[2.19px] pr-[1.53px] pt-[3.53px] pb-[3.06px] justify-center items-center flex" />*/}
          {/*</div>*/}
          {/*<div className="text-primary text-[14px] font-normal font-clarys leading-none">Do not show on next startup</div>*/}

          <input
              type="checkbox"
              id="showTourOnStart"
              checked={isShowTourOnStart}
              onChange={(e) => onShowTourOnStartChanged(e)}
              className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="showTourOnStart" className="font-clarys text-[14px]">
            Do not show on next startup
          </label>
        </div>
        <div className="justify-start items-center gap-4 flex">
          { currentStep !== 0 && <Button
              onClick={prevStep}
              disabled={currentStep === 0}
          >
            Previous
          </Button> }
          <Button
              onClick={nextStep}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

