const config = window?.APP_CONFIG || {
  GOOGLE_CLIENT_ID: '271566804440-u7gm5a3lo29kdguq069quflptm67nrdc.apps.googleusercontent.com'
};

const GOOGLE_CLIENT_ID = config.GOOGLE_CLIENT_ID;

export const launchGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    const redirectURL = chrome.identity.getRedirectURL();
    const authURL = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    
    authURL.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    authURL.searchParams.set('response_type', 'id_token');
    authURL.searchParams.set('redirect_uri', redirectURL);
    authURL.searchParams.set('scope', 'openid email profile');
    authURL.searchParams.set('nonce', Math.random().toString(36));

    chrome.identity.launchWebAuthFlow(
      {
        url: authURL.toString(),
        interactive: true,
      },
      (responseUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!responseUrl) {
          reject(new Error('No response URL received'));
          return;
        }

        try {
          const url = new URL(responseUrl);
          const hashParams = new URLSearchParams(url.hash.substring(1));
          const idToken = hashParams.get('id_token');

          if (!idToken) {
            reject(new Error('No ID token found in response'));
            return;
          }

          resolve(idToken);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};
