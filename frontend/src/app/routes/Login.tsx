import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { LoginForm } from '../../features/auth/components/LoginForm';

export const Login: React.FC = () => {
  const token = useAuthStore((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  return (
    <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gradient-to-tr from-purple-900/10 via-pink-900/10 to-indigo-900/10 dark:from-purple-950/20 dark:via-black dark:to-indigo-950/20 transition-all duration-300">
      <LoginForm />
    </div>
  );
};

export default Login;
