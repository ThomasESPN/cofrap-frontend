import React from 'react';
import { Shield, Clock, User, Activity, Settings, FileText } from 'lucide-react';
import { AuthUser } from '../types';

interface DashboardPageProps {
  user: AuthUser;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user }) => {
  const getExpirationColor = (days: number) => {
    if (days <= 30) return 'text-red-400';
    if (days <= 60) return 'text-orange-400';
    return 'text-green-400';
  };

  const getExpirationBgColor = (days: number) => {
    if (days <= 30) return 'bg-red-900/30 border-red-700';
    if (days <= 60) return 'bg-orange-900/30 border-orange-700';
    return 'bg-green-900/30 border-green-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 pb-20 pt-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Shield className="h-8 w-8 text-green-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Tableau de Bord COFRAP</h1>
          </div>
          <p className="text-gray-400">
            Bienvenue dans votre espace sécurisé, {user.username}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Expiration Status */}
          <div className={`rounded-xl p-6 border ${getExpirationBgColor(user.days_until_expiration)}`}>
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-gray-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Statut d'Expiration</h3>
            </div>
            <div className="text-2xl font-bold mb-2">
              <span className={getExpirationColor(user.days_until_expiration)}>
                {user.days_until_expiration} jours
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Avant expiration des identifiants
            </p>
          </div>

          {/* User Info */}
          <div className="bg-blue-900/30 border border-blue-700 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <User className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Informations Utilisateur</h3>
            </div>
            <div className="text-xl font-bold text-blue-400 mb-2">
              {user.username}
            </div>
            <p className="text-gray-400 text-sm">
              Utilisateur authentifié
            </p>
          </div>

          {/* Security Status */}
          <div className="bg-green-900/30 border border-green-700 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Sécurité</h3>
            </div>
            <div className="text-xl font-bold text-green-400 mb-2">
              Actif
            </div>
            <p className="text-gray-400 text-sm">
              2FA activé
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Activity className="h-6 w-6 mr-3 text-green-400" />
            Actions Rapides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600">
              <Settings className="h-6 w-6 text-gray-400 mr-3" />
              <div className="text-left">
                <div className="text-white font-medium">Paramètres</div>
                <div className="text-gray-400 text-sm">Gérer votre compte</div>
              </div>
            </button>

            <button className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600">
              <Shield className="h-6 w-6 text-gray-400 mr-3" />
              <div className="text-left">
                <div className="text-white font-medium">Sécurité</div>
                <div className="text-gray-400 text-sm">Options de sécurité</div>
              </div>
            </button>

            <button className="flex items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors border border-gray-600">
              <FileText className="h-6 w-6 text-gray-400 mr-3" />
              <div className="text-left">
                <div className="text-white font-medium">Journaux</div>
                <div className="text-gray-400 text-sm">Historique d'activité</div>
              </div>
            </button>
          </div>
        </div>

        {/* Renewal Warning */}
        {user.days_until_expiration <= 60 && (
          <div className={`rounded-xl p-6 border ${getExpirationBgColor(user.days_until_expiration)}`}>
            <div className="flex items-center mb-4">
              <Clock className="h-6 w-6 text-orange-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Alerte de Renouvellement</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Vos identifiants expirent dans {user.days_until_expiration} jours. Il est recommandé de les renouveler avant expiration.
            </p>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
              Renouveler maintenant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage; 