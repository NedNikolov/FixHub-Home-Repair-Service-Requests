import supabase from './supabase.js';

/**
 * Register a new user with email and password.
 * Returns Supabase response: { data, error }
 */
export async function register(email, password, options = {}) {
  if (!email || !password) {
    return { data: null, error: new Error('Email and password are required') };
  }

  try {
    // supabase.auth.signUp may accept an options object for user metadata
    const response = await supabase.auth.signUp({ email, password }, options);
    return response;
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Login with email and password.
 * Returns Supabase response: { data, error }
 */
export async function login(email, password) {
  if (!email || !password) {
    return { data: null, error: new Error('Email and password are required') };
  }

  try {
    const response = await supabase.auth.signInWithPassword({ email, password });
    return response;
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Logout the current user.
 */
export async function logout() {
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
  try {
    const response = await supabase.auth.getSession();
    return response;
  } catch (error) {
    return { data: null, error };
  }
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getSession,
};
