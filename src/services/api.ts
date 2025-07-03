import { AuthResponse, GeneratePasswordResponse, Generate2FAResponse } from '../types';

// Configuration automatique dev/production
const isDevelopment = import.meta.env.DEV;
const API_BASE_URL = isDevelopment 
  ? '/api' // En développement, utilise le proxy Vite
  : 'http://34.79.63.215:8080/function'; // En production, URL directe vers OpenFaaS

export const apiService = {
  async generatePasswordQRCode(username: string): Promise<GeneratePasswordResponse> {
    const response = await fetch(`${API_BASE_URL}/generate-password-qrcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du mot de passe');
    }

    return response.json();
  },

  async generatePasswordQRCodeImage(username: string, isRenewal: boolean = false): Promise<string> {
    console.log('Appel API via proxy avec username:', username, 'renouvellement:', isRenewal);
    
    try {
      // Choisir l'endpoint en fonction du mode
      const endpoint = isRenewal ? 'renew-password-qrcode' : 'generate-password-qrcode';
      console.log('Endpoint utilisé:', endpoint);
      
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envoyer seulement le username, plus de paramètre renew
        body: JSON.stringify({ username }),
      });

      console.log('Statut de la réponse via proxy:', response.status);

      if (!response.ok) {
        // Essayer de parser la réponse comme JSON d'abord
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur API: ${response.status}`);
        } else {
          const errorText = await response.text();
          console.error('Erreur API via proxy:', errorText);
          throw new Error(`Erreur lors de la génération du mot de passe: ${response.status} - ${errorText}`);
        }
      }

      // L'API OpenFaaS retourne directement l'image PNG via le proxy
      const blob = await response.blob();
      console.log('QR code reçu, taille:', blob.size, 'type:', blob.type);
      
      if (blob.size === 0) {
        throw new Error('QR code vide reçu de l\'API');
      }

      // Convertir le blob en URL pour l'affichage dans le frontend
      const imageUrl = window.URL.createObjectURL(blob);
      console.log('QR code converti en URL pour affichage');
      
      return imageUrl;
    } catch (error) {
      console.error('Erreur lors de l\'appel via proxy:', error);
      throw error;
    }
  },

  async generate2FASecret(username: string, isRenewal: boolean = false): Promise<string> {
    console.log('Appel API 2FA via proxy avec username:', username, 'renouvellement:', isRenewal);
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate-2fa-secret`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, renew: isRenewal }),
      });

      console.log('Statut de la réponse 2FA via proxy:', response.status);

      if (!response.ok) {
        // Essayer de parser la réponse comme JSON d'abord
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Erreur API: ${response.status}`);
        } else {
          const errorText = await response.text();
          console.error('Erreur API 2FA via proxy:', errorText);
          throw new Error(`Erreur lors de la génération du secret 2FA: ${response.status} - ${errorText}`);
        }
      }

      // L'API OpenFaaS retourne directement l'image PNG du QR code TOTP
      const blob = await response.blob();
      console.log('QR code 2FA reçu, taille:', blob.size, 'type:', blob.type);
      
      if (blob.size === 0) {
        throw new Error('QR code 2FA vide reçu de l\'API');
      }

      // Convertir le blob en URL pour l'affichage dans le frontend
      const imageUrl = window.URL.createObjectURL(blob);
      console.log('QR code 2FA converti en URL pour affichage');
      
      return imageUrl;
    } catch (error) {
      console.error('Erreur lors de l\'appel 2FA via proxy:', error);
      throw error;
    }
  },

  async authenticate(username: string, password: string, twoFactorCode: string): Promise<AuthResponse> {
    console.log('Appel API authentification via proxy avec username:', username);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, twoFactorCode }),
      });

      console.log('Statut de la réponse auth via proxy:', response.status);

      const responseData = await response.json();
      console.log('Réponse auth:', responseData);

      return responseData;
    } catch (error) {
      console.error('Erreur lors de l\'appel auth via proxy:', error);
      throw error;
    }
  },

  async renewPasswordOnly(username: string): Promise<string> {
    console.log('Renouvellement du mot de passe seulement pour:', username);
    return this.generatePasswordQRCodeImage(username, true);
  },
};