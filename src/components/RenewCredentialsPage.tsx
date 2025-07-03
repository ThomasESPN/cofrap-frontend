import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, User, CheckCircle, QrCode } from 'lucide-react';
import { Page } from '../types';
import { apiService } from '../services/api';

interface RenewCredentialsPageProps {
  onNavigate: (page: Page) => void;
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const RenewCredentialsPage: React.FC<RenewCredentialsPageProps> = ({ onNavigate, onShowToast }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [renewalStatus, setRenewalStatus] = useState<{
    passwordRenewed: boolean;
    twoFactorRenewed: boolean;
  }>({ passwordRenewed: false, twoFactorRenewed: false });
  const [generatedData, setGeneratedData] = useState<{
    passwordQR?: string;
    twoFactorQR?: string;
  }>({});

  const handleRenewal = async () => {
    if (!username.trim()) {
      onShowToast('error', 'Veuillez saisir un nom d\'utilisateur');
      return;
    }

    setLoading(true);
    setRenewalStatus({ passwordRenewed: false, twoFactorRenewed: false });
    setGeneratedData({});

    try {
      // Regenerate password only
      onShowToast('info', 'Régénération du mot de passe en cours...');
      const passwordQRUrl = await apiService.renewPasswordOnly(username);
      setGeneratedData(prev => ({ ...prev, passwordQR: passwordQRUrl }));
      setRenewalStatus(prev => ({ ...prev, passwordRenewed: true }));
      onShowToast('success', 'Mot de passe régénéré avec succès ! Le secret 2FA reste inchangé.');

    } catch (error) {
      onShowToast('error', error instanceof Error ? error.message : 'Erreur lors de la régénération');
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
            <RefreshCw className="h-8 w-8 mr-3 text-purple-400" />
            Renouvellement des identifiants
          </h1>

          <div className="space-y-6">
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                  placeholder="Saisissez votre nom d'utilisateur"
                />
              </div>
            </div>

            {/* Renewal Status */}
            {renewalStatus.passwordRenewed && (
              <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-3">État du renouvellement</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className={`h-5 w-5 ${renewalStatus.passwordRenewed ? 'text-green-400' : 'text-gray-400'}`} />
                    <span className={`text-sm ${renewalStatus.passwordRenewed ? 'text-green-300' : 'text-gray-400'}`}>
                      Mot de passe régénéré
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Le secret 2FA existant reste inchangé et fonctionnel.
                  </div>
                </div>
              </div>
            )}

            {/* Renewal Button */}
            <button
              onClick={handleRenewal}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5" />
                  <span>Renouveler les identifiants</span>
                </>
              )}
            </button>
          </div>

          {/* Generated QR Code */}
          {generatedData.passwordQR && (
            <div className="mt-6">
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="text-lg font-semibold text-white mb-4">Nouveau QR Code Mot de passe</h3>
                <div className="text-center">
                  <img
                    src={generatedData.passwordQR}
                    alt="Nouveau QR Code Mot de passe"
                    className="mx-auto bg-white p-2 rounded-lg"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Scannez ce QR code pour obtenir votre nouveau mot de passe
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Votre secret 2FA existant reste valide - pas besoin de le reconfigurer
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-300 text-sm">
              <strong>Important:</strong> Cette action génère un nouveau mot de passe et remet à zéro la date d'expiration. 
              Votre secret 2FA existant reste valide et fonctionnel.
            </p>
          </div>

          {/* Success Actions */}
          {renewalStatus.passwordRenewed && (
            <div className="mt-6 space-y-3">
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <p className="text-green-300 text-sm">
                  ✅ Mot de passe renouvelé avec succès ! Vous pouvez maintenant :
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => onNavigate('create-account')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  Créer un compte
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RenewCredentialsPage;