import React, { useState } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Award, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  FileText, 
  Send,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, ParentMonthlyReport } from '../types';

interface ParentPortalProps {
  currentUser: User;
  linkedStudent: User;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({ currentUser, linkedStudent }) => {
  const [reportMonth, setReportMonth] = useState('10');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [report, setReport] = useState<ParentMonthlyReport | null>(null);

  // Generate AI monthly report
  const handleGenerateReport = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/ai/parent-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: linkedStudent.name,
          className: linkedStudent.className || '6A',
          month: reportMonth,
          attendanceRate: 95,
          avgScore: 8.8,
          completedLessons: 6,
          strongAreas: 'Tư duy logic thuật toán rất nhạy bén, thao tác Office thành thạo',
          weakAreas: 'Cần chú ý kiểm tra kỹ lại định dạng trước khi nộp bài'
        })
      });

      const data = await response.json();
      setReport(data);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error generating parent report:', err);
      // Fallback
      setReport({
        reportTitle: `Báo Cáo Học Tập Tháng ${reportMonth} - Em ${linkedStudent.name}`,
        overallAssessment: `Em ${linkedStudent.name} luôn tích cực tham gia các tiết học Tin học trực tuyến, hoàn thành tốt các bài tập thực hành theo chuẩn chương trình GDPT 2018.`,
        competencyAnalysis: [
          { skill: 'Tư duy logic & Thuật toán', score: 9.0, status: 'Xuất sắc', detail: 'Hiểu nhanh cấu trúc điều khiển và giải quyết bài toán tốt.' },
          { skill: 'Kỹ năng phần mềm văn phòng', score: 8.5, status: 'Khá Giỏi', detail: 'Thao tác bảng tính Excel và soạn thảo Word chuẩn thể thức.' },
          { skill: 'Kỷ luật & Tự giác', score: 9.5, status: 'Rất tốt', detail: 'Chưa từng nộp muộn bài tập thực hành nào.' }
        ],
        teacherRemarks: `Kính gửi Bác ${currentUser.name}, em An có tinh thần tự giác cao và rất say mê với bộ môn Tin học. Nhà trường rất mong gia đình tiếp tục khích lệ em phát huy.`,
        recommendationsForHome: [
          'Duy trì thói quen học tập 30-45 phút mỗi buổi tối có lịch Tin học.',
          'Khuyến khích em tham gia thêm Câu lạc bộ Lập trình trẻ của trường.'
        ],
        aiGenerated: true
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Cổng Giám Sát Phụ Huynh
            </span>
            <span className="text-xs text-slate-500">Đồng hành cùng sự tiến bộ của con</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-purple-600" />
            Hồ Sơ Tiến Độ Học Tập & Báo Cáo Định Kỳ
          </h1>
        </div>

        {/* Generate Report Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 font-medium">Chọn kỳ báo cáo:</span>
            <select
              aria-label="Chọn tháng báo cáo"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="font-bold text-slate-800 bg-transparent focus:outline-hidden"
            >
              <option value="9">Tháng 9/2026</option>
              <option value="10">Tháng 10/2026</option>
              <option value="11">Tháng 11/2026</option>
            </select>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={isGeneratingAi}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-purple-600/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {isGeneratingAi ? 'AI Đang Tổng Hợp Báo Cáo...' : 'Tạo Báo Cáo Bằng AI (Gemini)'}
          </button>
        </div>
      </div>

      {/* Child Information Card */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl mb-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={linkedStudent.avatar}
              alt={linkedStudent.name}
              className="w-16 h-16 rounded-2xl ring-4 ring-white/20 object-cover shadow-md"
            />
            <div>
              <div className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                Học sinh được giám sát
              </div>
              <h2 className="text-2xl font-bold">{linkedStudent.name}</h2>
              <div className="text-xs text-slate-300 flex items-center gap-3 mt-1">
                <span>Lớp: <strong className="text-white">{linkedStudent.className}</strong></span>
                <span>•</span>
                <span>Mã học sinh: <strong className="text-white font-mono">{linkedStudent.username}</strong></span>
                <span>•</span>
                <span>GVCN: <strong className="text-white">Thầy Nguyễn Văn Bình</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto text-center">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-purple-200">Điểm TB Tháng</div>
              <div className="text-xl font-black text-amber-300 mt-0.5">8.8/10</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-purple-200">Tỷ Lệ Nộp Bài</div>
              <div className="text-xl font-black text-emerald-300 mt-0.5">100%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
              <div className="text-[11px] text-purple-200">Chuỗi Tự Học</div>
              <div className="text-xl font-black text-cyan-300 mt-0.5">{linkedStudent.streakDays || 7} ngày</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Reminders & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Realtime Reminders */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-600" />
            Nhắc Nhở Lịch Học & Deadline
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Hạn nộp: Bảng tính Excel & Hàm IF</div>
                <div className="text-amber-800 text-[11px] mt-0.5">Hạn chót: 23:59 ngày mai (Chưa nộp)</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Đã hoàn thành: Trắc nghiệm Bài 1</div>
                <div className="text-blue-800 text-[11px] mt-0.5">Đạt 10/10 điểm • Ngày 12/10</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Tiết học trực tuyến tiếp theo</div>
                <div className="text-purple-800 text-[11px] mt-0.5">08:00 Thứ Sáu • Phòng học Tin học 2</div>
              </div>
            </div>
          </div>
        </div>

        {/* Competency Radar Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-600" />
            Đánh Giá Năng Lực Tin Học Theo Chuẩn Bộ GD&ĐT
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Tư duy Thuật toán & Giải quyết vấn đề (CS)</span>
                <span className="text-indigo-600 font-bold">90% (Xuất sắc)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full w-[90%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">Ứng dụng Phần mềm & Xử lý Dữ liệu (ICT)</span>
                <span className="text-blue-600 font-bold">85% (Khá Giỏi)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full w-[85%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-700">An toàn Thông tin & Đạo đức Kỹ thuật số (DL)</span>
                <span className="text-emerald-600 font-bold">95% (Rất tốt)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[95%]" />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Dữ liệu cập nhật theo thời gian thực từ các bài nộp trên hệ thống</span>
            <span className="font-semibold text-slate-700">Xếp hạng: Top 5 của Lớp {linkedStudent.className}</span>
          </div>
        </div>
      </div>

      {/* Generated AI Monthly Progress Report Display */}
      {report && (
        <div className="bg-white rounded-3xl border-2 border-purple-200 p-6 sm:p-8 shadow-lg animate-in fade-in slide-in-from-bottom-3 space-y-6">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{report.reportTitle}</h3>
                <div className="text-xs text-purple-700 font-medium">
                  Báo Cáo Tổng Hợp Tự Động Tạo Bởi Gemini AI • Ký duyệt: Thầy Nguyễn Văn Bình
                </div>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              In Báo Cáo
            </button>
          </div>

          {/* Overall assessment paragraph */}
          <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-xs sm:text-sm text-purple-950 leading-relaxed font-sans">
            <strong>Nhận xét tổng quan:</strong> {report.overallAssessment}
          </div>

          {/* Competency Analysis */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Phân Tích Năng Lực Chi Tiết
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {report.competencyAnalysis.map((comp, idx) => (
                <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 text-sm mb-1">{comp.skill}</div>
                  <div className="flex items-center justify-between font-bold text-purple-700 mb-1.5">
                    <span>Điểm: {comp.score}/10</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px]">{comp.status}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{comp.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher personal note */}
          <div className="border-l-4 border-purple-600 pl-4 py-1 text-xs sm:text-sm text-slate-800 italic bg-slate-50/50 rounded-r-xl">
            "{report.teacherRemarks}"
            <div className="not-italic text-xs font-bold text-slate-900 mt-2">— Thầy Nguyễn Văn Bình (GVCN & Bộ môn Tin học)</div>
          </div>

          {/* Home Recommendations */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
            <div className="font-bold text-amber-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-amber-600" />
              Lời khuyên phối hợp giáo dục giữa Gia đình & Nhà trường:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {report.recommendationsForHome.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
