import React from 'react';
import { Bell, Clock, Calendar, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex justify-end">
      <div className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Trung Tâm Thông Báo</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Đọc tất cả
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Không có thông báo mới nào
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onMarkAsRead(notif.id)}
                className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                  notif.read
                    ? 'bg-slate-50 border-slate-200 text-slate-600'
                    : 'bg-blue-50/60 border-blue-200 text-slate-900 shadow-xs ring-1 ring-blue-300/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    {notif.type === 'deadline' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                    {notif.type === 'schedule' && <Calendar className="w-3.5 h-3.5 text-indigo-600" />}
                    {notif.type === 'parent' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                {!notif.read && (
                  <div className="mt-2 text-[10px] font-bold text-blue-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    Chưa đọc • Nhấn để đánh dấu đã đọc
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
