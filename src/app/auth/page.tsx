'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { register, login, getCurrentUser } from '@/lib/appwrite';
import Link from 'next/link';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then(() => {
        if (isMounted) router.replace('/app');
      })
      .catch(() => {
        if (isMounted) setCheckingAuth(false);
      });
    return () => { isMounted = false; };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setError(null);
    setSuccess(null);
     // Username validation: only a-z, no spaces
     if (!isLogin && !/^[a-z]{3,32}$/.test(username)) {
       setError('Username must be 3-32 lowercase letters (a-z), no spaces.');
       setIsLoading(false);
       return;
     }
     try {
       if (isLogin) {
         await login(email, password);
         router.push('/app');
       } else {
         await register(email, password, username);
         try {
           await login(email, password);
           router.push('/app');
          } catch (loginErr: unknown) {
            let msg = 'Account created, but failed to log in.';
            if (loginErr && typeof loginErr === 'object' && 'message' in loginErr) {
              msg += ' ' + (loginErr as { message: string }).message;
            }
            setError(msg);
            return;
          }       }
      } catch (err: unknown) {
        let msg = 'Authentication failed.';
        if (err && typeof err === 'object' && 'message' in err) {
          msg = (err as { message: string }).message;
        }
        setError(msg);
      } finally {       setIsLoading(false);
     }
   };
  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">
              Botfly
            </Link>
            <p className="text-slate-400 mt-2">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          {error && (
            <div className="mb-4 text-red-400 text-center text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-green-400 text-center text-sm font-medium">{success}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                 <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                   Username
                 </label>                <input
                   id="username"
                   type="text"
                   value={username}
                   onChange={(e) => {
                     // Only allow a-z, no spaces
                     const val = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                     setUsername(val);
                   }}
                   className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                   placeholder="Enter your username"
                   required={!isLogin}
                   autoComplete="username"
                   pattern="[a-z]{3,32}"
                   minLength={3}
                   maxLength={32}
                   title="Username must be 3-32 lowercase letters (a-z), no spaces."
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                placeholder="Enter your password"
                required
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <div className="text-center">
              <p className="text-slate-500 text-sm mb-4">Or continue with</p>
              <div className="space-y-3">
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
          </p>
        </div>
      </div>
    </main>
  );
}
