export const Overview = ({
                             userName,
                         }: {
    userName: string;
}) => {

    return (
        <div className='flex flex-col gap-4'>
            <div className='font-clarys leading-[80px] font-bold text-greetingMedium text-left'>
                Hello, <span className='text-gradient'>{userName}! </span>
            </div>
            <div className="self-stretch text-primary text-[24px] font-bold font-clarys leading-6">What can I do for you
                today?
            </div>
        </div>
    );
};
