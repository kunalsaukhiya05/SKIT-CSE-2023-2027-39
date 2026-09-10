const axios = require("axios");

const SYSTEM_PROMPT = `You are GyaanSetu AI Assistant — an intelligent, friendly educational helper designed for rural college students in India.

Your primary role is to:
1. Help students understand academic concepts across subjects (Math, Science, Computer Science, English, History, etc.)
2. Explain topics in simple, clear language — assume the student may have limited prior exposure
3. Provide study tips, exam preparation strategies, and time management advice
4. Help with assignment questions by guiding students to the answer (not just giving answers)
5. Suggest learning resources and study methods
6. Answer questions about the GyaanSetu platform features
7. Support both English and Hindi (respond in whichever language the student uses)

Guidelines:
- Keep answers concise but thorough (2-4 paragraphs max unless detailed explanation needed)
- Use examples from everyday life that rural students can relate to
- Be encouraging and supportive
- If you don't know something, say so honestly
- Never generate harmful, inappropriate, or off-topic content
- If asked about something unrelated to education, politely redirect to educational topics

Platform info: GyaanSetu is a Remote Classroom platform for Rural Colleges built at SKIT Jaipur. It supports live video classes, assignments, resources, attendance tracking, and AI-powered study assistance.`;

// AI Chat endpoint
const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key, use fallback intelligent responses
    if (!apiKey) {
      const fallbackResponse = getFallbackResponse(message);
      return res.status(200).json({
        message: "AI response generated",
        reply: fallbackResponse,
        source: "fallback",
      });
    }

    // Build conversation for Gemini
    const contents = [];
    
    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-6)) { // Last 6 messages for context
        contents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.9,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.status(200).json({
        message: "AI response generated",
        reply: "I'm sorry, I couldn't generate a response. Please try rephrasing your question.",
        source: "gemini-empty",
      });
    }

    return res.status(200).json({
      message: "AI response generated",
      reply,
      source: "gemini",
    });
  } catch (err) {
    console.error("AI Chat Error:", err?.response?.data || err.message);

    // Fallback if API fails
    const fallbackResponse = getFallbackResponse(req.body.message);
    return res.status(200).json({
      message: "AI response generated (fallback)",
      reply: fallbackResponse,
      source: "fallback",
    });
  }
};

// Intelligent fallback responses when API key is unavailable
function getFallbackResponse(message) {
  const msg = message.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("namaste")) {
    return "Hello! 👋 I'm GyaanSetu AI Assistant. I can help you with your studies, explain concepts, and answer academic questions. What would you like to learn about today?";
  }

  if (msg.includes("assignment") || msg.includes("homework")) {
    return "📝 For assignments, I recommend:\n\n1. **Read the instructions carefully** — understand what's being asked\n2. **Break it into smaller tasks** — tackle one section at a time\n3. **Research first** — use your textbook and class notes\n4. **Start early** — don't wait until the deadline\n5. **Review before submitting** — check for errors\n\nYou can upload and manage assignments through the Assignments section in your dashboard. Need help with a specific topic?";
  }

  if (msg.includes("exam") || msg.includes("test") || msg.includes("preparation") || msg.includes("study")) {
    return "📚 Here are effective study tips:\n\n1. **Active Recall** — Test yourself instead of just re-reading\n2. **Spaced Repetition** — Review material at increasing intervals\n3. **Pomodoro Technique** — Study for 25 min, break for 5 min\n4. **Teach someone else** — Explaining helps you understand better\n5. **Past papers** — Practice with previous exam questions\n6. **Sleep well** — Good rest improves memory retention\n\nWhich subject would you like specific guidance for?";
  }

  if (msg.includes("math") || msg.includes("calculus") || msg.includes("algebra") || msg.includes("equation")) {
    return "🔢 Mathematics is all about practice! Here's how to improve:\n\n1. **Understand the concept first** — don't just memorize formulas\n2. **Practice daily** — solve at least 5-10 problems per topic\n3. **Start with basics** — make sure your foundation is strong\n4. **Use visual aids** — graphs and diagrams help understand concepts\n5. **Ask for help early** — don't let confusion build up\n\nWhat specific math topic are you working on? I can try to explain it!";
  }

  if (msg.includes("science") || msg.includes("physics") || msg.includes("chemistry") || msg.includes("biology")) {
    return "🔬 Science learning tips:\n\n1. **Understand 'why' not just 'what'** — focus on reasoning\n2. **Draw diagrams** — visual representation aids memory\n3. **Connect to real life** — relate concepts to everyday observations\n4. **Lab work** — hands-on experiments make concepts stick\n5. **Use mnemonics** — create memory tricks for complex information\n\nWhich specific topic in science do you need help with?";
  }

  if (msg.includes("programming") || msg.includes("code") || msg.includes("python") || msg.includes("java") || msg.includes("computer")) {
    return "💻 Programming tips:\n\n1. **Start small** — begin with simple programs\n2. **Practice regularly** — code every day, even 30 minutes helps\n3. **Debug carefully** — read error messages, they tell you what's wrong\n4. **Build projects** — apply what you learn to real problems\n5. **Use free platforms** — try GeeksforGeeks, HackerRank, or freeCodeCamp\n\nWhich programming language or concept are you studying?";
  }

  if (msg.includes("attendance") || msg.includes("class")) {
    return "📋 Your attendance is tracked automatically when you join live classes on GyaanSetu. You can view your attendance records and statistics in your dashboard. Regular attendance is important — most colleges require 75% minimum attendance!";
  }

  if (msg.includes("gyaansetu") || msg.includes("platform") || msg.includes("help") || msg.includes("features")) {
    return "🎓 **GyaanSetu Features:**\n\n• **Live Classes** — Join video classes with your teachers\n• **Assignments** — View, submit, and track your assignments\n• **Resources** — Access study materials uploaded by teachers\n• **Attendance** — Track your attendance automatically\n• **AI Assistant** — That's me! Ask me any academic question\n• **Profile** — Manage your account settings\n\nHow can I help you today?";
  }

  // Default educational response
  return "I'm GyaanSetu AI Assistant! 🎓 I'm here to help you with:\n\n• **Academic subjects** — Math, Science, Computer Science, etc.\n• **Study tips** — Exam preparation, time management\n• **Assignment help** — Understanding questions and concepts\n• **Platform guidance** — How to use GyaanSetu features\n\nPlease ask me a specific question and I'll do my best to help! For example, try asking about a topic you're studying or need clarification on.";
}

module.exports = { aiChat };
