import React from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import type { IWorkoutPlan } from '../types/workoutPlan';

interface WorkoutPlanListProps {
    workoutPlans: IWorkoutPlan[];
}

const WorkoutPlanList: React.FC<WorkoutPlanListProps> = ({ workoutPlans }) => {
    if (workoutPlans.length === 0) {
        return <Typography>No workout plans found.</Typography>;
    }

    return (
        <Grid container spacing={3}>
            {workoutPlans.map((plan) => (
                <Grid item xs={12} sm={6} md={4} key={plan._id}>
                    <Card sx={{ height: '100%' }}>
                        <CardActionArea component={Link} to={`/workout-plans/${plan._id}`} sx={{ height: '100%', color: 'inherit', textDecoration: 'none' }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {plan.name}
                                </Typography>
                                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                                    {plan.description || 'No description available.'}
                                </Typography>
                                <Typography sx={{ mt: 2 }} variant="body2">
                                    {plan.exercises.length} exercise(s)
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default WorkoutPlanList;