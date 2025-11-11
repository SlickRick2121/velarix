import { useNavigate } from 'react-router-dom';
import './ServiceCard3D.css';

interface ServiceCard3DProps {
  text: string;
  icon: React.ReactNode;
  path: string;
  rotation?: number; // Kept for compatibility but not used in 3D design
}

const ServiceCard3D = ({ text, icon, path }: ServiceCard3DProps) => {
  const navigate = useNavigate();

  return (
    <div className="card-3d-parent">
      <div className="card-3d">
        <div className="logo-3d">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <span className="circle circle4"></span>
          <span className="circle circle5">
            <div className="icon-wrapper">
              {icon}
            </div>
          </span>
        </div>
        <div className="glass-3d"></div>
        <div className="content-3d">
          <span className="title-3d">{text}</span>
          <span className="text-3d">
            Discover our comprehensive solutions tailored to your needs
          </span>
        </div>
        <div className="bottom-3d">
          <div className="view-more-3d">
            <button 
              className="view-more-button-3d"
              onClick={() => navigate(path)}
              aria-label={`View ${text} details`}
            >
              Learn More
            </button>
            <svg 
              className="svg-3d" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard3D;
