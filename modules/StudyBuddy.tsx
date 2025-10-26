import React, { useState, useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { getStudyBuddyResponse } from '../services/geminiService';
import { saveUnderstandingScore } from '../services/googleSheetService';
import { SendIcon } from '../components/icons/Icons';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isModel = message.role === 'model';
  return (
    <div className={`flex items-end gap-2 ${isModel ? 'justify-start' : 'justify-end'}`}>
      {isModel && <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">A</div>}
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl break-words ${
          isModel ? 'bg-slate-700 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'
        }`}
      >
        {message.parts[0].text}
      </div>
    </div>
  );
};

export default function StudyBuddy(): React.ReactElement {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [understanding, setUnderstanding] = useState(50);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const startNewConversation = async (prompt: string) => {
      setIsLoading(true);
      setMessages([]);
      const initialResponse = await getStudyBuddyResponse(prompt);
      setMessages([{ role: 'model', parts: [{ text: initialResponse }] }]);
      setIsLoading(false);
  }
  
  useEffect(() => {
    startNewConversation("Bắt đầu cuộc trò chuyện");
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await getStudyBuddyResponse(input);
    const modelMessage: ChatMessage = { role: 'model', parts: [{ text: response }] };

    setMessages((prev) => [...prev, modelMessage]);
    setIsLoading(false);
  };
  
  const handleEvaluationSubmit = async () => {
    await saveUnderstandingScore(understanding);
    setShowEvaluation(false);
    startNewConversation("Bắt đầu cuộc trò chuyện mới");
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">A</div>
            <div className="bg-slate-700 p-3 rounded-2xl rounded-bl-none ml-2">
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

       {showEvaluation && (
        <div className="p-4 bg-slate-700/50 rounded-t-xl">
            <label htmlFor="understanding" className="block text-sm font-medium text-slate-300 mb-2">Bạn hiểu bài đến đâu? ({understanding}%)</label>
            <input
                id="understanding"
                type="range"
                min="0"
                max="100"
                value={understanding}
                onChange={(e) => setUnderstanding(Number(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-end gap-2 mt-3">
                 <button onClick={() => setShowEvaluation(false)} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm">Hủy</button>
                 <button onClick={handleEvaluationSubmit} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">Gửi đánh giá</button>
            </div>
        </div>
      )}

      <div className="p-4 border-t border-slate-700 flex items-center gap-3">
        <button 
            onClick={() => setShowEvaluation(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold whitespace-nowrap"
            disabled={isLoading || messages.length <= 1}
        >
            Kết thúc
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hỏi AI Learning Mate..."
            className="w-full bg-slate-700 rounded-full py-2 pl-4 pr-12 text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-sky-500 text-white disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-sky-400 transition-colors"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
