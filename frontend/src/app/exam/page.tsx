'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

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

  const [questions, setQuestions] = useState<Question[]>([]); // State to store fetched questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Use index for array
  const [totalTimer, setTotalTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [loading, setLoading] = useState(true); // Loading state for questions
  const [error, setError] = useState<string | null>(null); // Error state

  const currentQuestion = questions[currentQuestionIndex]; // Get the current question object

  // --- Timers Logic ---
  useEffect(() => {
    // Total Timer
    const totalTimerInterval = setInterval(() => {
      setTotalTimer((prevTime) => prevTime + 1);
    }, 1000);

    // Per-Question Timer
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
        // THIS IS THE CORRECTED LINE WITH YOUR SPECIFIC CODESPACES BACKEND URL
        const backendBaseUrl = `https://studious-space-telegram-q9w9jxpqg96f45wr-5000.app.github.dev`;
        const backendUrl = `${backendBaseUrl}/api/questions`; // Appending the endpoint

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
  }, [numQuestionsFromUrl]); // Re-run if numQuestionsFromUrl changes

  // --- Navigation Logic ---
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setQuestionTimer(0); // Reset question timer for the next question
    } else {
      // This is the last question
      alert(`Exam Finished for ${userName}! You completed ${questions.length} questions.`);
      // Later: Navigate to results page: router.push('/results');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
        <p className="text-xl">Loading questions...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
        <p className="text-xl text-red-400">Error: {error}</p>
        <p className="text-md text-gray-400 mt-2">Please ensure your backend server is running on port 5000 and try refreshing the page.</p>
      </main>
    );
  }

  if (questions.length === 0) {
      return (
          <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
              <p className="text-xl">No questions available. Please go back and select a valid number of questions.</p>
          </main>
      );
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 bg-gray-900 text-white">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4 text-blue-400">Exam Session: {userName}</h1>

        {/* Top Bar: Timers & Progress */}
        <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
          <div className="flex flex-col items-start">
            <span>Total Time: <span className="font-semibold text-white">{formatTime(totalTimer)}</span></span>
            <span>Question Time: <span className="font-semibold text-white">{formatTime(questionTimer)}</span></span>
          </div>
          <div className="flex flex-col items-end">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span> {/* Corrected for 0-indexed array */}
            {/* Progress bar */}
            <div className="w-40 h-2 bg-gray-700 rounded-full mt-1">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="bg-gray-700 p-6 rounded-md mb-6">
          <p className="text-lg font-medium mb-4">
            **Question {currentQuestionIndex + 1}: {currentQuestion?.question}** {/* Use optional chaining */}
          </p>
          <div className="mt-4 space-y-3">
            {currentQuestion?.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`option-${currentQuestionIndex}-${index}`} // Unique ID for each option
                  name={`question-options-${currentQuestionIndex}`} // Unique name per question
                  className="form-radio h-4 w-4 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor={`option-${currentQuestionIndex}-${index}`} className="ml-2 text-gray-200 cursor-pointer">
                  {option}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Button */}
        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
          </button>
        </div>
      </div>
    </main>
  );
}