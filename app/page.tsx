'use client';

import { useState } from 'react';
import { Upload, Settings, MessageSquare } from 'lucide-react';
import DocumentUploader from './components/DocumentUploader';
import LLMConfiguration from './components/LLMConfiguration';
import ChatInterface from './components/ChatInterface';

type Tab = 'upload' | 'config' | 'prototype';

interface UploadedDoc {
  id: string;
  name: string;
  type: 'agent-prompt' | 'behavioral-contract' | 'state-machine' | 'other';
  content: string;
}

interface LLMConfig {
  provider: 'claude' | 'openai' | 'gemini' | 'llama';
  apiKey: string;
  model: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);
  const [llmConfig, setLLMConfig] = useState<LLMConfig | null>(null);

  const canPrototype = documents.length > 0 && llmConfig !== null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Interaction Layer Studio
            </h1>
            <p className="text-lg text-slate-600 mb-1">
              Prototype the architecture between LLMs and products
            </p>
            <p className="text-sm text-slate-500">
              Designed by Alana Cortes
            </p>
          </div>

          {/* Tabs */}
          <nav className="flex gap-1">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'upload'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload Design
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'config'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              Configure LLM
            </button>
            <button
              onClick={() => setActiveTab('prototype')}
              disabled={!canPrototype}
              className={`px-6 py-3 rounded-t-lg font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'prototype' && canPrototype
                  ? 'bg-slate-900 text-white'
                  : canPrototype
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Prototype
              {!canPrototype && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                  Complete steps 1 & 2
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'upload' && (
          <DocumentUploader documents={documents} setDocuments={setDocuments} />
        )}

        {activeTab === 'config' && (
          <LLMConfiguration config={llmConfig} setConfig={setLLMConfig} />
        )}

        {activeTab === 'prototype' && canPrototype && (
          <ChatInterface documents={documents} llmConfig={llmConfig!} />
        )}
      </main>
    </div>
  );
}
