import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isTransitioning && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
          <div className="loader">
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
            <div className="loader-square"></div>
          </div>
          <style>{`
            .loader {
              position: relative;
              width: 48px;
              height: 48px;
              transform: rotate(45deg);
            }

            .loader-square {
              position: absolute;
              width: 14px;
              height: 14px;
              background: hsl(var(--accent));
              border-radius: 2px;
              animation: loader-square 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }

            .loader-square:nth-child(1) {
              top: 0;
              left: 0;
              animation-delay: 0s;
            }

            .loader-square:nth-child(2) {
              top: 0;
              left: 17px;
              animation-delay: 0.1s;
            }

            .loader-square:nth-child(3) {
              top: 0;
              left: 34px;
              animation-delay: 0.2s;
            }

            .loader-square:nth-child(4) {
              top: 17px;
              left: 34px;
              animation-delay: 0.3s;
            }

            .loader-square:nth-child(5) {
              top: 34px;
              left: 34px;
              animation-delay: 0.4s;
            }

            .loader-square:nth-child(6) {
              top: 34px;
              left: 17px;
              animation-delay: 0.5s;
            }

            .loader-square:nth-child(7) {
              top: 34px;
              left: 0;
              animation-delay: 0.6s;
            }

            @keyframes loader-square {
              0%, 10% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
              }
              50% {
                transform: translate(0, 0) scale(0.5);
                opacity: 0.5;
              }
              100% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
              }
            }
          `}</style>
        </div>
      )}
      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </div>
    </>
  );
};

export default PageTransition;
