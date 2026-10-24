import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra || {}) as { apiUrl?: string; googleWebClientId?: string };

export const API_URL = (extra.apiUrl || 'https://15-135-38-209.sslip.io').replace(/\/$/, '');
/** Built-in Google Web client ID, used until /app/config answers. */
export const GOOGLE_WEB_CLIENT_ID = extra.googleWebClientId || '';
export const APP_VERSION = Constants.expoConfig?.version || '1.0.0';
