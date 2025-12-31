import { useState } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Upload, Phone } from 'lucide-react';

interface Student {
  id: string;
  stid: string;
  firstName: string;
  lastName: string;
  class: string;
  stream: string;
  guardianName: string;
  guardianPhone: string;
  status: 'active' | 'inactive';
  arrears: number;
}

// Mock student data
const mockStudents: Student[] = [
  { id: '1', stid: 'STID-0001', firstName: 'Kwame', lastName: 'Asante', class: 'JHS 3', stream: 'A', guardianName: 'Mr. Kofi Asante', guardianPhone: '024-555-0101', status: 'active', arrears: 0 },
  { id: '2', stid: 'STID-0002', firstName: 'Ama', lastName: 'Mensah', class: 'JHS 2', stream: 'B', guardianName: 'Mrs. Akua Mensah', guardianPhone: '020-555-0102', status: 'active', arrears: 1500 },
  { id: '3', stid: 'STID-0003', firstName: 'Yaw', lastName: 'Boateng', class: 'Class 6', stream: 'A', guardianName: 'Mr. Kweku Boateng', guardianPhone: '027-555-0103', status: 'active', arrears: 0 },
  { id: '4', stid: 'STID-0004', firstName: 'Adwoa', lastName: 'Darko', class: 'JHS 1', stream: 'A', guardianName: 'Mrs. Esi Darko', guardianPhone: '055-555-0104', status: 'active', arrears: 2300 },
  { id: '5', stid: 'STID-0005', firstName: 'Kofi', lastName: 'Owusu', class: 'Class 5', stream: 'B', guardianName: 'Mr. Yaw Owusu', guardianPhone: '024-555-0105', status: 'inactive', arrears: 500 },
  { id: '6', stid: 'STID-0006', firstName: 'Akosua', lastName: 'Frimpong', class: 'JHS 3', stream: 'B', guardianName: 'Mrs. Abena Frimpong', guardianPhone: '020-555-0106', status: 'active', arrears: 0 },
  { id: '7', stid: 'STID-0007', firstName: 'Kwesi', lastName: 'Agyei', class: 'Class 4', stream: 'A', guardianName: 'Mr. Kwame Agyei', guardianPhone: '027-555-0107', status: 'active', arrears: 800 },
  { id: '8', stid: 'STID-0008', firstName: 'Efua', lastName: 'Osei', class: 'JHS 2', stream: 'A', guardianName: 'Mrs. Ama Osei', guardianPhone: '055-555-0108', status: 'active', arrears: 0 },
];

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStudents = mockStudents.filter(
    (student) =>
      student.stid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      key: 'stid',
      header: 'Student ID',
      sortable: true,
      mono: true,
      width: 'w-28',
    },
    {
      key: 'name',
      header: 'Full Name',
      sortable: true,
      render: (row: Student) => (
        <span className="font-medium">{row.firstName} {row.lastName}</span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      sortable: true,
      render: (row: Student) => (
        <span>{row.class} {row.stream}</span>
      ),
    },
    {
      key: 'guardianPhone',
      header: 'Guardian Phone',
      mono: true,
      render: (row: Student) => (
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-muted-foreground" />
          <span>{row.guardianPhone}</span>
        </div>
      ),
    },
    {
      key: 'arrears',
      header: 'Arrears',
      sortable: true,
      mono: true,
      render: (row: Student) => (
        <span className={row.arrears > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
          {row.arrears > 0 ? `GHS ${row.arrears.toLocaleString()}` : '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Student) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${
            row.status === 'active'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-muted bg-muted text-muted-foreground'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === 'active' ? 'bg-success' : 'bg-muted-foreground'}`} />
          {row.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Student Directory</h1>
          <p className="text-sm text-muted-foreground">
            {mockStudents.length} students enrolled
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Upload size={16} />
            Bulk Upload
          </Button>
          <Button className="gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={16} />
            Add Student
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="card-legal p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID, name, or class..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline">Filters</Button>
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredStudents}
        onRowClick={(row) => console.log('View student:', row.stid)}
        emptyMessage="No students found"
      />

      {/* Add Student Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="bio" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bio">Bio Data</TabsTrigger>
              <TabsTrigger value="guardian">Guardian Info</TabsTrigger>
              <TabsTrigger value="medical">Medical</TabsTrigger>
            </TabsList>

            <TabsContent value="bio" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Class</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select class</option>
                    <option value="class4">Class 4</option>
                    <option value="class5">Class 5</option>
                    <option value="class6">Class 6</option>
                    <option value="jhs1">JHS 1</option>
                    <option value="jhs2">JHS 2</option>
                    <option value="jhs3">JHS 3</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Stream</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select stream</option>
                    <option value="a">Stream A</option>
                    <option value="b">Stream B</option>
                  </select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="guardian" className="mt-4 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Guardian Name</Label>
                  <Input placeholder="Enter guardian's full name" />
                </div>
                <div className="space-y-2">
                  <Label>Relationship</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select relationship</option>
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Guardian</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input placeholder="e.g., 024-555-0100" />
                </div>
                <div className="space-y-2">
                  <Label>Alternative Phone</Label>
                  <Input placeholder="Optional" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Address</Label>
                  <Input placeholder="Enter residential address" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="mt-4 space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select blood group</option>
                    <option value="a+">A+</option>
                    <option value="a-">A-</option>
                    <option value="b+">B+</option>
                    <option value="b-">B-</option>
                    <option value="ab+">AB+</option>
                    <option value="ab-">AB-</option>
                    <option value="o+">O+</option>
                    <option value="o-">O-</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Known Allergies</Label>
                  <Input placeholder="List any known allergies" />
                </div>
                <div className="space-y-2">
                  <Label>Medical Conditions</Label>
                  <textarea
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Any medical conditions to be aware of..."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button>Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
