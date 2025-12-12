'use client';

import React, { useState } from 'react';
import { Copy, Check, Eye, Code as CodeIcon } from 'lucide-react';

interface CodePreviewProps {
  code: string;
  title?: string;
  preview?: React.ReactNode;
  language?: string;
  defaultTab?: 'preview' | 'code';
}

// Helper to generate a slug from the title for section IDs
const getSectionId = (title?: string) => title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : undefined;

export const CodePreview: React.FC<CodePreviewProps> = ({ 
  code, 
  title,
  preview,
  language = 'tsx',
  defaultTab = 'preview'
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>(defaultTab);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
       <div id={getSectionId(title)} className="border border-slate-300 rounded-lg  bg-white shadow-sm mb-8 scroll-mt-20">
          {title && (
            <div className="px-6 py-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            </div>
          )}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white">
            <div className="flex">
              <button onClick={() => setActiveTab('preview')} className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-all relative ${activeTab === 'preview' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'}`}>
                <Eye className="w-4 h-4" /> Preview
                {activeTab === 'preview' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
              <button onClick={() => setActiveTab('code')} className={`px-6 py-3 font-medium text-sm flex items-center gap-2 transition-all relative ${activeTab === 'code' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'}`}>
                <CodeIcon className="w-4 h-4" /> Code
                {activeTab === 'code' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            </div>
            {activeTab === 'code' && (
              <div className="px-4">
                <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors">
                  {copied ? (<><Check className="w-4 h-4 text-green-600" /> <span className="text-green-600">Copied!</span></>) : (<><Copy className="w-4 h-4" /> Copy Code</>)}
                </button>
              </div>
            )}
          </div>
          <div className="min-h-[150px]">
            {activeTab === 'preview' ? <div className="p-8 bg-slate-50">{preview}</div> : <div className="relative"><pre className="p-6 bg-slate-900 text-slate-100 text-sm overflow-x-auto"><code>{code}</code></pre></div>}
          </div>
        </div>
   
  );
};
