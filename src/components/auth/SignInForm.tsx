import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Mail, Lock } from 'lucide-react';
import { validateEmail } from '../../utils/validation';
import toast from 'react-hot-toast';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
          Email
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 
              dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary"
            placeholder="you@example.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text-primary mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 w-full p-2 border rounded focus:ring-1 focus:ring-blue-500 
              dark:bg-dark-bg-tertiary dark:border-dark-border-default dark:text-dark-text-primary"
            placeholder="••••••"
            required
            minLength={6}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 
          transition-colors duration-200 dark:bg-dark-brand-blue dark:hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  );
}