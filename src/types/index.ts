export type UserRole = 'teacher' | 'student' | 'parent';

export type SubmissionFileType =
  | 'cpp'
  | 'pdf'
  | 'excel'
  | 'xlsx'
  | 'docx'
  | 'doc'
  | 'ppt'
  | 'pptx'
  | 'sb3'
  | 'zip';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  username: string; // e.g., nguyenvana6a
  avatar: string;
  className?: string; // e.g. "6A", "9A"
  gradeLevel?: 6 | 7 | 8 | 9;
  birthDate?: string; // format: "2012-05-15" -> default pass: "15052012"
  isFirstLogin?: boolean;
  linkedStudentId?: string; // For parents
  email?: string;
  phone?: string;
  points?: number;
  streakDays?: number;
}

export interface RubricCriterion {
  id: string;
  name: string;
  maxScore: number;
  description: string;
  targetCategory: 'word' | 'excel' | 'powerpoint' | 'cpp' | 'scratch' | 'general';
}

export interface RubricGuide {
  id: string;
  title: string;
  gradeLevel: number;
  totalMaxScore: number;
  criteria: RubricCriterion[];
  standardRequirements: string[];
  evaluationInstructions: string;
}

export interface LessonMaterial {
  id: string;
  title: string;
  gradeLevel: 6 | 7 | 8 | 9;
  chapter: string;
  description: string;
  videoUrl?: string;
  duration?: string;
  theoryContent: string;
  practiceType: 'quiz' | 'office' | 'scratch' | 'cpp';
  quizQuestions?: QuizQuestion[];
  assignmentPrompt?: string;
  assignmentPdfName?: string;
  customTeacherInstructions?: string;
  acceptedFormats: string[]; // ['.cpp', '.pdf', '.xlsx', '.excel', '.docx', '.doc', '.ppt', '.pptx', '.sb3', '.zip']
  dueDate: string;
  rubricGuide?: RubricGuide;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  lessonId: string;
  lessonTitle: string;
  submittedAt: string;
  fileName: string;
  fileType: SubmissionFileType;
  fileSize: string;
  codeContent?: string;
  status: 'graded' | 'pending' | 'reviewing';
  score?: number; // 0 - 10
  aiFeedback?: string;
  criteriaScores?: { name: string; score: number; max: number; comment: string }[];
  teacherNote?: string;
}

export interface CppTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status?: 'AC' | 'WA' | 'TLE' | 'MLE' | 'Pending';
  executionTimeMs?: number;
  memoryKb?: number;
  explanation?: string;
  isSample?: boolean;
}

export interface CppProblem {
  id: string;
  title: string;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao' | 'HSG Cấp Tỉnh';
  timeLimit: string; // e.g. "1.0s"
  memoryLimit: string; // e.g. "256MB"
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  standardSolution: string;
  starterCode: string;
  testCases: CppTestCase[];
}

export interface BatchGradingItem {
  id: string;
  studentName: string;
  studentCode: string;
  className: string;
  fileName: string;
  format: SubmissionFileType;
  score: number;
  gradeType: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Đạt' | 'Cần rèn luyện';
  criteriaScores: {
    name: string;
    score: number;
    maxScore: number;
    comment: string;
  }[];
  breakdown: {
    formatCompliance: number;
    logicCorrectness: number;
    aestheticLayout: number;
    comments: string;
  };
  detectedIssues: string[];
  teacherNotes?: string;
}

export interface ParentMonthlyReport {
  reportTitle: string;
  overallAssessment: string;
  competencyAnalysis: {
    skill: string;
    score: number;
    status: string;
    detail: string;
  }[];
  teacherRemarks: string;
  recommendationsForHome: string[];
  aiGenerated?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'schedule' | 'grade' | 'parent';
  timestamp: string;
  read: boolean;
  targetRole: UserRole | 'all';
}
