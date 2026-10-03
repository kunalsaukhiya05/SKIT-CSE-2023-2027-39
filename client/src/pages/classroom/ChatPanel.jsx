import React, { useState, useRef, useEffect } from 'react';

const ChatPanel = ({ isOpen, onClose, currentUser, roomId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isEmojiOpen, setIsEmojiOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const quickEmojis = ['👍', '❤️', '😂', '🎉', '👏', '🤔', '✅', '📝'];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msg = {
            id: Date.now(),
            text: newMessage.trim(),
            sender: currentUser?.name || 'You',
            role: currentUser?.role || 'student',
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
            avatar: currentUser?.avatar || null
        };

        setMessages((prev) => [...prev, msg]);
        setNewMessage('');
        setIsEmojiOpen(false);
        inputRef.current?.focus();
    };

    const handleEmojiClick = (emoji) => {
        setNewMessage((prev) => prev + emoji);
        inputRef.current?.focus();
    };

    const formatTimestamp = (timestamp) => {
        return timestamp;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="px-4 py-3 bg-gray-800 text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h3 className="font-semibold text-sm">Class Chat</h3>
                        <p className="text-xs text-gray-400">{messages.length} messages</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-gray-700 rounded-lg transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="text-4xl mb-3">💬</div>
                        <p className="text-gray-400 text-sm font-medium">No messages yet</p>
                        <p className="text-gray-300 text-xs mt-1">Start a conversation with your class</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isOwn = msg.sender === (currentUser?.name || 'You');
                        return (
                            <div key={msg.id} className={lex  + String(isOwn ? 'justify-end' : 'justify-start')}>
                                <div className={max-w-[85%] rounded-2xl px-3.5 py-2  + String(isOwn ? 'bg-teal-600 text-white rounded-br-md' : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm')}>
                                    {!isOwn && (
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-xs font-semibold text-teal-600">{msg.sender}</span>
                                            {msg.role === 'teacher' && (
                                                <span className="px-1 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded">TEACHER</span>
                                            )}
                                        </div>
                                    )}
                                    <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                                    <p className={	ext-[10px] mt-1  + String(isOwn ? 'text-teal-200' : 'text-gray-400')}>{formatTimestamp(msg.timestamp)}</p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Emoji Bar */}
            {isEmojiOpen && (
                <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 flex-wrap">
                    {quickEmojis.map((emoji) => (
                        <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-xl hover:scale-125 transition-transform p-1">{emoji}</button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="px-3 py-3 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
                <button type="button" onClick={() => setIsEmojiOpen(!isEmojiOpen)} className={p-2 rounded-lg transition-colors  + String(isEmojiOpen ? 'bg-teal-100 text-teal-600' : 'hover:bg-gray-100 text-gray-500')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                    </svg>
                </button>
                <input ref={inputRef} type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                <button type="submit" disabled={!newMessage.trim()} className="p-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatPanel;
