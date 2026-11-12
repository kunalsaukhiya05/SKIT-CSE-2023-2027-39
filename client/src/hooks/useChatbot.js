import { useState, useCallback, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000/";

/**
 * Custom hook for GyaanSetu AI Academic Chatbot [Manish Regar]
 * Includes offline caching, session persistence, and bilingual language support.
 */
export const useChatbot = (defaultSubject = "General") => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const [curriculumSubjects, setCurriculumSubjects] = useState([]);
  const [language, setLanguage] = useState("en");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [lastComplexity, setLastComplexity] = useState("intermediate");

  // Load cached offline session on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem("gyaansetu_chat_cache");
      if (cached) {
        setMessages(JSON.parse(cached));
      }
    } catch (e) {
      console.warn("Failed to parse cached chat messages:", e);
    }
  }, []);

  // Fetch curriculum subjects and syllabus topic metadata [Manish Regar]
  const fetchCurriculum = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/chatbot/curriculum-subjects`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCurriculumSubjects(response.data.subjects || []);
      }
    } catch (err) {
      console.warn("Curriculum subjects fallback active:", err.message);
    }
  }, []);

  // Fetch curriculum suggested prompts
  const fetchPrompts = useCallback(async (subject) => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/chatbot/suggested-prompts?subject=${encodeURIComponent(subject || defaultSubject)}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setSuggestedPrompts(response.data.prompts);
      }
    } catch (err) {
      console.warn("Suggested prompts fallback active:", err.message);
    }
  }, [defaultSubject]);

  // Ask question to Google Gemini 1.5 Flash backend [Manish Regar]
  const ask = useCallback(async (query, subject = defaultSubject, lang = language, topic = selectedTopic) => {
    if (!query || !query.trim()) return;

    setLoading(true);
    setError(null);

    const userMessage = {
      role: "user",
      text: query.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => {
      const updated = [...prev, userMessage];
      try {
        localStorage.setItem("gyaansetu_chat_cache", JSON.stringify(updated.slice(-20)));
      } catch (e) {}
      return updated;
    });

    try {
      const response = await axios.post(
        `${BASE_URL}api/chatbot/ask`,
        {
          query: query.trim(),
          subject,
          topic,
          language: lang,
        },
        { withCredentials: true }
      );

      if (response.data.complexityLevel) {
        setLastComplexity(response.data.complexityLevel);
      }

      const aiMessage = {
        role: "assistant",
        text: response.data.reply,
        chatId: response.data.chatId,
        source: response.data.source,
        model: response.data.model,
        language: response.data.language,
        complexityLevel: response.data.complexityLevel,
        timestamp: response.data.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        try {
          localStorage.setItem("gyaansetu_chat_cache", JSON.stringify(updated.slice(-20)));
        } catch (e) {}
        return updated;
      });

      return response.data;
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to reach AI tutor";
      setError(msg);

      const fallbackMsg = {
        role: "assistant",
        text: "I am having difficulty connecting to the server. Please check your network connection and try again.",
        source: "offline_fallback",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [defaultSubject, language]);

  // Submit feedback on answer quality
  const submitFeedback = useCallback(async (chatId, feedback, comment = "") => {
    if (!chatId) return;
    try {
      await axios.post(
        `${BASE_URL}api/chatbot/feedback/${chatId}`,
        { feedback, comment },
        { withCredentials: true }
      );
    } catch (err) {
      console.warn("Feedback submission error:", err.message);
    }
  }, []);

  // Clear chat conversation
  const clearHistory = useCallback(async () => {
    setMessages([]);
    localStorage.removeItem("gyaansetu_chat_cache");
    try {
      await axios.delete(`${BASE_URL}api/chatbot/history`, { withCredentials: true });
    } catch (err) {
      console.warn("Server history clear error:", err.message);
    }
  }, []);

  return {
    messages,
    loading,
    error,
    language,
    setLanguage,
    selectedTopic,
    setSelectedTopic,
    lastComplexity,
    suggestedPrompts,
    curriculumSubjects,
    ask,
    fetchPrompts,
    fetchCurriculum,
    clearHistory,
    submitFeedback,
  };
};

export default useChatbot;
