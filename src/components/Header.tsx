import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export function Header() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-lg shadow-sm
      dark:bg-dark-bg-secondary">
      {user && (
        <div className="text-sm text-gray-600 dark:text-dark-text-secondary">
          Logged in as: <span className="font-medium">{user.email}</span>
        </div>
      )}
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded
            dark:text-dark-text-primary dark:hover:bg-dark-interactive-hover"
        >
          <LogOut size={16} />
          Logout
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}