import { AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertItem {
  id: string;
  title: string;
  description: string;
  severity: 'warning' | 'danger' | 'info';
  timestamp?: string;
}

interface AlertListProps {
  title?: string;
  alerts: AlertItem[];
  className?: string;
}

export const AlertList = ({ title = 'Alerts', alerts, className }: AlertListProps) => {
  const severityStyles = {
    warning: 'border-l-warning',
    danger: 'border-l-destructive',
    info: 'border-l-primary',
  };

  return (
    <div className={cn('card-legal', className)}>
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-warning" />
          <h3 className="text-sm font-semibold">{title}</h3>
          {alerts.length > 0 && (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-medium text-destructive-foreground">
              {alerts.length}
            </span>
          )}
        </div>
      </div>
      <div className="divide-y divide-border">
        {alerts.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-muted-foreground">No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                'flex cursor-pointer items-center gap-4 border-l-4 px-5 py-4 transition-colors hover:bg-muted/30',
                severityStyles[alert.severity]
              )}
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{alert.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{alert.description}</p>
                {alert.timestamp && (
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {alert.timestamp}
                  </p>
                )}
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
