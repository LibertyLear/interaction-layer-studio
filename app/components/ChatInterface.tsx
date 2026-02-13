'use client';

import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

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

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Props {
  documents: UploadedDoc[];
  llmConfig: LLMConfig;
}

export default function ChatInterface({ documents, llmConfig }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const buildSystemPrompt = () => {
    let prompt = 'You are simulating an agent system based on the following design specifications:\n\n';

    // Add each document to context
    documents.forEach(doc => {
      prompt += `\n=== ${doc.name} (${doc.type}) ===\n`;
      prompt += doc.content;
      prompt += '\n\n';
    });

    prompt += '\nRespond as this designed system would, following all specifications exactly. ';
    prompt += 'If the specifications define states, mention which state you\'re in. ';
    prompt += 'If they define error conditions, handle them as specified. ';
    prompt += 'Stay in character as the designed agent system.';

    return prompt;
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: buildSystemPrompt(),
          messages: [...messages, userMessage],
          config: llmConfig
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      alert('Error communicating with LLM. Check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Step 3: Prototype Your Design
        </h2>
        <p className="text-slate-600 mb-4">
          Interact with your designed agent system. The LLM will behave according to your uploaded specifications.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Using:</strong> {llmConfig.provider} / {llmConfig.model}
            <br />
            <strong>Documents loaded:</strong> {documents.length} files
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col" style={{ height: '600px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-slate-500 py-12">
              <Bot className="w-12 h-12 mx-auto mb-4 text-slate-400" />
              <p>Start a conversation to test your interaction layer design</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div
                className={`max-w-2xl rounded-lg px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div className="bg-slate-100 rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Type a message to test your agent..."
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
