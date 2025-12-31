import { useAuth } from '@/lib/auth-context';
import { StatsCard } from '@/components/ui/stats-card';
import { AlertList } from '@/components/ui/alert-list';
import { 
  Users, 
  Wallet, 
  AlertTriangle, 
  TrendingUp,
  GraduationCap,
  BookOpen,
  CheckCircle,
  Clock
} from 'lucide-react';

// Mock data
const mockAlerts = [
  {
    id: '1',
    title: 'High Arrears Alert',
    description: '23 students with arrears exceeding GHS 2,000',
    severity: 'danger' as const,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    title: 'Low Inventory',
    description: 'Exercise books stock below reorder level',
    severity: 'warning' as const,
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    title: 'Risk Assessment Due',
    description: 'Weekly academic risk analysis pending',
    severity: 'info' as const,
    timestamp: '1 day ago',
  },
];

const mockTasks = [
  { id: '1', title: 'Mark JHS 2 Mathematics Class Test', subject: 'Mathematics', dueDate: 'Today' },
  { id: '2', title: 'Enter Term 1 Scores for Class 6', subject: 'English', dueDate: 'Tomorrow' },
  { id: '3', title: 'Review Report Cards - JHS 3', subject: 'All Subjects', dueDate: '3 days' },
];

const ProprietorDashboard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of school operations</p>
      </div>
    </div>

    {/* Key Metrics - 4 Column Grid */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Cash Today"
        value="GHS 12,450"
        subtitle="32 transactions"
        icon={Wallet}
        trend={{ value: 8.2, isPositive: true }}
        variant="success"
      />
      <StatsCard
        title="Total Arrears"
        value="GHS 145,200"
        subtitle="89 students in debt"
        icon={AlertTriangle}
        trend={{ value: 3.1, isPositive: false }}
        variant="danger"
      />
      <StatsCard
        title="Enrollment"
        value="847"
        subtitle="Active students"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Risk Index"
        value="23%"
        subtitle="Students at academic risk"
        icon={TrendingUp}
        trend={{ value: 5.4, isPositive: true }}
        variant="warning"
      />
    </div>

    {/* Secondary Row */}
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Alerts */}
      <div className="lg:col-span-2">
        <AlertList alerts={mockAlerts} />
      </div>

      {/* Quick Stats */}
      <div className="space-y-4">
        <div className="card-legal p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Today's Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">New Admissions</span>
              <span className="font-mono text-sm font-medium">3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fee Payments</span>
              <span className="font-mono text-sm font-medium">32</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Store Sales</span>
              <span className="font-mono text-sm font-medium">GHS 890</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reports Generated</span>
              <span className="font-mono text-sm font-medium">12</span>
            </div>
          </div>
        </div>

        <div className="card-legal p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="status-dot status-dot-success" />
              <span className="text-sm">Database: Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot status-dot-success" />
              <span className="text-sm">Backup: Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="status-dot status-dot-success" />
              <span className="text-sm">Last Sync: Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TeacherDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold">My Dashboard</h1>
      <p className="text-sm text-muted-foreground">Your tasks and class overview</p>
    </div>

    {/* Quick Stats */}
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard
        title="My Classes"
        value="4"
        subtitle="Assigned this term"
        icon={GraduationCap}
      />
      <StatsCard
        title="Subjects"
        value="2"
        subtitle="Mathematics, Science"
        icon={BookOpen}
      />
      <StatsCard
        title="Pending Scores"
        value="45"
        subtitle="To be entered"
        icon={Clock}
        variant="warning"
      />
      <StatsCard
        title="Completed"
        value="128"
        subtitle="Scores entered"
        icon={CheckCircle}
        variant="success"
      />
    </div>

    {/* Tasks */}
    <div className="card-legal">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold">Pending Tasks</h3>
      </div>
      <div className="divide-y divide-border">
        {mockTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.subject}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-xs">
                {task.dueDate}
              </span>
              <button className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted">
                Start
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BursarDashboard = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-semibold">Finance Dashboard</h1>
      <p className="text-sm text-muted-foreground">Daily collections and arrears</p>
    </div>

    {/* Finance Metrics */}
    <div className="grid gap-4 md:grid-cols-4">
      <StatsCard
        title="Today's Collections"
        value="GHS 12,450"
        subtitle="32 payments"
        icon={Wallet}
        variant="success"
      />
      <StatsCard
        title="This Week"
        value="GHS 45,200"
        subtitle="142 payments"
        icon={TrendingUp}
      />
      <StatsCard
        title="Outstanding"
        value="GHS 145,200"
        subtitle="89 debtors"
        icon={AlertTriangle}
        variant="danger"
      />
      <StatsCard
        title="Collection Rate"
        value="76%"
        subtitle="Term 1 target"
        icon={CheckCircle}
      />
    </div>

    {/* Alerts */}
    <AlertList 
      title="Finance Alerts"
      alerts={mockAlerts.filter(a => a.title.includes('Arrears'))} 
    />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  // Render role-specific dashboard
  switch (user?.role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return <ProprietorDashboard />;
    case 'BURSAR':
      return <BursarDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    default:
      return <ProprietorDashboard />;
  }
};

export default Dashboard;
