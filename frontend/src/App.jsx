import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import WeatherDashboard from './components/Weather/WeatherDashboard';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      <div className="App min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 pt-24 sm:pt-28 pb-12">
          <ProtectedRoute>
            <WeatherDashboard />
          </ProtectedRoute>
        </main>
      </div>
    </Auth0Provider>
  );
}

export default App;
