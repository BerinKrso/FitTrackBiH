
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      {/* Main circle with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-full shadow-lg">
        {/* Inner glow effect */}
        <div className="absolute inset-0.5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-80"></div>
      </div>
      
      {/* Center icon - stylized dumbbell/fitness symbol */}
      <div className="relative z-10 flex items-center justify-center text-white font-bold">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-1/2 h-1/2"
        >
          <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
        </svg>
      </div>
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
    </div>
  );
};
