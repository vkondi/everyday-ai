export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 -z-10 w-screen h-screen overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/40 via-white/30 to-amber-100/50 dark:from-amber-900/30 dark:via-slate-900/40 dark:to-amber-800/35"></div>
      
      {/* Animated Stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 dark:bg-amber-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-500/60 dark:bg-amber-400/60 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Neural Network Grid - Enhanced visibility */}
      <div className="absolute inset-0 opacity-25 dark:opacity-35">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="neuralGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.3"
                className="text-amber-600/50 dark:text-amber-400/60"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#neuralGrid)" />
        </svg>
      </div>

      {/* Animated Circuit Lines */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(245 158 11)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="rgb(217 119 6)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Horizontal circuit lines */}
          <line x1="0" y1="20" x2="100" y2="20" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" />
          <line x1="0" y1="40" x2="100" y2="40" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '0.5s'}} />
          <line x1="0" y1="60" x2="100" y2="60" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '1s'}} />
          <line x1="0" y1="80" x2="100" y2="80" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '1.5s'}} />
          
          {/* Vertical circuit lines */}
          <line x1="20" y1="0" x2="20" y2="100" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '0.3s'}} />
          <line x1="40" y1="0" x2="40" y2="100" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '0.8s'}} />
          <line x1="60" y1="0" x2="60" y2="100" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '1.3s'}} />
          <line x1="80" y1="0" x2="80" y2="100" stroke="url(#circuitGradient)" strokeWidth="0.4" className="animate-pulse" style={{animationDelay: '1.8s'}} />
        </svg>
      </div>

      {/* Data Flow Streams */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dataFlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(245 158 11)" stopOpacity="0" />
              <stop offset="50%" stopColor="rgb(217 119 6)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(180 83 9)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          <path
            d="M 0 15 Q 25 10 50 15 T 100 15"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="0.6"
            className="animate-pulse"
          />
          <path
            d="M 0 35 Q 25 30 50 35 T 100 35"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="0.6"
            className="animate-pulse"
            style={{animationDelay: '0.7s'}}
          />
          <path
            d="M 0 55 Q 25 50 50 55 T 100 55"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="0.6"
            className="animate-pulse"
            style={{animationDelay: '1.4s'}}
          />
          <path
            d="M 0 75 Q 25 70 50 75 T 100 75"
            fill="none"
            stroke="url(#dataFlow)"
            strokeWidth="0.6"
            className="animate-pulse"
            style={{animationDelay: '2.1s'}}
          />
        </svg>
      </div>

      {/* Glowing Orbs - Removed circular objects as requested */}
      
      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-15 dark:opacity-20">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </div>
  )
} 