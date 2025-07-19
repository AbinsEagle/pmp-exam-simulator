'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [userName, setUserName] = useState('');
  const [numQuestions, setNumQuestions] = useState(10); // Default to 10 questions
  const router = useRouter();

  // Simple estimation: 1.2 minutes per question
  const estimatedTimeMinutes = (numQuestions * 1.2).toFixed(1);

  const handleNumQuestionsChange = (e: ChangeEvent<HTMLInputElement>) => { // Corrected type
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 100) { // Limit to 1-100 questions
      setNumQuestions(value);
    } else if (e.target.value === '') {
      setNumQuestions(0); // Allow clearing input
    }
  };

  const handleStartExam = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/exam?questions=${numQuestions}&user=${encodeURIComponent(userName)}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white text-gray-900">
      <div className="bg-white p-8 rounded-xl shadow-2xl shadow-gray-300 border border-gray-200 w-full max-w-md">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-600 drop-shadow-md">
          PMP Exam Simulator
        </h1>

        <form onSubmit={handleStartExam} className="space-y-7">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name (Optional):
            </label>
            <input
              type="text"
              id="userName"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-500 transition-all duration-300 ease-in-out"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="e.g., Aisha"
            />
          </div>

          <div>
            <label htmlFor="numQuestions" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions:
            </label>
            <input
              type="number"
              id="numQuestions"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg placeholder-gray-500 transition-all duration-300 ease-in-out"
              value={numQuestions}
              onChange={handleNumQuestionsChange}
              min="1"
              max="100"
              required
            />
            <p className="mt-3 text-sm text-gray-600">
              You’ll finish in <span className="font-semibold text-blue-600">~{estimatedTimeMinutes} min</span>.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white text-xl shadow-lg hover:shadow-xl shadow-blue-500/30"
          >
            Start Exam
          </button>
        </form>
      </div>
    </main>
  );
}