import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Globe,
  Zap,
} from 'lucide-react';
import { Language, UserProfile } from '../types/quiz';
import { getTranslation } from '../data/translations';
import { sounds } from '../utils/audio';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isError?: boolean;
}

interface ZaFootAIProps {
  language: Language;
  user: UserProfile;
  onBackToLobby: () => void;
}

const STARTER_PROMPTS_EN = [
  { icon: '🇲🇦', text: 'chkon howa a7san la3ib f tarikh dyal l-kora?' },
  { icon: '🏆', text: 'Who has won the most Champions League titles?' },
  { icon: '🇲🇦', text: 'شكون دّا كأس العالم 2022 وكيفاش كانت مسيرة المنتخب؟' },
  { icon: '🧠', text: 'Explain Pep Guardiola’s inverted fullbacks and false 9' },
  { icon: '🇫🇷', text: 'Qui a gagné le plus de Ballons d’Or dans l’histoire?' },
  { icon: '⭐', text: 'ch7al men ballon d’or 3nd Messi o Ronaldo?' },
];

const STARTER_PROMPTS_AR = [
  { icon: '🇲🇦', text: 'chkon howa a7san la3ib f tarikh dyal l-kora?' },
  { icon: '🇲🇦', text: 'شكون ربح كأس العالم 2022 وكيفاش كانت ملحمة المنتخب المغربي؟' },
  { icon: '🏆', text: 'من هو النادي الأكثر تتويجاً بدوري أبطال أوروبا؟' },
  { icon: '🧠', text: 'kidayr l-plan dial 4-3-3 o kifach kaykhdem l-false 9?' },
  { icon: '⭐', text: 'مقارنة تكتيكية وبطولات بين ميسي وكريستيانو رونالدو' },
  { icon: '🇲🇦', text: 'واش حكيمي كيتعتبر أحسن ظهير أيمن فالعالم دابا؟' },
];

export const ZaFootAI: React.FC<ZaFootAIProps> = ({ language, user, onBackToLobby }) => {
  const t = getTranslation(language);
  const starterPrompts = language === 'ar' ? STARTER_PROMPTS_AR : STARTER_PROMPTS_EN;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const welcomeText =
      language === 'ar'
        ? `مرحباً بك يا كابتن **${user.username}**! ⚽ أنا **زافوت AI**، مساعدك الكروي السريع المدعوم بـ **Google Gemini**.\n\nأفهم وأتحدث **الدارجة المغربية** (سواء بالحروف اللاتينية بالأرقام 7, 3, 9 أو بالحروف العربية)، إضافة إلى **العربية الفصحى**، **الفرنسية**، و**الإنجليزية**.\n\nاسألني في أي موضوع كروي: تكتيكات، أرقام قياسية، مسيرة النجوم، أو كواليس الميركاتو!`
        : `Welcome Manager **${user.username}**! ⚽ I am **ZaFoot AI**, your ultra-fast football assistant powered by **Google Gemini**.\n\nI understand and speak fluent **Moroccan Darija** (in Latin Arabizi & Arabic script), **Arabic**, **French**, and **English**.\n\nAsk me anything about football tactics, player records, world leagues, transfers, or rules!`;

    return [
      {
        id: 'msg_welcome',
        role: 'assistant',
        content: welcomeText,
        timestamp: Date.now(),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Clean up any ongoing fetch if unmounting
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (isLoading) {
      abortControllerRef.current?.abort();
      setIsLoading(false);
    }
    sounds.playClick();
    const resetWelcome =
      language === 'ar'
        ? `تم بدء محادثة جديدة! ⚽ اسألني بأي لغة تفضل: بالدارجة (Chkon / شكون)، بالعربية، الفرنسية، أو الإنجليزية.`
        : `New conversation started! ⚽ Ask in Moroccan Darija (Arabizi/Arabic), English, French, or Arabic.`;

    setMessages([
      {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        content: resetWelcome,
        timestamp: Date.now(),
      },
    ]);
    setApiKeyError(null);
  };

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    // Prevent duplicate sending while already generating
    if (!query || isLoading) return;

    sounds.playClick();
    setInput('');
    setApiKeyError(null);

    const userMessage: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const assistantPlaceholderId = 'bot_' + Date.now();
    const botPlaceholder: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '', // will be populated progressively via streaming
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages([...newMessages, botPlaceholder]);
    setIsLoading(true);

    // Keep history concise (last 6 messages max) for minimal token latency
    const historyPayload = newMessages
      .filter((m) => !m.isError && m.id !== 'msg_welcome')
      .slice(-6)
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream, application/json',
        },
        body: JSON.stringify({
          message: query,
          history: historyPayload.slice(0, -1),
          stream: true,
        }),
        signal: abortControllerRef.current.signal,
      });

      const contentType = res.headers.get('content-type') || '';

      // 1. Progressive Server-Sent Events (SSE) streaming
      if (res.ok && contentType.includes('text/event-stream') && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let streamError = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(':')) continue;

            if (trimmed.startsWith('data: ')) {
              const dataStr = trimmed.slice(6);
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantPlaceholderId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                } else if (parsed.error) {
                  streamError = parsed.error;
                }
              } catch {
                // If not JSON, ignore raw data
              }
            } else if (trimmed.startsWith('event: error')) {
              // error event from server
            }
          }
        }

        if (streamError) {
          throw new Error(streamError);
        }

        // If no text was received at all
        if (!accumulatedText.trim()) {
          throw new Error(
            language === 'ar'
              ? 'خوادم Google Gemini تشهد ضغطاً مؤقتاً. يرجى الضغط على زر إعادة المحاولة.'
              : 'Google Gemini servers are temporarily busy. Please tap Retry to resend.'
          );
        }
      } else {
        // 2. Unary JSON fallback
        const data = await res.json();
        if (!res.ok) {
          if (data.code === 'API_KEY_MISSING') {
            setApiKeyError(data.message || 'Gemini API key is missing.');
          }
          throw new Error(data.message || data.error || 'Server error');
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? { ...msg, content: data.reply }
              : msg
          )
        );
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User aborted, do nothing
        return;
      }
      console.error('ZaFoot AI chat error:', err);
      const serverMsg =
        err?.message && !err.message.includes('Server error')
          ? err.message
          : null;

      const errorMessageText =
        serverMsg ||
        apiKeyError ||
        (language === 'ar'
          ? 'عذراً، خوادم Google Gemini تشهد ضغطاً مؤقتاً. يرجى الضغط على زر إعادة المحاولة.'
          : 'Google Gemini is experiencing temporary high demand. Please tap Retry to resend.');

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? { ...msg, content: errorMessageText, isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  };

  const handleRetry = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      setMessages((prev) => prev.filter((m) => !m.isError));
      sendMessage(lastUserMessage.content);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Markdown renderer for structured football responses
  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }

          // Bullet point
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const textPart = trimmed.replace(/^(\*|-|•)\s+/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(textPart) }} />
              </div>
            );
          }

          // Numbered list
          const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numberMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-amber-400 font-bold tabular-nums shrink-0">
                  {numberMatch[1]}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numberMatch[2]) }} />
              </div>
            );
          }

          // Heading
          if (trimmed.startsWith('### ')) {
            return (
              <h4
                key={idx}
                className="font-black text-emerald-300 text-sm pt-1 uppercase tracking-wider"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.replace(/^###\s+/, '')) }}
              />
            );
          }
          if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            return (
              <h3
                key={idx}
                className="font-black text-white text-base pt-2 border-b border-slate-800 pb-1"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed.replace(/^#{1,2}\s+/, '')) }}
              />
            );
          }

          // Regular paragraph
          return (
            <p
              key={idx}
              className="text-slate-200"
              dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
            />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 text-xs font-mono">$1</code>');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col flex-1 h-[calc(100vh-80px)] min-h-[550px]">
      {/* Top Banner & Header */}
      <div className="bg-[#0b131e] border border-slate-800 rounded-2xl p-4 sm:p-5 mb-3 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToLobby}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            title={language === 'ar' ? 'العودة للرئيسية' : 'Back to Lobby'}
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>

          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 border border-emerald-400/40 shrink-0">
              <Bot className="w-6 h-6 text-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0b131e] animate-pulse" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                ZaFoot AI
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-400 fill-current" />
                <span>Fast Stream</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                🇲🇦 Darija (Latin & Arabic)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {language === 'ar'
                ? 'يفهم ويتحدث الدارجة المغربية (العربية ولاتينية بالأرقام)، الفصحى، الفرنسية والإنجليزية'
                : 'Fluent in Moroccan Darija (Latin & Arabic), Arabic, French & English'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
            title={language === 'ar' ? 'محادثة جديدة' : 'Clear Chat'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'محادثة جديدة' : 'Clear Chat'}</span>
          </button>
        </div>
      </div>

      {/* API Key Missing Notice (if applicable) */}
      {apiKeyError && (
        <div className="mb-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{language === 'ar' ? 'إعداد مفتاح Google Gemini:' : 'Google Gemini Configuration Notice:'}</p>
            <p className="text-amber-200/90 mt-0.5">
              {language === 'ar'
                ? 'يرجى التأكد من إضافة GEMINI_API_KEY في إعدادات مشروع Vercel (Settings > Environment Variables) أو في ملف .env محلياً.'
                : 'Make sure to add GEMINI_API_KEY in your Vercel Project Settings (Settings > Environment Variables) or in your local .env file.'}
            </p>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 bg-[#09111c] border border-slate-800/90 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner flex flex-col">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          // Hide empty assistant message while waiting for first chunk
          if (!isUser && !message.content && isLoading) {
            return null;
          }

          return (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 relative group shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-sm'
                    : message.isError
                    ? 'bg-rose-950/30 border border-rose-500/40 text-rose-200 rounded-tl-sm'
                    : 'bg-[#0e1724] border border-slate-800 text-slate-200 rounded-tl-sm'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 text-[11px] mb-1.5 opacity-70">
                  <span className="font-bold">
                    {isUser ? user.username : 'ZaFoot AI'}
                  </span>
                  <span className="tabular-nums">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Message Body */}
                {isUser ? (
                  <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed text-white">
                    {message.content}
                  </p>
                ) : (
                  <>
                    {renderFormattedContent(message.content)}
                    {message.isError && (
                      <div className="mt-3 pt-2.5 border-t border-rose-500/20 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-rose-300">
                          {language === 'ar' ? 'يمكنك إعادة إرسال السؤال مباشرة' : 'You can retry sending this question'}
                        </span>
                        <button
                          onClick={handleRetry}
                          disabled={isLoading}
                          className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                          <span>{language === 'ar' ? 'إعادة المحاولة' : 'Retry'}</span>
                        </button>
                      </div>
                    )}
                  </>
                )}

                {/* Assistant Copy action */}
                {!isUser && message.content && (
                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Copy response"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* User Avatar: Displays custom photo if uploaded, otherwise football icon */}
              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm overflow-hidden text-sm font-bold">
                  {user.customPhoto ? (
                    <img
                      src={user.customPhoto}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>⚽</span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Instant Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-[#0e1724] border border-slate-800 text-slate-200 rounded-2xl rounded-tl-sm p-3.5 shadow-md flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-75" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse delay-150" />
              </div>
              <span className="text-xs font-medium text-slate-400">
                {language === 'ar'
                  ? 'ZaFoot AI يحلل التكتيكات وسيبدأ بالرد فوراً...'
                  : 'ZaFoot AI is analyzing tactics & streaming response...'}
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Starter Chips */}
      {messages.length <= 2 && (
        <div className="py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{language === 'ar' ? 'مقترحات سريعة:' : 'Quick Prompts:'}</span>
          </span>
          {starterPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(item.text)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm hover:border-emerald-500/30 disabled:opacity-50"
            >
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="mt-2.5 bg-[#0b131e] border border-slate-800 focus-within:border-emerald-500/50 rounded-2xl p-2.5 shadow-xl transition-all">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === 'ar'
                ? 'اسأل بالدارجة (Chkon/شكون)، العربية، الفرنسية أو الإنجليزية...'
                : 'Ask in Moroccan Darija (Arabizi/Arabic), English, French, or Arabic...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none resize-none max-h-32 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md shadow-emerald-500/25 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
            }`}
            title={language === 'ar' ? 'إرسال' : 'Send'}
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>

        <div className="flex items-center justify-between px-3 pt-2 text-[11px] text-slate-500 border-t border-slate-800/60 mt-1">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>
              {language === 'ar'
                ? 'الدارجة المغربية (Latin & Arabic) · Français · English · العربية الفصحى'
                : 'Moroccan Darija (Latin & Arabic) · Français · English · Standard Arabic'}
            </span>
          </span>
          <span className="hidden sm:inline text-slate-500">
            {language === 'ar' ? 'اضغط Enter للإرسال' : 'Press Enter to send'}
          </span>
        </div>
      </div>
    </div>
  );
};
