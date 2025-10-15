import type { Exercise } from './exercise';
import type { IWorkoutPlan } from './workoutPlan';

interface PerformedSet {
    weight: number;
    reps: number;
    completed: boolean;
}

interface PerformedExercise {
    exercise: Exercise;
    sets: PerformedSet[];
}

export interface IWorkoutSession {
    _id: string;
    user: string;
    workoutPlan: IWorkoutPlan;
    performedExercises: PerformedExercise[];
    date: string;
    notes?: string;
}

export type WorkoutSessionInput = {
    workoutPlan: string;
    performedExercises: {
        exercise: string;
        sets: {
            weight: number;
            reps: number;
            completed: boolean;
        }[];
    }[];
    notes?: string;
};