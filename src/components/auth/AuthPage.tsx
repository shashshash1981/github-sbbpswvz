import React, { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

export function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 
      dark:bg-dark-bg-primary">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md
        dark:bg-dark-bg-secondary">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-dark-text-primary">
            {isSignIn ? 'Sign in to your account' : 'Create your account'}
          </h2>
        </div>

        {isSignIn ? <SignInForm /> : <SignUpForm />}

        <div className="text-center">
          <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-blue-600 hover:text-blue-500 dark:text-dark-brand-blue"
          >
            {isSignIn ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}