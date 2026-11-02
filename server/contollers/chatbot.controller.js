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

module.exports = {
  askQuestion,
  getChatHistory,
  clearChatHistory,
};
