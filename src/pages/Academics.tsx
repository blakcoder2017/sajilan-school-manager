import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Save, FileText } from 'lucide-react';

interface StudentScore {
  id: string;
  stid: string;
  name: string;
  hw1: number | null;
  hw2: number | null;
  hw3: number | null;
  ct1: number | null;
  ct2: number | null;
  exam: number | null;
  total: number;
  grade: string;
}

// Mock gradebook data
const mockScores: StudentScore[] = [
  { id: '1', stid: 'STID-0001', name: 'Kwame Asante', hw1: 8, hw2: 9, hw3: 7, ct1: 18, ct2: 17, exam: 65, total: 82, grade: 'A' },
  { id: '2', stid: 'STID-0002', name: 'Ama Mensah', hw1: 7, hw2: 8, hw3: 8, ct1: 15, ct2: 16, exam: 58, total: 74, grade: 'B' },
  { id: '3', stid: 'STID-0006', name: 'Akosua Frimpong', hw1: 9, hw2: 9, hw3: 9, ct1: 19, ct2: 18, exam: 72, total: 89, grade: 'A' },
  { id: '4', stid: 'STID-0008', name: 'Efua Osei', hw1: 6, hw2: 7, hw3: null, ct1: 14, ct2: null, exam: null, total: 0, grade: '-' },
  { id: '5', stid: 'STID-0003', name: 'Yaw Boateng', hw1: 8, hw2: 8, hw3: 7, ct1: 16, ct2: 15, exam: 60, total: 76, grade: 'B' },
];

const Academics = () => {
  const [selectedClass, setSelectedClass] = useState('JHS 3A');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [scores, setScores] = useState(mockScores);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: string } | null>(null);

  const assessmentColumns = [
    { key: 'hw1', header: 'HW1', max: 10 },
    { key: 'hw2', header: 'HW2', max: 10 },
    { key: 'hw3', header: 'HW3', max: 10 },
    { key: 'ct1', header: 'CT1', max: 20 },
    { key: 'ct2', header: 'CT2', max: 20 },
    { key: 'exam', header: 'Exam', max: 100 },
  ];

  const handleScoreChange = (studentId: string, field: string, value: string) => {
    setScores(
      scores.map((s) =>
        s.id === studentId
          ? { ...s, [field]: value === '' ? null : Number(value) }
          : s
      )
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, rowIndex: number, colIndex: number) => {
    const cols = ['hw1', 'hw2', 'hw3', 'ct1', 'ct2', 'exam'];
    
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (rowIndex > 0) {
          setFocusedCell({ row: rowIndex - 1, col: cols[colIndex] });
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (rowIndex < scores.length - 1) {
          setFocusedCell({ row: rowIndex + 1, col: cols[colIndex] });
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (colIndex > 0) {
          setFocusedCell({ row: rowIndex, col: cols[colIndex - 1] });
        }
        break;
      case 'ArrowRight':
      case 'Tab':
        if (e.key === 'Tab') e.preventDefault();
        if (colIndex < cols.length - 1) {
          setFocusedCell({ row: rowIndex, col: cols[colIndex + 1] });
        } else if (rowIndex < scores.length - 1) {
          setFocusedCell({ row: rowIndex + 1, col: cols[0] });
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (rowIndex < scores.length - 1) {
          setFocusedCell({ row: rowIndex + 1, col: cols[colIndex] });
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Academic Records</h1>
          <p className="text-sm text-muted-foreground">Gradebook and assessment management</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText size={16} />
            Report Cards
          </Button>
          <Button className="gap-2">
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card-legal p-4">
        <div className="flex items-center gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Class
            </label>
            <button className="flex h-10 w-40 items-center justify-between rounded-md border border-input bg-background px-3 text-sm">
              <span>{selectedClass}</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Subject
            </label>
            <button className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 text-sm">
              <span>{selectedSubject}</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Term
            </label>
            <button className="flex h-10 w-32 items-center justify-between rounded-md border border-input bg-background px-3 text-sm">
              <span>Term 1</span>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Gradebook Grid */}
      <div className="overflow-hidden rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="sticky left-0 z-10 w-24 border-b border-r border-border bg-muted/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  ID
                </th>
                <th className="sticky left-24 z-10 w-48 border-b border-r border-border bg-muted/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Student Name
                </th>
                {assessmentColumns.map((col) => (
                  <th
                    key={col.key}
                    className="w-20 border-b border-border px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    <div>{col.header}</div>
                    <div className="mt-0.5 text-[10px] font-normal">/{col.max}</div>
                  </th>
                ))}
                <th className="w-20 border-b border-l border-border bg-muted/30 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </th>
                <th className="w-16 border-b border-border bg-muted/30 px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Grade
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {scores.map((student, rowIndex) => (
                <tr key={student.id} className="border-b border-border last:border-b-0">
                  <td className="sticky left-0 z-10 border-r border-border bg-card px-4 py-2 font-mono text-sm">
                    {student.stid}
                  </td>
                  <td className="sticky left-24 z-10 border-r border-border bg-card px-4 py-2 text-sm font-medium">
                    {student.name}
                  </td>
                  {assessmentColumns.map((col, colIndex) => (
                    <td key={col.key} className="border-r border-border px-1 py-1">
                      <Input
                        type="number"
                        min={0}
                        max={col.max}
                        value={student[col.key as keyof StudentScore] ?? ''}
                        onChange={(e) => handleScoreChange(student.id, col.key, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        onFocus={() => setFocusedCell({ row: rowIndex, col: col.key })}
                        className="h-8 w-full text-center font-mono text-sm"
                        autoFocus={focusedCell?.row === rowIndex && focusedCell?.col === col.key}
                      />
                    </td>
                  ))}
                  <td className="border-l border-border bg-muted/30 px-2 py-2 text-center font-mono text-sm font-medium">
                    {student.total || '-'}
                  </td>
                  <td className="bg-muted/30 px-2 py-2 text-center">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-md font-mono text-sm font-semibold ${
                        student.grade === 'A'
                          ? 'bg-success/20 text-success'
                          : student.grade === 'B'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="card-legal p-4">
        <div className="flex items-center gap-6 text-xs text-muted-foreground">
          <span className="font-medium">Legend:</span>
          <span>HW = Homework (10 marks)</span>
          <span>CT = Class Test (20 marks)</span>
          <span>Exam = End of Term (100 marks)</span>
          <span className="ml-auto">Use arrow keys to navigate • Tab to move right</span>
        </div>
      </div>
    </div>
  );
};

export default Academics;
