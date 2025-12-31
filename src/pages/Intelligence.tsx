import { StatsCard } from '@/components/ui/stats-card';
import { AlertList } from '@/components/ui/alert-list';
import { DataTable } from '@/components/ui/data-table';
import { TrendingUp, AlertTriangle, Users, Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RiskStudent {
  id: string;
  stid: string;
  name: string;
  class: string;
  riskScore: number;
  weakCompetencies: string[];
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: string;
}

const mockRiskStudents: RiskStudent[] = [
  { 
    id: '1', 
    stid: 'STID-0012', 
    name: 'Kwabena Ofosu', 
    class: 'JHS 2A', 
    riskScore: 78, 
    weakCompetencies: ['Algebra', 'Fractions'],
    trend: 'declining',
    lastUpdated: '2024-01-26'
  },
  { 
    id: '2', 
    stid: 'STID-0045', 
    name: 'Afia Serwaa', 
    class: 'JHS 1B', 
    riskScore: 65, 
    weakCompetencies: ['Reading Comprehension'],
    trend: 'stable',
    lastUpdated: '2024-01-26'
  },
  { 
    id: '3', 
    stid: 'STID-0023', 
    name: 'Yaw Asare', 
    class: 'Class 6A', 
    riskScore: 58, 
    weakCompetencies: ['Essay Writing', 'Grammar'],
    trend: 'improving',
    lastUpdated: '2024-01-26'
  },
  { 
    id: '4', 
    stid: 'STID-0089', 
    name: 'Akua Manu', 
    class: 'JHS 3A', 
    riskScore: 52, 
    weakCompetencies: ['Science Practicals'],
    trend: 'declining',
    lastUpdated: '2024-01-26'
  },
];

const mockAlerts = [
  {
    id: '1',
    title: '15 Students Above Risk Threshold',
    description: 'Students with risk score > 50% identified this week',
    severity: 'danger' as const,
    timestamp: 'Analysis: Jan 26, 2024',
  },
  {
    id: '2',
    title: 'JHS 2A Needs Attention',
    description: 'Class average risk score increased by 8% this term',
    severity: 'warning' as const,
    timestamp: 'Trend: Last 4 weeks',
  },
  {
    id: '3',
    title: 'Mathematics Competency Gap',
    description: 'Algebra identified as common weak area across JHS 1-3',
    severity: 'info' as const,
    timestamp: 'Subject Analysis',
  },
];

const Intelligence = () => {
  const columns = [
    { key: 'stid', header: 'Student ID', mono: true, sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'class', header: 'Class', sortable: true },
    {
      key: 'riskScore',
      header: 'Risk Score',
      sortable: true,
      mono: true,
      render: (row: RiskStudent) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full transition-all ${
                row.riskScore >= 70 ? 'bg-destructive' : row.riskScore >= 50 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${row.riskScore}%` }}
            />
          </div>
          <span className={`font-medium ${row.riskScore >= 70 ? 'text-destructive' : row.riskScore >= 50 ? 'text-warning' : ''}`}>
            {row.riskScore}%
          </span>
        </div>
      ),
    },
    {
      key: 'weakCompetencies',
      header: 'Weak Areas',
      render: (row: RiskStudent) => (
        <div className="flex flex-wrap gap-1">
          {row.weakCompetencies.map((comp) => (
            <span
              key={comp}
              className="rounded border border-border bg-muted/50 px-2 py-0.5 text-xs"
            >
              {comp}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'trend',
      header: 'Trend',
      render: (row: RiskStudent) => {
        const styles = {
          improving: 'text-success',
          declining: 'text-destructive',
          stable: 'text-muted-foreground',
        };
        const icons = {
          improving: '↑',
          declining: '↓',
          stable: '→',
        };
        return (
          <span className={`font-medium ${styles[row.trend]}`}>
            {icons[row.trend]} {row.trend.charAt(0).toUpperCase() + row.trend.slice(1)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Academic Intelligence</h1>
          <p className="text-sm text-muted-foreground">Risk analysis and competency tracking</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw size={16} />
          Run Analysis
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="School Risk Index"
          value="23%"
          subtitle="Average across all students"
          icon={TrendingUp}
        />
        <StatsCard
          title="At-Risk Students"
          value="89"
          subtitle="Score > 50%"
          icon={AlertTriangle}
          variant="warning"
        />
        <StatsCard
          title="High Risk"
          value="15"
          subtitle="Score > 70%"
          icon={Users}
          variant="danger"
        />
        <StatsCard
          title="Last Analysis"
          value="Jan 26"
          subtitle="Weekly update"
          icon={Brain}
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Risk Alerts */}
        <div className="lg:col-span-1">
          <AlertList title="Risk Insights" alerts={mockAlerts} />
        </div>

        {/* Risk Formula */}
        <div className="lg:col-span-2">
          <div className="card-legal">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Risk Calculation Formula</h3>
            </div>
            <div className="p-5">
              <div className="rounded-md border border-border bg-muted/30 p-4 font-mono text-sm">
                <p className="text-muted-foreground">Risk Score = 100 - Weighted Academic Score</p>
                <p className="mt-2">
                  <span className="text-muted-foreground">Where:</span>
                </p>
                <p className="mt-1">
                  Weighted Score = (Homework Avg × <span className="text-primary font-semibold">0.4</span>) + (Class Test Avg × <span className="text-primary font-semibold">0.6</span>)
                </p>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Homework Weight</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">40%</p>
                </div>
                <div className="rounded-md border border-border p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Class Test Weight</p>
                  <p className="mt-1 font-mono text-2xl font-semibold">60%</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Analysis runs automatically every Friday at 16:00. Manual analysis can be triggered using the "Run Analysis" button.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Students Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">High Risk Students</h2>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
        <DataTable
          columns={columns}
          data={mockRiskStudents}
          emptyMessage="No students currently at risk"
        />
      </div>
    </div>
  );
};

export default Intelligence;
