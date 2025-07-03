import React, { useState } from 'react';
import { ArrowLeft, LogIn, User, Lock, Smartphone, Eye, EyeOff } from 'lucide-react';
import { Page, AuthUser } from '../types';
import { apiService } from '../services/api';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  onLogin: (user: AuthUser) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onShowToast, onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    twoFactorCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      onShowToast('error', 'Nom d\'utilisateur requis');
      return;
    }
    
    if (!formData.password.trim()) {
      onShowToast('error', 'Mot de passe requis');
      return;
    }
    
    if (!formData.twoFactorCode.trim()) {
      onShowToast('error', 'Code 2FA requis');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.authenticate(
        formData.username,
        formData.password,
        formData.twoFactorCode
      );

      if (response.status === 'success' && response.user) {
        const daysLeft = response.user.days_until_expiration;
        onShowToast('success', `Authentification réussie ! (${daysLeft} jours avant expiration)`);
        onLogin({
          username: response.user.username,
          days_until_expiration: response.user.days_until_expiration
        });
      } else if (response.status === 'expired') {
        onShowToast('warning', `${response.message} Redirection vers la régénération...`);
        setTimeout(() => onNavigate('renew-credentials'), 2000);
      } else {
        onShowToast('error', response.message || 'Échec de l\'authentification');
      }
    } catch (error) {
      onShowToast('error', error instanceof Error ? error.message : 'Erreur lors de l\'authentification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
          <h1 className="text-3xl font-bold text-white mb-8 flex items-center">
            <LogIn className="h-8 w-8 mr-3 text-green-400" />
            Authentification
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Saisissez votre nom d'utilisateur"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Saisissez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* 2FA Code */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code 2FA
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.twoFactorCode}
                  onChange={(e) => handleInputChange('twoFactorCode', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                  placeholder="Code à 6 chiffres"
                  maxLength={6}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Se connecter</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 text-sm">
              <strong>Info:</strong> Si vos identifiants sont expirés ({'>'} 6 mois), vous serez automatiquement redirigé vers la page de régénération.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;