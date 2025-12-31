import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TermRecord {
  term: string;
  year: string;
  class: string;
  subjects: {
    name: string;
    score: number;
    grade: string;
    position: number;
  }[];
  average: number;
  position: number;
  outOf: number;
  attendance: number;
  conduct: string;
}

interface StudentHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock academic history data
const mockStudentHistory = {
  student: {
    id: 'STID-0001',
    name: 'Kwame Asante',
    currentClass: 'JHS 3A',
    enrollmentDate: '2022-09-05',
  },
  records: [
    {
      term: 'Term 1',
      year: '2024/2025',
      class: 'JHS 3A',
      subjects: [
        { name: 'Mathematics', score: 82, grade: 'A', position: 2 },
        { name: 'English Language', score: 73, grade: 'B', position: 5 },
        { name: 'Integrated Science', score: 80, grade: 'A', position: 3 },
        { name: 'Social Studies', score: 72, grade: 'B', position: 6 },
        { name: 'French', score: 63, grade: 'C', position: 8 },
        { name: 'ICT', score: 86, grade: 'A', position: 1 },
      ],
      average: 76,
      position: 2,
      outOf: 30,
      attendance: 97,
      conduct: 'Excellent',
    },
    {
      term: 'Term 3',
      year: '2023/2024',
      class: 'JHS 2A',
      subjects: [
        { name: 'Mathematics', score: 79, grade: 'B', position: 3 },
        { name: 'English Language', score: 75, grade: 'B', position: 4 },
        { name: 'Integrated Science', score: 78, grade: 'B', position: 4 },
        { name: 'Social Studies', score: 70, grade: 'B', position: 7 },
        { name: 'French', score: 60, grade: 'C', position: 10 },
        { name: 'ICT', score: 82, grade: 'A', position: 2 },
      ],
      average: 74,
      position: 3,
      outOf: 31,
      attendance: 95,
      conduct: 'Very Good',
    },
    {
      term: 'Term 2',
      year: '2023/2024',
      class: 'JHS 2A',
      subjects: [
        { name: 'Mathematics', score: 81, grade: 'A', position: 2 },
        { name: 'English Language', score: 72, grade: 'B', position: 6 },
        { name: 'Integrated Science', score: 76, grade: 'B', position: 5 },
        { name: 'Social Studies', score: 68, grade: 'C', position: 9 },
        { name: 'French', score: 58, grade: 'D', position: 12 },
        { name: 'ICT', score: 84, grade: 'A', position: 1 },
      ],
      average: 73,
      position: 4,
      outOf: 32,
      attendance: 93,
      conduct: 'Very Good',
    },
    {
      term: 'Term 1',
      year: '2023/2024',
      class: 'JHS 2A',
      subjects: [
        { name: 'Mathematics', score: 78, grade: 'B', position: 4 },
        { name: 'English Language', score: 70, grade: 'B', position: 7 },
        { name: 'Integrated Science', score: 74, grade: 'B', position: 6 },
        { name: 'Social Studies', score: 65, grade: 'C', position: 10 },
        { name: 'French', score: 55, grade: 'D', position: 14 },
        { name: 'ICT', score: 80, grade: 'A', position: 3 },
      ],
      average: 70,
      position: 5,
      outOf: 32,
      attendance: 90,
      conduct: 'Good',
    },
    {
      term: 'Term 3',
      year: '2022/2023',
      class: 'JHS 1A',
      subjects: [
        { name: 'Mathematics', score: 75, grade: 'B', position: 5 },
        { name: 'English Language', score: 68, grade: 'C', position: 9 },
        { name: 'Integrated Science', score: 72, grade: 'B', position: 7 },
        { name: 'Social Studies', score: 62, grade: 'C', position: 12 },
        { name: 'French', score: 52, grade: 'D', position: 16 },
        { name: 'ICT', score: 78, grade: 'B', position: 4 },
      ],
      average: 68,
      position: 7,
      outOf: 30,
      attendance: 88,
      conduct: 'Good',
    },
  ] as TermRecord[],
};

const students = [
  { id: 'STID-0001', name: 'Kwame Asante' },
  { id: 'STID-0002', name: 'Ama Mensah' },
  { id: 'STID-0006', name: 'Akosua Frimpong' },
];

export const StudentHistoryModal = ({ open, onOpenChange }: StudentHistoryModalProps) => {
  const [selectedStudent, setSelectedStudent] = useState('STID-0001');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const { student, records } = mockStudentHistory;

  const getTrend = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) return { icon: TrendingUp, color: 'text-success', value: `+${diff}` };
    if (diff < 0) return { icon: TrendingDown, color: 'text-destructive', value: diff };
    return { icon: Minus, color: 'text-muted-foreground', value: '0' };
  };

  const subjects = records[0]?.subjects.map(s => s.name) || [];

  const getSubjectProgress = (subjectName: string) => {
    return records.map(term => {
      const subject = term.subjects.find(s => s.name === subjectName);
      return {
        term: `${term.term} ${term.year}`,
        score: subject?.score || 0,
        grade: subject?.grade || '-',
      };
    }).reverse();
  };

  const generateHistoryPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SAJILAN MODEL SCHOOL', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Academic History Report', pageWidth / 2, 27, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(15, 32, pageWidth - 15, 32);

    // Student Info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 15, 42);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Name: ${student.name}`, 15, 50);
    doc.text(`Student ID: ${student.id}`, 15, 56);
    doc.text(`Current Class: ${student.currentClass}`, 100, 50);
    doc.text(`Enrolled: ${student.enrollmentDate}`, 100, 56);

    // Term Summary Table
    doc.setFont('helvetica', 'bold');
    doc.text('Term Performance Summary', 15, 70);

    autoTable(doc, {
      startY: 75,
      head: [['Term', 'Class', 'Average', 'Grade', 'Position', 'Attendance', 'Conduct']],
      body: records.map(r => [
        `${r.term} ${r.year}`,
        r.class,
        `${r.average}%`,
        r.average >= 80 ? 'A' : r.average >= 70 ? 'B' : r.average >= 60 ? 'C' : 'D',
        `${r.position}/${r.outOf}`,
        `${r.attendance}%`,
        r.conduct
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], fontSize: 9 },
      bodyStyles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Subject-wise Performance
    doc.setFont('helvetica', 'bold');
    doc.text('Subject Performance Over Time', 15, finalY);

    const subjectData = subjects.map(subjectName => {
      const scores = records.map(r => {
        const subject = r.subjects.find(s => s.name === subjectName);
        return subject?.score || 0;
      });
      return [subjectName, ...scores.map(s => `${s}%`)];
    });

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Subject', ...records.map(r => `${r.term.slice(0, 2)} ${r.year.slice(0, 4)}`)]],
      body: subjectData,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
    });

    // Footer
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 285);

    doc.save(`Academic_History_${student.id}_${student.name.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Academic History</span>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {students.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Student Info Card */}
          <div className="card-legal p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Student Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Student ID</p>
                <p className="font-mono">{student.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Class</p>
                <p className="font-medium">{student.currentClass}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Enrolled Since</p>
                <p className="font-medium">{student.enrollmentDate}</p>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Performance Overview
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {records.slice(0, 5).map((term, idx) => {
                const trend = idx < records.length - 1 
                  ? getTrend(term.average, records[idx + 1].average)
                  : null;
                
                return (
                  <div key={idx} className="card-legal p-4 text-center">
                    <p className="text-xs text-muted-foreground">{term.term}</p>
                    <p className="text-xs text-muted-foreground">{term.year}</p>
                    <p className="text-2xl font-mono font-bold mt-2">{term.average}%</p>
                    {trend && (
                      <div className={`flex items-center justify-center gap-1 mt-1 ${trend.color}`}>
                        <trend.icon size={14} />
                        <span className="text-xs font-mono">{trend.value}</span>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Pos: {term.position}/{term.outOf}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSubject === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSubject(null)}
            >
              All Subjects
            </Button>
            {subjects.map(subject => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* Subject Progress Chart */}
          {selectedSubject && (
            <div className="card-legal p-4">
              <h4 className="font-semibold mb-3">{selectedSubject} - Performance Trend</h4>
              <div className="flex items-end gap-2 h-32">
                {getSubjectProgress(selectedSubject).map((data, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary/20 rounded-t relative"
                      style={{ height: `${data.score}%` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono font-bold">
                        {data.score}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1 text-center">
                      {data.term.slice(0, 6)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Term Records */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Detailed Term Records
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left border-r border-primary-foreground/20">Term</th>
                    <th className="px-3 py-2 text-left border-r border-primary-foreground/20">Class</th>
                    {(selectedSubject ? [selectedSubject] : subjects).map(subject => (
                      <th key={subject} className="px-3 py-2 text-center border-r border-primary-foreground/20">
                        {subject.length > 10 ? subject.slice(0, 8) + '...' : subject}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-center border-r border-primary-foreground/20">Avg</th>
                    <th className="px-3 py-2 text-center">Pos</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((term, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="px-3 py-2 border-r border-border whitespace-nowrap">
                        {term.term} {term.year}
                      </td>
                      <td className="px-3 py-2 border-r border-border">{term.class}</td>
                      {(selectedSubject ? term.subjects.filter(s => s.name === selectedSubject) : term.subjects).map((subject, sIdx) => (
                        <td key={sIdx} className="px-3 py-2 text-center border-r border-border">
                          <span className="font-mono">{subject.score}</span>
                          <span className={`ml-1 text-xs ${
                            subject.grade === 'A' ? 'text-success' :
                            subject.grade === 'B' ? 'text-primary' :
                            'text-muted-foreground'
                          }`}>
                            ({subject.grade})
                          </span>
                        </td>
                      ))}
                      <td className="px-3 py-2 text-center border-r border-border font-mono font-bold">
                        {term.average}%
                      </td>
                      <td className="px-3 py-2 text-center font-mono">
                        {term.position}/{term.outOf}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={generateHistoryPDF} className="gap-2">
            <Download size={16} />
            Export History PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
