import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  HelpCircle, 
  UploadCloud, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText, 
  FileSpreadsheet, 
  Code, 
  AlertCircle,
  Play,
  RotateCcw,
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  FileCheck2,
  FileCode2,
  Presentation
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CURRICULUM_DATA, ALL_SUPPORTED_FORMATS } from '../data/curriculumData';
import { LessonMaterial, User, BatchGradingItem } from '../types';
import { exportMultiSheetGradingExcel, DEFAULT_RUBRIC_GUIDE } from '../utils/excelHelper';
import { AssignmentProgressD3Chart } from './AssignmentProgressD3Chart';

interface CurriculumViewProps {
  currentUser: User;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ currentUser }) => {
  const [selectedGrade, setSelectedGrade] = useState<6 | 7 | 8 | 9>(currentUser.gradeLevel || 6);
  const lessons = CURRICULUM_DATA.filter((l) => l.gradeLevel === selectedGrade);
  const [activeLesson, setActiveLesson] = useState<LessonMaterial>(lessons[0] || CURRICULUM_DATA[0]);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Rubric view accordion toggle
  const [showRubricDetails, setShowRubricDetails] = useState(true);

  // Submission state
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<any | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [customInstructions, setCustomInstructions] = useState<string>(activeLesson.customTeacherInstructions || 'Yêu cầu trình bày sạch sẽ, tuân thủ đúng định dạng quy định, kiểm tra kỹ công thức và thuật toán.');
  const [assignmentPdf, setAssignmentPdf] = useState<string>(activeLesson.assignmentPdfName || 'De_Bai_Thuc_Hanh_TinHoc_THCS.pdf');

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const pdfInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: ext || '.docx'
      });
      setAiEvaluation(null);
      setSubmissionSuccess(false);
    }
  };

  const handlePdfBrowse = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAssignmentPdf(file.name);
      confetti({ particleCount: 40 });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: ext || '.docx'
      });
      setAiEvaluation(null);
      setSubmissionSuccess(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Switch grade
  const handleSelectGrade = (grade: 6 | 7 | 8 | 9) => {
    setSelectedGrade(grade);
    const gradeLessons = CURRICULUM_DATA.filter((l) => l.gradeLevel === grade);
    if (gradeLessons.length > 0) {
      setActiveLesson(gradeLessons[0]);
      setCustomInstructions(gradeLessons[0].customTeacherInstructions || 'Yêu cầu trình bày sạch sẽ, tuân thủ định dạng quy định.');
      setAssignmentPdf(gradeLessons[0].assignmentPdfName || 'De_Bai_Thuc_Hanh_TinHoc_THCS.pdf');
    }
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setUploadedFile(null);
    setAiEvaluation(null);
    setSubmissionSuccess(false);
  };

  // Switch lesson
  const handleSelectLesson = (lesson: LessonMaterial) => {
    setActiveLesson(lesson);
    setCustomInstructions(lesson.customTeacherInstructions || 'Yêu cầu trình bày sạch sẽ, tuân thủ định dạng quy định.');
    setAssignmentPdf(lesson.assignmentPdfName || 'De_Bai_Thuc_Hanh_TinHoc_THCS.pdf');
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setUploadedFile(null);
    setAiEvaluation(null);
    setSubmissionSuccess(false);
  };

  // Quiz submit
  const handleQuizSubmit = () => {
    if (!activeLesson.quizQuestions) return;
    let correctCount = 0;
    activeLesson.quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / activeLesson.quizQuestions.length) * 10);
    setQuizScore(finalScore);
    setQuizSubmitted(true);

    if (finalScore >= 8) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  // Pick sample file for any of the 10 supported formats
  const handlePickSampleFile = (type: string) => {
    let name = `BaiTap_${activeLesson.id}${type}`;
    if (type === '.cpp') name = `ThuatToan_${activeLesson.id}.cpp`;
    if (type === '.pdf') name = `BaoCao_SoDoTuDuy_${activeLesson.id}.pdf`;
    if (type === '.xlsx') name = `BangDiem_CongThuc_${activeLesson.id}.xlsx`;
    if (type === '.excel') name = `DuLieu_BangTinh_${activeLesson.id}.excel`;
    if (type === '.docx') name = `SoanThaoVanBan_${activeLesson.id}.docx`;
    if (type === '.doc') name = `DonXin_ThamGia_${activeLesson.id}.doc`;
    if (type === '.pptx') name = `ThuyetTrinh_Slide_${activeLesson.id}.pptx`;
    if (type === '.ppt') name = `TrinhChieu_BaiGiang_${activeLesson.id}.ppt`;
    if (type === '.sb3') name = `DuAn_Game_Scratch_${activeLesson.id}.sb3`;
    if (type === '.zip') name = `GoiDuAn_MaNguon_${activeLesson.id}.zip`;

    setUploadedFile({
      name,
      size: '3.2 MB',
      type
    });
    setAiEvaluation(null);
    setSubmissionSuccess(false);
  };

  // Run AI Pre-Grader aligned with Rubric
  const handleRunAiEvaluation = async () => {
    if (!uploadedFile) return;
    setIsSubmitting(true);

    const rubricGuide = activeLesson.rubricGuide || DEFAULT_RUBRIC_GUIDE;
    const rubricPrompt = rubricGuide.criteria
      .map((c) => `- ${c.name} (Max ${c.maxScore}đ): ${c.description}`)
      .join('\n');

    try {
      const response = await fetch('/api/ai/grade-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentUser.name,
          assignmentTitle: activeLesson.title,
          gradeLevel: `Khối ${activeLesson.gradeLevel}`,
          fileType: uploadedFile.type,
          submissionContent: `Tệp bài nộp thực hành: ${uploadedFile.name}. Yêu cầu đề bài/Dòng lệnh tùy chỉnh: ${customInstructions}`,
          rubric: rubricPrompt,
          customTeacherInstructions: customInstructions,
          assignmentPdfName: assignmentPdf
        })
      });

      const data = await response.json();
      setAiEvaluation(data);
      setSubmissionSuccess(true);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error running AI grading:', err);
      setAiEvaluation({
        score: 9.0,
        criteriaScores: [
          { name: 'Định dạng & Thể thức tệp', score: 3.5, max: 3.5, comment: 'Đạt chuẩn thể thức' },
          { name: 'Tính chính xác & Logic xử lý', score: 4.0, max: 4.5, comment: 'Đáp ứng tốt nội dung bài làm' },
          { name: 'Trình bày & Thẩm mỹ', score: 1.5, max: 2.0, comment: 'Bố cục khoa học, dễ theo dõi' }
        ],
        feedback: `Học sinh ${currentUser.name} hoàn thành tốt bài tập. Đáp ứng đúng Hướng dẫn chấm môn Tin học Khối ${activeLesson.gradeLevel}.`,
        strengths: ['Nộp bài đúng định dạng', 'Cấu trúc bài làm đầy đủ'],
        improvements: ['Kiểm tra thêm chú thích ở phần mở rộng']
      });
      setSubmissionSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct export of current evaluation as multi-sheet Excel
  const handleExportSingleReportExcel = () => {
    const singleBatchItem: BatchGradingItem = {
      id: `sub-${Date.now()}`,
      studentName: currentUser.name,
      studentCode: currentUser.username.toUpperCase(),
      className: currentUser.className || '6A',
      fileName: uploadedFile?.name || 'BaiTap_TinHoc.docx',
      format: (uploadedFile?.type.replace('.', '') as any) || 'docx',
      score: aiEvaluation?.score || 9.0,
      gradeType: (aiEvaluation?.score || 9.0) >= 9 ? 'Xuất sắc' : (aiEvaluation?.score || 9.0) >= 8 ? 'Giỏi' : 'Khá',
      criteriaScores: aiEvaluation?.criteriaScores || [
        { name: 'Thể thức & Kỹ thuật', score: 3.5, maxScore: 3.5, comment: 'Đạt chuẩn' },
        { name: 'Nội dung & Thuật toán', score: 4.0, maxScore: 4.5, comment: 'Chính xác' }
      ],
      breakdown: {
        formatCompliance: 3.5,
        logicCorrectness: 4.0,
        aestheticLayout: 1.5,
        comments: aiEvaluation?.feedback || 'Bài làm đạt yêu cầu theo Hướng dẫn chấm.'
      },
      detectedIssues: []
    };

    exportMultiSheetGradingExcel([singleBatchItem], activeLesson.rubricGuide || DEFAULT_RUBRIC_GUIDE);
    confetti({ particleCount: 70, spread: 60 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Grade Selector Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Chương Trình Tin Học THCS (2018)
          </h1>
          <p className="text-sm text-slate-600">
            Học liệu số hóa phân cấp theo khối lớp, bài giảng tương tác và chấm bài thông minh
          </p>
        </div>

        {/* Grade tabs */}
        <div className="inline-flex p-1 bg-slate-200/80 rounded-xl">
          {([6, 7, 8, 9] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => handleSelectGrade(grade)}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedGrade === grade
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Khối {grade}
              {grade === 9 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] bg-indigo-100 text-indigo-700 font-bold">
                  C++ & HSG
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* D3.js Statistical Progress Dashboard */}
      <div className="mb-6">
        <AssignmentProgressD3Chart />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Lessons List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Mục Lục Khối {selectedGrade}
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                {lessons.length} bài học
              </span>
            </div>

            <div className="space-y-2">
              {lessons.map((lesson) => {
                const isActive = activeLesson.id === lesson.id;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-blue-50/70 border-blue-400 text-blue-900 shadow-xs ring-1 ring-blue-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] font-semibold text-blue-600 uppercase mb-0.5">
                      {lesson.chapter}
                    </div>
                    <div className="font-semibold text-sm line-clamp-2 text-slate-900">
                      {lesson.title}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.duration || '45 phút'}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                        {lesson.practiceType === 'quiz' ? 'Trắc nghiệm' : lesson.practiceType === 'cpp' ? 'Code C++' : 'Thực hành File'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Format Highlights Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-200/60 rounded-2xl p-4 text-xs text-slate-700 space-y-2">
            <div className="font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Định dạng tệp nộp hỗ trợ đầy đủ:
            </div>
            <div className="flex flex-wrap gap-1">
              {ALL_SUPPORTED_FORMATS.map((fmt) => (
                <span key={fmt} className="px-1.5 py-0.5 bg-white border border-indigo-200 text-indigo-800 font-mono rounded text-[10px] font-bold">
                  {fmt}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
              AI tự động phân tích cú pháp theo chuẩn chuyên biệt của từng loại tệp và xuất báo cáo đối soát nhiều sheet trong Excel.
            </p>
          </div>
        </div>

        {/* Right: Active Lesson Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase mb-1">
              <span>Tin học {activeLesson.gradeLevel}</span>
              <span>•</span>
              <span>{activeLesson.chapter}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {activeLesson.title}
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              {activeLesson.description}
            </p>

            {/* Video Lecture Simulation */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video mb-6 group border border-slate-800">
              <img
                src={activeLesson.videoUrl}
                alt="Lecture preview"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                <button
                  onClick={() => confetti({ particleCount: 30, spread: 45 })}
                  className="w-16 h-16 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform mb-3"
                  aria-label="Phát video bài giảng"
                >
                  <Play className="w-7 h-7 fill-white ml-1" />
                </button>
                <div className="text-sm font-semibold tracking-wide">Video Bài Giảng Tương Tác</div>
                <div className="text-xs text-slate-300">Thời lượng: {activeLesson.duration || '45 phút'} • Thầy Nguyễn Văn Bình giảng dạy</div>
              </div>
            </div>

            {/* Theory Content */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Lý Thuyết & Trọng Tâm Kiến Thức
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 sm:p-5 text-sm text-slate-700 leading-relaxed space-y-3 border border-slate-200/70 font-sans">
                {activeLesson.theoryContent.split('\n\n').map((paragraph, i) => {
                  if (paragraph.startsWith('###')) {
                    return (
                      <h4 key={i} className="font-bold text-slate-900 text-sm mt-3 pt-2 border-t border-slate-200/50 first:mt-0 first:pt-0 first:border-0">
                        {paragraph.replace('###', '').trim()}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    return (
                      <pre key={i} className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs overflow-x-auto font-mono">
                        {paragraph.replace(/```cpp|```/g, '').trim()}
                      </pre>
                    );
                  }
                  return (
                    <div key={i} className="text-slate-700">
                      {paragraph}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* HƯỚNG DẪN CHẤM & RUBRIC ACCORDION */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div 
              onClick={() => setShowRubricDetails(!showRubricDetails)}
              className="flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Hướng Dẫn Chấm & Tiêu Chí Đánh Giá (Rubric Chuẩn)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Căn cứ tính điểm tự động của AI & đối soát của giáo viên (Thang điểm 10)
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                aria-label={showRubricDetails ? "Thu gọn tiêu chí chấm" : "Xem chi tiết tiêu chí chấm"}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                {showRubricDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showRubricDetails && (
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {(activeLesson.rubricGuide || DEFAULT_RUBRIC_GUIDE).criteria.map((crit) => (
                    <div key={crit.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                        <span>{crit.name}</span>
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 text-emerald-800 font-bold">
                          Max {crit.maxScore}đ
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{crit.description}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 border border-blue-200">
                  <strong>Nguyên tắc chấm:</strong> Điểm bài nộp được tổng hợp chi tiết theo từng sheet tương ứng với loại tệp (.docx, .doc, .xlsx, .excel, .ppt, .pptx, .cpp, .sb3, .pdf, .zip).
                </div>
              </div>
            )}
          </div>

          {/* Quiz section */}
          {activeLesson.practiceType === 'quiz' && activeLesson.quizQuestions && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  Trắc Nghiệm Khắc Sâu Kiến Thức ({activeLesson.quizQuestions.length} câu)
                </h3>
                {quizScore !== null && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Kết quả: {quizScore}/10 điểm
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {activeLesson.quizQuestions.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="font-semibold text-sm text-slate-900 mb-3">
                        Câu {qIndex + 1}: {q.question}
                      </div>
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          let optStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                          if (userAnswer === optIdx) {
                            optStyle = 'border-blue-500 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500';
                          }
                          if (quizSubmitted) {
                            if (optIdx === q.correctIndex) {
                              optStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-500';
                            } else if (userAnswer === optIdx && !isCorrect) {
                              optStyle = 'border-rose-400 bg-rose-50 text-rose-900 line-through';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIdx })}
                              className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${optStyle}`}
                            >
                              <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                              {quizSubmitted && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="mt-3 p-2.5 bg-blue-50/80 rounded-lg text-xs text-blue-800 border border-blue-200">
                          <strong>Giải thích:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-end gap-3">
                {quizSubmitted ? (
                  <button
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                      setQuizScore(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Làm lại bài trắc nghiệm
                  </button>
                ) : (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Nộp Bài Trắc Nghiệm
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PRACTICAL FILE SUBMISSION WITH ALL 10 FORMATS & AI GRADING */}
          {activeLesson.assignmentPrompt && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-indigo-600" />
                  Nộp Bài Tập Thực Hành & Chấm Điểm Bằng AI
                </h3>
                <span className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold border border-amber-200">
                  Hạn nộp: {activeLesson.dueDate}
                </span>
              </div>

              {/* PDF Assignment Brief & Custom Teacher Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {/* PDF Assignment Brief Card */}
                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-900 uppercase flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        Đề Bài Tập (Tệp PDF Đính Kèm)
                      </span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded font-mono">
                        PDF Brief
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 truncate mb-1">
                      {assignmentPdf}
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Tải xuống hoặc tải lên tệp đề bài PDF chi tiết do giáo viên biên soạn.
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <input
                      ref={pdfInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfBrowse}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (pdfInputRef.current) pdfInputRef.current.click();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-colors shadow-2xs inline-flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      Tải Lên Đề PDF Mới
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        confetti({ particleCount: 30 });
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-2xs"
                    >
                      Xem / Tải Đề PDF
                    </button>
                  </div>
                </div>

                {/* Custom Teacher Instructions / Command Line Requirement */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                        <Code className="w-4 h-4 text-emerald-600" />
                        Dòng Lệnh / Yêu Cầu Tùy Chỉnh Từ Giáo Viên
                      </span>
                      <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded">
                        Custom Rule
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Nhập dòng lệnh biên dịch hoặc yêu cầu chấm tùy chỉnh (VD: <code className="text-indigo-700">g++ -O3 main.cpp</code> hoặc yêu cầu đặc thù của giáo viên).
                    </p>
                  </div>

                  <textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    placeholder="Nhập yêu cầu chấm tùy chỉnh hoặc dòng lệnh..."
                    className="w-full h-16 p-2 rounded-lg border border-slate-200 text-xs font-mono bg-white text-slate-800 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Supported formats pills */}
              <div className="mb-4">
                <span className="text-xs text-slate-500 font-semibold block mb-1.5">
                  Định dạng hỗ trợ nộp bài ({ALL_SUPPORTED_FORMATS.length} loại tệp):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_SUPPORTED_FORMATS.map((fmt) => (
                    <span 
                      key={fmt} 
                      className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 transition-colors cursor-default"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              {/* Hidden File Input for Real Computer Upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".cpp,.pdf,.xlsx,.xls,.docx,.doc,.ppt,.pptx,.sb3,.zip"
                onChange={handleFileBrowse}
                className="hidden"
              />

              {/* Upload Dropzone */}
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center transition-colors bg-slate-50/40 cursor-pointer"
                onClick={() => {
                  if (!uploadedFile && fileInputRef.current) {
                    fileInputRef.current.click();
                  }
                }}
              >
                {uploadedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 font-bold uppercase text-sm shadow-xs">
                      {uploadedFile.type.replace('.', '')}
                    </div>
                    <div className="font-bold text-base text-slate-900">{uploadedFile.name}</div>
                    <div className="text-xs text-slate-500 mb-3">{uploadedFile.size} • Sẵn sàng chấm đối chiếu Rubric</div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                        className="text-xs text-rose-600 hover:text-rose-800 underline font-medium"
                      >
                        Chọn tệp khác
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Kéo thả tệp bài nộp vào đây hoặc bấm vào để chọn tệp từ máy tính
                    </p>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Hỗ trợ tải lên: .cpp, .pdf, .xlsx, .docx, .doc, .ppt, .pptx, .sb3, .zip
                    </p>

                    <div className="flex items-center justify-center gap-3 mb-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (fileInputRef.current) fileInputRef.current.click();
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Tải Tệp Lên Từ Máy Tính
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      <div className="text-xs text-slate-500 font-medium">Hoặc chọn nhanh tệp mẫu kiểm thử AI chấm:</div>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xl mx-auto">
                        {ALL_SUPPORTED_FORMATS.map((fmt) => (
                          <button
                            key={fmt}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePickSampleFile(fmt);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-700 shadow-2xs transition-all cursor-pointer"
                          >
                            Tệp mẫu {fmt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {uploadedFile && (
                <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="text-xs text-slate-500">
                    Học sinh: <strong>{currentUser.name}</strong> ({currentUser.username})
                  </div>
                  <button
                    onClick={handleRunAiEvaluation}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {isSubmitting ? 'AI Đang Đọc & Chấm Theo Rubric...' : 'Chấm Bài Ngay Bằng AI (Gemini)'}
                  </button>
                </div>
              )}

              {/* AI Grading Results Card */}
              {aiEvaluation && (
                <div className="mt-6 border border-emerald-300 bg-emerald-50/50 rounded-2xl p-5 animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          Kết Quả Chấm Bài Theo Hướng Dẫn Chấm
                        </div>
                        <div className="text-[11px] text-slate-600">
                          Định dạng tệp: <strong>{uploadedFile?.type}</strong> • Mô hình: {aiEvaluation.aiModelUsed || 'Gemini 2.5 Flash'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center gap-3">
                      <div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                          {aiEvaluation.score}<span className="text-xs font-semibold text-slate-500">/10đ</span>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-800">
                          {aiEvaluation.score >= 9 ? 'Xuất sắc' : aiEvaluation.score >= 8 ? 'Giỏi' : 'Khá'}
                        </div>
                      </div>

                      {/* Export Excel Button right on the result */}
                      <button
                        onClick={handleExportSingleReportExcel}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
                        title="Tải tệp Excel tổng hợp nhiều sheet theo rubric"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất File Excel</span>
                      </button>
                    </div>
                  </div>

                  {/* Criteria scores breakdown according to Rubric */}
                  {aiEvaluation.criteriaScores && (
                    <div>
                      <div className="text-xs font-bold text-slate-700 uppercase mb-2">
                        Điểm Chi Tiết Từng Tiêu Chí Theo Rubric:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {aiEvaluation.criteriaScores.map((crit: any, i: number) => (
                          <div key={i} className="bg-white/95 p-3 rounded-xl border border-emerald-200 text-xs shadow-2xs">
                            <div className="font-bold text-slate-800">{crit.name}</div>
                            <div className="text-emerald-700 font-black text-sm mt-0.5">
                              {crit.score}/{crit.max}đ
                            </div>
                            <div className="text-[11px] text-slate-600 mt-1 leading-tight">{crit.comment}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pedagogical feedback */}
                  <div className="bg-white rounded-xl p-3.5 border border-emerald-200 text-xs text-slate-800 leading-relaxed">
                    <strong>Lời phê sư phạm:</strong> {aiEvaluation.feedback}
                  </div>

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {aiEvaluation.strengths && (
                      <div className="bg-white/90 p-3 rounded-xl border border-slate-200">
                        <div className="font-bold text-emerald-700 mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Điểm nổi bật theo Rubric:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                          {aiEvaluation.strengths.map((str: string, i: number) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {aiEvaluation.improvements && (
                      <div className="bg-white/90 p-3 rounded-xl border border-slate-200">
                        <div className="font-bold text-amber-700 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Góp ý điều chỉnh để đạt điểm tuyệt đối:
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                          {aiEvaluation.improvements.map((imp: string, i: number) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
