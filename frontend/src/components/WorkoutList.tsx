import React from 'react';
import { Typography, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

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
}

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onDelete }) => {
    return (
        <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            {workouts.length === 0 ? (
                <Typography variant="body1">No workouts found. Add your first workout!</Typography>
            ) : (
                <List>
                    {workouts.map((workout) => (
                        <ListItem
                            key={workout._id}
                            divider
                            secondaryAction={
                                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(workout._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText
                                primary={workout.exercise}
                                secondary={`Sets: ${workout.sets}, Reps: ${workout.reps}, Weight: ${workout.weight} kg`}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default WorkoutList;