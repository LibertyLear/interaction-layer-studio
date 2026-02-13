'use client';

import { useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface UploadedDoc {
  id: string;
  name: string;
  type: 'agent-prompt' | 'behavioral-contract' | 'state-machine' | 'other';
  content: string;
}

interface Props {
  documents: UploadedDoc[];
  setDocuments: (docs: UploadedDoc[]) => void;
}

export default function DocumentUploader({ documents, setDocuments }: Props) {
  // Helper function to categorize files based on filename
  const categorizeFile = (filename: string): UploadedDoc['type'] => {
    const lowerName = filename.toLowerCase();
    
    // Agent prompts
    if (lowerName.includes('prompt') || lowerName.includes('agent')) {
      return 'agent-prompt';
    }
    
    // Behavioral contracts (6 types + variations)
    if (
      lowerName.includes('contract') || 
      lowerName.includes('behavioral') || 
      lowerName.includes('assumption') ||
      lowerName.includes('input') ||
      lowerName.includes('output') ||
      lowerName.includes('learning') ||
      lowerName.includes('recourse') ||
      lowerName.includes('use_case') ||
      lowerName.includes('usecase') ||
      lowerName.includes('blueprint') ||
      lowerName.includes('plan')
    ) {
      return 'behavioral-contract';
    }
    
    // State machines
    if (lowerName.includes('state') || lowerName.includes('machine') || lowerName.includes('workflow')) {
      return 'state-machine';
    }
    
    return 'other';
  };

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newDocs: UploadedDoc[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = '';
      
      // Parse based on file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
        // For binary files, we'll send to API for parsing
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/parse-document', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            content = data.text;
          } else {
            alert(`Failed to parse ${file.name}. Please try exporting as .txt or .md`);
            continue;
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          alert(`Error parsing ${file.name}. Please try a different format.`);
          continue;
        }
      } else {
        // Text files can be read directly
        content = await file.text();
      }
      
      const type = categorizeFile(file.name);

      newDocs.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        content
      });
    }

    setDocuments([...documents, ...newDocs]);
  }, [documents, setDocuments]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const newDocs: UploadedDoc[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let content = '';
      
      // Parse based on file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension === 'pdf' || extension === 'docx' || extension === 'doc') {
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/parse-document', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            const data = await response.json();
            content = data.text;
          } else {
            alert(`Failed to parse ${file.name}`);
            continue;
          }
        } catch (error) {
          console.error('Error parsing file:', error);
          alert(`Error parsing ${file.name}`);
          continue;
        }
      } else {
        content = await file.text();
      }
      
      const type = categorizeFile(file.name);

      newDocs.push({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type,
        content
      });
    }

    setDocuments([...documents, ...newDocs]);
  }, [documents, setDocuments]);

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const typeColors = {
    'agent-prompt': 'bg-blue-100 text-blue-800 border-blue-300',
    'behavioral-contract': 'bg-purple-100 text-purple-800 border-purple-300',
    'state-machine': 'bg-green-100 text-green-800 border-green-300',
    'other': 'bg-slate-100 text-slate-800 border-slate-300'
  };

  const typeLabels = {
    'agent-prompt': 'Agent Prompt',
    'behavioral-contract': 'Behavioral Contract',
    'state-machine': 'State Machine',
    'other': 'Other'
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Step 1: Upload Design Artifacts
        </h2>
        <p className="text-slate-600 mb-4">
          Upload your interaction layer design documents: agent prompts, behavioral contracts, state machines, error taxonomies, etc.
        </p>
      </div>

      {/* Upload Area */}
      <div 
        className="bg-white rounded-lg shadow-sm border-2 border-dashed border-slate-300 p-12 text-center hover:border-slate-400 transition-colors mb-6"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".md,.txt,.json,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-slate-700 mb-2">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-slate-500">
            .md, .txt, .json, .pdf, .doc, .docx files
          </p>
          <p className="text-xs text-slate-400 mt-2">
            💡 Tip: Export Google Docs as .docx or .pdf before uploading
          </p>
        </label>
      </div>

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Uploaded Documents ({documents.length})
          </h3>
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="w-5 h-5 text-slate-400" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{doc.name}</p>
                    <p className="text-sm text-slate-500">
                      {doc.content.length} characters
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border ${typeColors[doc.type]}`}>
                    {typeLabels[doc.type]}
                  </span>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="ml-4 p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {documents.length > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✓ Documents uploaded successfully. Proceed to <strong>Configure LLM</strong> tab.
          </p>
        </div>
      )}
    </div>
  );
}
