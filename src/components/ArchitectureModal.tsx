import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  GitBranch, 
  Cpu, 
  Globe, 
  X, 
  CheckCircle2, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Server
} from 'lucide-react';
import { ARCHITECTURE_PARTS, TechArchitecturePart } from '../data/architectureSpecs';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activePartId, setActivePartId] = useState<string>('part-1-stack');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPart = ARCHITECTURE_PARTS.find((p) => p.id === activePartId) || ARCHITECTURE_PARTS[0];

  const handleCopySpecs = () => {
    navigator.clipboard.writeText(currentPart.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">Hồ Sơ Kiến Trúc & Đặc Tả Kỹ Thuật Hệ Thống</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Chuẩn 5 Phần
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Thiết kế kiến trúc toàn diện cho E-Learning Tin học THCS (Khối 6-9) & AI Auto-Grader
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySpecs}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-lg"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split: Sidebar & Main Specs Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Navigation: 5 Parts */}
          <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 p-4 space-y-2 overflow-y-auto shrink-0">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">
              Danh mục 5 Phần Yêu Cầu
            </div>

            {ARCHITECTURE_PARTS.map((part) => {
              const isActive = part.id === activePartId;
              return (
                <button
                  key={part.id}
                  onClick={() => setActivePartId(part.id)}
                  className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${
                    isActive
                      ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-semibold shadow-xs ring-1 ring-indigo-400/40'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {part.number}
                  </div>
                  <div>
                    <div className="font-bold line-clamp-1">{part.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{part.shortDesc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Content View */}
          <div className="flex-1 p-6 overflow-y-auto bg-white space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                {currentPart.badge}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Phần {currentPart.number}: {currentPart.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1">{currentPart.shortDesc}</p>
            </div>

            {/* Markdown Text Render */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 space-y-4">
              {currentPart.content.split('\n\n').map((block, i) => {
                if (block.startsWith('###')) {
                  return (
                    <h4 key={i} className="text-base font-bold text-slate-900 mt-4 border-b border-slate-100 pb-1">
                      {block.replace('###', '').trim()}
                    </h4>
                  );
                }
                if (block.startsWith('```')) {
                  return (
                    <pre key={i} className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto">
                      {block.replace(/```[a-z]*|```/g, '').trim()}
                    </pre>
                  );
                }
                if (block.startsWith('|')) {
                  // Render table nicely
                  return (
                    <div key={i} className="overflow-x-auto my-3">
                      <div className="text-[11px] text-slate-500 font-mono whitespace-pre bg-slate-50 p-3 rounded-xl border border-slate-200">
                        {block}
                      </div>
                    </div>
                  );
                }
                return (
                  <p key={i} className="whitespace-pre-line">
                    {block}
                  </p>
                );
              })}
            </div>

            {/* Structured Details Cards */}
            {currentPart.details?.layers && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                {currentPart.details.layers.map((layer: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-indigo-900 text-xs uppercase mb-1.5 flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-indigo-600" />
                      {layer.name}
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-0.5">
                      {layer.items.map((it: string, i: number) => (
                        <li key={i}>{it}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {currentPart.details?.tables && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 uppercase">Danh sách Bảng Dữ liệu (Relational Tables):</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentPart.details.tables.map((tbl: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-indigo-700">{tbl.name}</span>
                        <div className="text-[11px] text-slate-500">{tbl.role}</div>
                      </div>
                      <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded font-mono text-slate-700">
                        {tbl.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentPart.details?.fileEngines && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-700 uppercase">Công Cụ Phân Tích Từng Định Dạng File:</div>
                <div className="space-y-2 text-xs">
                  {currentPart.details.fileEngines.map((eng: any, idx: number) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {eng.type}
                      </span>
                      <span className="text-slate-700 font-sans font-medium">{eng.engine}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
