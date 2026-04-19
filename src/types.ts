export type Subject = {
  id: string;
  name: string;
  color: string;
  readiness: number; // 0-100
  topics: Topic[];
  examDate?: string;
};

export type Topic = {
  id: string;
  subjectId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'todo' | 'in-progress' | 'completed';
  lastReviewed?: string;
  nextReview?: string;
  spacedRepetitionLevel: number; // for SM-2 logic
};

export type Deadline = {
  id: string;
  title: string;
  date: string;
  type: 'exam' | 'assignment' | 'presentation';
  subjectId: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type ReviewItem = {
  id: string;
  topicId: string;
  subjectName: string;
  topicTitle: string;
  dueAt: string;
};
