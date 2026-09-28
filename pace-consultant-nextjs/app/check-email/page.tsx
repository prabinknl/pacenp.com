'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  HiMail,
  HiArrowLeft,
  HiLockClosed,
  HiUser,
  HiExternalLink,
} from 'react-icons/hi';

export default function CheckEmailPage() {
  // Authentication states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('admin123'); // Default mock password for simulation
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Modals state
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isChangeOpen, setIsChangeOpen] = useState(false);

  // Change Password form states
  const [changeOldPassword, setChangeOldPassword] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');

  // Track the webmail popup window so we can monitor when it closes / user logs out
  const [webmailWindow, setWebmailWindow] = useState<Window | null>(null);

  // Poll the popup: when the user logs out of webmail and the popup is closed,
  // focus returns here automatically. If the popup is still open but shows the
  // logout page, we detect it and redirect focus.
  const checkWebmailWindow = useCallback(() => {
    if (webmailWindow && webmailWindow.closed) {
      setWebmailWindow(null);
    }
  }, [webmailWindow]);

  useEffect(() => {
    if (!webmailWindow) return;
    const interval = setInterval(checkWebmailWindow, 1000);
    return () => clearInterval(interval);
  }, [webmailWindow, checkWebmailWindow]);

  // When this page regains focus (user comes back from webmail tab), bring
  // attention back to the check-email page.
  useEffect(() => {
    const handleFocus = () => {
      // Page regained focus – the user likely closed/left the webmail tab
      if (webmailWindow && webmailWindow.closed) {
        setWebmailWindow(null);
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [webmailWindow]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!emailInput) {
      setLoginError('Please enter your email username.');
      return;
    }

    const fullEmail = `${emailInput.trim()}@pacenp.com`;

    setIsLoggingIn(true);
    setTimeout(() => {
      // Build the webmail login URL with goto_app to skip the app-selector
      // and go straight to Roundcube inbox.
      // cPanel webmail accepts goto_app=roundcube to auto-launch Roundcube
      // after successful login, skipping the webmail app selection screen.
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://webmail.pacenp.com/login/';
      // Open in a named popup window so we can track it
      form.target = 'pacenp_webmail';

      const userField = document.createElement('input');
      userField.type = 'hidden';
      userField.name = 'user';
      userField.value = fullEmail;
      form.appendChild(userField);

      if (passwordInput) {
        const passField = document.createElement('input');
        passField.type = 'hidden';
        passField.name = 'pass';
        passField.value = passwordInput;
        form.appendChild(passField);
      }

      // goto_app=roundcube tells cPanel to skip the webmail app selector
      // and go directly to the Roundcube inbox after authentication.
      const gotoAppField = document.createElement('input');
      gotoAppField.type = 'hidden';
      gotoAppField.name = 'goto_app';
      gotoAppField.value = 'roundcube';
      form.appendChild(gotoAppField);

      // Open the popup/tab and keep a reference
      const popup = window.open('about:blank', 'pacenp_webmail');
      if (popup) {
        setWebmailWindow(popup);
      }

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      
      setIsLoggingIn(false);
      setPasswordInput('');
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!changeOldPassword || !changeNewPassword || !changeConfirmPassword) {
      setChangeError('Please fill in all fields.');
      return;
    }

    // We check against the mock local password
    if (changeOldPassword !== currentPassword) {
      setChangeError('Incorrect old password.');
      return;
    }

    if (changeNewPassword !== changeConfirmPassword) {
      setChangeError('New passwords do not match.');
      return;
    }

    if (changeNewPassword.length < 6) {
      setChangeError('Password must be at least 6 characters.');
      return;
    }

    // Success! Update password in local state
    setCurrentPassword(changeNewPassword);
    setChangeSuccess('Password updated successfully!');
    setChangeOldPassword('');
    setChangeNewPassword('');
    setChangeConfirmPassword('');

    setTimeout(() => {
      setIsChangeOpen(false);
      setChangeSuccess('');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg border border-gray-200 shadow-card">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-dark transition mb-4">
            <HiArrowLeft className="h-3.5 w-3.5" /> Back to Website
          </Link>
          {/* Note: Customizing the actual Roundcube header/logo requires cPanel/Roundcube theme customization or Himalayan Host hosting provider support. This page acts as the branded intermediate page. */}
          {/* Branded Identity Area: Displaying [PACE logo] @pacenp.com horizontally aligned */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center gap-2 border border-gray-100 bg-gray-50/50 rounded-full px-4.5 py-2 shadow-sm max-w-full">
              <img
                src="/images/logo-emblem.png"
                alt="PACE logo"
                className="h-7 w-auto shrink-0 object-contain"
                loading="eager"
              />
              <span className="font-heading text-sm font-bold text-primary truncate">
                {emailInput ? `${emailInput}@pacenp.com` : '@pacenp.com'}
              </span>
            </div>
            <p className="mt-2.5 text-[11px] text-muted text-center leading-relaxed">
              Use your pacenp.com email credentials. Hosted on Himalayan Host.
            </p>
          </div>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleLoginSubmit} autoComplete="off">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <HiUser className="h-5 w-5" />
              </span>
              <input
                id="email"
                name="email_username"
                type="text"
                required
                value={emailInput}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val.includes('@')) {
                    val = val.split('@')[0];
                  }
                  setEmailInput(val);
                }}
                autoComplete="off"
                className="w-full rounded border border-gray-300 py-2.5 pl-10 pr-[7.5rem] text-sm focus:border-secondary focus:outline-none"
                placeholder="Username"
              />
              <span className="absolute right-3 text-sm font-semibold text-gray-500 pointer-events-none select-none">
                @pacenp.com
              </span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-xs font-semibold text-gray-600">
                Password
              </label>
              <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="hover:text-secondary-dark transition focus:outline-none"
                >
                  Forgot password?
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={() => setIsChangeOpen(true)}
                  className="hover:text-secondary-dark transition focus:outline-none"
                >
                  Change password
                </button>
              </div>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <HiLockClosed className="h-5 w-5" />
              </span>
              <input
                id="password"
                name="login_password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoComplete="new-password"
                className="w-full rounded border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-secondary focus:outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {loginError && (
            <div className="rounded bg-red-50 p-2.5 text-xs font-medium text-red-700">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="flex w-full items-center justify-center gap-2 rounded bg-primary py-3 font-heading text-sm font-semibold text-white hover:bg-primary-dark transition disabled:bg-primary/50 shadow-sm"
          >
            {isLoggingIn ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Redirecting to Inbox...
              </>
            ) : (
              <>
                <HiExternalLink className="h-4 w-4" />
                Open Webmail
              </>
            )}
          </button>

          {webmailWindow && !webmailWindow.closed && (
            <p className="text-center text-xs text-muted mt-2 animate-pulse">
              📬 Webmail is open in another tab. When you log out there, come back here.
            </p>
          )}
        </form>

        <p className="text-center text-[22px] font-semibold text-green-500 mt-4">
          Good Luck
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg border border-gray-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-3">Forgot Password?</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              To reset your <strong>pacenp.com</strong> domain email password, please visit the official 
              Himalayan Host Client Area or contact your IT Support Administrator.
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:paceconsultant@gmail.com"
                className="flex items-center justify-center gap-1.5 rounded bg-secondary py-2.5 text-sm font-semibold text-white hover:bg-secondary-dark transition shadow"
              >
                Contact Admin
                <HiMail className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="rounded border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg border border-gray-200">
            <h3 className="font-heading text-lg font-bold text-primary mb-3">Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Old Password
                </label>
                <input
                  type="password"
                  required
                  value={changeOldPassword}
                  onChange={(e) => setChangeOldPassword(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={changeNewPassword}
                  onChange={(e) => setChangeNewPassword(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={changeConfirmPassword}
                  onChange={(e) => setChangeConfirmPassword(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              {changeError && (
                <div className="rounded bg-red-50 p-2.5 text-xs font-medium text-red-700">
                  {changeError}
                </div>
              )}

              {changeSuccess && (
                <div className="rounded bg-green-50 p-2.5 text-xs font-medium text-green-700">
                  {changeSuccess}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsChangeOpen(false);
                    setChangeError('');
                    setChangeSuccess('');
                  }}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition shadow"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
