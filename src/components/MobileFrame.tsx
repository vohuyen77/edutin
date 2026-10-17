import React from 'react';
import { Wifi, Battery, Signal, Home, BookOpen, Code, FileText, Bell } from 'lucide-react';

interface MobileFrameProps {
  isMobile: boolean;
  children: React.ReactNode;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  isMobile,
  children,
  activeTab,
  onSelectTab
}) => {
  if (!isMobile) {
    return <main className="w-full min-h-[calc(100vh-130px)] pb-12">{children}</main>;
  }

  // Current time representation for phone status bar
  const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="py-6 px-2 flex justify-center items-center bg-slate-900/5 min-h-[calc(100vh-130px)]">
      {/* Smartphone Outer Shell */}
      <div className="relative w-full max-w-[420px] h-[860px] bg-slate-950 rounded-[48px] p-3 shadow-2xl shadow-indigo-900/20 border-4 border-slate-700/80 ring-1 ring-slate-900 flex flex-col overflow-hidden">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
          <div className="w-28 h-5 bg-black rounded-full flex items-center justify-between px-3">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-950 ring-1 ring-slate-800" />
          </div>
        </div>

        {/* Screen Bezel Area */}
        <div className="relative w-full h-full bg-slate-50 rounded-[38px] overflow-hidden flex flex-col border border-slate-800/40">
          
          {/* Mobile Top Status Bar */}
          <div className="h-10 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between text-xs font-semibold text-slate-800 select-none border-b border-slate-100 z-40 shrink-0">
            <span>{currentTime}</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4 fill-slate-800" />
            </div>
          </div>

          {/* Mobile Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-16">
            {children}
          </div>

          {/* Native Mobile Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 flex items-center justify-around px-2 z-40">
            <button
              onClick={() => onSelectTab('curriculum')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                activeTab === 'curriculum' ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-[10px]">Học Tập</span>
            </button>

            <button
              onClick={() => onSelectTab('cpp-grader')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                activeTab === 'cpp-grader' ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-5 h-5" />
              <span className="text-[10px]">HSG C++</span>
            </button>

            <button
              onClick={() => onSelectTab('batch-grader')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                activeTab === 'batch-grader' ? 'text-emerald-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="text-[10px]">Chấm Bài</span>
            </button>

            <button
              onClick={() => onSelectTab('parent-portal')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                activeTab === 'parent-portal' ? 'text-purple-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Phụ Huynh</span>
            </button>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/80 rounded-full pointer-events-none z-50" />
        </div>
      </div>
    </div>
  );
};
