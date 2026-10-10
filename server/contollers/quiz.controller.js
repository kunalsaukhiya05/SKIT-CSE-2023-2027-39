const quizModel = require("../models/quiz.model");
const quizAttemptModel = require("../models/quizAttempt.model");
const notificationModel = require("../models/notification.model");

// Create Quiz [Rishabh Jain]
const createQuiz = async (req, res) => {
  try {
    const teacherId = req.teacherId;
    const { title, subject, classId, teacherName, questions, durationMinutes, scheduledAt } = req.body;

    if (!title || !subject || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Title, subject, and at least one question are required" });
    }

    // Validate each question has options and a correct answer
    for (const q of questions) {
      if (!q.question || !q.options || q.options.length < 2 || q.correctOption === undefined) {
        return res.status(400).json({ message: "Each question must have text, at least 2 options, and a correct option index" });
      }
    }

    const newQuiz = await quizModel.create({
      title,
      subject,
      classId: classId || null,
      teacherId,
      teacherName: teacherName || "Teacher",
      questions,
      durationMinutes: durationMinutes || 30,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(),
      totalMarks: questions.length,
    });

    // Notify students about new quiz [Rishabh Jain]
    await notificationModel.create({
      title: "New Quiz Available",
      message: `A new quiz "${title}" for ${subject} has been scheduled. Duration: ${durationMinutes || 30} minutes.`,
      type: "quiz",
      recipientType: "student",
      senderId: teacherId,
      senderName: teacherName || "Teacher",
      classId: classId || null,
    });

    return res.status(201).json({
      message: "Quiz created successfully",
      quiz: newQuiz,
    });
  } catch (err) {
    console.error("Error creating quiz:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get all quizzes for a class or teacher [Rishabh Jain]
const getQuizzes = async (req, res) => {
  try {
    const { classId, teacherId } = req.query;
    let query = {};
    if (classId) query.classId = classId;
    if (teacherId) query.teacherId = teacherId;

    const quizzes = await quizModel
      .find(query)
      .select("-questions.correctOption") // Hide answers from students
      .sort({ scheduledAt: -1 });

    return res.status(200).json({
      message: "Quizzes fetched successfully",
      quizzes,
    });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get single quiz by ID [Rishabh Jain]
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await quizModel.findById(id).select("-questions.correctOption");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    return res.status(200).json({ message: "Quiz fetched successfully", quiz });
  } catch (err) {
    console.error("Error fetching quiz:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Submit and auto-grade quiz attempt [Rishabh Jain]
const submitQuizAttempt = async (req, res) => {
  try {
    const studentId = req.studentId;
    const { quizId, answers, studentName, timeTakenSeconds } = req.body;

    if (!quizId || !answers) {
      return res.status(400).json({ message: "Quiz ID and answers are required" });
    }

    // Check for duplicate attempt
    const existing = await quizAttemptModel.findOne({ quizId, studentId });
    if (existing) {
      return res.status(409).json({ message: "You have already attempted this quiz" });
    }

    const quiz = await quizModel.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Auto-grade: compare submitted answers with correct options [Rishabh Jain]
    let score = 0;
    const gradedAnswers = quiz.questions.map((q, idx) => {
      const submitted = answers[idx];
      const correct = q.correctOption;
      const isCorrect = submitted === correct;
      if (isCorrect) score++;
      return { questionIndex: idx, submitted, correct, isCorrect };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const attempt = await quizAttemptModel.create({
      quizId,
      studentId,
      studentName: studentName || "Student",
      answers,
      gradedAnswers,
      score,
      totalMarks: quiz.questions.length,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0,
      submittedAt: new Date(),
    });

    return res.status(201).json({
      message: "Quiz submitted and graded successfully",
      score,
      totalMarks: quiz.questions.length,
      percentage,
      gradedAnswers,
      attempt,
    });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get quiz attempts / leaderboard for a quiz (Teacher) [Rishabh Jain]
const getQuizAttempts = async (req, res) => {
  try {
    const { quizId } = req.params;

    const attempts = await quizAttemptModel
      .find({ quizId })
      .sort({ score: -1, timeTakenSeconds: 1 }); // Sort by score desc, time asc (leaderboard)

    return res.status(200).json({
      message: "Quiz attempts fetched successfully",
      attempts,
    });
  } catch (err) {
    console.error("Error fetching quiz attempts:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Get a student's own quiz attempts [Rishabh Jain]
const getStudentQuizAttempts = async (req, res) => {
  try {
    const studentId = req.studentId;

    const attempts = await quizAttemptModel
      .find({ studentId })
      .populate("quizId", "title subject totalMarks")
      .sort({ submittedAt: -1 });

    return res.status(200).json({
      message: "Student quiz attempts fetched successfully",
      attempts,
    });
  } catch (err) {
    console.error("Error fetching student quiz attempts:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Delete a quiz (Teacher only) [Rishabh Jain]
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.teacherId;

    const quiz = await quizModel.findOne({ _id: id, teacherId });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found or unauthorized" });
    }

    await quizModel.findByIdAndDelete(id);
    await quizAttemptModel.deleteMany({ quizId: id });

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (err) {
    console.error("Error deleting quiz:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  submitQuizAttempt,
  getQuizAttempts,
  getStudentQuizAttempts,
  deleteQuiz,
};
