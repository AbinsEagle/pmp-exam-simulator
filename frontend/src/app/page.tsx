'use client'; // This directive makes the component a Client Component

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [userName, setUserName] = useState('');
  const [numQuestions, setNumQuestions] = useState(10); // Default to 10 questions
  const router = useRouter();

  // Simple estimation: 1.2 minutes per question
  const estimatedTimeMinutes = (numQuestions * 1.2).toFixed(1);

  const handleNumQuestionsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 100) { // Limit to 1-100 questions
      setNumQuestions(value);
    } else if (e.target.value === '') {
      setNumQuestions(0); // Allow clearing input
    }
  };

  const handleStartExam = (e: FormEvent) => {
    e.preventDefault();
    // In MVP, we'll just navigate to a placeholder question page.
    // Later, we'll fetch questions from the backend here.
    alert(`Starting exam for ${userName || 'Guest'} with ${numQuestions} questions.`);
    router.push(`/exam?questions=${numQuestions}&user=${encodeURIComponent(userName)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">PMP Exam Simulator</h1>

        <form onSubmit={handleStartExam} className="space-y-6">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-1">
              Your Name (Optional):
            </label>
            <input
              type="text"
              id="userName"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g., Aisha"
            />
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-300 mb-1">
              Number of Questions:
            </label>
            <input
              type="number"
              id="numQuestions"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              min="1"
              max="100"
              required
            />
            <p className="mt-2 text-sm text-gray-400">
              You’ll finish in ~{estimatedTimeMinutes} min.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
          >
            Start Exam
          </button>
        </form>
      </div>
    </main>
  );
}