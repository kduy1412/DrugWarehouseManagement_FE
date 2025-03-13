import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();

  const handleLogin = () => {
    login({ email: "user@example.com", password: "password123" });
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

export default LoginPage;
