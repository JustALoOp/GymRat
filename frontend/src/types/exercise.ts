export interface Exercise {
    _id: string;
    name: string;
    description: string;
    muscleGroup: string;
    type: 'weight' | 'cardio';
}

export interface ExerciseInput {
    name: string;
    type: 'weight' | 'cardio';
}