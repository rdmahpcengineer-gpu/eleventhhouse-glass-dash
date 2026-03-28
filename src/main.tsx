import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from 'react-oidc-context';
import App from './App';
import './index.css';
import { initAnalytics } from './lib/analytics';

initAnalytics();

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;

const cognitoAuthConfig = {
  authority: `https://cognito-idp.us-east-1.amazonaws.com/${userPoolId}`,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "email openid phone",
  post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_URI || redirectUri,
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
