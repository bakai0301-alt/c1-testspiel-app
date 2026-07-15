export type McqQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TextEvidenceQuestion = {
  statement: string;
  correctAnswer: "richtig" | "falsch" | "nicht_im_text";
  explanation: string;
};

export type VocabularyItem = {
  term: string;
  article: string;
  meaningEn: string;
  example: string;
};

export type VocabularyQuestion = {
  sentence: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type Exercise = {
  id: string;
  title: string;
  subtitle: string;
  topic: string;
  level: "C1";
  estimatedMinutes: number;
  paragraphs: string[];
  mcq: McqQuestion[];
  evidence: TextEvidenceQuestion[];
  vocabulary: VocabularyItem[];
  vocabularyQuiz: VocabularyQuestion[];
  createdAt: string;
};

export type AnswerValue = number | TextEvidenceQuestion["correctAnswer"];

export type QuizAnswer = {
  key: string;
  value: AnswerValue;
  correct: boolean;
  prompt: string;
  explanation: string;
};

export type AttemptRecord = {
  id: string;
  exerciseId: string;
  title: string;
  score: number;
  total: number;
  completedAt: string;
  answers: QuizAnswer[];
};
