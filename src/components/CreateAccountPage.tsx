import React, { useState } from 'react';
import { ArrowLeft, User, Copy, QrCode, RefreshCw } from 'lucide-react';
import { Page } from '../types';
import { apiService } from '../services/api';

interface CreateAccountPageProps {
  onNavigate: (page: Page) => void;
  onShowToast: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ onNavigate, onShowToast }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<{
    passwordQR?: string;
    twoFactorQR?: string;
  }>({});

  const handleGeneratePassword = async () => {
    if (!username.trim()) {
      onShowToast('error', 'Veuillez saisir un nom d\'utilisateur');
      return;
    }

    setLoading(true);
    try {
      console.log('Appel de l\'API pour username:', username);
      
      // Appel à l'API qui génère le mot de passe et retourne le QR code
      const qrCodeUrl = await apiService.generatePasswordQRCodeImage(username);
      
      // Stocker l'URL du QR code pour l'affichage
      setGeneratedData(prev => ({
        ...prev,
        passwordQR: qrCodeUrl,
      }));
      
      onShowToast('success', 'Mot de passe généré et QR Code affiché avec succès');
      
    } catch (error) {
      console.error('Erreur complète:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération';
      
      // Vérifier si c'est une erreur d'utilisateur existant
      if (errorMessage.includes('existe déjà')) {
        onShowToast('warning', `${errorMessage} Utilisez la page de renouvellement pour mettre à jour vos identifiants.`);
      } else {
        onShowToast('error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate2FA = async () => {
    if (!username.trim()) {
      onShowToast('error', 'Veuillez saisir un nom d\'utilisateur');
      return;
    }

    setLoading(true);
    try {
      console.log('Appel de l\'API 2FA pour username:', username);
      
      // Appel à l'API qui génère le secret 2FA et retourne le QR code
      const qrCodeUrl = await apiService.generate2FASecret(username);
      
      // Stocker l'URL du QR code pour l'affichage
      setGeneratedData(prev => ({
        ...prev,
        twoFactorQR: qrCodeUrl,
      }));
      
      onShowToast('success', 'Secret 2FA généré et QR Code affiché avec succès');
    } catch (error) {
      console.error('Erreur complète 2FA:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération';
      
      // Vérifier si c'est une erreur d'utilisateur existant ou inexistant
      if (errorMessage.includes('existe déjà') || errorMessage.includes('n\'existe pas')) {
        onShowToast('warning', `${errorMessage} ${errorMessage.includes('n\'existe pas') ? 'Créez d\'abord le mot de passe.' : 'Utilisez la page de renouvellement.'}`);
      } else {
        onShowToast('error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('success', `${type} copié dans le presse-papiers`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
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
            <User className="h-8 w-8 mr-3 text-cyan-400" />
            Création de compte utilisateur
          </h1>

          {/* Username Input */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
              placeholder="Saisissez le nom d'utilisateur"
            />
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleGeneratePassword}
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              <QrCode className="h-5 w-5" />
              <span>Générer QR Code mot de passe</span>
            </button>

            <button
              onClick={handleGenerate2FA}
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
            >
              <QrCode className="h-5 w-5" />
              <span>Générer secret 2FA + QR Code</span>
            </button>
          </div>

          {/* Generated Content */}
          {(generatedData.passwordQR || generatedData.twoFactorQR) && (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Password Section */}
              {generatedData.passwordQR && (
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-semibold text-white mb-4">QR Code Mot de passe</h3>
                  
                  <div className="text-center">
                    <img
                      src={generatedData.passwordQR}
                      alt="QR Code Mot de passe"
                      className="mx-auto bg-white p-2 rounded-lg"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Scannez ce QR code pour obtenir votre mot de passe
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Le mot de passe est stocké de manière sécurisée dans la base de données
                    </p>
                  </div>
                </div>
              )}

              {/* 2FA Section */}
              {generatedData.twoFactorQR && (
                <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <h3 className="text-xl font-semibold text-white mb-4">QR Code 2FA (TOTP)</h3>
                  
                  <div className="text-center">
                    <img
                      src={generatedData.twoFactorQR}
                      alt="QR Code 2FA"
                      className="mx-auto bg-white p-2 rounded-lg"
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      Scannez avec votre app d'authentification (Google Authenticator, Authy, etc.)
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Le secret 2FA est stocké de manière sécurisée dans la base de données
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Success Message */}
          {generatedData.passwordQR && generatedData.twoFactorQR && (
            <div className="mt-8 bg-green-900/30 border border-green-700 rounded-lg p-4">
              <p className="text-green-300 text-sm mb-3">
                ✅ Compte créé avec succès ! Vous pouvez maintenant vous authentifier avec ces identifiants.
              </p>
              <button
                onClick={() => onNavigate('login')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Se connecter maintenant
              </button>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="mt-8 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <p className="text-blue-300 text-sm mb-3">
              <strong>Utilisateur existant ?</strong> Si vous avez déjà un compte, utilisez la page de renouvellement pour mettre à jour vos identifiants.
            </p>
            <button
              onClick={() => onNavigate('renew-credentials')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Renouveler des identifiants</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountPage;