import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';
import type { IWorkoutPlan } from '../types/workoutPlan';

interface WorkoutPlanListProps {
    workoutPlans: IWorkoutPlan[];
}

const WorkoutPlanList: React.FC<WorkoutPlanListProps> = ({ workoutPlans }) => {
    if (workoutPlans.length === 0) {
        return <Typography>No workout plans found.</Typography>;
    }

    return (
        <List>
            {workoutPlans.map((plan) => (
                <ListItem key={plan._id}>
                    <ListItemText primary={plan.name} secondary={plan.description} />
                </ListItem>
            ))}
        </List>
    );
};

export default WorkoutPlanList;