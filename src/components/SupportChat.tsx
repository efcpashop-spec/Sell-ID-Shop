import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, UserCheck } from 'lucide-react';
import { CHAT_BOT_ANSWERS } from '../data';

export default function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'สวัสดีครับ! ยินดีต้อนรับสู่ EFCPAShop แอดมิน AI ประเมินการกู้ผ่อนสิทธิ์ยินดียินดีให้บริการครับ สอบถามขั้นตอนการเริ่มผ่อน หรือเอกสารที่ต้องใช้พิมพ์ถามผมได้เลย!',
      time: 'เมื่อครู่'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: now }]);
    setInputText('');

    // Simulate Admin/Bot Response
    setTimeout(() => {
      let responseText = 'คุณสามารถสอบถามเรื่อง: วิธีการผ่อนชำระ, เอกสารที่ต้องใช้, เกณฑ์อายุขั้นต่ำ หรือสามารถแชทเข้าแอดมินเพจหลักโดยตรงเพื่อรับคำตอบด่วนพิเศษได้เลยครับ!';

      // Look up keywords inside answers
      const lowerText = userText.toLowerCase();
      const matchedAnswer = CHAT_BOT_ANSWERS.find((item) =>
        item.keywords.some((keyword) => lowerText.includes(keyword))
      );

      if (matchedAnswer) {
        responseText = matchedAnswer.answer;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      {/* Floating Messenger bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="open-chat-widget"
          className="flex items-center gap-2 bg-gradient-to-tr from-cyan-500 via-indigo-600 to-indigo-700 text-white p-3.5 px-5 rounded-full shadow-[0_5px_20px_rgba(6,182,212,0.45)] hover:shadow-[0_8px_25px_rgba(6,182,212,0.65)] hover:scale-103 active:scale-97 transition-all cursor-pointer font-bold border border-cyan-400/30"
        >
          <MessageSquare className="h-5.5 w-5.5 animate-pulse" />
          <span className="text-xs font-mono tracking-wide">สอบถามการผ่อน (แอดมิน AI)</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-ping" />
        </button>
      )}

      {/* Actual Chat Drawer */}
      {isOpen && (
        <div 
          id="support-chat-drawer"
          className="bg-[#0c0d13] border border-cyan-500/20 w-[330px] sm:w-[380px] h-[480px] rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col animate-scaleUp"
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                <Bot className="h-5 w-5 animate-bounce" />
              </div>
              <div className="text-left leading-none">
                <h4 className="text-white font-extrabold text-sm flex items-center gap-1">
                  <span>ผู้ช่วยสมัครผ่อนสิทธิ์</span>
                  <span className="text-[9px] bg-cyan-900 text-cyan-200 px-1 rounded">แท้</span>
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono mt-1 block">● ออนไลน์คิวตอบด่วน</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5.5 w-5.5" />
            </button>
          </div>

          {/* Messages list area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3.5 bg-[#050608]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                
                <div className="max-w-[80%] space-y-1">
                  <div
                    className={`p-3 rounded-2xl text-[12px] leading-relaxed text-left font-sans ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="block text-[9px] text-gray-600 text-left font-mono px-1">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guidance Labels */}
          <div className="p-2 border-t border-slate-900 bg-slate-950/60 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
            {['วิธีผ่อนไอดี', 'ต้องใช้บัตรอะไร', 'จำกัดอายุไหม', 'ปลอดภัยไหม'].map((chip) => (
              <button
                key={chip}
                onClick={() => setInputText(chip)}
                className="text-[11px] text-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/60 border border-cyan-500/20 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Message input form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-800/80 bg-slate-900/40 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              placeholder="ถามคำถามที่ต้องการ เช่น ต้องเตรียมอะไรบ้าง..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-[#050608] border border-slate-800 focus:border-cyan-500/50 p-2.5 rounded-xl text-white outline-none text-xs"
            />
            <button
              type="submit"
              className="p-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition-colors cursor-pointer flex-shrink-0"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
