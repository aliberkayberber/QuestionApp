import { useState, useEffect } from 'react';
import questions from '../questions';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showOptions, setShowOptions] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    if (!testStarted) return;

    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, testStarted]);

  useEffect(() => {
    if (!testStarted) return;

    const optionsTimer = setTimeout(() => {
      setShowOptions(true);
    }, 4000);

    return () => clearTimeout(optionsTimer);
  }, [currentQuestion, testStarted]);

  const handleAnswerOptionClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { question: questions[currentQuestion].question, isCorrect },
    ]);
    handleNextQuestion();
  };

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

  const calculateResults = () => {
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers = userAnswers.length - correctAnswers;
    const blankAnswers = questions.length - userAnswers.length;
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
                <button key={index} onClick={() => handleAnswerOptionClick(option === questions[currentQuestion].answer)}>
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