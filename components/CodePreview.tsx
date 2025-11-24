import React, { useState } from 'react';
import { Code, Eye, Copy, Check, Download } from 'lucide-react';

interface CodePreviewProps {
  htmlCode: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ htmlCode }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recreated-website.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-900">
        <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
              activeTab === 'preview' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors ${
              activeTab === 'code' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
          >
            <Code size={16} />
            Code
          </button>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handleCopy}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Copy Code"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
          <button 
            onClick={handleDownload}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Download HTML"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-white">
        {activeTab === 'preview' ? (
          <iframe 
            srcDoc={htmlCode}
            title="Live Preview"
            className="w-full h-full border-0"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900 overflow-auto p-4">
            <pre className="text-xs sm:text-sm font-mono text-blue-300 whitespace-pre-wrap break-words">
              {htmlCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};