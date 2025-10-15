import type { Exercise } from './exercise';

export interface IWorkoutPlanExercise {
    exercise: Exercise;
    sets: number;
    reps: string;
}

export interface IWorkoutPlan {
    _id: string;
    name: string;
    description?: string;
    user: string;
    exercises: IWorkoutPlanExercise[];
    createdAt: string;
}