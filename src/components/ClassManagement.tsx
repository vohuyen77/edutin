import React, { useState } from 'react';
import { 
  Users, 
  FileSpreadsheet, 
  Download, 
  UserPlus, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User } from '../types';
import { downloadStudentTemplateExcel, generateUsername, generateDefaultPassword } from '../utils/excelHelper';

interface ClassManagementProps {
  users: User[];
  onAddStudents: (newStudents: User[]) => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({ users, onAddStudents }) => {
  const [selectedClass, setSelectedClass] = useState<string>('6A');
  const [searchQuery, setSearchQuery] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  // Filter students
  const students = users.filter((u) => u.role === 'student');
  const classStudents = students.filter(
    (s) => (s.className === selectedClass || selectedClass === 'all') &&
           (s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sample import data for teachers to test bulk import
  const handleSimulateBulkExcelImport = () => {
    const rawBatch = [
      { name: 'Nguyễn Tiến Dũng', className: '6A', birthDate: '2013-03-12', points: 350 },
      { name: 'Vũ Hoàng Hải Yến', className: '6A', birthDate: '2013-09-25', points: 410 },
      { name: 'Bùi Đức Trọng', className: '6A', birthDate: '2013-12-08', points: 290 },
      { name: 'Đặng Ngọc Mai', className: '6A', birthDate: '2013-01-30', points: 530 }
    ];

    const generatedStudents: User[] = rawBatch.map((item, idx) => ({
      id: `usr-imported-${Date.now()}-${idx}`,
      name: item.name,
      role: 'student',
      className: item.className,
      gradeLevel: 6,
      birthDate: item.birthDate,
      username: generateUsername(item.name, item.className),
      isFirstLogin: true,
      points: item.points,
      streakDays: 3,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + idx}?w=150&auto=format&fit=crop&q=80`
    }));

    onAddStudents(generatedStudents);
    setShowImportModal(false);
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Phân Quyền & Quản Lý RBAC
            </span>
            <span className="text-xs text-slate-500">Giáo viên & Quản trị viên Toàn Quyền</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-600" />
            Quản Lý Khối Lớp & Nhập Danh Sách Học Viên Bằng Excel
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadStudentTemplateExcel()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Tải Mẫu Excel (.xlsx)
          </button>

          <button
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Nhập Học Sinh Hàng Loạt
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Tổng số học sinh</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{students.length} em</div>
          <div className="text-xs text-slate-500 mt-1">Đã cấp tài khoản định danh</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Cơ chế định danh Username</div>
          <div className="text-sm font-mono font-bold text-indigo-700 mt-1">[ten][lop] không dấu</div>
          <div className="text-xs text-slate-500 mt-1">Ví dụ: nguyenvana6a</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Mật khẩu mặc định</div>
          <div className="text-sm font-mono font-bold text-emerald-700 mt-1">ddmmyyyy (Ngày sinh)</div>
          <div className="text-xs text-slate-500 mt-1">Hỗ trợ đổi MK lần đầu đăng nhập</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Liên kết Phụ huynh</div>
          <div className="text-2xl font-bold text-purple-700 mt-1">100%</div>
          <div className="text-xs text-slate-500 mt-1">Tự động kích hoạt tài khoản giám sát</div>
        </div>
      </div>

      {/* Class Tabs & Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
          {/* Class pills */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs">
            {['6A', '7A', '8A', '9A', 'all'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  selectedClass === cls
                    ? 'bg-white text-amber-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cls === 'all' ? 'Tất cả khối lớp' : `Lớp ${cls}`}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 w-64"
            />
          </div>
        </div>

        {/* Student Accounts Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Họ và Tên</th>
                <th className="py-3 px-3">Lớp</th>
                <th className="py-3 px-3 font-mono">Username Định Danh</th>
                <th className="py-3 px-3 font-mono">Mật Khẩu Ban Đầu (ddmmyyyy)</th>
                <th className="py-3 px-3">Trạng Thái Đổi MK</th>
                <th className="py-3 px-3">Tài Khoản Phụ Huynh Liên Kết</th>
                <th className="py-3 px-3 text-right">Điểm XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classStudents.map((st) => {
                const defaultPass = generateDefaultPassword(st.birthDate);
                return (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900 flex items-center gap-2">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span>{st.name}</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-700">{st.className}</td>
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700 bg-indigo-50/50 rounded">
                      {st.username}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {defaultPass} ({st.birthDate})
                    </td>
                    <td className="py-3 px-3">
                      {st.isFirstLogin ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                          Chờ đổi lần đầu
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <ShieldCheck className="w-3 h-3" />
                          Đã kích hoạt an toàn
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-purple-700 flex items-center gap-1.5 font-medium">
                      <LinkIcon className="w-3 h-3" />
                      phuhuynh_{st.username}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{st.points || 0} XP</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Bulk Excel Import */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Nhập Danh Sách Học Viên Bằng Excel</h3>
                  <p className="text-xs text-slate-500">Tự động sinh tài khoản học sinh và liên kết phụ huynh</p>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900">Quy tắc sinh tài khoản tự động:</div>
              <div>• <strong>Username:</strong> [Tên học sinh] + [Lớp] viết liền không dấu (VD: Nguyễn Văn An lớp 6A &rarr; <code className="font-mono font-bold text-indigo-700 bg-indigo-50 px-1 py-0.5 rounded">nguyenvana6a</code>).</div>
              <div>• <strong>Password:</strong> Ngày tháng năm sinh định dạng <code className="font-mono font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">ddmmyyyy</code>.</div>
              <div>• <strong>Phụ huynh:</strong> Cấp mã giám sát tự động để phụ huynh đăng nhập theo dõi.</div>
            </div>

            <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6 text-center bg-amber-50/30">
              <FileSpreadsheet className="w-10 h-10 text-amber-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-800">Chọn tệp Excel danh sách (.xlsx, .xls)</div>
              <p className="text-xs text-slate-500 mt-1 mb-3">Hỗ trợ cột: Họ và tên, Lớp, Ngày sinh, SĐT Phụ huynh</p>
              
              <button
                onClick={handleSimulateBulkExcelImport}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Nạp Thử Nghiệm Danh Sách 4 Học Sinh Lớp 6A
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
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
