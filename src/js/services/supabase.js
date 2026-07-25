import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[supabase] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Supabase client will operate in a disabled state.');
}

let supabase = null;
try {
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } else {
    // Provide a lightweight shim that surfaces errors when used without configuration.
    const err = (msg) => ({ error: new Error(msg) });
    supabase = {
      auth: {
        signUp: async () => err('Supabase not configured'),
        signInWithPassword: async () => err('Supabase not configured'),
        signOut: async () => err('Supabase not configured'),
        getUser: async () => err('Supabase not configured'),
        getSession: async () => err('Supabase not configured'),
      },
    };
  }
} catch (e) {
  console.warn('[supabase] failed to create client', e);
  supabase = {
    auth: {
      signUp: async () => ({ error: e }),
      signInWithPassword: async () => ({ error: e }),
      signOut: async () => ({ error: e }),
      getUser: async () => ({ error: e }),
      getSession: async () => ({ error: e }),
    },
  };
}

export default supabase;
