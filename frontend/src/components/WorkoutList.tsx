import React from 'react';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Workout {
    _id: string;
    exercise: string;
    reps: number;
    sets: number;
    weight: number;
    createdAt: string;
}

interface WorkoutListProps {
    workouts: Workout[];
    onDelete: (id: string) => void;
    onEdit: (workout: Workout) => void;
}

const groupWorkoutsByDate = (workouts: Workout[]) => {
    return workouts.reduce((acc, workout) => {
        const date = new Date(workout.createdAt).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(workout);
        return acc;
    }, {} as Record<string, Workout[]>);
};

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onDelete, onEdit }) => {
    const groupedWorkouts = groupWorkoutsByDate(workouts);
    const sortedDates = Object.keys(groupedWorkouts).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return (
        <Box sx={{ mt: 3 }}>
            {workouts.length === 0 ? (
                <Typography variant="body1">No workouts found. Add your first workout!</Typography>
            ) : (
                sortedDates.map((date) => (
                    <Accordion key={date} sx={{ mb: 2 }} defaultExpanded={sortedDates.indexOf(date) === 0}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`panel-${date}-content`}
                            id={`panel-${date}-header`}
                        >
                            <Typography variant="h6">Workout Session - {date}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                {groupedWorkouts[date].map((workout) => (
                                    <Grid item xs={12} sm={6} md={4} key={workout._id}>
                                        <Card elevation={2}>
                                            <CardContent>
                                                <Typography variant="h5" component="div">
                                                    {workout.exercise}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Sets: {workout.sets} | Reps: {workout.reps} | Weight: {workout.weight} kg
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <IconButton aria-label="edit" onClick={() => onEdit(workout)}>
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton aria-label="delete" onClick={() => onDelete(workout._id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                ))
            )}
        </Box>
    );
};

export default WorkoutList;