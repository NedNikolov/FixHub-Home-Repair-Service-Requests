import { getSession, getCurrentUser, logout as authLogout } from '../services/authService.js';
import { updateNavbarForAuth } from '../components/navbar.js';

async function isAuthenticated() {
  try {
    const sessionRes = await getSession();
    const userRes = await getCurrentUser();
    const user = userRes?.data?.user || sessionRes?.data?.session?.user || null;
    return { authenticated: Boolean(user), user };
  } catch (e) {
    return { authenticated: false, user: null };
  }
}

async function requireAuth() {
  const { authenticated, user } = await isAuthenticated();
  updateNavbarForAuth(user);
  if (!authenticated) {
    window.location.href = '/login.html';
    return false;
  }
  return true;
}

async function redirectIfAuthenticated() {
  const { authenticated, user } = await isAuthenticated();
  updateNavbarForAuth(user);
  if (authenticated) {
    window.location.href = '/dashboard.html';
    return true;
  }
  return false;
}

function attachLogoutHandler() {
  const el = document.getElementById('nav-logout');
  if (!el) return;
  el.addEventListener('click', async (e) => {
    e.preventDefault();
    await authLogout();
    updateNavbarForAuth(null);
    window.location.href = '/';
  });
}

export async function initAuthGuard() {
  const path = window.location.pathname || window.location.href;
  // Update navbar and attach handlers
  const { authenticated, user } = await isAuthenticated();
  updateNavbarForAuth(user);
  // attach logout handler if present
  attachLogoutHandler();

  // Protect routes
  if (path.endsWith('/dashboard.html') || path.endsWith('/dashboard')) {
    if (!authenticated) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }

  if (path.endsWith('/login.html') || path.endsWith('/register.html')) {
    return redirectIfAuthenticated();
  }

  return authenticated;
}

export default {
  isAuthenticated,
  requireAuth,
  redirectIfAuthenticated,
  initAuthGuard,
};
