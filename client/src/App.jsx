import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateGoal from "./pages/CreateGoal";
import GoalList from "./pages/GoalList";
import GoalDetails from "./pages/GoalDetails";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <GoalList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals/create"
        element={
          <ProtectedRoute>
            <CreateGoal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals/:id"
        element={
          <ProtectedRoute>
            <GoalDetails />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
