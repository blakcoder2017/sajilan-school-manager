import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, School, Calendar, Users, Database } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('school');

  const sections = [
    { id: 'school', label: 'School Profile', icon: School },
    { id: 'academic', label: 'Academic Year', icon: Calendar },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'backup', label: 'Data & Backup', icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">System configuration and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <section.icon size={18} />
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeSection === 'school' && (
            <div className="card-legal">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">School Profile</h2>
                <p className="text-sm text-muted-foreground">Basic information about your school</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>School Name</Label>
                    <Input defaultValue="Sajilan International School" />
                  </div>
                  <div className="space-y-2">
                    <Label>School Code</Label>
                    <Input defaultValue="SIS-001" className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input defaultValue="123 Education Lane, Accra" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input defaultValue="030-222-5555" className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" defaultValue="info@sajilan.edu.gh" />
                  </div>
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Greater Accra</option>
                      <option>Ashanti</option>
                      <option>Eastern</option>
                      <option>Western</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'academic' && (
            <div className="card-legal">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">Academic Year Configuration</h2>
                <p className="text-sm text-muted-foreground">Manage academic years and terms</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="rounded-md border border-success/30 bg-success/10 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">2024/2025</p>
                      <p className="text-sm text-muted-foreground">Current Academic Year</p>
                    </div>
                    <span className="rounded-md border border-success/30 bg-success/20 px-3 py-1 text-xs font-medium text-success">
                      Active
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Terms</h3>
                  <div className="divide-y divide-border rounded-md border border-border">
                    {['Term 1', 'Term 2', 'Term 3'].map((term, index) => (
                      <div key={term} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{term}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {index === 0 ? 'Sep 4 - Dec 15, 2024' : index === 1 ? 'Jan 8 - Apr 5, 2025' : 'Apr 28 - Jul 18, 2025'}
                          </p>
                        </div>
                        <span
                          className={`rounded-md border px-2 py-0.5 text-xs font-medium ${
                            index === 0
                              ? 'border-success/30 bg-success/10 text-success'
                              : 'border-border bg-muted text-muted-foreground'
                          }`}
                        >
                          {index === 0 ? 'Current' : 'Upcoming'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Add New Year</Button>
                  <Button className="gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div className="card-legal">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">User Management</h2>
                <p className="text-sm text-muted-foreground">Manage system users and their roles</p>
              </div>
              <div className="p-6">
                <div className="divide-y divide-border rounded-md border border-border">
                  {[
                    { name: 'Dr. Kwame Asante', role: 'SUPER_ADMIN', username: 'proprietor', status: 'active' },
                    { name: 'Mr. Kofi Mensah', role: 'ADMIN', username: 'headmaster', status: 'active' },
                    { name: 'Mrs. Ama Boateng', role: 'BURSAR', username: 'bursar', status: 'active' },
                    { name: 'Mr. Yaw Darko', role: 'TEACHER', username: 'teacher', status: 'active' },
                  ].map((user) => (
                    <div key={user.username} className="flex items-center justify-between px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <span className="font-mono text-xs font-medium">
                            {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium">
                          {user.role.replace('_', ' ')}
                        </span>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button>Add New User</Button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'backup' && (
            <div className="card-legal">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">Data & Backup</h2>
                <p className="text-sm text-muted-foreground">Database management and backups</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Database Status</p>
                      <p className="text-xs text-muted-foreground">SQLite with WAL Mode enabled</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="status-dot status-dot-success" />
                      <span className="text-sm text-success font-medium">Healthy</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold">Recent Backups</h3>
                  <div className="divide-y divide-border rounded-md border border-border">
                    {[
                      { date: '2024-01-26 18:00', size: '45.2 MB', type: 'Automatic' },
                      { date: '2024-01-25 18:00', size: '44.8 MB', type: 'Automatic' },
                      { date: '2024-01-24 14:32', size: '44.5 MB', type: 'Manual' },
                    ].map((backup, index) => (
                      <div key={index} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="font-mono text-sm">{backup.date}</p>
                          <p className="text-xs text-muted-foreground">{backup.type} • {backup.size}</p>
                        </div>
                        <Button variant="outline" size="sm">Restore</Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Export Data</Button>
                  <Button>Create Backup Now</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
