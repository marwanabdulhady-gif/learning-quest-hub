import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  points: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

const sizeClasses = {
  sm: 'text-lg px-3 py-1.5 gap-1.5',
  md: 'text-xl px-4 py-2 gap-2',
  lg: 'text-3xl px-6 py-3 gap-3',
};

const iconSizes = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-8 w-8',
};

export function PointsDisplay({
  points,
  size = 'md',
  showLabel = true,
  animate = false,
}: PointsDisplayProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full font-bold',
        'bg-gold/20 text-gold-foreground',
        sizeClasses[size],
        animate && 'animate-pulse-glow'
      )}
    >
      <Star className={cn(iconSizes[size], 'fill-gold text-gold')} />
      <span>{points.toLocaleString()}</span>
      {showLabel && <span className="font-medium opacity-70">pts</span>}
    </div>
  );
}
