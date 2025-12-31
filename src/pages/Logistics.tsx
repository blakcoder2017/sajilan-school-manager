import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Bus, UtensilsCrossed, AlertTriangle, Plus, Search } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderLevel: number;
  unitPrice: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface ServiceOption {
  id: string;
  name: string;
  type: 'bus' | 'feeding';
  monthlyCost: number;
  subscribers: number;
}

const mockInventory: InventoryItem[] = [
  { id: '1', name: 'Exercise Book (40 leaves)', category: 'Stationery', stockLevel: 450, reorderLevel: 100, unitPrice: 5, status: 'in_stock' },
  { id: '2', name: 'Exercise Book (80 leaves)', category: 'Stationery', stockLevel: 85, reorderLevel: 100, unitPrice: 8, status: 'low_stock' },
  { id: '3', name: 'Blue Pen (Box)', category: 'Stationery', stockLevel: 25, reorderLevel: 50, unitPrice: 45, status: 'low_stock' },
  { id: '4', name: 'School Uniform (M)', category: 'Uniform', stockLevel: 12, reorderLevel: 20, unitPrice: 150, status: 'low_stock' },
  { id: '5', name: 'School Uniform (L)', category: 'Uniform', stockLevel: 0, reorderLevel: 20, unitPrice: 160, status: 'out_of_stock' },
  { id: '6', name: 'Mathematical Set', category: 'Stationery', stockLevel: 200, reorderLevel: 50, unitPrice: 25, status: 'in_stock' },
];

const mockServices: ServiceOption[] = [
  { id: '1', name: 'Route A - Madina', type: 'bus', monthlyCost: 400, subscribers: 45 },
  { id: '2', name: 'Route B - Achimota', type: 'bus', monthlyCost: 350, subscribers: 38 },
  { id: '3', name: 'Route C - Tema', type: 'bus', monthlyCost: 500, subscribers: 22 },
  { id: '4', name: 'Full Meal Plan', type: 'feeding', monthlyCost: 300, subscribers: 156 },
  { id: '5', name: 'Lunch Only', type: 'feeding', monthlyCost: 200, subscribers: 89 },
];

const Logistics = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'services'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');

  const lowStockCount = mockInventory.filter((i) => i.status !== 'in_stock').length;
  const totalSubscribers = mockServices.reduce((sum, s) => sum + s.subscribers, 0);

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const inventoryColumns = [
    { key: 'name', header: 'Item Name', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
    {
      key: 'stockLevel',
      header: 'Stock',
      sortable: true,
      mono: true,
      render: (row: InventoryItem) => (
        <div className="flex items-center gap-2">
          <span>{row.stockLevel}</span>
          {row.stockLevel <= row.reorderLevel && (
            <AlertTriangle size={14} className="text-warning" />
          )}
        </div>
      ),
    },
    {
      key: 'reorderLevel',
      header: 'Reorder At',
      mono: true,
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      mono: true,
      render: (row: InventoryItem) => `GHS ${row.unitPrice}`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: InventoryItem) => {
        const styles = {
          in_stock: 'border-success/30 bg-success/10 text-success',
          low_stock: 'border-warning/30 bg-warning/10 text-warning',
          out_of_stock: 'border-destructive/30 bg-destructive/10 text-destructive',
        };
        const labels = {
          in_stock: 'In Stock',
          low_stock: 'Low Stock',
          out_of_stock: 'Out of Stock',
        };
        return (
          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles[row.status]}`}>
            {labels[row.status]}
          </span>
        );
      },
    },
  ];

  const serviceColumns = [
    {
      key: 'type',
      header: '',
      width: 'w-10',
      render: (row: ServiceOption) =>
        row.type === 'bus' ? (
          <Bus size={16} className="text-muted-foreground" />
        ) : (
          <UtensilsCrossed size={16} className="text-muted-foreground" />
        ),
    },
    { key: 'name', header: 'Service Name', sortable: true },
    {
      key: 'type',
      header: 'Type',
      render: (row: ServiceOption) => (
        <span className="capitalize">{row.type}</span>
      ),
    },
    {
      key: 'monthlyCost',
      header: 'Monthly Cost',
      mono: true,
      render: (row: ServiceOption) => `GHS ${row.monthlyCost}`,
    },
    {
      key: 'subscribers',
      header: 'Subscribers',
      mono: true,
      sortable: true,
    },
    {
      key: 'revenue',
      header: 'Monthly Revenue',
      mono: true,
      render: (row: ServiceOption) => `GHS ${(row.monthlyCost * row.subscribers).toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Logistics</h1>
          <p className="text-sm text-muted-foreground">Inventory, transport, and feeding management</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Inventory Items"
          value={mockInventory.length.toString()}
          subtitle="Total SKUs"
          icon={Package}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockCount.toString()}
          subtitle="Items need reorder"
          icon={AlertTriangle}
          variant={lowStockCount > 0 ? 'warning' : 'default'}
        />
        <StatsCard
          title="Bus Subscribers"
          value={mockServices.filter((s) => s.type === 'bus').reduce((sum, s) => sum + s.subscribers, 0).toString()}
          subtitle="Active this term"
          icon={Bus}
        />
        <StatsCard
          title="Feeding Subscribers"
          value={mockServices.filter((s) => s.type === 'feeding').reduce((sum, s) => sum + s.subscribers, 0).toString()}
          subtitle="Active this term"
          icon={UtensilsCrossed}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'inventory'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Store Inventory
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'services'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Service Options
          </button>
        </div>
      </div>

      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="card-legal p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button className="gap-2">
                <Plus size={16} />
                Add Item
              </Button>
            </div>
          </div>

          <DataTable columns={inventoryColumns} data={filteredInventory} emptyMessage="No inventory items found" />
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="card-legal p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Total monthly service revenue: <span className="font-mono font-medium text-foreground">GHS {mockServices.reduce((sum, s) => sum + s.monthlyCost * s.subscribers, 0).toLocaleString()}</span>
              </p>
              <Button className="gap-2">
                <Plus size={16} />
                Add Service
              </Button>
            </div>
          </div>

          <DataTable columns={serviceColumns} data={mockServices} emptyMessage="No services configured" />
        </div>
      )}
    </div>
  );
};

export default Logistics;
