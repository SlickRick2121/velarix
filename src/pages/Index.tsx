import AnimatedBackground from '@/components/AnimatedBackground';

export default function VelarixLanding() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative min-h-screen w-full overflow-hidden">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold text-white">
          Velarix<span className="text-purple-500">.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#blog" className="hover:text-white transition-colors">Blog</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
          Get Started
        </button>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Velarix<span className="text-purple-500">.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">Digital Studio</p>
          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            Crafting modern digital experiences for small businesses and creators across the
            Netherlands and United States
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg transition-all flex items-center gap-2 text-lg font-medium">
              Start Project
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="border-2 border-gray-600 hover:border-purple-500 text-white px-8 py-4 rounded-lg transition-all text-lg font-medium">
              Explore Services
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2 text-gray-400 animate-bounce">
          <span className="text-sm">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
    </>
  );
}
