import { Subject, Deadline, Topic } from "./types";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: "1",
    name: "Advanced Mathematics",
    color: "#3b82f6",
    readiness: 65,
    examDate: "2026-05-15",
    topics: [
      { id: "t1", subjectId: "1", title: "Complex Numbers", difficulty: "medium", status: "completed", spacedRepetitionLevel: 2 },
      { id: "t2", subjectId: "1", title: "Differential Equations", difficulty: "hard", status: "in-progress", spacedRepetitionLevel: 0 },
      { id: "t3", subjectId: "1", title: "Linear Algebra", difficulty: "medium", status: "todo", spacedRepetitionLevel: 0 },
    ]
  },
  {
    id: "2",
    name: "Molecular Biology",
    color: "#10b981",
    readiness: 42,
    examDate: "2026-05-20",
    topics: [
      { id: "t4", subjectId: "2", title: "DNA Replication", difficulty: "medium", status: "completed", spacedRepetitionLevel: 1 },
      { id: "t5", subjectId: "2", title: "Protein Synthesis", difficulty: "hard", status: "todo", spacedRepetitionLevel: 0 },
    ]
  },
  {
    id: "3",
    name: "Intro to Economics",
    color: "#f59e0b",
    readiness: 88,
    examDate: "2026-05-10",
    topics: [
      { id: "t6", subjectId: "3", title: "Supply and Demand", difficulty: "easy", status: "completed", spacedRepetitionLevel: 3 },
      { id: "t7", subjectId: "3", title: "Macroeconomics", difficulty: "medium", status: "completed", spacedRepetitionLevel: 2 },
    ]
  }
];

export const MOCK_DEADLINES: Deadline[] = [
  { id: "d1", title: "Math Assignment 4", date: "2026-04-22", type: "assignment", subjectId: "1" },
  { id: "d2", title: "Bio Lab Presentation", date: "2026-04-25", type: "presentation", subjectId: "2" },
  { id: "d3", title: "Econ Final Exam", date: "2026-05-10", type: "exam", subjectId: "3" },
];
