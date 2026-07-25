import supabase, { isSupabaseConfigured } from './supabase.js';

/**
 * Register a new user with email and password.
 * Returns Supabase response: { data, error }
 */
export async function register(email, password, options = {}) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured'), message: 'Supabase is not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.' };
  }
  if (!email || !password) {
    return { data: null, error: new Error('Email and password are required'), message: 'Email and password are required' };
  }

  try {
    // supabase.auth.signUp may accept an options object for user metadata
    const response = await supabase.auth.signUp({ email, password }, options);
    if (response.error) {
      const message = _friendlyErrorMessage(response.error);
      return { data: response.data || null, error: response.error, message };
    }
    return { data: response.data || null, error: null, message: null };
  } catch (error) {
    const message = _friendlyErrorMessage(error);
    return { data: null, error, message };
  }
}

/**
 * Login with email and password.
 * Returns Supabase response: { data, error }
 */
export async function login(email, password) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured'), message: 'Supabase is not configured. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.' };
  }
  if (!email || !password) {
    return { data: null, error: new Error('Email and password are required'), message: 'Email and password are required' };
  }

  try {
    const response = await supabase.auth.signInWithPassword({ email, password });
    if (response.error) {
      const message = _friendlyErrorMessage(response.error);
      return { data: null, error: response.error, message };
    }

    // ensure session is available
    try {
      const sessionRes = await supabase.auth.getSession();
      return { data: { ...response.data, session: sessionRes.data?.session || null }, error: null, message: null };
    } catch (innerErr) {
      return { data: response.data || null, error: null, message: null };
    }
  } catch (error) {
    const message = _friendlyErrorMessage(error);
    return { data: null, error, message };
  }
}

/**
 * Logout the current user.
 */
export async function logout() {
  if (!isSupabaseConfigured) {
    return { error: new Error('Supabase not configured') };
  }
  try {
    const response = await supabase.auth.signOut();
    return response;
  } catch (error) {
    return { error };
  }
}

/**
 * Get the current authenticated user (if any).
 * Returns { data: { user }, error }
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const response = await supabase.auth.getUser();
    return response;
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get the current session.
 * Returns { data: { session }, error }
 */
export async function getSession() {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase not configured') };
  }
  try {
    const response = await supabase.auth.getSession();
    return response;
  } catch (error) {
    return { data: null, error };
  }
}

function _friendlyErrorMessage(error) {
  const raw = (error && (error.message || error.error_description || error.msg)) || String(error || '');
  const text = String(raw).toLowerCase();

  if (text.includes('already') || text.includes('duplicate') || text.includes('user exists') || text.includes('user already')) {
    return 'An account with that email already exists.';
  }

  if (text.includes('password') && (text.includes('weak') || text.includes('length') || text.includes('min') || text.includes('8'))) {
    return 'Password is too weak. Use at least 8 characters.';
  }

  if (text.includes('invalid') || text.includes('credentials') || text.includes('incorrect') || text.includes('unauthorized')) {
    return 'Invalid credentials. Please check your email and password.';
  }

  if (text.includes('network') || text.includes('failed to fetch') || text.includes('timeout')) {
    return 'Network error. Please check your connection and try again.';
  }

  // fallback to original message
  return error?.message || String(error);
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getSession,
};
