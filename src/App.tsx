import React, { useState } from 'react';
import { Page, AuthUser } from './types';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/Toast';
import HomePage from './components/HomePage';
import CreateAccountPage from './components/CreateAccountPage';
import LoginPage from './components/LoginPage';
import RenewCredentialsPage from './components/RenewCredentialsPage';
import DashboardPage from './components/DashboardPage';
import AuthNavBar from './components/AuthNavBar';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  const handlePageNavigation = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = (user: AuthUser) => {
    setAuthenticatedUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setCurrentPage('home');
    addToast('info', 'Déconnexion réussie');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handlePageNavigation} />;
      case 'create-account':
        return <CreateAccountPage onNavigate={handlePageNavigation} onShowToast={addToast} />;
      case 'login':
        return <LoginPage onNavigate={handlePageNavigation} onShowToast={addToast} onLogin={handleLogin} />;
      case 'renew-credentials':
        return <RenewCredentialsPage onNavigate={handlePageNavigation} onShowToast={addToast} />;
      case 'dashboard':
        return authenticatedUser ? <DashboardPage user={authenticatedUser} /> : <HomePage onNavigate={handlePageNavigation} />;
      default:
        return <HomePage onNavigate={handlePageNavigation} />;
    }
  };

  return (
    <div className="relative">
      {/* Auth Navigation Bar */}
      {authenticatedUser && <AuthNavBar user={authenticatedUser} onLogout={handleLogout} />}
      
      {renderCurrentPage()}
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © COFRAP 2025 - Système d'authentification sécurisée
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;