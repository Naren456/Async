import * as ExpoSecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// WARNING: Web fallback is not secure - token stored in plaintext localStorage
// For production web, use httpOnly cookies via backend instead
export const setItemAsync = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    try {
      // Basic obfuscation, not encryption - still vulnerable to XSS
      // TODO: migrate web auth to httpOnly cookies
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await ExpoSecureStore.setItemAsync(key, value);
  }
};

export const getItemAsync = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
      return null;
    }
  } else {
    return await ExpoSecureStore.getItemAsync(key);
  }
};

export const deleteItemAsync = async (key: string) => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Local storage is unavailable:', e);
    }
  } else {
    await ExpoSecureStore.deleteItemAsync(key);
  }
};
