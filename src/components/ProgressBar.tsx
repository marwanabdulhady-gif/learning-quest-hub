import { cn } from '@/lib/utils';

interface ProgressBarProps {
  completed: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'accent';
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const colorClasses = {
  primary: 'gradient-primary',
  success: 'gradient-success',
  accent: 'gradient-accent',
};

export function ProgressBar({
  completed,
  total,
  showLabel = true,
  size = 'md',
  color = 'primary',
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            {completed} of {total} lessons completed
          </span>
          <span className="font-bold text-primary">{percentage}%</span>
        </div>
      )}
      <div className={cn('w-full overflow-hidden rounded-full bg-muted', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
