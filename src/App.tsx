/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileFrame } from './components/MobileFrame';
import { CurriculumView } from './components/CurriculumView';
import { CppAutoGrader } from './components/CppAutoGrader';
import { BatchAutoGrader } from './components/BatchAutoGrader';
import { ClassManagement } from './components/ClassManagement';
import { ParentPortal } from './components/ParentPortal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { NotificationCenter } from './components/NotificationCenter';
import { INITIAL_USERS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { User, NotificationItem } from './types';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default: Teacher
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<string>('curriculum');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // First login password change modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Switch user role
  const handleSwitchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'parent') {
        setActiveTab('parent-portal');
      } else if (user.role === 'student' && user.gradeLevel === 9) {
        setActiveTab('cpp-grader');
      } else {
        setActiveTab('curriculum');
      }

      // Check if student requires first login password change
      if (user.role === 'student' && user.isFirstLogin) {
        setShowPasswordModal(true);
      }
    }
  };

  // Add students from Excel import
  const handleAddStudents = (newStudents: User[]) => {
    setAllUsers((prev) => [...prev, ...newStudents]);
    // Notify
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '📁 Nhập danh sách lớp thành công',
      message: `Đã tự động tạo và kích hoạt ${newStudents.length} tài khoản học sinh và liên kết phụ huynh.`,
      type: 'schedule',
      timestamp: 'Vừa xong',
      read: false,
      targetRole: 'teacher'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // First login password update submit
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    // Update current user
    const updatedUser = { ...currentUser, isFirstLogin: false };
    setCurrentUser(updatedUser);
    setAllUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setShowPasswordModal(false);
    setPasswordError('');
    setNewPassword('');
    setConfirmPassword('');

    confetti({ particleCount: 70, spread: 60 });
  };

  // Notification handlers
  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Find linked student for parents
  const linkedStudent = allUsers.find(
    (u) => u.id === (currentUser.linkedStudentId || 'usr-student-1')
  ) || allUsers[1];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={allUsers}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
      />

      {/* Main View Area (Desktop or Smartphone Container) */}
      <MobileFrame
        isMobile={viewMode === 'mobile'}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      >
        {activeTab === 'curriculum' && <CurriculumView currentUser={currentUser} />}
        {activeTab === 'cpp-grader' && <CppAutoGrader currentUser={currentUser} />}
        {activeTab === 'batch-grader' && <BatchAutoGrader currentUser={currentUser} />}
        {activeTab === 'class-management' && (
          <ClassManagement users={allUsers} onAddStudents={handleAddStudents} />
        )}
        {activeTab === 'parent-portal' && (
          <ParentPortal currentUser={currentUser} linkedStudent={linkedStudent} />
        )}
      </MobileFrame>

      {/* Architecture & Specs Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      {/* Real-time Notification Drawer */}
      <NotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      {/* Modal: First-login Password Change Prompt */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Đổi Mật Khẩu Lần Đầu Đăng Nhập</h3>
              <p className="text-xs text-slate-500 mt-1">
                Chào mừng em <strong>{currentUser.name}</strong> ({currentUser.username}). Để bảo vệ tài khoản, vui lòng thay đổi mật khẩu ngày sinh mặc định (ddmmyyyy).
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu mới (tối thiểu 6 ký tự):
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận lại mật khẩu mới:
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {passwordError && (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {passwordError}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  Để sau
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Lưu Mật Khẩu & Bắt Đầu Học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
