import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  systemPrompt: string;
  messages: Message[];
  config: {
    provider: 'claude' | 'openai' | 'gemini' | 'llama';
    apiKey: string;
    model: string;
  };
}

async function callClaude(apiKey: string, model: string, systemPrompt: string, messages: Message[]) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Claude API error: ${error}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAI(apiKey: string, model: string, systemPrompt: string, messages: Message[]) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(apiKey: string, model: string, systemPrompt: string, messages: Message[]) {
  // Gemini uses a different format - system prompt goes in first user message
  const geminiMessages = [
    { role: 'user' as const, parts: [{ text: `${systemPrompt}\n\nUser: ${messages[0].content}` }] }
  ];

  // Add rest of conversation
  for (let i = 1; i < messages.length; i++) {
    const msg = messages[i];
    geminiMessages.push({
      role: (msg.role === 'assistant' ? 'model' : 'user') as any,
      parts: [{ text: msg.content }]
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: geminiMessages
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callLlama(apiKey: string, model: string, systemPrompt: string, messages: Message[]) {
  // Together AI API (OpenAI-compatible format for Llama)
  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ],
      max_tokens: 4096,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Llama API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { systemPrompt, messages, config } = body;

    let content: string;

    switch (config.provider) {
      case 'claude':
        content = await callClaude(config.apiKey, config.model, systemPrompt, messages);
        break;
      case 'openai':
        content = await callOpenAI(config.apiKey, config.model, systemPrompt, messages);
        break;
      case 'gemini':
        content = await callGemini(config.apiKey, config.model, systemPrompt, messages);
        break;
      case 'llama':
        content = await callLlama(config.apiKey, config.model, systemPrompt, messages);
        break;
      default:
        throw new Error('Invalid provider');
    }

    return NextResponse.json({ content });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
