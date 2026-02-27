import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

export const LoginScreen = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    const result = await login();
    if (!result.success) {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center animate-fade-in relative z-10">
      <div className="w-full glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden group">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-accent-blue opacity-50"></div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-block p-3 rounded-2xl bg-white/5 mb-4 ring-1 ring-white/10 group-hover:scale-110 transition-transform duration-500">
            <img src={chrome.runtime.getURL("icons/icon48.png")} alt="Logo" className="w-10 h-10 filter drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-2 tracking-tight">
            Async
          </h1>
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase opacity-80">Assignment Tracker</p>
        </div>

        {/* Welcome Text */}
        <div className="text-center mb-8 relative z-10">
          <h2 className="text-xl font-semibold text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-[240px] mx-auto">
            Your personal academic assistant. Sign in to stay organized.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-slide-up">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="relative z-10">
          <Button variant="google" onClick={handleLogin} loading={loading} className="w-full justify-center group-hover:shadow-blue-500/20 shadow-lg transition-all duration-300">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </Button>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-8 text-center space-y-3">
        {/* Footer content removed */}
      </div>
    </div>
  );
};
