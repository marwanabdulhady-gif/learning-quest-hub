import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, Settings } from 'lucide-react';
import { PointsDisplay } from './PointsDisplay';
import { cn } from '@/lib/utils';

interface HeaderProps {
  totalPoints: number;
}

export function Header({ totalPoints }: HeaderProps) {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Learn', icon: Home },
    { to: '/dashboard', label: 'My Progress', icon: Trophy },
    { to: '/admin', label: 'Manage', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-2xl shadow-button transition-transform group-hover:scale-110">
            📐
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-tight text-foreground">
              Math Learning Hub
            </h1>
            <p className="text-xs text-muted-foreground">Grade 4</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                location.pathname === to
                  ? 'bg-primary text-primary-foreground shadow-button'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Points */}
        <PointsDisplay points={totalPoints} size="sm" />
      </div>
    </header>
  );
}
