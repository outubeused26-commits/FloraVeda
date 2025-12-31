import React, { useState, useRef, useEffect } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import { SendIcon, RefreshIcon, StethoscopeIcon } from './Icons';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  chatSession: Chat | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ chatSession }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: "Hello! I am Dr. Green. I've analyzed your plant's condition. How can I assist you with its health and care today? 🩺🌿" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (text: string, responseId: string) => {
    if (!chatSession) return;
    
    setIsTyping(true);
    
    // Set message to loading state
    setMessages(prev => prev.map(msg => 
        msg.id === responseId 
        ? { ...msg, text: '', isLoading: true, isError: false } 
        : msg
    ));

    try {
      const result = await chatSession.sendMessageStream({ message: text });
      
      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === responseId 
            ? { ...msg, text: fullText, isLoading: false }
            : msg
        ));
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      
      let errorText = "I encountered a connection error. Please try again.";
      if (error.message) {
        if (error.message.includes("429")) {
          errorText = "I'm receiving too many requests right now. Please try again in a moment.";
        } else if (error.message.includes("503")) {
          errorText = "The service is temporarily unavailable.";
        } else if (error.message.includes("safety")) {
          errorText = "I cannot provide an answer to that request due to safety guidelines.";
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === responseId 
          ? { ...msg, text: errorText, isLoading: false, isError: true } 
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Create placeholder for model response
    const responseId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: responseId, role: 'model', text: '', isLoading: true }]);

    await generateResponse(userMsg.text, responseId);
  };

  const handleRetry = async (msgId: string) => {
    // Find the user message preceding this model message
    const msgIndex = messages.findIndex(m => m.id === msgId);
    if (msgIndex > 0) {
        const userMsg = messages[msgIndex - 1];
        if (userMsg.role === 'user') {
            await generateResponse(userMsg.text, msgId);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/20 h-[600px] flex flex-col shadow-2xl">
      <div className="bg-white/10 backdrop-blur-xl p-4 border-b border-white/10 flex items-center space-x-3">
        <div className="bg-jungle-500 p-2 rounded-lg shadow-lg">
          <StethoscopeIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white font-display">Plant Doctor</h3>
          <p className="text-xs text-jungle-300 flex items-center">
            <span className="w-2 h-2 bg-jungle-400 rounded-full mr-2 animate-pulse"></span>
            Diagnosis & Care Specialist
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-lg backdrop-blur-sm
                ${msg.role === 'user' 
                  ? 'bg-jungle-600/90 text-white rounded-tr-sm border border-jungle-500/50' 
                  : msg.isError
                    ? 'bg-red-900/40 text-red-100 rounded-tl-sm border border-red-500/30'
                    : 'bg-white/10 text-gray-100 rounded-tl-sm border border-white/10'
                }
              `}
            >
              <div className="flex items-center space-x-2">
                 <span>{msg.text}</span>
                 {msg.isError && (
                    <button 
                      onClick={() => handleRetry(msg.id)}
                      className="flex-shrink-0 ml-2 p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-full transition-colors text-white"
                      title="Retry"
                    >
                      <RefreshIcon className="w-4 h-4" />
                    </button>
                 )}
              </div>

              {msg.isLoading && msg.text === '' && (
                 <div className="flex space-x-1 items-center h-5">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-0"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce delay-200"></div>
                 </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-black/20 border-t border-white/5 backdrop-blur-xl">
        <div className="flex items-center space-x-2 bg-white/10 rounded-full px-2 py-2 border border-white/10 focus-within:ring-1 focus-within:ring-jungle-400 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dr. Green about your plant..."
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/30 px-4"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-3 bg-jungle-500 text-white rounded-full hover:bg-jungle-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;