import React from 'react';
import { LogOut, User } from 'lucide-react';
import { AuthUser } from '../types';

interface AuthNavBarProps {
  user: AuthUser;
  onLogout: () => void;
}

const AuthNavBar: React.FC<AuthNavBarProps> = ({ user, onLogout }) => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">COFRAP</span>
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="h-5 w-5 text-green-400" />
              <span className="text-sm">
                Connecté en tant que <span className="font-semibold text-white">{user.username}</span>
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthNavBar; 