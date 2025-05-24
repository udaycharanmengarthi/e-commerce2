import React from 'react';
import { Star } from 'lucide-react';
import { formatRating } from '../../utils/formatters';

interface RatingProps {
  value: number;
  reviewCount?: number;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  reviewCount,
  showCount = false,
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: {
      star: 'w-3 h-3',
      text: 'text-xs',
    },
    md: {
      star: 'w-4 h-4',
      text: 'text-sm',
    },
    lg: {
      star: 'w-5 h-5',
      text: 'text-base',
    },
  };

  // Create array of 5 stars
  const stars = Array.from({ length: 5 }, (_, i) => {
    // Full star
    if (i < Math.floor(value)) {
      return <Star key={i} className={`${sizeStyles[size].star} fill-yellow-400 text-yellow-400`} />;
    }
    // Half star
    else if (i === Math.floor(value) && value % 1 >= 0.5) {
      return (
        <div key={i} className="relative">
          <Star className={`${sizeStyles[size].star} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${sizeStyles[size].star} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      );
    }
    // Empty star
    else {
      return <Star key={i} className={`${sizeStyles[size].star} text-gray-300`} />;
    }
  });

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">{stars}</div>
      {showCount && reviewCount !== undefined && (
        <div className={`ml-2 ${sizeStyles[size].text} text-gray-500`}>
          <span className="font-medium text-gray-700">{formatRating(value)}</span>
          <span className="mx-1">•</span>
          <span>{reviewCount} reviews</span>
        </div>
      )}
    </div>
  );
};

export default Rating;