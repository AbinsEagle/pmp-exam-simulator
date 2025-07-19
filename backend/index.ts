import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000; // Our backend will run on port 5000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing for request bodies

// Hardcoded sample questions for MVP
const sampleQuestions = [
  {
    id: 'q1',
    question: 'A project manager identifies a risk with a high probability and high impact. What should be the BEST response strategy?',
    options: [
      'A. Accept the risk.',
      'B. Mitigate the risk.',
      'C. Avoid the risk.',
      'D. Transfer the risk.'
    ],
    correct: 'C. Avoid the risk.',
    rationale: 'Avoiding the risk means eliminating the threat entirely, which is the best approach for high probability, high impact negative risks if feasible.'
  },
  {
    id: 'q2',
    question: 'During project execution, a team member reports that a newly implemented feature is causing unforeseen issues. What should the project manager do FIRST?',
    options: [
      'A. Immediately revert the feature.',
      'B. Document the issue and raise a change request.',
      'C. Update the risk register.',
      'D. Analyze the impact of the issue.'
    ],
    correct: 'D. Analyze the impact of the issue.',
    rationale: 'The project manager should always analyze the impact of any issue before taking action. This ensures a proper understanding of the problem and its consequences.'
  },
  {
    id: 'q3',
    question: 'The project sponsor requests a new feature that was not part of the original scope. What is the BEST course of action for the project manager?',
    options: [
      'A. Add the feature to the backlog immediately.',
      'B. Assess the impact on schedule and budget, then escalate to the change control board.',
      'C. Implement the feature if it seems small.',
      'D. Inform the sponsor that it is out of scope.'
    ],
    correct: 'B. Assess the impact on schedule and budget, then escalate to the change control board.',
    rationale: 'Any new request, especially from the sponsor, requires formal change control process. The PM should analyze its impact and then involve the change control board for approval.'
  },
  {
    id: 'q4',
    question: 'A project team is consistently missing deadlines due to miscommunication. What technique should the project manager utilize to improve team performance?',
    options: [
      'A. Implement stricter control measures.',
      'B. Conduct daily stand-up meetings to improve communication flow.',
      'C. Replace underperforming team members.',
      'D. Reassign tasks to more experienced individuals.'
    ],
    correct: 'B. Conduct daily stand-up meetings to improve communication flow.',
    rationale: 'Daily stand-up meetings (a key Agile practice) are designed to improve team communication, identify impediments, and foster collaboration, directly addressing miscommunication.'
  },
  {
    id: 'q5',
    question: 'The project is nearing completion, and some deliverables are pending final acceptance. What project management process is the project manager currently executing?',
    options: [
      'A. Manage Communications.',
      'B. Control Quality.',
      'C. Validate Scope.',
      'D. Close Project or Phase.'
    ],
    correct: 'C. Validate Scope.',
    rationale: 'Validate Scope is the process of formalizing acceptance of the completed project deliverables. This occurs before closing the project or phase.'
  },
];

// API Endpoint for questions
app.post('/api/questions', (req, res) => {
  const { numQuestions, topic } = req.body; // Topic not used in MVP but included for future
  const count = Math.min(numQuestions || sampleQuestions.length, sampleQuestions.length); // Get requested count, max out at available
  const shuffledQuestions = sampleQuestions.sort(() => 0.5 - Math.random()); // Simple shuffle
  const selectedQuestions = shuffledQuestions.slice(0, count);

  res.json(selectedQuestions);
});

// Basic welcome route to confirm backend is running
app.get('/', (req, res) => {
  res.send('PMP Exam Simulator Backend is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
  console.log('Use the PORTS tab to open in browser for Codespaces.');
});