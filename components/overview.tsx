import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = (/*param here*/) => {
  //todo get the userName
  const userName = 'UserName'

  return (
    <motion.div
      key="overview"
      className=""
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className='flex flex-col gap-4'>
        <div className='font-clarys leading-[80px] font-bold text-greetingMedium text-left'>
          Hello, <span className='text-gradient'>{userName}! </span>
        </div>
        <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">What can I do for you today?</div>
      </div>
    </motion.div>
  );
};
