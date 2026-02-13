'use client';

import { useState } from 'react';
import { Key, Check } from 'lucide-react';

interface LLMConfig {
  provider: 'claude' | 'openai' | 'gemini' | 'llama';
  apiKey: string;
  model: string;
}

interface Props {
  config: LLMConfig | null;
  setConfig: (config: LLMConfig) => void;
}

export default function LLMConfiguration({ config, setConfig }: Props) {
  const [provider, setProvider] = useState<LLMConfig['provider']>(config?.provider || 'claude');
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [model, setModel] = useState(config?.model || '');

  // Load saved config from localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('llm-config');
      if (saved && !config) {
        try {
          const savedConfig = JSON.parse(saved);
          setProvider(savedConfig.provider);
          setApiKey(savedConfig.apiKey);
          setModel(savedConfig.model);
          setConfig(savedConfig);
        } catch (e) {
          console.error('Failed to load saved config');
        }
      }
    }
  });

  const modelOptions = {
    claude: [
      'claude-sonnet-4-20250514',
      'claude-opus-4-20250514',
      'claude-3-5-sonnet-20241022'
    ],
    openai: [
      'gpt-4-turbo-preview',
      'gpt-4',
      'gpt-3.5-turbo'
    ],
    gemini: [
      'gemini-1.5-pro',
      'gemini-1.5-flash'
    ],
    llama: [
      'meta-llama/Meta-Llama-3.3-70B-Instruct-Turbo',
      'meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo',
      'meta-llama/Llama-3.1-405B-Instruct-Turbo',
      'meta-llama/Llama-3.1-70B-Instruct-Turbo'
    ]
  };

  const handleSave = () => {
    if (!apiKey || !model) {
      alert('Please fill in all fields');
      return;
    }

    const newConfig = {
      provider,
      apiKey,
      model
    };

    setConfig(newConfig);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('llm-config', JSON.stringify(newConfig));
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Step 2: Configure LLM
        </h2>
        <p className="text-slate-600 mb-4">
          Choose which LLM to use for prototyping your interaction layer design.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-6">
        {/* Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            LLM Provider
          </label>
          <div className="grid grid-cols-4 gap-4">
            {(['claude', 'openai', 'gemini', 'llama'] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setProvider(p);
                  setModel(modelOptions[p][0]);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  provider === p
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <p className="font-medium capitalize">{p}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a model</option>
            {modelOptions[provider].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            API Key
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Your API key is stored locally and never sent to our servers.
            {provider === 'llama' && (
              <span className="block mt-1">
                For Llama models, use Together AI API key (api.together.xyz) or Groq API key (groq.com)
              </span>
            )}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Save Configuration
        </button>

        {/* Clear Saved Config */}
        {config && (
          <button
            onClick={() => {
              if (confirm('Clear saved API configuration?')) {
                localStorage.removeItem('llm-config');
                setProvider('claude');
                setApiKey('');
                setModel('');
                setConfig({ provider: 'claude', apiKey: '', model: '' });
              }
            }}
            className="w-full bg-slate-100 text-slate-700 py-2 rounded-lg text-sm hover:bg-slate-200 transition-colors"
          >
            Clear Saved Configuration
          </button>
        )}
      </div>

      {config && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            ✓ LLM configured successfully. Proceed to <strong>Prototype</strong> tab.
          </p>
        </div>
      )}
    </div>
  );
}
