import React from 'react';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onDelete, onEdit }) => {
    return (
        <Box sx={{ mt: 3 }}>
            {workouts.length === 0 ? (
                <Typography variant="body1">No workouts found. Add your first workout!</Typography>
            ) : (
                <Grid container spacing={3}>
                    {workouts.map((workout) => (
                        <Grid item xs={12} sm={6} md={4} key={workout._id}>
                            <Card elevation={3}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {workout.exercise}
                                    </Typography>
                                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                        {new Date(workout.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2">
                                        Sets: {workout.sets} <br />
                                        Reps: {workout.reps} <br />
                                        Weight: {workout.weight} kg
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
            )}
        </Box>
    );
};

export default WorkoutList;