import { Calendar, Wifi, WifiOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AppHeader = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-card px-6">
      {/* Left - Term Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-muted-foreground" />
          <span className="font-medium">Term 1</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">2024/2025</span>
        </div>
      </div>

      {/* Right - Status */}
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${
            isOnline
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-warning/30 bg-warning/10 text-warning'
          }`}
        >
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-mono">{new Date().toLocaleDateString('en-GB')}</span>
        </div>
      </div>
    </header>
  );
};
