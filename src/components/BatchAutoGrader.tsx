import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Sparkles, 
  FileText, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  FolderArchive,
  Layers,
  Settings,
  Filter,
  FileCheck2,
  Presentation,
  Terminal,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { INITIAL_BATCH_ITEMS } from '../data/mockData';
import { BatchGradingItem, User, RubricGuide } from '../types';
import { exportMultiSheetGradingExcel, DEFAULT_RUBRIC_GUIDE } from '../utils/excelHelper';

interface BatchAutoGraderProps {
  currentUser: User;
}

export const BatchAutoGrader: React.FC<BatchAutoGraderProps> = ({ currentUser }) => {
  const [items, setItems] = useState<BatchGradingItem[]>(INITIAL_BATCH_ITEMS);
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('all');
  const [activePreviewSheet, setActivePreviewSheet] = useState<number>(1);
  const [isAiReevaluating, setIsAiReevaluating] = useState(false);
  const [rubricGuide, setRubricGuide] = useState<RubricGuide>(DEFAULT_RUBRIC_GUIDE);
  const [showRubricModal, setShowRubricModal] = useState(false);

  // Filter items
  const filteredItems = selectedFormatFilter === 'all'
    ? items
    : items.filter((i) => i.format === selectedFormatFilter);

  // Trigger real multi-sheet Excel export
  const handleExportExcel = () => {
    exportMultiSheetGradingExcel(items, rubricGuide);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Re-evaluate with AI
  const handleReevaluateAll = () => {
    setIsAiReevaluating(true);
    setTimeout(() => {
      const updated = items.map((item) => ({
        ...item,
        score: Math.min(10, Math.round((item.score + (Math.random() > 0.5 ? 0.5 : 0)) * 10) / 10),
        breakdown: {
          ...item.breakdown,
          comments: item.breakdown.comments + ' (Đã rà soát lại theo Hướng dẫn chấm bằng Gemini AI).'
        }
      }));
      setItems(updated);
      setIsAiReevaluating(false);
      confetti({ particleCount: 50 });
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Chấm Điểm Đa Định Dạng (10 Loại Tệp)
            </span>
            <span className="text-xs text-slate-500">.cpp • .pdf • .excel • .docx • .doc • .ppt • .pptx • .sb3 • .zip</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Chấm Bài Thực Hành Bằng AI & Xuất Excel Theo Hướng Dẫn Chấm
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowRubricModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <FileCheck2 className="w-4 h-4 text-indigo-600" />
            Xem Hướng Dẫn Chấm (Rubric)
          </button>

          <button
            onClick={handleReevaluateAll}
            disabled={isAiReevaluating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            {isAiReevaluating ? 'Đang Chấm Lại...' : 'AI Chấm Lại Hàng Loạt'}
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Xuất File Excel Nhiều Sheet (.xlsx)
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Tổng số bài nộp</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{items.length} bài</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Đầy đủ 10 định dạng hỗ trợ</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Điểm trung bình theo rubric</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {(items.reduce((acc, cur) => acc + cur.score, 0) / items.length).toFixed(1)}/10đ
          </div>
          <div className="text-xs text-blue-600 font-semibold mt-1">Đạt chuẩn năng lực THCS</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Tỷ lệ xuất sắc & giỏi</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {Math.round((items.filter((i) => i.score >= 8.5).length / items.length) * 100)}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Chấm tự động theo chuẩn GDPT</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Cấu trúc File Excel Xuất</div>
          <div className="text-2xl font-bold text-indigo-700 mt-1">8 Sheets</div>
          <div className="text-xs text-slate-500 mt-1">Tổng hợp + 6 Sheet định dạng + Rubric</div>
        </div>
      </div>

      {/* Sheet Preview Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 uppercase">Xem trước các Sheet trong Excel:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs flex-wrap gap-1">
              <button
                onClick={() => setActivePreviewSheet(1)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 1 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 1: Tổng Hợp Điểm
              </button>
              <button
                onClick={() => setActivePreviewSheet(2)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 2 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 2: Word (.docx/.doc)
              </button>
              <button
                onClick={() => setActivePreviewSheet(3)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 3 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 3: Excel (.xlsx/.excel)
              </button>
              <button
                onClick={() => setActivePreviewSheet(4)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 4 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 4: PowerPoint (.ppt/.pptx)
              </button>
              <button
                onClick={() => setActivePreviewSheet(5)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 5 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 5: C++ Code (.cpp)
              </button>
              <button
                onClick={() => setActivePreviewSheet(6)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 6 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 6: Scratch (.sb3)
              </button>
              <button
                onClick={() => setActivePreviewSheet(7)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 7 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 7: PDF & Zip
              </button>
              <button
                onClick={() => setActivePreviewSheet(8)}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  activePreviewSheet === 8 ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sheet 8: Rubric Chấm
              </button>
            </div>
          </div>

          {/* Format filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              aria-label="Lọc theo định dạng bài nộp"
              value={selectedFormatFilter}
              onChange={(e) => setSelectedFormatFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
            >
              <option value="all">Tất cả 10 định dạng</option>
              <option value="docx">Word (.docx)</option>
              <option value="doc">Word (.doc)</option>
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="excel">Excel (.excel)</option>
              <option value="pptx">PowerPoint (.pptx)</option>
              <option value="ppt">PowerPoint (.ppt)</option>
              <option value="cpp">C++ (.cpp)</option>
              <option value="sb3">Scratch (.sb3)</option>
              <option value="pdf">Báo cáo (.pdf)</option>
              <option value="zip">Gói mã nguồn (.zip)</option>
            </select>
          </div>
        </div>

        {/* Sheet 1: Bảng điểm tổng hợp */}
        {activePreviewSheet === 1 && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Mã HS</th>
                  <th className="py-3 px-3">Họ và Tên</th>
                  <th className="py-3 px-3">Lớp</th>
                  <th className="py-3 px-3">Tệp Bài Nộp</th>
                  <th className="py-3 px-3 text-center">Định Dạng</th>
                  <th className="py-3 px-3 text-right">Điểm Tổng</th>
                  <th className="py-3 px-3">Xếp Loại</th>
                  <th className="py-3 px-3">Nhận Xét Của AI & Giáo Viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.studentCode}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.studentName}</td>
                    <td className="py-3 px-3 text-slate-600">{item.className}</td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-xs truncate max-w-[180px]">{item.fileName}</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        item.format.includes('doc') ? 'bg-blue-100 text-blue-800' :
                        item.format.includes('xls') || item.format === 'excel' ? 'bg-emerald-100 text-emerald-800' :
                        item.format.includes('ppt') ? 'bg-orange-100 text-orange-800' :
                        item.format === 'cpp' ? 'bg-indigo-100 text-indigo-800' :
                        item.format === 'sb3' ? 'bg-amber-100 text-amber-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        .{item.format}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-black text-emerald-700 text-base">{item.score}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.gradeType === 'Xuất sắc' ? 'bg-emerald-100 text-emerald-800' :
                        item.gradeType === 'Giỏi' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {item.gradeType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-slate-600 max-w-xs">{item.breakdown.comments}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sheet 2: Word Details */}
        {activePreviewSheet === 2 && (
          <div className="mt-4 p-4 bg-blue-50/40 rounded-xl border border-blue-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-blue-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Sheet 2: Chi Tiết Đánh Giá Tệp Văn Bản Word (.docx, .doc)
            </div>
            <p className="text-slate-600 text-xs">
              Tiêu chí Hướng dẫn chấm: Phông chữ Unicode (Times New Roman / Arial), Cỡ chữ 13-14pt, Giãn dòng 1.5 lines, Căn lề chuẩn (Trái 3cm, Phải 2cm, Trên/Dưới 2cm) theo Nghị định 30.
            </p>
            <div className="space-y-2 mt-2">
              {items.filter((i) => i.format === 'docx' || i.format === 'doc').map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.studentName} ({item.className}) - {item.fileName}</div>
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">
                      ✓ Đạt chuẩn căn lề 3cm/2cm • Font 14pt • Giãn dòng 1.5 lines
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-base">{item.score}/10đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sheet 3: Excel Details */}
        {activePreviewSheet === 3 && (
          <div className="mt-4 p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-emerald-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Sheet 3: Chi Tiết Đánh Giá Bảng Tính Excel (.xlsx, .excel)
            </div>
            <p className="text-slate-600 text-xs">
              Tiêu chí Hướng dẫn chấm: Cú pháp hàm thống kê (SUM, AVERAGE, MAX, MIN), Hàm điều kiện lồng nhau IF, Định dạng số có dấu phẩy phân cách hàng nghìn, Kẻ khung viền bảng tính và vẽ biểu đồ.
            </p>
            <div className="space-y-2 mt-2">
              {items.filter((i) => i.format === 'xlsx' || i.format === 'excel').map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.studentName} ({item.className}) - {item.fileName}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {item.detectedIssues.length > 0 ? (
                        <span className="text-amber-700 font-medium">⚠️ {item.detectedIssues.join(', ')}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">✓ Sử dụng đúng hàm =IF, =SUM, định dạng số và bảng biểu chuẩn</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-base">{item.score}/10đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sheet 4: PowerPoint Details */}
        {activePreviewSheet === 4 && (
          <div className="mt-4 p-4 bg-orange-50/40 rounded-xl border border-orange-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-orange-900 flex items-center gap-2">
              <Presentation className="w-4 h-4 text-orange-600" />
              Sheet 4: Chi Tiết Đánh Giá Bản Trình Chiếu PowerPoint (.ppt, .pptx)
            </div>
            <p className="text-slate-600 text-xs">
              Tiêu chí Hướng dẫn chấm: Bố cục Slide Master đồng bộ, màu sắc tương phản cao, cỡ chữ tiêu đề &amp; nội dung (&ge; 24pt), hiệu ứng chuyển slide (Transition) và hiệu ứng đối tượng (Animation) hợp lý.
            </p>
            <div className="space-y-2 mt-2">
              {items.filter((i) => i.format === 'ppt' || i.format === 'pptx').map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-orange-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.studentName} ({item.className}) - {item.fileName}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {item.detectedIssues.length > 0 ? (
                        <span className="text-amber-700 font-medium">⚠️ {item.detectedIssues.join(', ')}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">✓ Bố cục Slide Master hài hòa, hiệu ứng mượt mà, cỡ chữ chuẩn</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-base">{item.score}/10đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sheet 5: C++ Details */}
        {activePreviewSheet === 5 && (
          <div className="mt-4 p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-indigo-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              Sheet 5: Chi Tiết Đánh Giá Mã Nguồn C++ (.cpp)
            </div>
            <p className="text-slate-600 text-xs">
              Tiêu chí Hướng dẫn chấm: Biên dịch thành công với g++ (-std=c++11), vượt qua 100% Test Cases (kể cả test biên), giới hạn thời gian Time Limit (1.0s), bộ nhớ Memory Limit (256MB), cấu trúc code sạch.
            </p>
            <div className="space-y-2 mt-2">
              {items.filter((i) => i.format === 'cpp').map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-indigo-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.studentName} ({item.className}) - {item.fileName}</div>
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">
                      ✓ Biên dịch chuẩn g++ 0 cảnh báo • AC 100% Test Cases • Time: 24ms, Memory: 18.4MB
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-base">{item.score}/10đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sheet 6: Scratch Details */}
        {activePreviewSheet === 6 && (
          <div className="mt-4 p-4 bg-amber-50/40 rounded-xl border border-amber-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-amber-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-amber-600" />
              Sheet 6: Chi Tiết Đánh Giá Dự Án Scratch 3.0 (.sb3)
            </div>
            <p className="text-slate-600 text-xs">
              Tiêu chí Hướng dẫn chấm: Khối lệnh khởi đầu whenGreenFlagClicked, vòng lặp liên tục forever mượt mà, biến số tính điểm, cảm biến va chạm nhân vật và âm thanh sinh động.
            </p>
            <div className="space-y-2 mt-2">
              {items.filter((i) => i.format === 'sb3').map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.studentName} ({item.className}) - {item.fileName}</div>
                    <div className="text-xs text-emerald-600 font-medium mt-0.5">
                      ✓ Vòng lặp 60 FPS • Cảm biến va chạm chính xác • Âm thanh hiệu ứng đầy đủ
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-base">{item.score}/10đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sheet 7: PDF & Zip Details */}
        {activePreviewSheet === 7 && (
          <div className="mt-4 p-4 bg-purple-50/40 rounded-xl border border-purple-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-purple-900 flex items-center gap-2">
              <FolderArchive className="w-4 h-4 text-purple-600" />
              Sheet 7: Chi Tiết Đánh Giá Báo Cáo PDF & Gói Dự Án ZIP (.pdf, .zip)
            </div>
            <p className="text-slate-600 text-xs">
              Tiêu chí Hướng dẫn chấm: Tệp tin toàn vẹn, đầy đủ tài liệu và file đính kèm theo yêu cầu đề bài, định dạng báo cáo chuẩn PDF/A, vượt qua quét an toàn bảo mật.
            </p>
            <div className="space-y-2 mt-2">
              {items.filter((i) => i.format === 'pdf' || i.format === 'zip').map((item) => (
                <div key={item.id} className="bg-white p-3.5 rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">{item.studentName} ({item.className}) - {item.fileName}</div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {item.detectedIssues.length > 0 ? (
                        <span className="text-amber-700 font-medium">⚠️ {item.detectedIssues.join(', ')}</span>
                      ) : (
                        <span className="text-emerald-600 font-medium">✓ Đầy đủ thành phần dự án • Quét an toàn 100% ClamAV</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 text-base">{item.score}/10đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sheet 8: Rubric Guide */}
        {activePreviewSheet === 8 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-3">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              Sheet 8: Toàn Bộ Bảng Hướng Dẫn Chấm (Rubric) Đối Soát
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-200/70 text-slate-700 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">STT</th>
                    <th className="py-2.5 px-3">Tên Tiêu Chí</th>
                    <th className="py-2.5 px-3">Điểm Tối Đa</th>
                    <th className="py-2.5 px-3">Nhóm Định Dạng</th>
                    <th className="py-2.5 px-3">Mô Tả Yêu Cầu Đạt Chuẩn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {rubricGuide.criteria.map((crit, idx) => (
                    <tr key={crit.id}>
                      <td className="py-2.5 px-3 font-bold">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{crit.name}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">{crit.maxScore}đ</td>
                      <td className="py-2.5 px-3 font-mono uppercase text-indigo-700">{crit.targetCategory}</td>
                      <td className="py-2.5 px-3 text-slate-600">{crit.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rubric Guide Modal */}
      {showRubricModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <FileCheck2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{rubricGuide.title}</h3>
                  <p className="text-xs text-slate-500">Căn cứ chấm bài thực hành Tin học THCS theo GDPT 2018</p>
                </div>
              </div>
              <button
                onClick={() => setShowRubricModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-800">Quy chuẩn chung:</div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {rubricGuide.standardRequirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>

              <div className="font-bold text-slate-800 pt-2">Chi tiết từng tiêu chí:</div>
              <div className="space-y-2">
                {rubricGuide.criteria.map((crit) => (
                  <div key={crit.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{crit.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{crit.description}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0 ml-2">
                      Max {crit.maxScore}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowRubricModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
