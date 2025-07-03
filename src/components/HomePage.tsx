import React from 'react';
import { UserPlus, LogIn, RefreshCw, Shield } from 'lucide-react';
import { Page } from '../types';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const buttons = [
    {
      id: 'create-account',
      label: 'Créer un compte',
      icon: UserPlus,
      description: 'Générer un nouveau compte utilisateur avec authentification 2FA',
      onClick: () => onNavigate('create-account'),
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'login',
      label: 'S\'authentifier',
      icon: LogIn,
      description: 'Se connecter avec nom d\'utilisateur, mot de passe et code 2FA',
      onClick: () => onNavigate('login'),
      gradient: 'from-green-600 to-teal-600',
    },
    {
      id: 'renew',
      label: 'Renouveler le mot de passe',
      icon: RefreshCw,
      description: 'Régénérer les identifiants et codes d\'authentification',
      onClick: () => onNavigate('renew-credentials'),
      gradient: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-16 w-16 text-cyan-400 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Portail Utilisateur <span className="text-cyan-400">COFRAP</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Système d'authentification sécurisée avec double facteur
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {buttons.map((button) => {
            const Icon = button.icon;
            return (
              <div
                key={button.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl cursor-pointer group"
                onClick={button.onClick}
              >
                <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${button.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {button.label}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {button.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="mt-12 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-blue-400" />
            <p className="text-blue-300 text-sm">
              <strong>Sécurité:</strong> Toutes les communications sont chiffrées et les identifiants sont générés aléatoirement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;