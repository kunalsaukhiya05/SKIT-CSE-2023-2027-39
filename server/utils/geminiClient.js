const axios = require("axios");

const GEMINI_SYSTEM_INSTRUCTION = `You are GyaanSetu Academic AI Assistant — an educational tutor optimized for rural college students in India.
Your mission:
1. Explain college-level academic concepts (Computer Science, Mathematics, Physics, Chemistry, Electrical, Civil) clearly and simply.
2. Adapt explanations to both English and Hindi based on the student's language preference.
3. Keep responses structured, concise (under 250 words unless detailed derivation requested), and bandwidth-friendly.
4. Provide practical, relatable analogies that rural students can visualize.
5. If the student asks for assignment solutions, guide them through problem-solving steps rather than providing direct copy-paste answers.
6. Always maintain an encouraging, respectful, and academically sound tone.`;

const SUBJECT_FALLBACK_KNOWLEDGE = {
  "computer science": [
    { keywords: ["dsa", "data structure", "algorithm", "complexity", "stack", "queue"], reply: "💡 **Data Structures & Algorithms Overview:**\n- **Arrays/Linked Lists:** Linear structures for contiguous or pointer-based sequence.\n- **Stacks/Queues:** LIFO (recursion, undo) and FIFO (task scheduling).\n- **Trees/Graphs:** Hierarchical non-linear models for searching and networks.\n- **Time Complexity:** O(1) constant, O(log N) divide-and-conquer, O(N) linear, O(N log N) sorting.\n\n*Study Tip: Practice drawing memory layouts on paper when tracing pointers.*" },
    { keywords: ["dbms", "sql", "database", "normalization", "acid"], reply: "📊 **DBMS Core Fundamentals:**\n- **ACID Properties:** Atomicity, Consistency, Isolation, Durability guarantee transaction integrity.\n- **Normalization:** 1NF (atomic values), 2NF (no partial dependency), 3NF (no transitive dependency) eliminates data redundancy.\n- **Indexing:** B-Trees provide O(log N) lookup speed on large datasets." },
    { keywords: ["os", "operating system", "process", "deadlock", "thread"], reply: "⚙️ **Operating Systems Essentials:**\n- **Process vs Thread:** Process has isolated address space; threads share heap/code segment.\n- **Deadlock Conditions (Coffman):** Mutual exclusion, hold & wait, no preemption, circular wait.\n- **Virtual Memory:** Paging maps virtual addresses to physical frames to prevent fragmentation." }
  ],
  "mathematics": [
    { keywords: ["calculus", "derivative", "integration", "limit", "differential"], reply: "📐 **Engineering Calculus Essentials:**\n- **Derivative d/dx:** Instantaneous rate of change / slope of tangent line.\n- **Definite Integral:** Net area under curve; accumulation function.\n- **Fundamental Theorem:** ∫[a,b] f(x)dx = F(b) - F(a) where F' = f." },
    { keywords: ["matrix", "eigen", "linear algebra", "vector"], reply: "🔢 **Linear Algebra & Matrices:**\n- **Determinant:** Geometric volume scaling factor; det(A) ≠ 0 means matrix is invertible.\n- **Eigenvalues (Av = λv):** Scalars λ where transformation only stretches vector v without rotating." }
  ],
  "physics": [
    { keywords: ["newton", "mechanics", "force", "velocity", "energy", "motion"], reply: "⚡ **Engineering Physics - Mechanics:**\n- **Newton's 2nd Law:** F = dp/dt = m*a (force equals rate of change of momentum).\n- **Conservation of Energy:** Mechanical energy remains constant in conservative force fields (KE + PE = Constant)." },
    { keywords: ["semiconductor", "diode", "pn junction", "transistor", "band"], reply: "🔌 **Solid State & Electronics:**\n- **Intrinsic vs Extrinsic:** Pure silicon doped with Group-V (N-type) or Group-III (P-type) impurities.\n- **PN Junction:** Forward bias narrows depletion barrier; reverse bias expands it." }
  ]
};

function getIntelligentFallback(query, subject = "") {
  const q = query.toLowerCase();
  const sub = subject.toLowerCase();

  // Search in matching subject category
  for (const [category, topics] of Object.entries(SUBJECT_FALLBACK_KNOWLEDGE)) {
    if (sub.includes(category) || category.includes(sub)) {
      for (const item of topics) {
        if (item.keywords.some((kw) => q.includes(kw))) {
          return item.reply;
        }
      }
    }
  }

  // Cross-category fallback search
  for (const topics of Object.values(SUBJECT_FALLBACK_KNOWLEDGE)) {
    for (const item of topics) {
      if (item.keywords.some((kw) => q.includes(kw))) {
        return item.reply;
      }
    }
  }

  // Default educational guidance
  return `🎓 **GyaanSetu AI Academic Guidance:**\n\nRegarding your question: "${query}"\n\n1. **Core Concept:** Break this problem down into fundamental definitions and governing formulas.\n2. **Academic Verification:** Review standard lecture notes or reference textbooks for ${subject || "this subject"}.\n3. **Problem-Solving Framework:** List all known parameters, identify the required target, and verify units.\n\n*(Low-bandwidth offline mode active. Connect to network for real-time Google Gemini 1.5 Flash generation.)*`;
}

async function callGeminiFlash({ query, history = [], subject = "", language = "en" }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: getIntelligentFallback(query, subject),
      source: "fallback",
      tokensUsed: 0,
      model: "offline-fallback",
      latencyMs: 15,
    };
  }

  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const item of history.slice(-6)) {
      contents.push({
        role: item.role === "assistant" || item.role === "model" ? "model" : "user",
        parts: [{ text: item.content || item.text || item.query || item.response || "" }],
      });
    }
  }

  const langPrompt = language === "hi"
    ? "कृपया उत्तर स्पष्ट और सरल हिंदी में दें।"
    : language === "bilingual"
    ? "Please explain in a bilingual Hindi + English conversational style suitable for college students."
    : "Please answer in clear English.";

  const subjectContext = subject ? `Subject Context: ${subject}. ` : "";
  contents.push({
    role: "user",
    parts: [{ text: `${subjectContext}${langPrompt}\n\nQuestion: ${query}` }],
  });

  const startTime = Date.now();
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        system_instruction: {
          parts: [{ text: GEMINI_SYSTEM_INSTRUCTION }],
        },
        contents,
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 800,
          topP: 0.85,
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const tokensUsed = response.data?.usageMetadata?.totalTokenCount || 0;
    const latencyMs = Date.now() - startTime;

    if (!reply) {
      return {
        reply: getIntelligentFallback(query, subject),
        source: "fallback",
        tokensUsed: 0,
        model: "gemini-1.5-flash",
        latencyMs,
      };
    }

    return {
      reply,
      source: "gemini",
      tokensUsed,
      model: "gemini-1.5-flash",
      latencyMs,
    };
  } catch (apiErr) {
    console.warn("Gemini 1.5 Flash API error, falling back to local engine:", apiErr.message);
    return {
      reply: getIntelligentFallback(query, subject),
      source: "fallback",
      tokensUsed: 0,
      model: "gemini-1.5-flash-fallback",
      latencyMs: Date.now() - startTime,
    };
  }
}

module.exports = {
  callGeminiFlash,
  getIntelligentFallback,
  GEMINI_SYSTEM_INSTRUCTION,
};
