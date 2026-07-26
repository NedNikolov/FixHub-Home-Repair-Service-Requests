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

let logoutHandlerAttached = false;

function attachLogoutHandler() {
  if (logoutHandlerAttached) return;
  logoutHandlerAttached = true;

  document.addEventListener('click', async (event) => {
    const logoutButton = event.target.closest('#nav-logout');
    if (!logoutButton) return;

    event.preventDefault();
    logoutButton.disabled = true;
    await authLogout();
    updateNavbarForAuth(null);
    window.location.href = '/';
  });
}

export async function initAuthGuard() {
  const path = window.location.pathname || window.location.href;
  const { authenticated, user } = await isAuthenticated();
  updateNavbarForAuth(user);
  attachLogoutHandler();

  if (path.endsWith('/dashboard.html') || path.endsWith('/dashboard') || path.endsWith('/profile.html') || path.endsWith('/profile')) {
    if (!authenticated) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }

  if (path.endsWith('/admin.html') || path.endsWith('/admin')) {
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
