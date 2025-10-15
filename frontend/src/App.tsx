import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import WorkoutPlansPage from './pages/WorkoutPlansPage';
import WorkoutPlanDetailsPage from './pages/WorkoutPlanDetailsPage';
import ActiveWorkoutPage from './pages/ActiveWorkoutPage';
import StatsPage from './pages/StatsPage';
import ExercisesPage from './pages/ExercisesPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <DashboardPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workouts"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <WorkoutsPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workout-plans"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <WorkoutPlansPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workout-plans/:id"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <WorkoutPlanDetailsPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/workouts/active/:planId"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ActiveWorkoutPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/stats"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <StatsPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/exercises"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ExercisesPage />
                            </Layout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;