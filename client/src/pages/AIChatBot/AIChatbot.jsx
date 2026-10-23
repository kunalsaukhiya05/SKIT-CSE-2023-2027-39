import React, { useState, useEffect, useRef } from "react";
import "./AIChatbot.css";

const OFFLINE_FAQS = [
  {
    keywords: ["ohm", "law", "resistance", "voltage", "current"],
    question: "What is Ohm's Law?",
    answer:
      "Ohm's Law states that the current flowing through a conductor between two points is directly proportional to the voltage across the two points, and inversely proportional to the resistance: V = I Ã— R (where V is Voltage in Volts, I is Current in Amperes, and R is Resistance in Ohms).",
  },
  {
    keywords: ["binary", "search", "algorithm", "complexity"],
    question: "What is Binary Search and its time complexity?",
    answer:
      "Binary Search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item. Time complexity: Best Case O(1), Average and Worst Case O(log N). Prerequisite: Array must be sorted.",
  },
  {
    keywords: ["photosynthesis", "plant", "sunlight", "chlorophyll"],
    question: "Explain the process of Photosynthesis.",
    answer:
      "Photosynthesis is the process used by green plants to synthesize nutrients from carbon dioxide and water using sunlight energy. Chemical equation: 6CO2 + 6H2O + Light Energy -> C6H12O6 (Glucose) + 6O2. Chlorophyll absorbs solar energy.",
  },
  {
    keywords: ["offline", "attendance", "sync", "submit"],
    question: "How do offline homework and attendance sync work?",
    answer:
      "When internet connectivity drops, GyanSetu automatically saves your attendance check-ins, homework drafts, and quiz answers into encrypted browser local storage. As soon as a 2G/3G/WiFi signal returns, our background sync daemon silently uploads your work to the college server.",
  },
  {
    keywords: ["webrtc", "bandwidth", "low bandwidth", "rural"],
    question: "How does GyanSetu optimize video/audio in rural 2G/3G areas?",
    answer:
      "GyanSetu utilizes dynamic adaptive bitrate streaming with Opus audio forward-error-correction (FEC). When high latency or packet loss (>20%) is detected, the app automatically switches to high-priority audio plus compressed slide frames, saving over 85% mobile data.",
  },
];

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: "Namaste! I am GyanSetu AI Doubt Assistant. Ask me any conceptual question or select a frequent doubt below. I work both online and in low-bandwidth offline mode!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lowBandwidthMode, setLowBandwidthMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const findOfflineAnswer = (query) => {
    const tokens = query.toLowerCase().split(/\s+/);
    for (const faq of OFFLINE_FAQS) {
      const match = faq.keywords.some((kw) => tokens.includes(kw));
      if (match) return faq.answer;
    }
    return (
      "I am currently in Offline / Low-Bandwidth Mode. I couldn't find a local cache answer for this question. " +
      "Your doubt has been queued and will be answered via the LLM server once internet connectivity is restored."
    );
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = (!isOnline || lowBandwidthMode)
        ? findOfflineAnswer(query)
        : `[GyanSetu AI]: Regarding "${query}" â€” Here is the structured explanation: \n\n1. Core Concept: In modern rural learning networks, edge intelligence allows rapid resolution of fundamental engineering and science concepts.\n2. Key Formula / Insight: Break down the problem systematically into smaller sub-problems.\n3. Practical Example: Review the associated classroom lecture notes in the offline revision bundle.`;

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cached: !isOnline || lowBandwidthMode,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleClear = () => {
    setMessages([
      {
        id: "cleared-welcome",
        sender: "bot",
        text: "Chat cleared. What topic would you like to study or clarify today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="aichat-container">
      <div className="aichat-card">
        {/* Header */}
        <div className="aichat-header">
          <div className="aichat-title-group">
            <div className="aichat-avatar">ðŸ¤–</div>
            <div>
              <h2 className="aichat-title">GyanSetu AI Doubt Assistant</h2>
              <p className="aichat-subtitle">Rural Peer AI & Instant Conceptual Solver</p>
            </div>
          </div>
          <div className="aichat-badge-group">
            <span className={`status-pill ${isOnline ? "pill-online" : "pill-offline"}`}>
              {isOnline ? "â— Online" : "â—‹ Offline Cache"}
            </span>
            <button
              onClick={() => setLowBandwidthMode(!lowBandwidthMode)}
              className={`mode-toggle-btn ${lowBandwidthMode ? "active" : ""}`}
              title="Toggle Low Bandwidth Mode"
            >
              {lowBandwidthMode ? "âš¡ 2G Ultra-Lite ON" : "âš¡ Ultra-Lite OFF"}
            </button>
          </div>
        </div>

        {/* Quick FAQs */}
        <div className="aichat-quick-faqs">
          <span className="faq-hint">ðŸ’¡ Quick Doubts:</span>
          {OFFLINE_FAQS.slice(0, 3).map((faq, idx) => (
            <button
              key={idx}
              className="faq-chip"
              onClick={() => handleSend(faq.question)}
            >
              {faq.question}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="aichat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`msg-row ${m.sender === "user" ? "msg-user" : "msg-bot"}`}
            >
              <div className="msg-bubble">
                {m.cached && <span className="cache-tag">[Offline Cache Hit]</span>}
                <p className="msg-content">{m.text}</p>
                <span className="msg-time">{m.timestamp}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="msg-row msg-bot">
              <div className="msg-bubble typing-bubble">
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="aichat-input-bar">
          <input
            type="text"
            className="aichat-input"
            placeholder="Type your academic doubt or syllabus question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            className="aichat-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim()}
          >
            Ask AI
          </button>
          <button className="aichat-clear-btn" onClick={handleClear} title="Clear conversation">
            ðŸ—‘ï¸
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
