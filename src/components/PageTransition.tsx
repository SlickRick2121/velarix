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
          <aside className="page-loader">
            <div style={{ "--s": 0 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 1 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 2 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 3 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 4 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 5 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 6 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 7 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 8 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 9 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 10 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 11 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 12 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 13 } as React.CSSProperties} className="aro"></div>
            <div style={{ "--s": 14 } as React.CSSProperties} className="aro"></div>
          </aside>
          <style>{`
            .page-loader {
              width: 300px;
              height: 300px;
              position: relative;
              transform-style: preserve-3d;
              transform: perspective(500px) rotateX(60deg);
            }

            .page-loader .aro {
              position: absolute;
              inset: calc(var(--s) * 10px);
              box-shadow: inset 0 0 80px rgba(0, 159, 183, 0.6);
              clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
              animation: up_and_down 3s infinite ease-in-out both;
              animation-delay: calc(var(--s) * -0.1s);
            }

            @keyframes up_and_down {
              0%,
              100% {
                transform: translateZ(-100px) rotate(0deg);
              }
              50% {
                transform: translateZ(100px) rotate(90deg);
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
