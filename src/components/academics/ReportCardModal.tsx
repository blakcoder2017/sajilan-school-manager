import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface StudentRecord {
  id: string;
  stid: string;
  name: string;
  class: string;
  subjects: SubjectScore[];
  attendance: { present: number; absent: number; total: number };
  conduct: string;
  teacherRemarks: string;
  headRemarks: string;
}

interface SubjectScore {
  subject: string;
  classScore: number;
  examScore: number;
  total: number;
  grade: string;
  position: number;
  remarks: string;
}

interface ReportCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock student data for report cards
const mockStudents: StudentRecord[] = [
  {
    id: '1',
    stid: 'STID-0001',
    name: 'Kwame Asante',
    class: 'JHS 3A',
    subjects: [
      { subject: 'Mathematics', classScore: 34, examScore: 65, total: 82, grade: 'A', position: 2, remarks: 'Excellent' },
      { subject: 'English Language', classScore: 30, examScore: 58, total: 73, grade: 'B', position: 5, remarks: 'Very Good' },
      { subject: 'Integrated Science', classScore: 35, examScore: 62, total: 80, grade: 'A', position: 3, remarks: 'Excellent' },
      { subject: 'Social Studies', classScore: 32, examScore: 55, total: 72, grade: 'B', position: 6, remarks: 'Very Good' },
      { subject: 'French', classScore: 28, examScore: 48, total: 63, grade: 'C', position: 8, remarks: 'Good' },
      { subject: 'ICT', classScore: 36, examScore: 68, total: 86, grade: 'A', position: 1, remarks: 'Outstanding' },
    ],
    attendance: { present: 58, absent: 2, total: 60 },
    conduct: 'Excellent',
    teacherRemarks: 'Kwame has shown remarkable improvement this term. Keep up the good work!',
    headRemarks: 'A promising student with great potential. Promoted to JHS 3.',
  },
  {
    id: '2',
    stid: 'STID-0002',
    name: 'Ama Mensah',
    class: 'JHS 3A',
    subjects: [
      { subject: 'Mathematics', classScore: 30, examScore: 58, total: 74, grade: 'B', position: 4, remarks: 'Very Good' },
      { subject: 'English Language', classScore: 35, examScore: 65, total: 83, grade: 'A', position: 1, remarks: 'Excellent' },
      { subject: 'Integrated Science', classScore: 28, examScore: 52, total: 66, grade: 'C', position: 10, remarks: 'Good' },
      { subject: 'Social Studies', classScore: 33, examScore: 60, total: 78, grade: 'B', position: 3, remarks: 'Very Good' },
      { subject: 'French', classScore: 34, examScore: 62, total: 80, grade: 'A', position: 2, remarks: 'Excellent' },
      { subject: 'ICT', classScore: 30, examScore: 55, total: 70, grade: 'B', position: 6, remarks: 'Very Good' },
    ],
    attendance: { present: 60, absent: 0, total: 60 },
    conduct: 'Very Good',
    teacherRemarks: 'Ama is a dedicated student with excellent language skills.',
    headRemarks: 'Consistent performance. Continue the hard work.',
  },
  {
    id: '3',
    stid: 'STID-0006',
    name: 'Akosua Frimpong',
    class: 'JHS 3A',
    subjects: [
      { subject: 'Mathematics', classScore: 37, examScore: 72, total: 89, grade: 'A', position: 1, remarks: 'Outstanding' },
      { subject: 'English Language', classScore: 33, examScore: 60, total: 78, grade: 'B', position: 3, remarks: 'Very Good' },
      { subject: 'Integrated Science', classScore: 36, examScore: 68, total: 87, grade: 'A', position: 1, remarks: 'Outstanding' },
      { subject: 'Social Studies', classScore: 35, examScore: 62, total: 81, grade: 'A', position: 1, remarks: 'Excellent' },
      { subject: 'French', classScore: 32, examScore: 58, total: 75, grade: 'B', position: 4, remarks: 'Very Good' },
      { subject: 'ICT', classScore: 35, examScore: 65, total: 83, grade: 'A', position: 2, remarks: 'Excellent' },
    ],
    attendance: { present: 59, absent: 1, total: 60 },
    conduct: 'Excellent',
    teacherRemarks: 'Akosua is the top performer in the class. Outstanding in all subjects.',
    headRemarks: 'Exceptional student. Best wishes for continued success.',
  },
];

// Academic history data
const academicHistory = [
  { term: 'Term 1, 2023/24', average: 78, position: 3, outOf: 32 },
  { term: 'Term 2, 2023/24', average: 81, position: 2, outOf: 32 },
  { term: 'Term 3, 2023/24', average: 79, position: 3, outOf: 31 },
  { term: 'Term 1, 2024/25', average: 82, position: 2, outOf: 30 },
];

const gradeScale = [
  { range: '80-100', grade: 'A', interpretation: 'Excellent' },
  { range: '70-79', grade: 'B', interpretation: 'Very Good' },
  { range: '60-69', grade: 'C', interpretation: 'Good' },
  { range: '50-59', grade: 'D', interpretation: 'Satisfactory' },
  { range: '40-49', grade: 'E', interpretation: 'Pass' },
  { range: '0-39', grade: 'F', interpretation: 'Fail' },
];

export const ReportCardModal = ({ open, onOpenChange }: ReportCardModalProps) => {
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0].stid);
  const [currentIndex, setCurrentIndex] = useState(0);

  const student = mockStudents.find(s => s.stid === selectedStudent) || mockStudents[0];

  const calculateOverallAverage = () => {
    const total = student.subjects.reduce((acc, s) => acc + s.total, 0);
    return (total / student.subjects.length).toFixed(1);
  };

  const getOverallGrade = (avg: number) => {
    if (avg >= 80) return 'A';
    if (avg >= 70) return 'B';
    if (avg >= 60) return 'C';
    if (avg >= 50) return 'D';
    if (avg >= 40) return 'E';
    return 'F';
  };

  const handlePrevStudent = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : mockStudents.length - 1;
    setCurrentIndex(newIndex);
    setSelectedStudent(mockStudents[newIndex].stid);
  };

  const handleNextStudent = () => {
    const newIndex = currentIndex < mockStudents.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedStudent(mockStudents[newIndex].stid);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // School Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('SAJILAN MODEL SCHOOL', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('P.O. Box 123, Accra, Ghana | Tel: +233 XX XXX XXXX', pageWidth / 2, 27, { align: 'center' });
    doc.text('"Excellence in Education"', pageWidth / 2, 33, { align: 'center' });
    
    // Horizontal line
    doc.setLineWidth(0.5);
    doc.line(15, 38, pageWidth - 15, 38);
    
    // Report Title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMINAL REPORT CARD', pageWidth / 2, 48, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Academic Year: 2024/2025 | Term 1', pageWidth / 2, 55, { align: 'center' });
    
    // Student Info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 15, 68);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${student.name}`, 15, 75);
    doc.text(`Student ID: ${student.stid}`, 15, 81);
    doc.text(`Class: ${student.class}`, 100, 75);
    doc.text(`No. in Class: 30`, 100, 81);
    
    // Subjects Table
    autoTable(doc, {
      startY: 90,
      head: [['Subject', 'Class Score (40%)', 'Exam Score (60%)', 'Total (100%)', 'Grade', 'Position', 'Remarks']],
      body: student.subjects.map(s => [
        s.subject,
        s.classScore.toString(),
        s.examScore.toString(),
        s.total.toString(),
        s.grade,
        `${s.position}/${30}`,
        s.remarks
      ]),
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 22, halign: 'center' },
        4: { cellWidth: 15, halign: 'center' },
        5: { cellWidth: 20, halign: 'center' },
        6: { cellWidth: 30 },
      },
    });
    
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Summary
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 15, finalY);
    doc.setFont('helvetica', 'normal');
    
    const avg = parseFloat(calculateOverallAverage());
    doc.text(`Overall Average: ${avg}%`, 15, finalY + 7);
    doc.text(`Overall Grade: ${getOverallGrade(avg)}`, 15, finalY + 13);
    doc.text(`Class Position: 2nd out of 30`, 100, finalY + 7);
    
    // Attendance
    doc.text(`Attendance: ${student.attendance.present}/${student.attendance.total} days (${((student.attendance.present / student.attendance.total) * 100).toFixed(0)}%)`, 100, finalY + 13);
    doc.text(`Conduct: ${student.conduct}`, 15, finalY + 19);
    
    // Remarks
    doc.setFont('helvetica', 'bold');
    doc.text("Class Teacher's Remarks:", 15, finalY + 30);
    doc.setFont('helvetica', 'normal');
    doc.text(student.teacherRemarks, 15, finalY + 37, { maxWidth: pageWidth - 30 });
    
    doc.setFont('helvetica', 'bold');
    doc.text("Head Teacher's Remarks:", 15, finalY + 50);
    doc.setFont('helvetica', 'normal');
    doc.text(student.headRemarks, 15, finalY + 57, { maxWidth: pageWidth - 30 });
    
    // Signatures
    const sigY = finalY + 75;
    doc.line(15, sigY, 60, sigY);
    doc.line(80, sigY, 125, sigY);
    doc.line(145, sigY, 190, sigY);
    
    doc.setFontSize(8);
    doc.text('Class Teacher', 25, sigY + 5);
    doc.text('Head Teacher', 90, sigY + 5);
    doc.text('Parent/Guardian', 155, sigY + 5);
    
    // Footer
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 285);
    doc.text('Next Term Begins: January 6, 2025', pageWidth - 15, 285, { align: 'right' });
    
    // Save PDF
    doc.save(`Report_Card_${student.stid}_${student.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePrint = () => {
    generatePDF();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Student Report Card</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevStudent}>
                <ChevronLeft size={16} />
              </Button>
              <Select value={selectedStudent} onValueChange={(val) => {
                setSelectedStudent(val);
                setCurrentIndex(mockStudents.findIndex(s => s.stid === val));
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((s) => (
                    <SelectItem key={s.stid} value={s.stid}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleNextStudent}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Report Card Preview */}
        <div className="border border-border rounded-md bg-card p-6 space-y-6">
          {/* School Header */}
          <div className="text-center border-b border-border pb-4">
            <h2 className="text-xl font-bold">SAJILAN MODEL SCHOOL</h2>
            <p className="text-xs text-muted-foreground">P.O. Box 123, Accra, Ghana | Tel: +233 XX XXX XXXX</p>
            <p className="text-xs italic text-muted-foreground">"Excellence in Education"</p>
            <div className="mt-3">
              <h3 className="font-semibold">TERMINAL REPORT CARD</h3>
              <p className="text-sm text-muted-foreground">Academic Year: 2024/2025 | Term 1</p>
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p><span className="font-medium">Name:</span> {student.name}</p>
              <p><span className="font-medium">Student ID:</span> <span className="font-mono">{student.stid}</span></p>
            </div>
            <div className="space-y-1">
              <p><span className="font-medium">Class:</span> {student.class}</p>
              <p><span className="font-medium">No. in Class:</span> 30</p>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-border">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="px-3 py-2 text-left border-r border-primary-foreground/20">Subject</th>
                  <th className="px-3 py-2 text-center border-r border-primary-foreground/20">Class Score (40%)</th>
                  <th className="px-3 py-2 text-center border-r border-primary-foreground/20">Exam Score (60%)</th>
                  <th className="px-3 py-2 text-center border-r border-primary-foreground/20">Total (100%)</th>
                  <th className="px-3 py-2 text-center border-r border-primary-foreground/20">Grade</th>
                  <th className="px-3 py-2 text-center border-r border-primary-foreground/20">Position</th>
                  <th className="px-3 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {student.subjects.map((subject, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="px-3 py-2 border-r border-border font-medium">{subject.subject}</td>
                    <td className="px-3 py-2 text-center border-r border-border font-mono">{subject.classScore}</td>
                    <td className="px-3 py-2 text-center border-r border-border font-mono">{subject.examScore}</td>
                    <td className="px-3 py-2 text-center border-r border-border font-mono font-semibold">{subject.total}</td>
                    <td className="px-3 py-2 text-center border-r border-border">
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded font-mono font-semibold ${
                        subject.grade === 'A' ? 'bg-success/20 text-success' :
                        subject.grade === 'B' ? 'bg-primary/20 text-primary' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {subject.grade}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center border-r border-border font-mono">{subject.position}/30</td>
                    <td className="px-3 py-2 text-muted-foreground">{subject.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-4 gap-4 bg-muted/50 p-4 rounded-md">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Average</p>
              <p className="text-2xl font-mono font-bold">{calculateOverallAverage()}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Grade</p>
              <p className="text-2xl font-mono font-bold">{getOverallGrade(parseFloat(calculateOverallAverage()))}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Class Position</p>
              <p className="text-2xl font-mono font-bold">2<sup className="text-sm">nd</sup>/30</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Attendance</p>
              <p className="text-2xl font-mono font-bold">{student.attendance.present}/{student.attendance.total}</p>
            </div>
          </div>

          {/* Academic History */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Academic History</h4>
            <div className="grid grid-cols-4 gap-3">
              {academicHistory.map((term, idx) => (
                <div key={idx} className="border border-border rounded-md p-3 text-center">
                  <p className="text-xs text-muted-foreground">{term.term}</p>
                  <p className="text-lg font-mono font-bold mt-1">{term.average}%</p>
                  <p className="text-xs text-muted-foreground">Pos: {term.position}/{term.outOf}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Remarks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Class Teacher's Remarks</p>
              <p className="text-sm border border-border rounded-md p-3 bg-muted/30 min-h-[60px]">
                {student.teacherRemarks}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Head Teacher's Remarks</p>
              <p className="text-sm border border-border rounded-md p-3 bg-muted/30 min-h-[60px]">
                {student.headRemarks}
              </p>
            </div>
          </div>

          {/* Conduct & Grading Scale */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conduct & Behavior</p>
              <p className="text-sm font-medium">{student.conduct}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grading Scale</p>
              <div className="flex gap-2 flex-wrap">
                {gradeScale.map((g) => (
                  <span key={g.grade} className="text-xs border border-border rounded px-2 py-1">
                    {g.grade}: {g.range}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Next Term Begins: January 6, 2025
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer size={16} />
              Print
            </Button>
            <Button onClick={generatePDF} className="gap-2">
              <Download size={16} />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
