import { useState, useEffect } from "react";
import questions from "../questions";

function Quiz() {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0); // Index of the current question
  const [showScore, setShowScore] = useState(false); // Flag to show the score section
  const [score, setScore] = useState(0); // User's score
  const [timeLeft, setTimeLeft] = useState(30); // Time left for the current question
  const [showOptions, setShowOptions] = useState(false); // Flag to show the answer options
  const [userAnswers, setUserAnswers] = useState([]); // Array to store user's answers
  const [testStarted, setTestStarted] = useState(false); // Flag to indicate if the test has started

  // Effect to handle the countdown timer
  useEffect(() => {
    if (!testStarted) return;

    if (timeLeft === 0) {
      handleUnansweredQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testStarted]);

  // Effect to show the answer options after 4 seconds
  useEffect(() => {
    if (!testStarted) return;

    const optionsTimer = setTimeout(() => {
      setShowOptions(true);
    }, 4000);

    return () => clearTimeout(optionsTimer);
  }, [currentQuestion, testStarted]);

  // Function to handle answer option click
  const handleAnswerOptionClick = (isCorrect, option) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: questions[currentQuestion].question, isCorrect, chosenAnswer: option, correctAnswer: questions[currentQuestion].answer, isBlank: false },
    ]);
    handleNextQuestion();
  };

  // Function to handle moving to the next question
  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(30);
      setShowOptions(false);
    } else {
      setShowScore(true);
    }
  };

  // Function to handle unanswered questions
  const handleUnansweredQuestion = () => {
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: questions[currentQuestion].question, isCorrect: false, chosenAnswer: "No answer", correctAnswer: questions[currentQuestion].answer, isBlank: true },
    ]);
    handleNextQuestion();
  };

  // Function to calculate the results
  const calculateResults = () => {
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const blankAnswers = userAnswers.filter((answer) => answer.isBlank).length;
    const incorrectAnswers = userAnswers.length - correctAnswers - blankAnswers;
    return { correctAnswers, incorrectAnswers, blankAnswers };
  };

  const results = calculateResults();

  return (
    <div className="quiz">
      {!testStarted ? (
        <div className="start-screen">
          <h1>Welcome to the Quiz App</h1>
          <p>This quiz consists of {questions.length} questions. Each question will be displayed for a maximum of 30 seconds. The answer options will be hidden for the first 4 seconds.</p>
          <button onClick={() => setTestStarted(true)}>Start Testing</button>
        </div>
      ) : showScore ? (
        <div className="score-section">
          <i className="fas fa-trophy" style={{ fontSize: '3em', color: '#ffd700' }}></i>
          <p>You scored {score} out of {questions.length}</p>
          <p><i className="fas fa-check-circle" style={{ color: 'green' }}></i> Correct answers: {results.correctAnswers}</p>
          <p><i className="fas fa-times-circle" style={{ color: 'red' }}></i> Incorrect answers: {results.incorrectAnswers}</p>
          <p><i className="fas fa-minus-circle" style={{ color: 'gray' }}></i> Blank answers: {results.blankAnswers}</p>
          <h2>Review Your Answers</h2>
          <ul>
            {userAnswers.map((answer, index) => (
              <li key={index}>
                <p><strong>Question:</strong> {answer.question}</p>
                <p><strong>Your Answer:</strong> {answer.chosenAnswer}</p>
                <p><strong>Correct Answer:</strong> {answer.correctAnswer}</p>
                <p>{answer.isCorrect ? <i className="fas fa-check-circle" style={{ color: 'green' }}></i> : answer.isBlank ? <i className="fas fa-minus-circle" style={{ color: 'gray' }}></i> : <i className="fas fa-times-circle" style={{ color: 'red' }}></i>}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="question-text">{questions[currentQuestion].question}</div>
            <img src={questions[currentQuestion].media} alt="question media" className="question-media" />
            <div className="timer">Time left: {timeLeft} seconds</div>
            <div className="circular-timer" key={currentQuestion}>
              <svg>
                <circle className="background-circle" cx="50" cy="50" r="45"></circle>
                <circle className="progress-circle" cx="50" cy="50" r="45" strokeDasharray="283" strokeDashoffset="0"></circle>
              </svg>
            </div>
          </div>
          <div className="answer-section">
            {showOptions ? (
              questions[currentQuestion].options.map((option, index) => (
                <button key={index} onClick={() => handleAnswerOptionClick(option === questions[currentQuestion].answer, option)}>
                  {option}
                </button>
              ))
            ) : (
              <div className="waiting">Please wait...</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;