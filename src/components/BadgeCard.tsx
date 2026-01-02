import { cn } from '@/lib/utils';
import type { Badge as BadgeType } from '@/data/badges';

interface BadgeCardProps {
  badge: BadgeType;
  isEarned: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
  gold: {
    bg: 'bg-gold/20',
    border: 'border-gold/40',
    shadow: 'shadow-badge',
  },
  accent: {
    bg: 'bg-accent/20',
    border: 'border-accent/40',
    shadow: 'shadow-badge',
  },
  primary: {
    bg: 'bg-primary/20',
    border: 'border-primary/40',
    shadow: 'shadow-card',
  },
  success: {
    bg: 'bg-success/20',
    border: 'border-success/40',
    shadow: 'shadow-card',
  },
};

const sizeClasses = {
  sm: {
    container: 'p-3',
    icon: 'text-2xl h-10 w-10',
    title: 'text-sm',
    description: 'text-xs',
  },
  md: {
    container: 'p-4',
    icon: 'text-3xl h-14 w-14',
    title: 'text-base',
    description: 'text-sm',
  },
  lg: {
    container: 'p-5',
    icon: 'text-4xl h-16 w-16',
    title: 'text-lg',
    description: 'text-sm',
  },
};

export function BadgeCard({ badge, isEarned, size = 'md' }: BadgeCardProps) {
  const colors = colorClasses[badge.color];
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        'relative rounded-2xl border-2 transition-all duration-300',
        sizes.container,
        isEarned
          ? cn(colors.bg, colors.border, colors.shadow, 'opacity-100')
          : 'bg-muted/30 border-muted opacity-50 grayscale',
        isEarned && 'hover:scale-105 hover:shadow-lg cursor-pointer'
      )}
    >
      {/* Sparkle effect for earned badges */}
      {isEarned && (
        <div className="absolute -top-1 -right-1 text-xl animate-sparkle">✨</div>
      )}

      {/* Badge icon */}
      <div
        className={cn(
          'mx-auto mb-3 flex items-center justify-center rounded-full',
          sizes.icon,
          isEarned ? colors.bg : 'bg-muted/50'
        )}
      >
        {badge.icon}
      </div>

      {/* Badge info */}
      <div className="text-center">
        <h4 className={cn('font-bold', sizes.title, isEarned ? 'text-foreground' : 'text-muted-foreground')}>
          {badge.title}
        </h4>
        <p className={cn('mt-1', sizes.description, 'text-muted-foreground')}>
          {badge.description}
        </p>
      </div>

      {/* Lock icon for unearned */}
      {!isEarned && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/60">
          <span className="text-3xl">🔒</span>
        </div>
      )}
    </div>
  );
}
