const chatModel = require("../models/chat.model");
const { callGeminiFlash } = require("../utils/geminiClient");

// Ask Academic Doubt / Query Endpoint [Manish Regar]
const askQuestion = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { query, subject = "General", language = "en", classId } = req.body;

    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, message: "Query message is required" });
    }

    // Retrieve previous 6 interactions for multi-turn dialogue context
    const recentChats = await chatModel
      .find({ studentId })
      .sort({ createdAt: -1 })
      .limit(6);

    const history = recentChats.reverse().map((c) => ({
      role: "user",
      content: c.query,
    })).concat(
      recentChats.map((c) => ({
        role: "model",
        content: c.response,
      }))
    );

    const result = await callGeminiFlash({
      query: query.trim(),
      history,
      subject,
      language,
    });

    const studentName = req.studentName || req.user?.fullName || "Student";

    const chatRecord = await chatModel.create({
      studentId,
      studentName,
      subject,
      classId: classId || null,
      query: query.trim(),
      response: result.reply,
      language,
      model: result.model,
      source: result.source,
      tokensUsed: result.tokensUsed || 0,
      latencyMs: result.latencyMs || 0,
    });

    return res.status(200).json({
      success: true,
      message: "Academic response generated successfully",
      chatId: chatRecord._id,
      reply: result.reply,
      source: result.source,
      model: result.model,
      tokensUsed: result.tokensUsed,
      latencyMs: result.latencyMs,
      createdAt: chatRecord.createdAt,
    });
  } catch (err) {
    console.error("Error in askQuestion:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Retrieve Student Chat History [Manish Regar]
const getChatHistory = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { page = 1, limit = 20, subject } = req.query;

    const query = { studentId };
    if (subject && subject !== "All") {
      query.subject = new RegExp(`^${subject}$`, "i");
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [history, total] = await Promise.all([
      chatModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      chatModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      history,
    });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Clear Student Chat History [Manish Regar]
const clearChatHistory = async (req, res) => {
  try {
    const studentId = req.studentId;
    await chatModel.deleteMany({ studentId });

    return res.status(200).json({
      success: true,
      message: "Chat session history cleared successfully",
    });
  } catch (err) {
    console.error("Error clearing chat history:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


// Curriculum-Relevant Starter Prompts for Rural Students [Manish Regar]
const getSuggestedPrompts = async (req, res) => {
  try {
    const { subject } = req.query;

    const SUGGESTIONS = {
      "Computer Science": [
        "Explain QuickSort vs MergeSort with an easy analogy",
        "What are ACID properties in database transactions?",
        "Difference between process and thread in operating systems?",
        "How does binary search achieve O(log N) complexity?",
      ],
      "Mathematics": [
        "How to find eigenvalues and eigenvectors of a 2x2 matrix?",
        "What is the physical interpretation of double integration?",
        "Explain Taylor series expansion with a practical example",
        "Step-by-step method to solve first-order differential equations",
      ],
      "Physics": [
        "How does a PN junction diode work in forward bias?",
        "State and explain Gauss's law in electrostatics",
        "Difference between spontaneous and stimulated emission in lasers",
        "Explain the working principle of optical fiber communication",
      ],
      "General": [
        "How should I structure my revision 1 week before university exams?",
        "Explain the Pomodoro study technique for college students",
        "Tips to prepare laboratory viva and project defense presentations",
        "How to write a structured technical lab report?",
      ],
    };

    const prompts = (subject && SUGGESTIONS[subject])
      ? SUGGESTIONS[subject]
      : Object.values(SUGGESTIONS).flat().slice(0, 8);

    return res.status(200).json({
      success: true,
      subject: subject || "All",
      prompts,
    });
  } catch (err) {
    console.error("Error fetching suggested prompts:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

// Student Answer Quality Feedback [Manish Regar]
const submitFeedback = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { feedback, comment } = req.body;

    if (!["helpful", "unhelpful"].includes(feedback)) {
      return res.status(400).json({ success: false, message: "Feedback must be 'helpful' or 'unhelpful'" });
    }

    const chat = await chatModel.findByIdAndUpdate(
      chatId,
      {
        feedback,
        feedbackComment: comment || "",
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat interaction not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback: chat.feedback,
    });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  getSuggestedPrompts,
  submitFeedback,
  askQuestion,
  getChatHistory,
  clearChatHistory,
};
