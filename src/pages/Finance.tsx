import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatsCard } from '@/components/ui/stats-card';
import { Search, Printer, Download, Wallet, AlertTriangle, TrendingUp, Users } from 'lucide-react';

interface Debtor {
  id: string;
  stid: string;
  name: string;
  class: string;
  totalBilled: number;
  totalPaid: number;
  arrears: number;
  lastPaymentDate: string;
}

interface CartItem {
  id: string;
  name: string;
  amount: number;
}

// Mock debtor data
const mockDebtors: Debtor[] = [
  { id: '1', stid: 'STID-0002', name: 'Ama Mensah', class: 'JHS 2B', totalBilled: 3500, totalPaid: 2000, arrears: 1500, lastPaymentDate: '2024-01-15' },
  { id: '2', stid: 'STID-0004', name: 'Adwoa Darko', class: 'JHS 1A', totalBilled: 3500, totalPaid: 1200, arrears: 2300, lastPaymentDate: '2024-01-10' },
  { id: '3', stid: 'STID-0005', name: 'Kofi Owusu', class: 'Class 5B', totalBilled: 2800, totalPaid: 2300, arrears: 500, lastPaymentDate: '2024-01-20' },
  { id: '4', stid: 'STID-0007', name: 'Kwesi Agyei', class: 'Class 4A', totalBilled: 2800, totalPaid: 2000, arrears: 800, lastPaymentDate: '2024-01-08' },
];

const feeItems = [
  { id: 'tuition', name: 'Tuition Fee', amount: 1500 },
  { id: 'pta', name: 'PTA Levy', amount: 200 },
  { id: 'sports', name: 'Sports Fee', amount: 150 },
  { id: 'exam', name: 'Examination Fee', amount: 100 },
  { id: 'ict', name: 'ICT Fee', amount: 250 },
];

const Finance = () => {
  const [activeTab, setActiveTab] = useState<'pos' | 'debtors'>('pos');
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<{ stid: string; name: string } | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [debtorSearch, setDebtorSearch] = useState('');

  const addToCart = (item: { id: string; name: string; amount: number }) => {
    if (!cart.find((c) => c.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.amount, 0);

  const filteredDebtors = mockDebtors.filter(
    (debtor) =>
      debtor.stid.toLowerCase().includes(debtorSearch.toLowerCase()) ||
      debtor.name.toLowerCase().includes(debtorSearch.toLowerCase())
  );

  const debtorColumns = [
    { key: 'stid', header: 'Student ID', sortable: true, mono: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'class', header: 'Class', sortable: true },
    {
      key: 'arrears',
      header: 'Arrears',
      sortable: true,
      mono: true,
      render: (row: Debtor) => (
        <span className="font-medium text-destructive">
          GHS {row.arrears.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'lastPaymentDate',
      header: 'Last Payment',
      mono: true,
      render: (row: Debtor) => new Date(row.lastPaymentDate).toLocaleDateString('en-GB'),
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <Button variant="outline" size="sm">
          Record Payment
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Finance Console</h1>
          <p className="text-sm text-muted-foreground">Payment collection and arrears management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Today's Collections" value="GHS 12,450" icon={Wallet} variant="success" />
        <StatsCard title="This Term" value="GHS 245,800" icon={TrendingUp} />
        <StatsCard title="Total Arrears" value="GHS 145,200" icon={AlertTriangle} variant="danger" />
        <StatsCard title="Debtors" value="89" icon={Users} variant="warning" />
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('pos')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pos'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            POS Mode
          </button>
          <button
            onClick={() => setActiveTab('debtors')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'debtors'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Debtors List
          </button>
        </div>
      </div>

      {activeTab === 'pos' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left - Student Search & Fee Items */}
          <div className="space-y-4">
            <div className="card-legal p-4">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search student by ID or name..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              {studentSearch && (
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => {
                      setSelectedStudent({ stid: 'STID-0002', name: 'Ama Mensah' });
                      setStudentSearch('');
                    }}
                    className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <span className="font-mono text-sm">STID-0002</span>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-sm font-medium">Ama Mensah</span>
                    </div>
                    <span className="text-xs text-muted-foreground">JHS 2B</span>
                  </button>
                </div>
              )}
            </div>

            {selectedStudent && (
              <>
                <div className="card-legal p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm text-muted-foreground">{selectedStudent.stid}</span>
                      <h3 className="text-lg font-semibold">{selectedStudent.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Change
                    </button>
                  </div>
                </div>

                <div className="card-legal">
                  <div className="border-b border-border px-4 py-3">
                    <h3 className="text-sm font-semibold">Fee Items</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {feeItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-muted/30"
                      >
                        <span className="text-sm">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm">GHS {item.amount}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addToCart(item)}
                            disabled={cart.some((c) => c.id === item.id)}
                          >
                            {cart.some((c) => c.id === item.id) ? 'Added' : 'Add'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right - Cart & Payment */}
          <div className="card-legal">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold">Payment Cart</h3>
            </div>

            {cart.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Wallet size={32} className="mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  {selectedStudent ? 'Add fee items to cart' : 'Select a student first'}
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between px-5 py-3">
                      <span className="text-sm">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">GHS {item.amount}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total</span>
                    <span className="font-mono text-xl font-semibold">GHS {cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-border p-5 space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Amount Received
                    </label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="font-mono text-lg"
                    />
                  </div>

                  {paymentAmount && Number(paymentAmount) >= cartTotal && (
                    <div className="rounded-md border border-success/30 bg-success/10 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Change</span>
                        <span className="font-mono font-medium text-success">
                          GHS {(Number(paymentAmount) - cartTotal).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Printer size={16} />
                      Print Receipt
                    </Button>
                    <Button className="flex-1" disabled={!paymentAmount || Number(paymentAmount) < cartTotal}>
                      Complete Payment
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === 'debtors' && (
        <div className="space-y-4">
          <div className="card-legal p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search debtors..."
                  value={debtorSearch}
                  onChange={(e) => setDebtorSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Download size={16} />
                Export PDF
              </Button>
            </div>
          </div>

          <DataTable columns={debtorColumns} data={filteredDebtors} emptyMessage="No debtors found" />
        </div>
      )}
    </div>
  );
};

export default Finance;
