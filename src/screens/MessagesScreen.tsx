import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';

export const MessagesScreen: React.FC = () => {
  const {
    conversations,
    messages,
    sendMessage,
    activeConversationId,
    setActiveConversationId,
    user,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string>(activeConversationId);

  const activeConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];
  const activeMessages = messages[selectedConvId] || [];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await sendMessage(selectedConvId, text);
  };

  const quickReplies = [
    'How is Milo doing? 🐕',
    'Thanks for the hydration update! 💧',
    'He has salmon treats in his pack 🐟',
    'Heading home now! 👋',
  ];

  return (
    <div className="flex flex-col w-full max-w-md mx-auto px-5 pb-28 pt-2 space-y-3">
      {/* Top Header */}
      <div>
        <h1 className="font-headline font-bold text-headline-lg text-primary tracking-tight">
          Caregiver Messages
        </h1>
        <p className="text-xs text-on-surface-variant">
          Direct communication with verified walkers and veterinary care teams
        </p>
      </div>

      {/* Conversation Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {conversations.map((c) => {
          const isSelected = c.id === selectedConvId;
          return (
            <button
              key={c.id}
              onClick={() => {
                setSelectedConvId(c.id);
                setActiveConversationId(c.id);
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl shrink-0 transition-all border ${
                isSelected
                  ? 'bg-surface-container-lowest border-primary shadow-xs ring-1 ring-primary/20'
                  : 'bg-surface-container-low border-surface-container-high hover:bg-surface-container'
              }`}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-surface-variant shrink-0">
                <img className="w-full h-full object-cover" src={c.providerAvatar} alt={c.providerName} />
                {c.unreadCount > 0 && !isSelected && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-headline text-xs font-bold text-on-surface leading-tight">
                  {c.providerName}
                </span>
                <span className="text-[10px] text-on-surface-variant truncate max-w-[120px]">
                  {c.lastMessageText}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Conversation Card */}
      <div className="bg-surface-container-lowest rounded-3xl p-4 shadow-[0_4px_20px_-2px_rgba(30,75,56,0.06)] border border-[#dde2f3]/40 flex flex-col h-[460px] overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-10 h-10 rounded-full object-cover shadow-xs"
                src={activeConv?.providerAvatar}
                alt={activeConv?.providerName}
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary ring-2 ring-surface"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-headline font-bold text-sm text-on-surface">
                  {activeConv?.providerName}
                </h3>
                <span className="material-symbols-outlined text-[14px] text-secondary material-symbols-fill">
                  verified
                </span>
              </div>
              <span className="text-[11px] text-secondary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                Active on walk session
              </span>
            </div>
          </div>
          <a
            href="tel:+15552348901"
            className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
          </a>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
          {activeMessages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isMe
                      ? 'bg-primary text-on-primary rounded-br-xs'
                      : 'bg-surface-container-low text-on-surface rounded-bl-xs border border-surface-container-high/60'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[9px] text-on-surface-variant mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1.5 no-scrollbar">
          {quickReplies.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(q);
              }}
              className="px-2.5 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-[10px] whitespace-nowrap font-medium shrink-0 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-surface-container-high/60">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to caregiver..."
            className="flex-1 h-10 px-3.5 rounded-full bg-surface-container-low text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-primary border border-transparent focus:border-primary"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs disabled:opacity-40 hover:opacity-95 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
