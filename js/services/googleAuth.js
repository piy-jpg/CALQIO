/**
 * CALQIO Real Google Authentication Service
 * Genuine Google Identity Services (GSI) & OAuth 2.0 Token Client integration.
 * Performs authentic Google sign-in via Google's official OAuth chooser.
 */

import { state } from '../state.js';
import { AuthApi } from '../api/auth.js';
import { Storage } from '../storage.js';
import { Toast } from '../toast.js';

export const GoogleAuthService = {
  // Configured Web Client ID from Google Cloud Console
  DEFAULT_CLIENT_ID: '985624969915-22gj8ldlmlbd3lv9h0vngmbmdunkjpg9.apps.googleusercontent.com',
  isInitialized: false,
  tokenClient: null,
  authListeners: new Set(),

  /**
   * Get active Google Client ID
   */
  getClientId() {
    if (typeof window !== 'undefined') {
      if (window.GOOGLE_CLIENT_ID) return window.GOOGLE_CLIENT_ID;
      const meta = document.querySelector('meta[name="google-signin-client_id"]');
      if (meta && meta.content && !meta.content.includes('YOUR_GOOGLE_CLIENT_ID')) {
        return meta.content.trim();
      }
    }
    return this.DEFAULT_CLIENT_ID;
  },

  /**
   * Register a listener for auth changes
   */
  onAuthChange(callback) {
    if (typeof callback === 'function') {
      this.authListeners.add(callback);
    }
    return () => this.authListeners.delete(callback);
  },

  notifyAuthListeners(user) {
    this.authListeners.forEach(cb => {
      try {
        cb(user);
      } catch (e) {
        console.warn('Auth listener notification error:', e);
      }
    });
  },

  /**
   * Parse JWT payload from Google Identity credential (ID Token)
   */
  parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.warn('Failed to parse Google JWT token:', e);
      return null;
    }
  },

  /**
   * Wait for Google Identity Services SDK to load asynchronously
   */
  async waitForGoogleSdk(maxWaitMs = 3000) {
    if (typeof window === 'undefined') return false;
    if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) return true;

    if (typeof document !== 'undefined' && !document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const startTime = Date.now();
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - startTime > maxWaitMs) {
          clearInterval(interval);
          resolve(Boolean(window.google?.accounts));
        }
      }, 50);
    });
  },

  /**
   * Initialize Google Identity Services (GIS)
   */
  async init(callback) {
    if (callback) {
      this.onAuthChange(callback);
    }

    // 0. Check URL for returning redirect tokens (e.g. hash fragments / params)
    await this.checkUrlForOAuthCallback();

    await this.waitForGoogleSdk();

    const clientId = this.getClientId();
    if (!clientId) return;

    try {
      // 1. Initialize Google ID (One-Tap / Credential listener)
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            const user = await this.handleCredentialResponse(response);
            this.notifyAuthListeners(user);
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });
      }

      // 2. Initialize OAuth 2.0 Token Client for authentic popup flow
      if (window.google?.accounts?.oauth2) {
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid profile email',
          callback: async (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
              const user = await this.fetchGoogleUserInfo(tokenResponse.access_token);
              this.notifyAuthListeners(user);
            } else if (tokenResponse && tokenResponse.error) {
              this.handleAuthError(tokenResponse.error);
            }
          }
        });
      }

      if (this.tokenClient || window.google?.accounts?.id) {
        this.isInitialized = true;
      }
    } catch (err) {
      console.warn('Google Identity Services initialization notice:', err.message);
    }
  },

  /**
   * Fetch authenticated user profile directly from Google's UserInfo API
   */
  async fetchGoogleUserInfo(accessToken) {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!res.ok) {
        throw new Error(`Google UserInfo request failed with status: ${res.status}`);
      }

      const data = await res.json();
      if (!data || !data.email) {
        throw new Error('Google did not return user email.');
      }

      const googleUser = {
        googleId: data.sub,
        email: data.email,
        name: data.name || data.given_name || data.email.split('@')[0],
        avatar: data.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name || data.email)}`,
        emailVerified: data.email_verified,
        provider: 'google'
      };

      return await this.completeSignIn(googleUser);
    } catch (err) {
      console.error('Failed to retrieve Google user profile:', err);
      Toast.show('Failed to retrieve profile from Google: ' + err.message, 'error');
      return null;
    }
  },

  /**
   * Process Google ID Token Credential Response
   */
  async handleCredentialResponse(response) {
    if (!response || !response.credential) return null;

    const payload = this.parseJwt(response.credential);
    if (!payload || !payload.email) {
      Toast.show('Invalid authentication response from Google.', 'error');
      return null;
    }

    const googleUser = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      avatar: payload.picture || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(payload.name || payload.email)}`,
      emailVerified: payload.email_verified,
      credential: response.credential,
      provider: 'google'
    };

    return await this.completeSignIn(googleUser);
  },

  /**
   * Render Official Google Sign-In Button inside a DOM element
   */
  async renderGoogleButton(containerEl) {
    if (!containerEl) return;
    await this.init();

    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.renderButton(containerEl, {
          theme: state.get('theme') === 'dark' ? 'filled_black' : 'outline',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'continue_with',
          logo_alignment: 'left',
          width: Math.min(380, containerEl.offsetWidth || 360)
        });
      } catch (e) {
        console.warn('Google button rendering notice:', e);
      }
    }
  },

  /**
   * Trigger the REAL Google OAuth Account Chooser / Authentication flow
   */
  async promptSignIn() {
    await this.init();

    // 1. Primary: Use GIS TokenClient popup flow
    if (this.tokenClient) {
      return new Promise((resolve) => {
        const prevCallback = this.tokenClient.callback;
        this.tokenClient.callback = async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            const user = await this.fetchGoogleUserInfo(tokenResponse.access_token);
            this.notifyAuthListeners(user);
            resolve(user);
          } else if (tokenResponse && tokenResponse.error) {
            this.handleAuthError(tokenResponse.error);
            resolve(null);
          } else {
            resolve(null);
          }
          if (prevCallback) prevCallback(tokenResponse);
        };

        try {
          this.tokenClient.requestAccessToken({ prompt: 'select_account' });
        } catch (err) {
          console.warn('Token client request error:', err);
          this.openDirectOAuthPopup().then(resolve);
        }
      });
    }

    // 2. Fallback: Direct Authentic Google OAuth 2.0 Web Chooser Popup
    return await this.openDirectOAuthPopup();
  },

  /**
   * Direct Authentic Google OAuth 2.0 Popup Chooser Fallback
   */
  async openDirectOAuthPopup() {
    const clientId = this.getClientId();
    if (!clientId) {
      Toast.show('Google Client ID is not configured.', 'error');
      return null;
    }

    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token%20id_token&scope=${encodeURIComponent('openid profile email')}&prompt=select_account&nonce=${Date.now()}`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'google_oauth_signin',
      `width=${width},height=${height},left=${left},top=${top},status=no,toolbar=no,menubar=no,location=yes`
    );

    if (!popup) {
      Toast.show('Please allow popups for Google Sign-In.', 'warning');
      return null;
    }

    return new Promise((resolve) => {
      let resolved = false;

      const checkInterval = setInterval(() => {
        try {
          if (!popup || popup.closed) {
            clearInterval(checkInterval);
            if (!resolved) {
              resolve(null);
            }
            return;
          }

          if (popup.location && popup.location.origin === window.location.origin) {
            const hash = popup.location.hash;
            if (hash && (hash.includes('access_token=') || hash.includes('id_token='))) {
              clearInterval(checkInterval);
              resolved = true;
              popup.close();

              const params = new URLSearchParams(hash.substring(1));
              const accessToken = params.get('access_token');
              const idToken = params.get('id_token');

              if (accessToken) {
                this.fetchGoogleUserInfo(accessToken).then((user) => {
                  this.notifyAuthListeners(user);
                  resolve(user);
                });
              } else if (idToken) {
                this.handleCredentialResponse({ credential: idToken }).then((user) => {
                  this.notifyAuthListeners(user);
                  resolve(user);
                });
              } else {
                resolve(null);
              }
            }
          }
        } catch (e) {
          // Cross-origin access in popup before redirect is normal, wait for return
        }
      }, 200);

      // Max timeout 3 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!resolved) resolve(null);
      }, 180000);
    });
  },

  /**
   * Handle OAuth Errors
   */
  handleAuthError(error) {
    console.warn('Google OAuth error:', error);
    if (error === 'popup_closed_by_user' || error === 'access_denied') {
      Toast.show('Google Sign-In was cancelled.', 'info');
    } else if (error === 'popup_blocked_by_browser') {
      Toast.show('Google Sign-In popup was blocked by your browser. Please allow popups for this site.', 'warning');
    } else {
      Toast.show(`Google Authentication error: ${error}`, 'error');
    }
  },

  /**
   * Check URL for returning OAuth redirect tokens and show website
   */
  async checkUrlForOAuthCallback() {
    if (typeof window === 'undefined') return null;
    try {
      const hash = window.location.hash || '';
      const search = window.location.search || '';

      if (hash.includes('access_token=') || hash.includes('id_token=')) {
        const hashParams = hash.substring(1);
        const params = new URLSearchParams(hashParams);
        const accessToken = params.get('access_token');
        const idToken = params.get('id_token');

        // Clean up URL hash to restore normal website routing
        window.history.replaceState(null, '', window.location.pathname + '#/');

        if (accessToken) {
          const user = await this.fetchGoogleUserInfo(accessToken);
          this.notifyAuthListeners(user);
          return user;
        } else if (idToken) {
          const user = await this.handleCredentialResponse({ credential: idToken });
          this.notifyAuthListeners(user);
          return user;
        }
      } else if (search.includes('code=')) {
        const params = new URLSearchParams(search);
        const code = params.get('code');
        window.history.replaceState(null, '', window.location.pathname + '#/');
        if (code) {
          try {
            const res = await AuthApi.googleLogin({ code });
            if (res && res.user) {
              return await this.completeSignIn(res.user);
            }
          } catch (e) {
            console.warn('OAuth code exchange note:', e);
          }
        }
      }
    } catch (e) {
      console.warn('OAuth URL redirect check note:', e);
    }
    return null;
  },

  /**
   * Complete Sign-In: update state, persist session, migrate guest data, close modal, show website
   */
  async completeSignIn(googleUser) {
    try {
      let resData;
      try {
        resData = await AuthApi.googleLogin(googleUser);
      } catch (e) {
        // Fallback for static client session
        const mockToken = 'g_' + btoa(JSON.stringify({ email: googleUser.email, sub: googleUser.googleId, iat: Date.now() }));
        AuthApi.setToken(mockToken);
        resData = { user: googleUser };
      }

      const user = resData.user || googleUser;
      
      // Close modal first, then update user and state
      state.set('authModalOpen', false);
      Storage.setCurrentUser(user);
      state.set('currentUser', user);

      // Explicitly cleanup any open modal overlay from DOM
      const modalRoot = document.getElementById('auth-modal-root');
      if (modalRoot) modalRoot.innerHTML = '';
      const backdrop = document.getElementById('auth-modal-backdrop');
      if (backdrop) backdrop.remove();

      // Show authenticated website view immediately
      const mainEl = document.getElementById('app-main');
      const headerEl = document.getElementById('app-header');
      if (typeof window !== 'undefined') {
        import('../router.js').then(({ Router }) => {
          if (mainEl) Router.handleRoute();
        }).catch(() => {});
        import('../ui/navbar.js').then(({ Navbar }) => {
          if (headerEl) Navbar.render(headerEl);
        }).catch(() => {});
      }

      // Migrate guest history, favorites, and settings in the background
      Storage.syncGuestDataToServer().catch(e => console.warn('Background sync note:', e));

      Toast.show(`✓ Welcome, ${user.name}! Signed in with Google.`, 'success');
      return user;
    } catch (err) {
      console.error('Error completing Google sign-in:', err);
      Toast.show('Could not complete Google session initialization: ' + err.message, 'error');
      return null;
    }
  },

  /**
   * Genuine Sign Out
   */
  signOut() {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        // ignore
      }
    }
    AuthApi.logout();
    Storage.removeCurrentUser();
    state.set('currentUser', null);
    state.set('authModalOpen', false);
    
    const modalRoot = document.getElementById('auth-modal-root');
    if (modalRoot) modalRoot.innerHTML = '';

    Toast.show('Signed out from CALQIO.', 'info');
  }
};
