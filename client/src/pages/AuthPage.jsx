import React from 'react';
import SignUpForm from '../components/SignUpForm';
import LoginForm from '../components/LoginForm';

export const AuthPage = () => {
  const [isLogin, setIsLogin] = React.useState(true);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-500 p4">
      <div className="w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white mb-8">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        <div className="bg-white shadow-xl rounded-lg p-8">
          {isLogin ? <LoginForm /> : <SignUpForm />}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </p>

            <button
              className="mt-2 text-red-600 hover:text-red-800 font-medium transition-colors duration-300"
              onClick={() => setIsLogin(!isLogin)}>
              {' '}
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
