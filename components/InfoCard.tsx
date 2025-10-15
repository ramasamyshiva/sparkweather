import React from 'react';

interface InfoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ children, className = '', ...rest }) => {
  return (
    <div
      {...rest}
      className={`bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg dark:shadow-[0_15px_25px_rgba(0,0,0,0.3)] hover:bg-white/80 dark:hover:bg-white/10 hover:-translate-y-1 dark:hover:-translate-y-2 hover:shadow-xl dark:hover:shadow-[0_20px_35px_rgba(0,0,0,0.35),0_0_25px_rgba(0,170,255,0.2)] transition-all duration-300 ease-in-out ${className}`}
    >
      {children}
    </div>
  );
};

export default React.memo(InfoCard);