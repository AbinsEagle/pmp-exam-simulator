'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Modal from '@/components/Modal'; // Import the Modal component

// Define the type for a Question
interface Question {
  id: string;
  question: string;
  options: string[];
  correct: string;
  rationale: string;
}

export default function ExamPage() {
  const searchParams = useSearchParams();
  const numQuestionsFromUrl = parseInt(searchParams.get('questions') || '0', 10);
  const userName = searchParams.get('user') || 'Guest';

  const router = useRouter(); // Initialize useRouter hook

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // State variables for the Custom Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'info' as 'info' | 'success' | 'error' });

  const currentQuestion = questions[currentQuestionIndex];

  // --- Timers Logic ---
  useEffect(() => {
    const totalTimerInterval = setInterval(() => {
      setTotalTimer((prevTime) => prevTime + 1);
    }, 1000);

    const questionTimerInterval = setInterval(() => {
      setQuestionTimer((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(totalTimerInterval);
      clearInterval(questionTimerInterval);
    };
  }, []);

  // --- Fetch Questions Logic ---
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Your specific Codespaces backend URL (as per your current working code)
        const backendBaseUrl = `https://studious-space-telegram-q9w9jxpqg96f45wr-5000.app.github.dev`;
        const backendUrl = `${backendBaseUrl}/api/questions`;

        const response = await fetch(backendUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ numQuestions: numQuestionsFromUrl }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Question[] = await response.json();
        setQuestions(data);
      } catch (err: any) {
        console.error("Failed to fetch questions:", err);
        setError(`Failed to load questions: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (numQuestionsFromUrl > 0) {
      fetchQuestions();
    } else {
      setError("No number of questions specified or invalid.");
      setLoading(false);
    }
  }, [numQuestionsFromUrl]);

  // --- Navigation Logic ---
  const handleNextQuestion = () => {
    if (!selectedOption && !showFeedback) {
        setModalContent({
            title: "Please Select an Option",
            message: "You must choose an answer before submitting.",
            type: "info"
        });
        setIsModalOpen(true);
        return;
    }

    if (!showFeedback) {
      setShowFeedback(true);
    } else {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setQuestionTimer(0);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setModalContent({
          title: 'Exam Finished!',
          message: `Congratulations, ${userName}! You completed ${questions.length} questions.`,
          type: 'success',
        });
        setIsModalOpen(true);
      }
    }
  };

  // --- New: Navigation Functions for buttons ---
  const handleStartOver = () => {
    router.push('/'); // Navigate to the home/login page to start a new exam
  };

  const handleGoHome = () => {
    router.push('/'); // Navigate to the home/login page
  };

  const handleChangeOption = (option: string) => {
    if (!showFeedback) {
      setSelectedOption(option);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
        <p className="text-xl text-blue-600 animate-pulse">Loading questions...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
        <p className="text-xl text-red-600">Error: {error}</p>
        <p className="text-md text-gray-700 mt-2">Please ensure your backend server is running and accessible.</p>
      </main>
    );
  }

  if (questions.length === 0) {
      return (
          <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50 text-gray-900">
              <p className="text-xl text-yellow-600">No questions available. Please go back and select a valid number of questions.</p>
          </main>
      );
  }


  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-50 text-gray-900"> {/* Main content area background */}
        <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl shadow-gray-300 border border-gray-200"> {/* Inner container styling */}
          <h1 className="text-2xl font-extrabold mb-4 text-blue-600">Exam Session: {userName}</h1>

          {/* Navigation Buttons (Start Over / Home) */}
          <div className="flex justify-end space-x-4 mb-4">
            <button
              onClick={handleStartOver}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              Start Over
            </button>
            <button
              onClick={handleGoHome}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white"
            >
              Home
            </button>
          </div>

          {/* Top Bar: Timers & Progress */}
          <div className="flex justify-between items-center mb-6 text-sm text-gray-600 border-b border-gray-300 pb-4">
            <div className="flex flex-col items-start">
              <span className="text-lg">Total Time: <span className="font-bold text-blue-600">{formatTime(totalTimer)}</span></span>
              <span className="text-lg">Question Time: <span className="font-bold text-blue-600">{formatTime(questionTimer)}</span></span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg">Question {currentQuestionIndex + 1} of {questions.length}</span>
              <div className="w-48 h-2 bg-gray-300 rounded-full mt-2">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Question Area */}
          <div className="bg-gray-100 p-6 rounded-lg shadow-inner shadow-gray-200 border border-gray-300 mb-6">
            <p className="text-xl font-bold mb-4 text-gray-800">
              Question {currentQuestionIndex + 1}: {currentQuestion?.question}
            </p>
            <div className="mt-4 space-y-4">
              {currentQuestion?.options.map((option, index) => (
                <div key={index} className="flex items-center group">
                  <input
                    type="radio"
                    id={`option-${currentQuestionIndex}-${index}`}
                    name={`question-options-${currentQuestionIndex}`}
                    className="form-radio h-5 w-5 text-blue-600 focus:ring-blue-600 cursor-pointer bg-gray-200 border-gray-400"
                    value={option}
                    checked={selectedOption === option}
                    onChange={() => handleChangeOption(option)}
                    disabled={showFeedback}
                  />
                  <label
                    htmlFor={`option-${currentQuestionIndex}-${index}`}
                    className={`ml-3 cursor-pointer text-lg transition-all duration-200 ease-in-out
                      ${showFeedback && option === currentQuestion?.correct ? 'text-green-600 font-semibold' : 'text-gray-800 group-hover:text-blue-600'}
                      ${showFeedback && selectedOption === option && selectedOption !== currentQuestion?.correct ? 'text-red-600 line-through' : ''}
                      ${showFeedback && selectedOption !== option && option !== currentQuestion?.correct ? 'text-gray-500' : ''}
                    `}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Area */}
          {showFeedback && currentQuestion && (
            <div
              className={`mt-4 p-5 rounded-lg shadow-xl border
                ${selectedOption === currentQuestion.correct ? 'bg-green-100 border-green-400 shadow-green-200' : 'bg-red-100 border-red-400 shadow-red-200'}
              `}
            >
              <h3 className="font-extrabold text-xl mb-3 text-gray-900">
                {selectedOption === currentQuestion.correct ? 'Correct! ✅' : 'Incorrect ❌'}
              </h3>
              <p className="text-gray-800 leading-relaxed text-base">{currentQuestion.rationale}</p>
            </div>
          )}

          {/* Navigation Button (Submit Answer / Next / Finish) */}
          <div className="text-center mt-8">
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption && !showFeedback} // Disable if no option selected and not showing feedback
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-4 px-10 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-white text-xl shadow-lg hover:shadow-xl shadow-purple-500/30"
            >
              {showFeedback ? (currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam') : 'Submit Answer'}
            </button>
          </div>
        </div>
      </main>
      {/* Custom Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
      />
    </>
  );
}