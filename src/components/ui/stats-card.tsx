import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'warning' | 'danger' | 'success';
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) => {
  const variantStyles = {
    default: 'border-border',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-destructive/30 bg-destructive/5',
    success: 'border-success/30 bg-success/5',
  };

  return (
    <div
      className={cn(
        'card-legal p-5',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={cn(
                'mt-2 text-xs font-medium',
                trend.isPositive ? 'text-success' : 'text-destructive'
              )}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last term
            </p>
          )}
        </div>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
            <Icon size={20} className="text-muted-foreground" />
          </div>
        )}
      </div>
    </div>
  );
};
