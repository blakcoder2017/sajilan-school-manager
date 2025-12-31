import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-10 w-10 mx-auto skeleton-pulse rounded-md" />
          <p className="text-sm text-muted-foreground">Establishing session...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(username, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-md border border-border bg-primary">
            <span className="font-mono text-2xl font-bold text-primary-foreground">S</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Sajilan SMS</h1>
          <p className="mt-1 text-sm text-muted-foreground">School Management System</p>
        </div>

        {/* Login Card */}
        <div className="card-legal p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-medium uppercase tracking-wider">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="h-11"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Establishing Session...' : 'Sign In'}
            </Button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-md border border-border bg-muted/50 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Demo Credentials
          </p>
          <div className="space-y-1 font-mono text-xs text-muted-foreground">
            <p>proprietor / admin123</p>
            <p>headmaster / admin123</p>
            <p>bursar / admin123</p>
            <p>teacher / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
