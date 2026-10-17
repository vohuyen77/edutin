import React from 'react';
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  Smartphone, 
  Monitor, 
  Bell, 
  BookOpen, 
  Code2, 
  FileSpreadsheet, 
  FileText,
  Flame,
  Award,
  Layers
} from 'lucide-react';
import { User, UserRole, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (userId: string) => void;
  allUsers: User[];
  viewMode: 'desktop' | 'mobile';
  onToggleViewMode: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenArchitecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  viewMode,
  onToggleViewMode,
  activeTab,
  onSelectTab,
  notifications,
  onOpenNotifications,
  onOpenArchitecture
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'teacher':
        return { label: 'Giáo viên / Admin', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
      case 'student':
        return { label: `Học sinh Lớp ${currentUser.className || '6A'}`, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' };
      case 'parent':
        return { label: 'Phụ huynh học sinh', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
    }
  };

  const badge = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner & Quick Role Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">EduTin THCS</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Khối 6-9 & AI Auto-Grader
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                Hệ thống E-Learning Tin học & Chấm bài tự động tích hợp Gemini AI
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Architecture Modal Trigger */}
            <button
              onClick={onOpenArchitecture}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
              title="Xem Sơ đồ Kiến trúc & Đặc tả Kỹ thuật 5 Phần"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Kiến trúc Hệ thống</span>
            </button>

            {/* View Mode Toggle (Mobile / Desktop) */}
            <button
              onClick={onToggleViewMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                viewMode === 'mobile'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={viewMode === 'mobile' ? 'Chuyển sang bản Web Desktop' : 'Chuyển sang Giả lập Mobile App'}
            >
              {viewMode === 'mobile' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chế độ Mobile App</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chế độ Web Desktop</span>
                </>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Role Switcher Dropdown */}
            <div className="relative flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/30 object-cover"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className={`text-[10px] font-medium px-1.5 py-0.2 rounded border inline-block ${badge.color}`}>
                  {badge.label}
                </div>
              </div>

              {/* Selector */}
              <select
                aria-label="Chuyển đổi vai trò người dùng"
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium hover:bg-slate-100 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                {allUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.role === 'teacher' ? '👨‍🏫 GV: ' : u.role === 'student' ? '🎓 HS: ' : '👨‍👩‍👧 PH: '}
                    {u.name} ({u.username})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gamification Bar for Students */}
        {currentUser.role === 'student' && (
          <div className="py-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                Chuỗi học tập: <strong className="text-slate-800">{currentUser.streakDays || 7} ngày liên tục</strong>
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <Award className="w-4 h-4 text-indigo-600" />
                Điểm tích lũy: <strong className="text-slate-800">{currentUser.points || 480} XP</strong>
              </span>
            </div>
            <div className="text-slate-500 text-[11px] hidden sm:block">
              Mã đăng nhập định danh: <span className="font-mono font-bold text-slate-700">{currentUser.username}</span> | Mật khẩu mặc định: ddmmyyyy
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 border-t border-slate-100 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => onSelectTab('curriculum')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            LMS Học Tập (Khối 6-9)
          </button>

          <button
            onClick={() => onSelectTab('cpp-grader')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'cpp-grader'
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Luyện HSG Tin 9 (C++ Grader)
          </button>

          <button
            onClick={() => onSelectTab('batch-grader')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'batch-grader'
                ? 'bg-emerald-50 text-emerald-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Chấm Đa Định Dạng & Xuất Excel
          </button>

          {currentUser.role === 'teacher' && (
            <button
              onClick={() => onSelectTab('class-management')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'class-management'
                  ? 'bg-amber-50 text-amber-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Quản lý Lớp & Nhập Excel
            </button>
          )}

          {(currentUser.role === 'parent' || currentUser.role === 'teacher') && (
            <button
              onClick={() => onSelectTab('parent-portal')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === 'parent-portal'
                  ? 'bg-purple-50 text-purple-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Cổng Phụ Huynh & Báo Cáo AI
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
