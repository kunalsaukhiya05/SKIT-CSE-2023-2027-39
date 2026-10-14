import { useState, useEffect } from "react";
import axios from "axios";

/**
 * QuizPlayer — Student-facing component to attempt an MCQ quiz.
 * Features: timer countdown, option selection, submit, and auto-grade result display.
 * [Rishabh Jain] Week 10 Sprint
 */
const QuizPlayer = ({ quiz, studentId, studentName, onClose }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState((quiz?.durationMinutes || 30) * 60);
  const [startTime] = useState(Date.now());

  // Countdown timer [Rishabh Jain]
  useEffect(() => {
    if (submitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    const timeTakenSeconds = Math.floor((Date.now() - startTime) / 1000);
    const answersArray = quiz.questions.map((_, i) =>
      answers[i] !== undefined ? answers[i] : -1
    );

    try {
      const res = await axios.post(
        "/api/quiz/attempt/submit",
        { quizId: quiz._id, answers: answersArray, studentName, timeTakenSeconds },
        { withCredentials: true }
      );
      setResult(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit quiz");
      setSubmitted(false);
    }
  };

  if (result) {
    return (
      <div className="quiz-result-container">
        <h2>Quiz Completed!</h2>
        <div className="result-score">
          <span className="score-big">{result.percentage}%</span>
          <span className="score-detail">
            {result.score} / {result.totalMarks} correct
          </span>
        </div>
        <ul className="graded-answers">
          {result.gradedAnswers.map((ga, i) => (
            <li key={i} className={ga.isCorrect ? "correct" : "wrong"}>
              Q{i + 1}: Your answer — Option {ga.submitted + 1}{" "}
              {ga.isCorrect ? "✓" : `✗ (Correct: Option ${ga.correct + 1})`}
            </li>
          ))}
        </ul>
        <button className="btn-primary" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-player-container">
      <div className="quiz-header">
        <h2>{quiz?.title}</h2>
        <div className={`quiz-timer ${timeLeft < 60 ? "timer-urgent" : ""}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="quiz-questions">
        {quiz?.questions?.map((q, qIdx) => (
          <div key={qIdx} className="question-card">
            <p className="question-text">
              Q{qIdx + 1}. {q.question}
            </p>
            <div className="options-list">
              {q.options.map((opt, optIdx) => (
                <button
                  key={optIdx}
                  className={`option-btn ${
                    answers[qIdx] === optIdx ? "selected" : ""
                  }`}
                  onClick={() => handleSelect(qIdx, optIdx)}
                  disabled={submitted}
                >
                  {String.fromCharCode(65 + optIdx)}. {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="quiz-footer">
        <span className="answered-count">
          Answered: {Object.keys(answers).length} / {quiz?.questions?.length}
        </span>
        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={submitted}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizPlayer;
